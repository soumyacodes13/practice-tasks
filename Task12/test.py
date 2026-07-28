import pytest
import sys
import os

# Setup path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from model import Model
from fields import StringField, NumberField
from query import build_insert, build_update, build_delete, build_select

class User(Model):
    id = NumberField(primary_key=True)
    name = StringField(required=True)
    email = StringField(unique=True)

# Query Builder Tests (3 sets per operation)
def test_insert_queries():
    table = 'user'
    # Test 1
    sql, params = build_insert(table, {'name': 'A', 'email': 'a@a.com'})
    assert "INSERT INTO user" in sql and "?" in sql
    # Test 2
    sql, params = build_insert(table, {'name': 'B', 'email': 'b@b.com'})
    assert len(params) == 2
    # Test 3
    sql, params = build_insert(table, {'id': 1})
    assert "VALUES (?)" in sql

def test_update_queries():
    table = 'user'
    # Test 1
    sql, params = build_update(table, 'id', 1, {'name': 'Jane'})
    assert "UPDATE user SET name = ? WHERE id = ?" in sql
    # Test 2
    sql, params = build_update(table, 'id', 2, {'email': 'new@mail.com'})
    assert params == ('new@mail.com', 2)
    # Test 3
    sql, params = build_update(table, 'id', 3, {'name': 'x', 'email': 'y'})
    assert len(params) == 3

def test_delete_queries():
    table = 'user'
    # Test 1
    sql, params = build_delete(table, 'id', 1)
    assert sql == "DELETE FROM user WHERE id = ?"
    # Test 2
    sql, params = build_delete(table, 'id', 2)
    assert params == (2,)
    # Test 3
    sql, params = build_delete(table, 'id', 99)
    assert params == (99,)

def test_select_queries():
    table = 'user'
    # Test 1
    sql, params = build_select(table)
    assert sql == "SELECT * FROM user"
    # Test 2
    sql, params = build_select(table, {'name': 'John'})
    assert "WHERE name = ?" in sql
    # Test 3
    sql, params = build_select(table, {'name': 'John', 'email': 'a@a.com'})
    assert "AND" in sql

# Model Operations Tests
def test_model_ops():
    # Test 1
    user = User(id=1, name='John', email='john@example.com')
    assert user.to_dict() == {'id': 1, 'name': 'John', 'email': 'john@example.com'}
    # Test 2
    user2 = User(name='Mike')
    assert user2.name == 'Mike'
    # Test 3
    assert user.id == 1

