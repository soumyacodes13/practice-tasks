# db.connect()
# db.close()
# db.execute(
#     "INSERT INTO users(name) VALUES (?)",
#     ("Alice",)
# )

# fetchone
# fetchall
# db.py → executes the SQL.

import sqlite3

class Database:
    def __init__(self,database="orm.db"):
        self.conn=sqlite3.connect("orm.db")
        self.cur=self.conn.cursor()

    def execute(self,query):
        self.cur.execute(query)
    def fetchone(self):
        self.cur.fetchone()
    def fetchall(self):
        self.cur.fetchall()
    def commit(self):
        self.conn.commit()
    def close(self):
        self.conn.close()
    def rollback(self):
        self.conn.rollback()
db=Database()