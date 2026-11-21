from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import story, interrogate

app = FastAPI(
    title="PlaceWire (VeritasMesh) API",
    description="Epistemic Knowledge Graph & Forensics Engine powered by SerpApi, You.com & Gemini 2.5 Flash",
    version="1.0.0"
)

# Enable CORS for local Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(story.router)
app.include_router(interrogate.router)

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "PlaceWire Backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
