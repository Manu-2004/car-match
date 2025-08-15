from pydantic import BaseModel
from typing import Optional, Dict, Any

class CarDetails(BaseModel):
    make: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    engine: Optional[str] = None
    transmission: Optional[str] = None
    fuel_type: Optional[str] = None
    mileage: Optional[float] = None
    features: Optional[str] = None
    condition: Optional[str] = None
    location: Optional[str] = None
    raw_description: str

class CompareRequest(BaseModel):
    car1: CarDetails
    car2: CarDetails

class PriceEstimateRequest(BaseModel):
    car_details: CarDetails

class CompareResponse(BaseModel):
    comparison: str
    summary: Dict[str, Any]
    recommendation: str

class PriceEstimateResponse(BaseModel):
    estimated_price: str
    price_range: Dict[str, float]
    factors: Dict[str, str]
    market_analysis: str

from pydantic import BaseModel
from typing import Optional, Dict, Any

class CarDetails(BaseModel):
    make: Optional[str] = None
    model: Optional[str] = None
    year: Optional[str] = None
    engine: Optional[str] = None
    transmission: Optional[str] = None
    fuel_type: Optional[str] = None
    mileage: Optional[str] = None
    features: Optional[str] = None
    condition: Optional[str] = "Good"
    price: Optional[str] = None
    raw_description: str

class CompareRequest(BaseModel):
    car1: CarDetails
    car2: CarDetails

class CompareResponse(BaseModel):
    comparison: str
    summary: dict
    recommendation: str

# Price Estimation Schemas
class PriceEstimateRequest(BaseModel):
    car_details: CarDetails

class PriceEstimateResponse(BaseModel):
    estimated_price: str
    price_range: Dict[str, float]
    factors: Dict[str, str]
    market_analysis: str
