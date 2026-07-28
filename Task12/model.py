# model.py → implements the CRUD API (create, find, update, delete) and coordinates the operation.

from db import db
from fields import Field
class ModelMeta(type):
    def __new__(cls, name, bases, attrs):
        # Collect field definitions from attrs
        fields = {k: v for k, v in attrs.items() if hasattr(v, 'db_column')}
        attrs['_fields'] = fields
        attrs["_table"]=name.lower()+"s"
        return super().__new__(cls, name, bases, attrs)

class Model(metaclass=ModelMeta):
    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)

    @classmethod
    async def create(cls, **kwargs):
        # Implement create logic
        columns=", ".join(kwargs.keys())
        placeholders=", ".join(["?"] * len(kwargs))
        values=tuple(kwargs.values())

        query=f"INSERT INTO {cls._table} ({columns}) VALUES ({placeholders})"
        db.execute(query,values)
        db.commit()
        return cls(**kwargs)

    @classmethod
    async def find(cls, **kwargs):
        name=list(kwargs.keys())[0]
        value=kwargs[name]
        # Implement find logic
        query=f"SELECT * FROM {cls._table} WHERE {name} = ?"
        return db.execute(query,value)


    @classmethod
    async def find_by_id(cls, id):
        # Implement find_by_id logic
        query=f"SELECT * FROM {cls._table} WHERE id=?"
        return db.execute(query,(id,))

    @classmethod
    async def update(cls, id, **kwargs):
        data=", ".join(f"{k}=?" for k in kwargs)
        values=tuple(kwargs.values()) + (id,)
        query=f"UPDATE {cls._table} SET {data} WHERE id=?"
        # Implement update logic
        try:
            db.execute(query,values)
            db.commit()
        except Exception:
            db.rollback()
            raise Exception("Failed to update record")

    @classmethod
    async def delete(cls, id):
        # Implement delete logic
        query=f"DELETE FROM {cls._table} WHERE id = ?"
        try:
            db.execute(query,(id,))
            db.commit()
        except Exception:
            db.rollback()
            raise Exception("Failed to delete record")

    @classmethod
    async def all(cls):
        # Implement all logic
        query= f"SELECT * FROM {cls._table}"
        rows = db.fetchall(query)
        return [cls.from_row(row) for row in rows]

    def to_dict(self):
        # Implement to_dict logic
        return {k: getattr(self, k, None) for k in self._fields}

    @classmethod
    def from_row(cls, row):
        # Implement from_row logic
        return cls(**row)
