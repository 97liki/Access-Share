from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.api_v1.api import api_router

app = FastAPI(
    title="Access Share API",
    description="API for Access Share platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api/v1")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "Access Share API is running"
    }

@app.get("/")
async def root():
    return {"message": "Welcome to AccessShare API"}

@app.get("/api/health")
async def health_check():
    """Health check endpoint for frontend connection testing"""
    return {"status": "healthy", "message": "Backend API is running"}

# Add a health check endpoint at the API v1 path as well
@app.get("/api/v1/health")
async def health_check_v1():
    """Health check endpoint for frontend connection testing (v1)"""
    return {"status": "healthy", "message": "Backend API v1 is running"} 