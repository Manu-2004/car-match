import os
from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage
from dotenv import load_dotenv
from models.schemas import CompareRequest, CompareResponse, CarDetails
from utils.prompts import CAR_COMPARISON_PROMPT, CAR_DETAILS_EXTRACTION_PROMPT
import json
import re

# Load environment variables
load_dotenv()

class CarComparisonService:
    def __init__(self):
        OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
        self.llm = ChatOpenAI(
            model="gpt-4o",
            api_key=OPENAI_API_KEY,
            temperature=0.3,
            max_tokens=2000
        )
    
    def extract_car_details(self, raw_description: str) -> dict:
        """Extract structured details from raw car description"""
        try:
            messages = [
                SystemMessage(content="You are an expert at extracting car specifications from descriptions."),
                HumanMessage(content=CAR_DETAILS_EXTRACTION_PROMPT.format(description=raw_description))
            ]
            
            response = self.llm.invoke(messages)
            return self._parse_extracted_details(response.content)
        except Exception as e:
            print(f"Error extracting car details: {e}")
            return {"raw_description": raw_description}
    
    def _parse_extracted_details(self, extracted_text: str) -> dict:
        """Parse the extracted details into a structured format"""
        details = {}
        lines = extracted_text.split('\n')
        
        for line in lines:
            if ':' in line:
                key, value = line.split(':', 1)
                key = key.strip().lower().replace(' ', '_')
                value = value.strip()
                if value and value != "Not specified":
                    details[key] = value
        
        return details
    
    def compare_cars(self, request: CompareRequest) -> CompareResponse:
        """Compare two cars and return detailed analysis"""
        try:
            # Format car details for comparison
            car1_formatted = self._format_car_details(request.car1)
            car2_formatted = self._format_car_details(request.car2)
            
            # Create comparison prompt
            messages = [
                SystemMessage(content="You are an expert automotive consultant providing detailed car comparisons."),
                HumanMessage(content=CAR_COMPARISON_PROMPT.format(
                    car1_details=car1_formatted,
                    car2_details=car2_formatted
                ))
            ]
            
            # Get comparison from LLM
            response = self.llm.invoke(messages)
            comparison_text = response.content
            
            # Extract summary and recommendation
            summary = self._extract_summary(comparison_text)
            recommendation = self._extract_recommendation(comparison_text)
            
            return CompareResponse(
                comparison=comparison_text,
                summary=summary,
                recommendation=recommendation
            )
            
        except Exception as e:
            print(f"Error in car comparison: {e}")
            return CompareResponse(
                comparison=f"Error occurred during comparison: {str(e)}",
                summary={},
                recommendation="Unable to provide recommendation due to an error."
            )
    
    def _format_car_details(self, car: CarDetails) -> str:
        """Format car details for LLM consumption"""
        details = []
        
        if car.make:
            details.append(f"Make: {car.make}")
        if car.model:
            details.append(f"Model: {car.model}")
        if car.year:
            details.append(f"Year: {car.year}")
        if car.engine:
            details.append(f"Engine: {car.engine}")
        if car.transmission:
            details.append(f"Transmission: {car.transmission}")
        if car.fuel_type:
            details.append(f"Fuel Type: {car.fuel_type}")
        if car.mileage:
            details.append(f"Mileage: {car.mileage}")
        if car.features:
            details.append(f"Features: {car.features}")
        if car.condition:
            details.append(f"Condition: {car.condition}")
        if car.location:
            details.append(f"Location: {car.location}")
        
        details.append(f"Description: {car.raw_description}")
        
        return "\n".join(details)
    
    def _extract_summary(self, comparison_text: str) -> dict:
        """Extract key points summary from comparison text"""
        summary = {
            "performance": "Analysis included in comparison",
            "fuel_efficiency": "Analysis included in comparison", 
            "features": "Analysis included in comparison",
            "value": "Analysis included in comparison"
        }
        return summary
    
    def _extract_recommendation(self, comparison_text: str) -> str:
        """Extract recommendation from comparison text"""
        lines = comparison_text.split('\n')
        recommendation_started = False
        recommendation_lines = []
        
        for line in lines:
            if 'recommendation' in line.lower() or 'conclusion' in line.lower():
                recommendation_started = True
            elif recommendation_started:
                recommendation_lines.append(line.strip())
        
        if recommendation_lines:
            return '\n'.join(recommendation_lines)
        else:
            return "Please refer to the detailed comparison above for recommendations."
