
import pymysql
import os
import base64
import tempfile
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    ca_base64 = os.getenv("TIDB_CA_CERT_BASE64")

    if ca_base64:
        ca_content = base64.b64decode(ca_base64)
        ca_path = os.path.join(tempfile.gettempdir(), "ca.pem")

        with open(ca_path, "wb") as file:
            file.write(ca_content)
    else:
        ca_path = os.getenv("CA_PATH", "ca.pem")

    connection = pymysql.connect(
        host=os.getenv("TIDB_HOST"),
        port=int(os.getenv("TIDB_PORT")),
        user=os.getenv("TIDB_USER"),
        password=os.getenv("TIDB_PASSWORD"),
        database=os.getenv("TIDB_DB_NAME"),
        cursorclass=pymysql.cursors.DictCursor,
        ssl={"ca": ca_path}
    )

    return connection
