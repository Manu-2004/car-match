from fastapi import APIRouter, HTTPException
from ..models.schemas import CompareRequest, CompareResponse
from ..services.car_comparison import CarComparisonService

router = APIRouter(prefix="/api/compare", tags=["Car Comparison"])

comparison_service = CarComparisonService()

@router.post("/", response_model=CompareResponse)
async def compare_cars(request: CompareRequest):
    """Compare two cars and return detailed analysis"""
    try:
        result = comparison_service.compare_cars(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Comparison failed: {str(e)}")

@router.post("/extract-details")
async def extract_car_details(description: str):
    """Extract structured details from car description"""
    try:
        details = comparison_service.extract_car_details(description)
        return {"details": details}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detail extraction failed: {str(e)}")
