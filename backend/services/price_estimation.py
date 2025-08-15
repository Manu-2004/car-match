import os
from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage
from dotenv import load_dotenv
from ..models.schemas import PriceEstimateRequest, PriceEstimateResponse, CarDetails
from ..utils.prompts import CAR_PRICE_ESTIMATION_PROMPT
import re

# Load environment variables
load_dotenv()

class PriceEstimationService:
    def __init__(self):
        OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
        self.llm = ChatOpenAI(
            model="gpt-4o",
            api_key=OPENAI_API_KEY,
            temperature=0.2,
            max_tokens=1500
        )
    
    def estimate_price(self, request: PriceEstimateRequest) -> PriceEstimateResponse:
        """Estimate car price based on provided details"""
        try:
            # Format car details
            car_formatted = self._format_car_details(request.car_details)
            
            # Create price estimation prompt
            messages = [
                SystemMessage(content="You are a professional car appraiser with 20+ years of experience in automotive valuation."),
                HumanMessage(content=CAR_PRICE_ESTIMATION_PROMPT.format(car_details=car_formatted))
            ]
            
            # Get price estimation from LLM
            response = self.llm.invoke(messages)
            estimation_text = response.content
            
            # Parse the response
            price_range = self._extract_price_range(estimation_text)
            factors = self._extract_factors(estimation_text)
            market_analysis = self._extract_market_analysis(estimation_text)
            
            return PriceEstimateResponse(
                estimated_price=self._extract_estimated_price(estimation_text),
                price_range=price_range,
                factors=factors,
                market_analysis=market_analysis
            )
            
        except Exception as e:
            print(f"Error in price estimation: {e}")
            return PriceEstimateResponse(
                estimated_price="Unable to estimate due to error",
                price_range={"min": 0, "max": 0},
                factors={"error": str(e)},
                market_analysis="Error occurred during price estimation."
            )
    
    def _format_car_details(self, car: CarDetails) -> str:
        """Format car details for price estimation"""
        details = []
        
        if car.make and car.model:
            details.append(f"Vehicle: {car.make} {car.model}")
        if car.year:
            details.append(f"Year: {car.year}")
        if car.mileage:
            details.append(f"Mileage: {car.mileage} miles")
        if car.engine:
            details.append(f"Engine: {car.engine}")
        if car.transmission:
            details.append(f"Transmission: {car.transmission}")
        if car.fuel_type:
            details.append(f"Fuel Type: {car.fuel_type}")
        if car.condition:
            details.append(f"Condition: {car.condition}")
        if car.features:
            details.append(f"Features: {car.features}")
        
        details.append(f"Additional Details: {car.raw_description}")
        
        return "\n".join(details)
    
    def _extract_estimated_price(self, text: str) -> str:
        """Extract the main estimated price from response"""
        price_patterns = [
            r'\$[\d,]+',
            r'₹[\d,]+',
            r'£[\d,]+',
            r'€[\d,]+'
        ]
        
        for pattern in price_patterns:
            matches = re.findall(pattern, text)
            if matches:
                return matches[0] if len(matches) == 1 else f"{matches} - {matches[-1]}"
        
        return "Price estimate included in analysis"
    
    def _extract_price_range(self, text: str) -> dict:
        """Extract minimum and maximum price range"""
        try:
            range_pattern = r'\$(\d{1,3}(?:,\d{3})*)\s*[-to]\s*\$(\d{1,3}(?:,\d{3})*)'
            matches = re.search(range_pattern, text, re.IGNORECASE)
            
            if matches:
                min_price = float(matches.group(1).replace(',', ''))
                max_price = float(matches.group(2).replace(',', ''))
                return {"min": min_price, "max": max_price}
            
            price_pattern = r'\$(\d{1,3}(?:,\d{3})*)'
            prices = re.findall(price_pattern, text)
            
            if len(prices) >= 2:
                prices_float = [float(p.replace(',', '')) for p in prices]
                return {"min": min(prices_float), "max": max(prices_float)}
            
        except Exception as e:
            print(f"Error extracting price range: {e}")
        
        return {"min": 0, "max": 0}
    
    def _extract_factors(self, text: str) -> dict:
        """Extract key factors affecting price"""
        factors = {}
        lines = text.split('\n')
        
        factor_keywords = ['depreciation', 'mileage', 'condition', 'demand', 'features', 'location', 'market']
        
        for line in lines:
            for keyword in factor_keywords:
                if keyword.lower() in line.lower() and ':' in line:
                    factors[keyword] = line.strip()
                    break
        
        if not factors:
            factors = {"analysis": "Detailed factors included in market analysis"}
        
        return factors
    
    def _extract_market_analysis(self, text: str) -> str:
        """Extract market analysis section"""
        lines = text.split('\n')
        market_lines = []
        capture = False
        
        for line in lines:
            if any(keyword in line.lower() for keyword in ['market', 'trend', 'analysis', 'demand']):
                capture = True
            
            if capture:
                market_lines.append(line.strip())
        
        if market_lines:
            return '\n'.join(market_lines)
        else:
            return text
