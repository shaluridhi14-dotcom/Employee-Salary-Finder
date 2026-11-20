from flask import Flask, jsonify
from db import get_connection
from flask_cors import CORS
app = Flask(__name__)

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Employee Salary Finder Backend is Running!"


@app.route("/highest-salary")
def highest_salary():

    connection = get_connection()
    cursor = connection.cursor()

    query = """
        SELECT *
        FROM employee
        WHERE salary = (
            SELECT MAX(salary)
            FROM employee
        )
    """

    cursor.execute(query)
    employee = cursor.fetchone()

    cursor.close()
    connection.close()

    return jsonify(employee)


@app.route("/lowest-salary")
def lowest_salary():
    connection = get_connection()
    cursor = connection.cursor()

    query = """
        SELECT *
        FROM employee
        WHERE salary = (
            SELECT MIN(salary)
            FROM employee
        )
    """

    cursor.execute(query)
    employee = cursor.fetchone()

    cursor.close()
    connection.close()

    return jsonify(employee)


@app.route("/top-5-employees")
def top_5_employees():
    connection = get_connection()
    cursor = connection.cursor()

    query = """
        SELECT *
        FROM employee
        ORDER BY salary DESC
        LIMIT 5
    """

    cursor.execute(query)
    employees = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(employees)


@app.route("/average-salary")
def average_salary():
    connection = get_connection()
    cursor = connection.cursor()

    query = """
        SELECT AVG(salary) AS average_salary
        FROM employee
    """

    cursor.execute(query)
    result = cursor.fetchone()

    cursor.close()
    connection.close()

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
