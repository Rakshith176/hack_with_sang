from fastapi import APIRouter
from app.models.schemas import InterrogationRequest, InterrogationVerdict
from app.services.you_service import search_live_citations
from app.services.gemini_service import synthesize_interrogation

router = APIRouter(prefix="/api/interrogate", tags=["interrogate"])

@router.post("", response_model=InterrogationVerdict)
async def interrogate_claim(request: InterrogationRequest):
    """
    Live adversarial interrogation:
    1. Queries You.com live web index (POST https://ydc-index.io/v1/search)
    2. Runs Gemini 2.5 Flash to synthesize counter-evidence vs corroboration
    3. Returns structured epistemic verdict with live cited URLs and quotes.
    """
    # 1. Targeted live adversarial search on You.com
    search_query = f"evidence contradicting OR official statement regarding {request.claim_text}"
    citations = await search_live_citations(query=search_query, count=4)
    
    # 2. Synthesize with Gemini 2.5 Flash
    verdict = await synthesize_interrogation(claim_text=request.claim_text, citations=citations)
    verdict.target_claim_id = request.claim_id
    
    return verdict
