
from db import get_connection

try:
    connection = get_connection()
    print("TiDB Cloud Connected Successfully!")

    cursor = connection.cursor()
    cursor.execute("SELECT COUNT(*) AS total FROM employee")
    result = cursor.fetchone()

    print("Total Employees:", result["total"])

    cursor.close()
    connection.close()

except Exception as e:
    print("Database Connection Failed:", e)
