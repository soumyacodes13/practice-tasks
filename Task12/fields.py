# Define the field class
# Define field types
# Store column metadata (db_column, primary_key, required, unique, etc.)
# Convert python values to db values and vice versa

# It should not:
# Execute SQL.
# Generate queries.
# Validate entire models.
# Handle relationships (except providing a ForeignKeyField placeholder).

class Field:
    def __init__(self, db_column=None, primary_key=False, required=False, unique=False):
        self.db_column = db_column
        self.primary_key = primary_key
        self.required = required
        self.unique = unique

    def python_to_db(self, value):
        return value

    def db_to_python(self, value):
        return value

class StringField(Field):
    def python_to_db(self,value):
        if value is None:return None
        return str(value)

class NumberField(Field):
    def python_to_db(self,value):
        if value is None:return None
        return int(value)

class ForeignKeyField(Field):
    def __init__(self, to_model, **kwargs):
        self.to_model = to_model
        super().__init__(**kwargs)
