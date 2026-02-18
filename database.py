import sqlite3

conn = sqlite3.connect("applications.db", check_same_thread=False)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    income REAL,
    risk TEXT
)
""")

def save_application(name, income, risk):
    cursor.execute(
        "INSERT INTO applications (name, income, risk) VALUES (?, ?, ?)",
        (name, income, risk)
    )
    conn.commit()
