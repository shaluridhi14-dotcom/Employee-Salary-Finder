const API_URL = window.location.hostname === "localhost" ||
                window.location.hostname === "127.0.0.1"
                ? "http://127.0.0.1:5000"
                : "https://employee-salary-finder-hdd7.vercel.app";

// 1. Highest Salary Employee
async function getHighestSalary() {
    const response = await fetch(`${API_URL}/highest-salary`);
    const employee = await response.json();

    document.getElementById("highest-salary").innerText =
        "₹" + Number(employee.salary).toLocaleString("en-IN");

    document.getElementById("highest-result").innerHTML = `
        <h4>Employee Details</h4>
        <p><b>ID:</b> ${employee.emp_id}</p>
        <p><b>Name:</b> ${employee.emp_name}</p>
        <p><b>Department:</b> ${employee.department}</p>
    `;
}


// 2. Lowest Salary Employee
async function getLowestSalary() {
    const response = await fetch(`${API_URL}/lowest-salary`);
    const employee = await response.json();

    document.getElementById("lowest-salary").innerText =
        "₹" + Number(employee.salary).toLocaleString("en-IN");

    document.getElementById("lowest-result").innerHTML = `
        <h4>Employee Details</h4>
        <p><b>ID:</b> ${employee.emp_id}</p>
        <p><b>Name:</b> ${employee.emp_name}</p>
        <p><b>Department:</b> ${employee.department}</p>
    `;
}


// 3. Top 5 Highest Paid Employees
async function getTop5() {
    const response = await fetch(`${API_URL}/top-5-employees`);
    const employees = await response.json();

    let html = `
        <h4>Top 5 Highest Paid Employees</h4>
        <table>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Salary</th>
            </tr>
    `;

    employees.forEach(employee => {
        html += `
            <tr>
                <td>${employee.emp_id}</td>
                <td>${employee.emp_name}</td>
                <td>₹${Number(employee.salary).toLocaleString("en-IN")}</td>
            </tr>
        `;
    });

    html += "</table>";

    document.getElementById("top5-result").innerHTML = html;
}


// 4. Average Salary
async function getAverageSalary() {
    const response = await fetch(`${API_URL}/average-salary`);
    const result = await response.json();

    const average = Number(result.average_salary);

    const formattedAverage = "₹" + average.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    document.getElementById("average-salary").innerText =
        formattedAverage;

    document.getElementById("average-result").innerHTML = `
        <h4>Average Employee Salary</h4>
        <h3>${formattedAverage}</h3>
    `;
}


async function searchEmployee() {
    const searchText = document
        .getElementById("searchInput")
        .value.trim();

    const resultDiv = document.getElementById("result");

    if (!searchText) {
        resultDiv.innerHTML = "<p>Please enter Employee ID or Name.</p>";
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/search-employee?query=${encodeURIComponent(searchText)}`
        );

        const employees = await response.json();

        if (!response.ok) {
            throw new Error(employees.message || "Search failed");
        }

        if (employees.length === 0) {
            resultDiv.innerHTML = "<p>No employee found.</p>";
            return;
        }

        resultDiv.innerHTML = `
            <table>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Salary</th>
                </tr>

                ${employees.map(emp => `
                    <tr>
                        <td>${emp.emp_id}</td>
                        <td>${emp.emp_name}</td>
                        <td>${emp.department}</td>
                        <td>₹${emp.salary}</td>
                    </tr>
                `).join("")}
            </table>
        `;

    } catch (error) {
        resultDiv.innerHTML = `<p>${error.message}</p>`;
    }
}

document.getElementById("addEmployeeForm")
    .addEventListener("submit", async function(event) {

    event.preventDefault();

    const employee = {
        emp_id: document.getElementById("emp_id").value,
        emp_name: document.getElementById("emp_name").value.trim(),
        department: document.getElementById("department").value.trim(),
        salary: document.getElementById("salary").value
    };

    const message = document.getElementById("addMessage");

    try {
        const response = await fetch(`${API_URL}/add-employee`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(employee)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Unable to add employee");
        }

        message.textContent = result.message;
        message.style.color = "green";

        document.getElementById("addEmployeeForm").reset();

    } catch (error) {
        message.textContent = error.message;
        message.style.color = "red";
    }
});

async function deleteEmployee() {
    const empId = document.getElementById("deleteEmpId").value;
    const message = document.getElementById("deleteMessage");

    if (!empId) {
        message.textContent = "Please enter Employee ID.";
        message.style.color = "red";
        return;
    }

    const confirmDelete = confirm(
        "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) return;

    try {
        const response = await fetch(
            `${API_URL}/delete-employee/${empId}`,
            {
                method: "DELETE"
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Delete failed");
        }

        message.textContent = result.message;
        message.style.color = "green";

        document.getElementById("deleteEmpId").value = "";

    } catch (error) {
        message.textContent = error.message;
        message.style.color = "red";
    }
}

async function getEmployees() {
    const employeeList = document.getElementById("employeeList");

    try {
        const response = await fetch(`${API_URL}/employees`);
        const employees = await response.json();

        if (!response.ok) {
            throw new Error(employees.message || "Unable to fetch employees");
        }

        if (employees.length === 0) {
            employeeList.innerHTML = "<p>No employees found.</p>";
            return;
        }

        employeeList.innerHTML = `
            <table>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Salary</th>
                    <th>Action</th>
                </tr>

                ${employees.map(emp => `
                    <tr>
                        <td>${emp.emp_id}</td>
                        <td>${emp.emp_name}</td>
                        <td>${emp.department}</td>
                        <td>₹${emp.salary}</td>
                        <td>
                            <button onclick="fillUpdateForm(
                                '${emp.emp_id}',
                                '${String(emp.emp_name).replace(/\\/g, "\\\\").replace(/'/g, "\\'")}',
                                '${String(emp.department).replace(/\\/g, "\\\\").replace(/'/g, "\\'")}',
                                '${emp.salary}'
                            )">Edit</button>
                        </td>
                    </tr>
                `).join("")}
            </table>
        `;

    } catch (error) {
        employeeList.innerHTML = `<p>${error.message}</p>`;
    }
}

async function getEmployees() {
    const employeeList = document.getElementById("employeeList");

    try {
        const response = await fetch(`${API_URL}/employees`);
        const employees = await response.json();

        if (!response.ok) {
            throw new Error(employees.message || "Unable to fetch employees");
        }

        if (employees.length === 0) {
            employeeList.innerHTML = "<p>No employees found.</p>";
            return;
        }

        employeeList.innerHTML = `
            <table>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Salary</th>
                    <th>Action</th>
                </tr>

                ${employees.map(emp => `
                    <tr>
                        <td>${emp.emp_id}</td>
                        <td>${emp.emp_name}</td>
                        <td>${emp.department}</td>
                        <td>₹${emp.salary}</td>
                        <td>
                            <button onclick="fillUpdateForm(
                                '${emp.emp_id}',
                                '${String(emp.emp_name).replace(/\\/g, "\\\\").replace(/'/g, "\\'")}',
                                '${String(emp.department).replace(/\\/g, "\\\\").replace(/'/g, "\\'")}',
                                '${emp.salary}'
                            )">Edit</button>
                        </td>
                    </tr>
                `).join("")}
            </table>
        `;

    } catch (error) {
        employeeList.innerHTML = `<p>${error.message}</p>`;
    }
}

function fillUpdateForm(id, name, department, salary) {
    document.getElementById("updateEmpId").value = id;
    document.getElementById("updateEmpName").value = name;
    document.getElementById("updateDepartment").value = department;
    document.getElementById("updateSalary").value = salary;

    document.getElementById("updateEmployeeForm")
        .scrollIntoView({ behavior: "smooth" });
}

document.getElementById("updateEmployeeForm")
    .addEventListener("submit", async function(event) {

    event.preventDefault();

    const empId = document.getElementById("updateEmpId").value;

    const employee = {
        emp_name: document.getElementById("updateEmpName").value.trim(),
        department: document.getElementById("updateDepartment").value.trim(),
        salary: document.getElementById("updateSalary").value
    };

    const message = document.getElementById("updateMessage");

    try {
        const response = await fetch(
            `${API_URL}/update-employee/${empId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(employee)
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Update failed");
        }

        message.textContent = result.message;
        message.style.color = "green";

        getEmployees();

    } catch (error) {
        message.textContent = error.message;
        message.style.color = "red";
    }
});

