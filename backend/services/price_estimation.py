import os
import re
from langchain_openai import ChatOpenAI

from langchain.schema import HumanMessage, SystemMessage
from dotenv import load_dotenv
from models.schemas import PriceEstimateRequest, PriceEstimateResponse, CarDetails
from utils.prompts import CAR_PRICE_ESTIMATION_PROMPT

# Load environment variables
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
        """Extract minimum and maximum price range with improved currency detection"""
        try:
            print(f"Extracting price range from text: {text[:500]}...")  # Debug log
            
            # Enhanced patterns for multi-character currencies
            min_patterns = [
                r'Minimum Value:\s*(C\$[\d,]+)',    # Canadian Dollar
                r'Minimum Value:\s*(A\$[\d,]+)',    # Australian Dollar
                r'Minimum Value:\s*([₹$€£¥][\d,]+)' # Other currencies
            ]
            
            max_patterns = [
                r'Maximum Value:\s*(C\$[\d,]+)',    # Canadian Dollar
                r'Maximum Value:\s*(A\$[\d,]+)',    # Australian Dollar
                r'Maximum Value:\s*([₹$€£¥][\d,]+)' # Other currencies
            ]
            
            min_price_str = None
            max_price_str = None
            
            # Try each pattern until we find a match
            for pattern in min_patterns:
                min_match = re.search(pattern, text, re.IGNORECASE)
                if min_match:
                    min_price_str = min_match.group(1).strip()
                    break
            
            for pattern in max_patterns:
                max_match = re.search(pattern, text, re.IGNORECASE)
                if max_match:
                    max_price_str = max_match.group(1).strip()
                    break
            
            if min_price_str and max_price_str:
                print(f"Found min: {min_price_str}, max: {max_price_str}")  # Debug log
                
                # Extract numeric values for calculations
                min_numeric = float(re.sub(r'[₹$€£¥CA,\s]', '', min_price_str))
                max_numeric = float(re.sub(r'[₹$€£¥CA,\s]', '', max_price_str))
                
                # Detect currency
                if min_price_str.startswith('C$'):
                    currency = 'C$'
                elif min_price_str.startswith('A$'):
                    currency = 'A$'
                elif min_price_str.startswith('₹'):
                    currency = '₹'
                elif min_price_str.startswith('€'):
                    currency = '€'
                elif min_price_str.startswith('£'):
                    currency = '£'
                elif min_price_str.startswith('¥'):
                    currency = '¥'
                else:
                    currency = '$'
                
                return {
                    "min": min_numeric,
                    "max": max_numeric,
                    "min_display": min_price_str,
                    "max_display": max_price_str,
                    "currency_detected": currency
                }
            
            # Enhanced fallback: look for any currency patterns in order of preference
            currency_patterns = [
                (r'C\$[\d,]+', 'C$'),  # Canadian Dollar - check first
                (r'A\$[\d,]+', 'A$'),  # Australian Dollar - check second  
                (r'₹[\d,]+', '₹'),     # Indian Rupee
                (r'€[\d,]+', '€'),     # Euro
                (r'£[\d,]+', '£'),     # British Pound
                (r'¥[\d,]+', '¥'),     # Japanese Yen
                (r'\$[\d,]+', '$'),    # US Dollar - check last to avoid conflicts
            ]
            
            all_prices = []
            detected_currency = '$'  # Default
            
            for pattern, currency in currency_patterns:
                matches = re.findall(pattern, text)
                if matches:
                    detected_currency = currency
                    for match in matches:
                        # Extract numeric value properly for multi-char currencies
                        if currency in ['C$', 'A$']:
                            numeric_str = re.sub(r'[CA$,\s]', '', match)
                        else:
                            numeric_str = re.sub(r'[₹$€£¥,\s]', '', match)
                        
                        try:
                            numeric_value = float(numeric_str)
                            if numeric_value > 0:
                                all_prices.append({
                                    "text": match,
                                    "value": numeric_value
                                })
                        except ValueError:
                            continue
                    
                    # If we found prices with this currency, stop looking
                    if all_prices:
                        break
            
            if len(all_prices) >= 2:
                # Sort by numeric value
                all_prices.sort(key=lambda x: x["value"])
                
                return {
                    "min": all_prices[0]["value"],
                    "max": all_prices[-1]["value"],
                    "min_display": all_prices[0]["text"],
                    "max_display": all_prices[-1]["text"],
                    "currency_detected": detected_currency
                }
            elif len(all_prices) == 1:
                # Single price found
                price = all_prices[0]
                return {
                    "min": price["value"],
                    "max": price["value"],
                    "min_display": price["text"],
                    "max_display": price["text"],
                    "currency_detected": detected_currency
                }
                
        except Exception as e:
            print(f"Error extracting price range: {e}")
        
        # Return safe default values
        return {
            "min": 0, 
            "max": 0,
            "min_display": "",
            "max_display": "",
            "currency_detected": "$"
        }
    
    def _extract_estimated_price(self, text: str) -> str:
        """Extract the most likely price"""
        try:
            # Look for "Most Likely Price" first
            likely_patterns = [
                r'Most Likely Price:\s*(C\$[\d,]+)',    # Canadian Dollar
                r'Most Likely Price:\s*(A\$[\d,]+)',    # Australian Dollar
                r'Most Likely Price:\s*([₹$€£¥][\d,]+)' # Other currencies
            ]
            
            for pattern in likely_patterns:
                likely_match = re.search(pattern, text, re.IGNORECASE)
                if likely_match:
                    return likely_match.group(1).strip()
            
            # Fallback to any price found - prioritize multi-character currencies
            price_patterns = [
                r'(C\$[\d,]+)',      # Canadian Dollar
                r'(A\$[\d,]+)',      # Australian Dollar
                r'([₹€£¥][\d,]+)',   # Other currencies
                r'(\$[\d,]+)',       # US Dollar (last to avoid conflicts)
            ]
            
            for pattern in price_patterns:
                match = re.search(pattern, text)
                if match:
                    return match.group(1).strip()
            
        except Exception as e:
            print(f"Error extracting estimated price: {e}")
        
        return "Price estimate included in analysis"
    
    def _extract_factors(self, text: str) -> dict:
        """Extract key factors affecting price"""
        factors = {}
        
        try:
            # Look for the KEY PRICING FACTORS section
            factors_section_match = re.search(r'\*\*KEY PRICING FACTORS:\*\*(.*?)(?:\*\*|$)', text, re.DOTALL | re.IGNORECASE)
            
            if factors_section_match:
                factors_text = factors_section_match.group(1)
                
                # Parse individual factors with improved regex
                factor_lines = re.findall(r'-\s*([^:]+):\s*([^\n\r-]+)', factors_text)
                
                for factor_name, factor_desc in factor_lines:
                    clean_name = factor_name.strip()
                    clean_desc = factor_desc.strip()
                    
                    # Clean up common suffixes
                    clean_name = clean_name.replace(' Impact', '').replace(' Assessment', '').replace(' Factors', '')
                    
                    if clean_name and clean_desc and len(clean_desc) > 10:  # Only meaningful descriptions
                        factors[clean_name] = clean_desc
            
            # If no factors found in the structured format, try to extract from anywhere in the text
            if not factors:
                # Look for common factor patterns throughout the text
                factor_keywords = [
                    ('mileage', r'mileage[^.]*\.'),
                    ('condition', r'condition[^.]*\.'),
                    ('market demand', r'market\s+demand[^.]*\.'),
                    ('location', r'location[^.]*\.'),
                    ('depreciation', r'depreciation[^.]*\.'),
                    ('features', r'features[^.]*\.')
                ]
                
                for keyword, pattern in factor_keywords:
                    match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
                    if match:
                        description = match.group(0).strip()
                        if len(description) > 20:  # Only meaningful descriptions
                            factors[keyword.title()] = description[:150]  # Limit length
        
        except Exception as e:
            print(f"Error extracting factors: {e}")
        
        return factors if factors else {"analysis": "Detailed factors included in market analysis"}
    
    def _extract_market_analysis(self, text: str) -> str:
        """Extract market analysis section - kept for compatibility"""
        # This method is kept for backward compatibility
        # The full text is returned in estimate_price method
        return text
