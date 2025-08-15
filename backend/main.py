from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from .routes import compare, price

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="Car Match API",
    description="Backend API for car comparison using LangChain",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include only comparison router
app.include_router(compare.router)


app.include_router(price.router)


@app.get("/")
async def root():
    return {"message": "Car Match API is running! Car Comparison service available."}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "car-match-backend", "features": ["car-comparison"]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
