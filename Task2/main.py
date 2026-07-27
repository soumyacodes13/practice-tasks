from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uvicorn

app = FastAPI(title="Todo List API")

# --- Models ---
class TodoBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False

class Todo(TodoBase):
    id: int
    createdAt: datetime

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

# --- In-Memory Storage ---
todos: List[Todo] = []
current_id = 1

# --- Endpoints ---

@app.get("/todos", response_model=List[Todo])
def list_todos():
    """List all todos"""
    return todos

@app.get("/todos/{todo_id}", response_model=Todo)
def get_todo(todo_id: int):
    """Get a specific todo by ID"""
    for todo in todos:
        if todo.id == todo_id:
            return todo
    raise HTTPException(status_code=404, detail="Todo not found")

@app.post("/todos", response_model=Todo, status_code=201)
def create_todo(todo_in: TodoBase):
    """Create a new todo"""
    global current_id
    new_todo = Todo(
        id=current_id,
        createdAt=datetime.now(),
        **todo_in.dict()
    )
    todos.append(new_todo)
    current_id += 1
    return new_todo

@app.put("/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id: int, todo_update: TodoUpdate):
    """Update a specific todo"""
    for index, todo in enumerate(todos):
        if todo.id == todo_id:
            update_data = todo_update.dict(exclude_unset=True)
            updated_todo = todo.copy(update=update_data)
            todos[index] = updated_todo
            return updated_todo
    raise HTTPException(status_code=404, detail="Todo not found")

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int):
    """Delete a todo"""
    for index, todo in enumerate(todos):
        if todo.id == todo_id:
            todos.pop(index)
            return {"message": "Todo deleted successfully"}
    raise HTTPException(status_code=404, detail="Todo not found")

if __name__ == "__main__":
    # Command to run: uvicorn main:app --reload --port 3000
    uvicorn.run(app, host="0.0.0.0", port=3000)
