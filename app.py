from flask import Flask, jsonify, request
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

@app.route("/search-employee", methods=["GET"])
def search_employee():

    search_text = request.args.get("query", "").strip()

    if not search_text:
        return jsonify({
            "message": "Please enter Employee ID or Name"
        }), 400

    connection = get_connection()
    cursor = connection.cursor()

    try:
        query = """
            SELECT emp_id, emp_name, department, salary
            FROM employee
            WHERE CAST(emp_id AS CHAR) LIKE %s
            OR emp_name LIKE %s
        """

        search_value = f"%{search_text}%"

        cursor.execute(query, (search_value, search_value))

        employees = cursor.fetchall()

        return jsonify(employees)

    finally:
        cursor.close()
        connection.close()
    

@app.route("/add-employee", methods=["POST"])
def add_employee():
    data = request.get_json()

    emp_id = data.get("emp_id")
    emp_name = data.get("emp_name")
    department = data.get("department")
    salary = data.get("salary")

    if not emp_id or not emp_name or not department or salary is None:
        return jsonify({"message": "All fields are required"}), 400

    try:
        salary = float(salary)

        if salary < 0:
            return jsonify({"message": "Salary cannot be negative"}), 400

        connection = get_connection()
        cursor = connection.cursor()

        query = """
            INSERT INTO employee (emp_id, emp_name, department, salary)
            VALUES (%s, %s, %s, %s)
        """

        cursor.execute(query, (emp_id, emp_name, department, salary))
        connection.commit()

        return jsonify({
            "message": "Employee added successfully!"
        }), 201

    except Exception as e:
        return jsonify({"message": str(e)}), 500

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'connection' in locals():
            connection.close()

@app.route("/delete-employee/<int:emp_id>", methods=["DELETE"])
def delete_employee(emp_id):

    connection = get_connection()
    cursor = connection.cursor()

    try:
        query = "DELETE FROM employee WHERE emp_id = %s"
        cursor.execute(query, (emp_id,))
        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({"message": "Employee not found"}), 404

        return jsonify({
            "message": "Employee deleted successfully!"
        }), 200

    except Exception as e:
        connection.rollback()
        return jsonify({"message": str(e)}), 500

    finally:
        cursor.close()
        connection.close()


@app.route("/employees", methods=["GET"])
def get_employees():
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            SELECT emp_id, emp_name, department, salary
            FROM employee
            ORDER BY emp_id
        """)

        employees = cursor.fetchall()
        return jsonify(employees), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500

    finally:
        cursor.close()
        connection.close()


@app.route("/update-employee/<int:emp_id>", methods=["PUT"])
def update_employee(emp_id):

    data = request.get_json()

    emp_name = data.get("emp_name")
    department = data.get("department")
    salary = data.get("salary")

    if not emp_name or not department or salary is None:
        return jsonify({"message": "All fields are required"}), 400

    connection = get_connection()
    cursor = connection.cursor()

    try:
        query = """
            UPDATE employee
            SET emp_name = %s,
                department = %s,
                salary = %s
            WHERE emp_id = %s
        """

        cursor.execute(
            query,
            (emp_name, department, salary, emp_id)
        )

        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({"message": "Employee not found or no changes made"}), 404

        return jsonify({
            "message": "Employee updated successfully!"
        }), 200

    except Exception as e:
        connection.rollback()
        return jsonify({"message": str(e)}), 500

    finally:
        cursor.close()
        connection.close()
    
if __name__ == "__main__":
    app.run(debug=True)
