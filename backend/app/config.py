import os
from pathlib import Path
from dotenv import load_dotenv

# Search for .env in project root or current directory
root_dir = Path(__file__).resolve().parent.parent.parent
env_path = root_dir / ".env"

if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()

# Normalize keys (handle both lowercase and uppercase names)
SERP_API_KEY = os.getenv("SERP_API_KEY") or os.getenv("serp_api_key") or ""
YOU_COM_API_KEY = os.getenv("YOU_COM_API_KEY") or os.getenv("you_com_api_key") or ""
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("gemini_api_key") or ""
