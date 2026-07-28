# Task 12 – Simple ORM-like Layer

## Objective

Build a lightweight ORM-like interface over SQLite that allows models to be defined as Python classes and perform CRUD operations without writing raw SQL.

## Features

* Model definition using Python classes
* Automatic field metadata collection
* SQL query builder
* CRUD operations
* Optional foreign-key relationship support

## Project Structure

```text
Task12/
├── db.py          # Database connection and execution
├── fields.py      # Field definitions
├── model.py       # Base model and CRUD API
├── query.py       # SQL query builders
├── relation.py    # Relationship helpers (optional)
├── utils.py       # Shared helper functions
├── test.py        # Example usage/tests
└── README.md
```

## How to Run

1. Open a terminal in the project root.
2. Ensure Python 3.9+ is installed.
3. Run the example/test script:

```bash
python Task12/test.py
```

## Example Usage

```python
await User.create(name="John", email="john@example.com")
await User.find(name="John")
await User.find_by_id(1)
await User.update(1, name="Jane")
await User.delete(1)
```

## Workflow

1. Define a model using field classes.
2. `ModelMeta` collects model metadata.
3. `query.py` builds parameterized SQL.
4. `db.py` executes the query and manages transactions.
5. Rows are converted into model instances.

## Deliverables

* ✅ Model definition
* ✅ Query builder
* ✅ CRUD operations
* ☐ Relationship support (optional)
* ✅ Documentation
