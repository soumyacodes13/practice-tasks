# Todo List API

A simple REST API for managing todos built with **FastAPI** and **In-Memory** storage.

## Features
- Full CRUD (Create, Read, Update, Delete)
- Input validation using Pydantic
- Automatic documentation (Swagger UI)

## Prerequisites
- Python 3.10+
- Pip installed

## Installation

1. Navigate to the task folder:
   ```bash
   cd task2
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Server

Start the API server using **uvicorn**:

```bash
uvicorn main:app --reload --port 3000
```

The API will be available at `http://localhost:3000`.

## Interactive API Docs

Once the server is running, you can explore and test the API directly in your browser:
- **Swagger UI**: [http://localhost:3000/docs](http://localhost:3000/docs)
- **ReDoc**: [http://localhost:3000/redoc](http://localhost:3000/redoc)

## Running Tests

Verify the API logic using **pytest**:

```bash
python -m pytest test_main.py
```

## Example Usage

### Create a Todo
```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn AI","description":"Practice prompts"}'
```

### List Todos
```bash
curl http://localhost:3000/todos
```

### Update a Todo
```bash
curl -X PUT http://localhost:3000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### Delete a Todo
```bash
curl -X DELETE http://localhost:3000/todos/1
```
