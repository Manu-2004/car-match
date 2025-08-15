import os
import re
from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage
from dotenv import load_dotenv
from ..models.schemas import PriceEstimateRequest, PriceEstimateResponse, CarDetails
from ..utils.prompts import CAR_PRICE_ESTIMATION_PROMPT

load_dotenv()

class PriceEstimationService:
    def __init__(self):
        OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
        self.llm = ChatOpenAI(
            model="gpt-4o",
            api_key=OPENAI_API_KEY,
            temperature=0.2,
            max_tokens=2000
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
            
            print(f"AI Response: {estimation_text}")  # Debug log
            
            # Parse the response
            price_range = self._extract_price_range(estimation_text)
            estimated_price = self._extract_estimated_price(estimation_text)
            factors = self._extract_factors(estimation_text)
            market_analysis = estimation_text  # Return full text for frontend parsing
            
            return PriceEstimateResponse(
                estimated_price=estimated_price,
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
            mileage_unit = getattr(car, 'mileage_unit', 'miles')
            details.append(f"Mileage: {car.mileage} {mileage_unit}")
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
        if car.location:
            details.append(f"Location: {car.location}")
        
        details.append(f"Additional Details: {car.raw_description}")
        
        return "\n".join(details)
    
    def _extract_price_range(self, text: str) -> dict:
        """Extract minimum and maximum price range - fixed to avoid Pydantic errors"""
        try:
            # Look for the exact format we specified in the prompt
            min_pattern = r'Minimum Value:\s*([₹$€£¥C\$A\$]?[\d,]+)'
            max_pattern = r'Maximum Value:\s*([₹$€£¥C\$A\$]?[\d,]+)'
            
            min_match = re.search(min_pattern, text, re.IGNORECASE)
            max_match = re.search(max_pattern, text, re.IGNORECASE)
            
            if min_match and max_match:
                min_price_str = min_match.group(1).strip()
                max_price_str = max_match.group(1).strip()
                
                # Extract numeric values only (remove currency symbols and commas)
                min_numeric = float(re.sub(r'[₹$€£¥C\$A\$,\s]', '', min_price_str))
                max_numeric = float(re.sub(r'[₹$€£¥C\$A\$,\s]', '', max_price_str))
                
                return {
                    "min": min_numeric,  # Numeric value for calculations
                    "max": max_numeric,  # Numeric value for calculations
                    "min_display": min_price_str,  # Formatted string for display
                    "max_display": max_price_str   # Formatted string for display
                }
            
            # Fallback: look for any price patterns and sort them
            price_patterns = [
                r'([₹$€£¥][\d,]+)',
                r'(\$[\d,]+)',
                r'(₹[\d,]+)',
                r'(€[\d,]+)',
                r'(£[\d,]+)'
            ]
            
            all_prices = []
            for pattern in price_patterns:
                matches = re.findall(pattern, text)
                for match in matches:
                    # Clean numeric value for sorting
                    numeric_value = float(re.sub(r'[₹$€£¥,\s]', '', match))
                    if numeric_value > 0:  # Only valid prices
                        all_prices.append({
                            "text": match,
                            "value": numeric_value
                        })
            
            if len(all_prices) >= 2:
                # Sort by numeric value
                all_prices.sort(key=lambda x: x["value"])
                
                return {
                    "min": all_prices[0]["value"],
                    "max": all_prices[-1]["value"],
                    "min_display": all_prices["text"],
                    "max_display": all_prices[-1]["text"]
                }
            
        except Exception as e:
            print(f"Error extracting price range: {e}")
        
        # Return default values if parsing fails
        return {
            "min": 0, 
            "max": 0,
            "min_display": "Not available",
            "max_display": "Not available"
        }
    
    def _extract_estimated_price(self, text: str) -> str:
        """Extract the most likely price"""
        # Look for "Most Likely Price" first
        likely_pattern = r'Most Likely Price:\s*([₹$€£¥C\$A\$]?[\d,]+)'
        likely_match = re.search(likely_pattern, text, re.IGNORECASE)
        
        if likely_match:
            return likely_match.group(1).strip()
        
        # Fallback to any price found
        price_patterns = [
            r'([₹$€£¥][\d,]+)',
            r'(\$[\d,]+)',
            r'(₹[\d,]+)'
        ]
        
        for pattern in price_patterns:
            match = re.search(pattern, text)
            if match:
                return match.group(1).strip()
        
        return "Price estimate included in analysis"
    
    def _extract_factors(self, text: str) -> dict:
        """Extract key factors affecting price"""
        factors = {}
        
        # Look for the KEY PRICING FACTORS section
        factors_section_match = re.search(r'\*\*KEY PRICING FACTORS:\*\*(.*?)(?:\*\*|$)', text, re.DOTALL | re.IGNORECASE)
        
        if factors_section_match:
            factors_text = factors_section_match.group(1)
            
            # Parse individual factors
            factor_lines = re.findall(r'-\s*([^:]+):\s*([^\n-]+)', factors_text)
            
            for factor_name, factor_desc in factor_lines:
                clean_name = factor_name.strip()
                clean_desc = factor_desc.strip()
                if clean_name and clean_desc:
                    factors[clean_name] = clean_desc
        
        return factors if factors else {"analysis": "Detailed factors included in market analysis"}
