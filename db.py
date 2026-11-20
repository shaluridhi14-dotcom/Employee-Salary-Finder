
import pymysql
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def get_connection():

    connection = pymysql.connect(
        host=os.getenv("TIDB_HOST"),
        port=int(os.getenv("TIDB_PORT")),
        user=os.getenv("TIDB_USER"),
        password=os.getenv("TIDB_PASSWORD"),
        database=os.getenv("TIDB_DB_NAME"),
        cursorclass=pymysql.cursors.DictCursor,
        ssl={
            "ca": os.getenv("CA_PATH")
        }
    )

    return connection
