# PlaceWire (VeritasMesh)

An epistemic knowledge graph and forensics engine for news. PlaceWire traces a headline
back to the stories, filings, and announcements that preceded it, then shows **how the
claim drifted** between the original source and today's reporting.

Built for the *Hack with Sang* hackathon.

## What it does

- **Lineage spine** — reverse-chronological graph of antecedent stories, filings, and
  regulatory actions, each node with its own real headline, source, and URL.
- **Drift inspector** — per-claim diff between what the original source said and how it is
  being reported now.
- **Systemic ripple** — which downstream sectors, vendors, or policies a claim touches.
- **Interrogation** — query a specific claim and get a verdict with supporting evidence.
- **Live analysis** — pick any trending headline and generate its lineage chain on demand
  via SerpApi date-bounded archive searches.
- **Drill deeper** — expand any node into earlier archival sources.

## Stack

| Layer | Tech |
|---|---|
| Backend | FastAPI, Pydantic v2, httpx, uvicorn |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, @xyflow/react |
| Data / AI | SerpApi (news + archive), You.com (corroboration), Gemini 2.5 Flash (synthesis) |

## Getting started

### 1. Configure keys

```bash
cp .env.example .env
# then fill in SERP_API_KEY, YOU_COM_API_KEY, GEMINI_API_KEY
```

All three are optional to boot — services degrade to deterministic/mock responses when a
key is missing — but live analysis and interrogation need them.

### 2. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Runs at `http://127.0.0.1:8000`. Interactive API docs at `/docs`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://127.0.0.1:5173` and proxies `/api` to the backend.

## API

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/story/trending?q=` | Trending news via SerpApi |
| `GET` | `/api/story/catalog` | Available curated stories |
| `GET` | `/api/story/flagship?story_id=` | Curated flagship story graph |
| `POST` | `/api/story/analyze` | Build a lineage graph for a live headline |
| `POST` | `/api/story/drill-deeper` | Expand a node into earlier archival sources |
| `POST` | `/api/interrogate` | Interrogate a claim and return a verdict |

## Project layout

```
backend/
  app/
    main.py            FastAPI app + CORS
    config.py          .env loading and key normalization
    routers/           story + interrogate endpoints
    services/          serp / you.com / gemini clients
    models/schemas.py  Pydantic graph + verdict schemas
    data/              flagship story dataset
frontend/
  src/
    components/        graph, drift, ripple, modal views
    api/client.ts      typed backend client
    types/             shared TypeScript types
```

## Notes

- The backend reads `.env` from the repository root.
- CORS is currently `allow_origins=["*"]` for local development.
- Never commit `.env` — it is gitignored; only `.env.example` is tracked.
