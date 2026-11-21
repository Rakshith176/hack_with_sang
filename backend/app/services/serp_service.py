import httpx
from typing import Dict, Any, Optional
from app.config import SERP_API_KEY

SERP_API_BASE_URL = "https://serpapi.com/search.json"

async def search_google_news(query: str, gl: str = "us", hl: str = "en") -> Dict[str, Any]:
    """Search Google News using SerpApi engine=google_news."""
    if not SERP_API_KEY:
        return {"error": "SERP_API_KEY not configured", "news_results": []}
    
    params = {
        "engine": "google_news",
        "q": query,
        "gl": gl,
        "hl": hl,
        "api_key": SERP_API_KEY
    }
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(SERP_API_BASE_URL, params=params)
        if response.status_code == 200:
            return response.json()
        return {"error": f"SerpApi error: {response.status_code}", "detail": response.text}

async def search_historical_archive(query: str, cd_min: str = "", cd_max: str = "") -> Dict[str, Any]:
    """Search historical Google results with date range filters (tbs=cdr:1,cd_min:...,cd_max:...)."""
    if not SERP_API_KEY:
        return {"error": "SERP_API_KEY not configured", "organic_results": []}
    
    params = {
        "engine": "google",
        "q": query,
        "api_key": SERP_API_KEY
    }
    if cd_min and cd_max:
        params["tbs"] = f"cdr:1,cd_min:{cd_min},cd_max:{cd_max}"
    
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(SERP_API_BASE_URL, params=params)
        if response.status_code == 200:
            return response.json()
        return {"error": f"SerpApi error: {response.status_code}", "detail": response.text}

async def extract_page_content(url: str) -> Dict[str, Any]:
    """Extract full markdown/text from a webpage or public filing using SerpApi engine=extract."""
    if not SERP_API_KEY:
        return {"error": "SERP_API_KEY not configured", "content": ""}
    
    params = {
        "engine": "extract",
        "url": url,
        "api_key": SERP_API_KEY
    }
    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.get(SERP_API_BASE_URL, params=params)
        if response.status_code == 200:
            return response.json()
        return {"error": f"SerpApi extract error: {response.status_code}", "detail": response.text}
