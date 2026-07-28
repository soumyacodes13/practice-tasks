# query.py → builds the SQL strings (INSERT, SELECT, UPDATE, DELETE).

def build_insert(table_name, data):
    columns = ", ".join(data.keys())
    placeholders = ", ".join(["?"] * len(data))
    sql = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"
    return sql, tuple(data.values())

def build_select(table_name, filters=None):
    sql = f"SELECT * FROM {table_name}"
    params = ()
    if filters:
        conditions = " AND ".join([f"{k} = ?" for k in filters.keys()])
        sql += f" WHERE {conditions}"
        params = tuple(filters.values())
    return sql, params

def build_update(table_name, id_col, id_val, data):
    set_clause = ", ".join([f"{k} = ?" for k in data.keys()])
    sql = f"UPDATE {table_name} SET {set_clause} WHERE {id_col} = ?"
    params = tuple(data.values()) + (id_val,)
    return sql, params

def build_delete(table_name, id_col, id_val):
    sql = f"DELETE FROM {table_name} WHERE {id_col} = ?"
    return sql, (id_val,)
