from fastapi import APIRouter, HTTPException
from models.schemas import PriceEstimateRequest, PriceEstimateResponse
from services.price_estimation import PriceEstimationService

router = APIRouter(prefix="/api/price", tags=["Price Estimation"])

price_service = PriceEstimationService()

@router.post("/estimate", response_model=PriceEstimateResponse)
async def estimate_price(request: PriceEstimateRequest):
    """Estimate car price based on provided details"""
    try:
        result = price_service.estimate_price(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Price estimation failed: {str(e)}")

@router.get("/health")
async def price_health_check():
    """Health check for price estimation service"""
    return {
        "status": "healthy", 
        "service": "price-estimation",
        "message": "Price estimation service is running"
    }
