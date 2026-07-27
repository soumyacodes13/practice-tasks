import pytest
from fastapi.testclient import TestClient
from main import app, todos

client = TestClient(app)

@pytest.fixture(autouse=True)
def clear_todos():
    """Clear the in-memory list before each test."""
    todos.clear()
    import main
    main.current_id = 1

def test_create_todo():
    """Test POST /todos endpoint"""
    response = client.post("/todos", json={"title": "Test Todo", "description": "Test Desc"})
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Todo"
    assert data["id"] == 1
    assert data["completed"] is False

def test_list_todos_empty():
    """Test GET /todos when empty"""
    response = client.get("/todos")
    assert response.status_code == 200
    assert response.json() == []

def test_list_todos_with_data():
    """Test GET /todos with multiple items"""
    client.post("/todos", json={"title": "Task 1"})
    client.post("/todos", json={"title": "Task 2"})
    response = client.get("/todos")
    assert len(response.json()) == 2

def test_get_specific_todo():
    """Test GET /todos/{id}"""
    client.post("/todos", json={"title": "Find Me"})
    response = client.get("/todos/1")
    assert response.status_code == 200
    assert response.json()["title"] == "Find Me"

def test_get_non_existent_todo():
    """Test GET /todos/{id} with invalid ID"""
    response = client.get("/todos/99")
    assert response.status_code == 404

def test_update_todo():
    """Test PUT /todos/{id}"""
    client.post("/todos", json={"title": "Old Title", "completed": False})
    response = client.put("/todos/1", json={"title": "New Title", "completed": True})
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "New Title"
    assert data["completed"] is True

def test_update_non_existent_todo():
    """Test PUT /todos/{id} with invalid ID"""
    response = client.put("/todos/99", json={"title": "No"})
    assert response.status_code == 404

def test_delete_todo():
    """Test DELETE /todos/{id}"""
    client.post("/todos", json={"title": "Delete Me"})
    response = client.delete("/todos/1")
    assert response.status_code == 200
    assert response.json()["message"] == "Todo deleted successfully"
    # Verify it's gone
    check_response = client.get("/todos")
    assert len(check_response.json()) == 0

def test_delete_non_existent_todo():
    """Test DELETE /todos/{id} with invalid ID"""
    response = client.delete("/todos/99")
    assert response.status_code == 404
