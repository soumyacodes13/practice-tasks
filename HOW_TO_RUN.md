# How to Run — any.ai Practice Tasks

## 🚀 Cloning & Installation

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd any.ai
```

### 2. Install JavaScript dependencies (Root node_modules)
```bash
npm install
```

### 3. Install Python dependencies (Required for Tasks 1, 2, and 5)
```bash
pip install -r requirements.txt
```

---

## 🏃 Running Commands

All commands below should be run from the **project root directory**: `c:\Users\SOUMYA\Documents\any.ai`

---

## Quick Reference

| Task | Language | Run Demo | Run Tests |
|------|----------|----------|-----------|
| Task 1 | Python | `python Task1/generator.py` | `python -m pytest Task1/` |
| Task 2 | Python | `python Task2/main.py` | `python -m pytest Task2/` |
| Task 3 | JS | *(no demo)* | `npm run test:t3` |
| Task 4 | JS | `npm run start:t4` | `npm run test:t4` |
| Task 5 | Python | `python Task5/main.py` | `python -m pytest Task5/` |
| Task 6 | JS | `npm run start:t6` | `npm run test:t6` |
| Task 7 | JS | `npm run start:t7` | `npm run test:t7` |
| Task 8 | JS | `npm run start:t8` | `npm run test:t8` |
| Task 9 | JS | `npm run start:t9` | `npm run test:t9` |
| Task 10 | JS | `npm run start:t10` | `npm run test:t10` |
| Task 11 | JS | *(no demo)* | `npm run test:t11` |
| Task 12 | Python | *(no demo)* | `python -m pytest Task12/test.py` |

---

## Run All JS Tests at Once

```bash
npm run test:all
```

## Run All Python Tests at Once

```bash
# Run each python suite separately (avoids module naming collisions on 'main')
python -m pytest Task1/; python -m pytest Task2/; python -m pytest Task5/; python -m pytest Task12/test.py
```

---

## Per-Task Details

### Task 1 — Python: Markdown Report Generator
> Generates markdown reports from data.

```bash
# Run
python Task1/generator.py

# Test
python -m pytest Task1/
```

---

### Task 2 — Python

```bash
# Run
python Task2/main.py

# Test
python -m pytest Task2/
```

---

### Task 3 — JS: Discount Calculator + Test Suite
> Discount calculation logic with a comprehensive test suite. No interactive demo.

```bash
# Test
npm run test:t3
```

---

### Task 4 — JS: Password Strength Checker (CLI)
> Interactive CLI to check password strength against common password lists.

```bash
# Demo (interactive CLI)
npm run start:t4

# Test
npm run test:t4
```

---

### Task 5 — Python

```bash
# Run
python Task5/main.py

# Test
python -m pytest Task5/
```

---

### Task 6 — JS: Input Validator (CLI)
> Interactive CLI for validating user input fields.

```bash
# Demo (interactive CLI)
npm run start:t6

# Test
npm run test:t6
```

---

### Task 7 — JS: API Rate Limiter
> Rate-limiting middleware. The demo runs example request scenarios.

```bash
# Demo
npm run start:t7

# Test
npm run test:t7
```

---

### Task 8 — JS: JSON Configuration Manager
> Manages app config from JSON files with env variable interpolation and schema validation.

```bash
# Demo
npm run start:t8

# Test
npm run test:t8
```

---

### Task 9 — JS: In-Memory Cache (TTL + LRU)
> Cache with TTL expiry, LRU eviction, and hit/miss statistics.

```bash
# Demo
npm run start:t9

# Test
npm run test:t9
```

---

### Task 10 — JS: Logger with Levels
> Logging library supporting log levels, pretty & JSON formatting, and multiple outputs (console, file).

```bash
# Demo
npm run start:t10

# Test
npm run test:t10
```

---

### Task 11 — JS: Event Emitter System
> Pub-Sub event emitter supporting standard/wildcard event subscriptions, async handlers, and isolated error propagation.

```bash
# Test
npm run test:t11
```

---

### Task 12 — Python: Simple ORM Layer
> Lightweight ORM-like interface for database operations: model definition, querying, and relationships.

```bash
# Test
python -m pytest Task12/test.py
```
