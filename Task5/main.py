from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, HttpUrl
from typing import Optional
import string
import random
import uvicorn

app = FastAPI(title="URL Shortener Service")

# --- In-Memory Storage ---
# Maps short_code -> original_url
url_storage = {}
# Maps original_url -> short_code (to handle duplicate submissions)
reverse_storage = {}

class ShortenRequest(BaseModel):
    url: HttpUrl
    alias: Optional[str] = None

class ShortenResponse(BaseModel):
    short_code: str
    original_url: str

class URLInfo(BaseModel):
    short_code: str
    original_url: str
    clicks: int = 0 # Bonus feature hinted in PRD

# To keep track of clicks
click_counts = {}

def generate_short_code(length: int = 6):
    chars = string.ascii_letters + string.digits
    while True:
        code = ''.join(random.choices(chars, k=length))
        if code not in url_storage:
            return code

@app.post("/shorten", response_model=ShortenResponse, status_code=201)
def shorten_url(request: ShortenRequest):
    original_url = str(request.url)

    # 1. Handle Custom Alias
    if request.alias:
        if request.alias in url_storage:
            raise HTTPException(status_code=400, detail="Alias already taken")
        short_code = request.alias
    # 2. Handle Duplicate Submissions (if no alias provided)
    elif original_url in reverse_storage:
        return {
            "short_code": reverse_storage[original_url],
            "original_url": original_url
        }
    # 3. Generate New Code
    else:
        short_code = generate_short_code()

    # Store mapping
    url_storage[short_code] = original_url
    reverse_storage[original_url] = short_code
    click_counts[short_code] = 0

    return {
        "short_code": short_code,
        "original_url": original_url
    }

@app.get("/{code}")
def redirect_to_url(code: str):
    if code not in url_storage:
        raise HTTPException(status_code=404, detail="Short code not found")

    # Increment click count
    click_counts[code] = click_counts.get(code, 0) + 1

    return RedirectResponse(url=url_storage[code])

@app.get("/info/{code}", response_model=URLInfo)
def get_url_info(code: str):
    if code not in url_storage:
        raise HTTPException(status_code=404, detail="Short code not found")

    return {
        "short_code": code,
        "original_url": url_storage[code],
        "clicks": click_counts.get(code, 0)
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3000)
