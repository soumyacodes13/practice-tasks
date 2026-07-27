import pytest
from fastapi.testclient import TestClient
from main import app, url_storage, reverse_storage, click_counts

client = TestClient(app)

@pytest.fixture(autouse=True)
def clear_storage():
    url_storage.clear()
    reverse_storage.clear()
    click_counts.clear()

def test_shorten_url():
    response = client.post("/shorten", json={"url": "https://www.google.com"})
    assert response.status_code == 201
    data = response.json()
    assert "short_code" in data
    assert len(data["short_code"]) == 6
    assert data["original_url"] == "https://www.google.com/"

def test_shorten_url_duplicate():
    client.post("/shorten", json={"url": "https://www.google.com"})
    response = client.post("/shorten", json={"url": "https://www.google.com"})
    assert response.status_code == 201 # Should return existing
    data = response.json()
    # Check that it's the same code (reverse storage works)
    assert len(data["short_code"]) == 6

def test_shorten_with_alias():
    response = client.post("/shorten", json={"url": "https://www.google.com", "alias": "mygoog"})
    assert response.status_code == 201
    data = response.json()
    assert data["short_code"] == "mygoog"

def test_redirect():
    client.post("/shorten", json={"url": "https://www.google.com", "alias": "g"})
    response = client.get("/g", follow_redirects=False)
    assert response.status_code == 307
    assert response.headers["location"] == "https://www.google.com/"

def test_info():
    client.post("/shorten", json={"url": "https://www.google.com", "alias": "g"})
    client.get("/g") # Click once
    response = client.get("/info/g")
    assert response.status_code == 200
    data = response.json()
    assert data["clicks"] == 1
    assert data["original_url"] == "https://www.google.com/"

def test_not_found():
    response = client.get("/nonexistent")
    assert response.status_code == 404
