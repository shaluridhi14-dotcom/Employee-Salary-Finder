
const API_URL = "http://127.0.0.1:5000";

// 1. Highest Salary Employee
async function getHighestSalary() {
    const response = await fetch(`${API_URL}/highest-salary`);
    const employee = await response.json();

    document.getElementById("highest-salary").innerText =
        "₹" + Number(employee.salary).toLocaleString("en-IN");

    showEmployee(employee);
}

// 2. Lowest Salary Employee
async function getLowestSalary() {
    const response = await fetch(`${API_URL}/lowest-salary`);
    const employee = await response.json();

    document.getElementById("lowest-salary").innerText =
        "₹" + Number(employee.salary).toLocaleString("en-IN");

    showEmployee(employee);
}

// 3. Top 5 Employees
async function getTop5() {
    const response = await fetch(`${API_URL}/top-5-employees`);
    const employees = await response.json();

    let html = `
        <h3>Top 5 Highest Paid Employees</h3>
        <table>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Salary</th>
            </tr>
    `;

    employees.forEach(employee => {
        html += `
            <tr>
                <td>${employee.emp_id}</td>
                <td>${employee.emp_name}</td>
                <td>${employee.department}</td>
                <td>₹${Number(employee.salary).toLocaleString("en-IN")}</td>
            </tr>
        `;
    });

    html += "</table>";

    document.getElementById("result").innerHTML = html;
}

// 4. Average Salary
async function getAverageSalary() {
    const response = await fetch(`${API_URL}/average-salary`);
    const result = await response.json();

    const average = Number(result.average_salary);

    document.getElementById("average-salary").innerText =
        "₹" + average.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    document.getElementById("result").innerHTML = `
        <h3>Average Employee Salary</h3>
        <h2>₹${average.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}</h2>
    `;
}

// Display individual employee details
function showEmployee(employee) {
    document.getElementById("result").innerHTML = `
        <h3>Employee Details</h3>
        <p><b>Employee ID:</b> ${employee.emp_id}</p>
        <p><b>Name:</b> ${employee.emp_name}</p>
        <p><b>Department:</b> ${employee.department}</p>
        <p><b>Salary:</b> ₹${Number(employee.salary).toLocaleString("en-IN")}</p>
    `;
}
