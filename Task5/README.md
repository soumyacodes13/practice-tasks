# URL Shortener Service

A FastAPI-based URL shortener that generates unique 6-character short codes, supports custom aliases, redirects to original URLs, and tracks click counts.

## Requirements

- Python 3.10+
- pip

Check your installation:

```bash
python --version
pip --version
```

## Running the Service

```bash
python main.py
```

The API will be available at:

```
http://localhost:3000
```

Interactive API documentation:

```
http://localhost:3000/docs
```

## Running Tests

```bash
pytest
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/shorten` | Create a short URL |
| GET | `/{code}` | Redirect to the original URL |
| GET | `/info/{code}` | Get URL information and click count |

## Example Usage

### Create Short URL

```bash
curl -X POST http://localhost:3000/shorten \
-H "Content-Type: application/json" \
-d '{"url":"https://www.google.com"}'
```

### Create with Custom Alias

```bash
curl -X POST http://localhost:3000/shorten \
-H "Content-Type: application/json" \
-d '{"url":"https://www.google.com","alias":"google"}'
```

### Redirect

```
GET /google
```

### Get URL Information

```bash
curl http://localhost:3000/info/google
```

## Features

- Unique 6-character short codes
- Custom aliases
- Duplicate URL detection
- URL redirection
- Click tracking
- In-memory storage
```