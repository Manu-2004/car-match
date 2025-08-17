import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from backend.routes import compare, price
  # Updated import paths

load_dotenv()

app = FastAPI(
    title="Car Match API",
    description="Backend API for car comparison and price estimation",
    version="1.0.0"
)

# Updated CORS for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173", 
        "https://*.railway.app",  # Railway domains
        "*"  # For development - restrict this in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(compare.router)
app.include_router(price.router)

@app.get("/")
async def root():
    return {"message": "Car Match API is running!"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "service": "car-match-backend", 
        "features": ["car-comparison", "price-estimation"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8001)))
