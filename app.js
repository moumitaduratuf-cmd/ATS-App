const employees = [
  { name: "Ava Patel", role: "Managing Director", department: "Operations", status: "Active", joined: "2020-01-13", salary: 9200 },
  { name: "Noah Smith", role: "Operations Lead", department: "Operations", status: "Active", joined: "2021-03-05", salary: 6200 },
  { name: "Mia Johnson", role: "HR Manager", department: "HR", status: "Active", joined: "2021-07-19", salary: 5600 },
  { name: "Ethan Brown", role: "Accountant", department: "Finance", status: "Active", joined: "2022-02-11", salary: 5100 },
  { name: "Sophia Lee", role: "Sales Manager", department: "Sales", status: "Active", joined: "2020-09-28", salary: 6800 },
  { name: "Lucas Wilson", role: "Sales Executive", department: "Sales", status: "Active", joined: "2022-05-16", salary: 3900 },
  { name: "Isabella Garcia", role: "Customer Success", department: "Sales", status: "Active", joined: "2023-01-09", salary: 4200 },
  { name: "James Miller", role: "Backend Developer", department: "Technology", status: "Active", joined: "2021-11-22", salary: 7400 },
  { name: "Amelia Davis", role: "Frontend Developer", department: "Technology", status: "Remote", joined: "2022-08-01", salary: 7100 },
  { name: "Benjamin Taylor", role: "QA Analyst", department: "Technology", status: "Active", joined: "2023-04-17", salary: 4800 },
  { name: "Charlotte Moore", role: "Office Admin", department: "Operations", status: "Active", joined: "2022-12-05", salary: 3600 },
  { name: "Henry Martin", role: "Procurement", department: "Operations", status: "Active", joined: "2023-06-26", salary: 4100 },
  { name: "Harper Clark", role: "Recruiter", department: "HR", status: "Active", joined: "2024-02-12", salary: 4300 },
  { name: "Daniel Lewis", role: "Finance Analyst", department: "Finance", status: "Active", joined: "2023-09-18", salary: 4700 },
  { name: "Evelyn Walker", role: "Marketing Specialist", department: "Sales", status: "Active", joined: "2024-04-08", salary: 4500 },
  { name: "Logan Hall", role: "Support Executive", department: "Operations", status: "Active", joined: "2024-06-03", salary: 3500 },
  { name: "Abigail Allen", role: "UI Designer", department: "Technology", status: "Remote", joined: "2024-08-19", salary: 5200 },
  { name: "Matthew Young", role: "Bookkeeper", department: "Finance", status: "Active", joined: "2025-01-06", salary: 3900 },
  { name: "Ella Hernandez", role: "Sales Coordinator", department: "Sales", status: "Active", joined: "2025-03-24", salary: 3400 },
  { name: "Jack King", role: "IT Support", department: "Technology", status: "Active", joined: "2025-10-13", salary: 4400 }
];

const attendance = new Map(employees.map((employee, index) => [employee.name, index % 9 === 0 ? "Leave" : index % 5 === 0 ? "Remote" : "Present"]));
const leaves = [
  { employee: "Ava Patel", type: "Annual Leave", from: "2026-05-18", to: "2026-05-20", status: "Approved" },
  { employee: "Lucas Wilson", type: "Sick Leave", from: "2026-05-14", to: "2026-05-14", status: "Pending" },
  { employee: "Harper Clark", type: "Personal Leave", from: "2026-05-22", to: "2026-05-23", status: "Pending" }
];

const currencyFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

const sectionTitles = {
  dashboard: "Homepage Dashboard",
  employees: "Employee Details",
  leaves: "Leaves",
  attendance: "Attendance",
  payroll: "Payroll System"
};

const pageTitle = document.querySelector("#page-title");
const searchInput = document.querySelector("#employee-search");

function renderDashboard() {
  const headcount = employees.length;
  const present = [...attendance.values()].filter((status) => status === "Present" || status === "Remote").length;
  const pendingLeaves = leaves.filter((leave) => leave.status === "Pending").length;
  const grossPayroll = employees.reduce((sum, employee) => sum + employee.salary, 0);
  const readiness = Math.round(((headcount - pendingLeaves) / 20) * 100);

  document.querySelector("#total-headcount").textContent = headcount;
  document.querySelector("#present-count").textContent = present;
  document.querySelector("#present-rate").textContent = `${Math.round((present / headcount) * 100)}% attendance rate`;
  document.querySelector("#pending-leaves").textContent = pendingLeaves;
  document.querySelector("#payroll-cost").textContent = currencyFormatter.format(grossPayroll);
  document.querySelector("#payroll-readiness").textContent = `${readiness}%`;
  document.querySelector("#readiness-bar").style.width = `${readiness}%`;

  renderDepartmentBars();
  renderTasks(pendingLeaves);
}

function renderDepartmentBars() {
  const departmentCounts = employees.reduce((counts, employee) => {
    counts[employee.department] = (counts[employee.department] || 0) + 1;
    return counts;
  }, {});

  document.querySelector("#department-bars").innerHTML = Object.entries(departmentCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([department, count]) => {
      const width = Math.round((count / employees.length) * 100);
      return `
        <div class="department-row">
          <div><span>${department}</span><span>${count} people</span></div>
          <div class="bar-track"><span class="bar-fill" style="width: ${width}%"></span></div>
        </div>
      `;
    })
    .join("");
}

function renderTasks(pendingLeaves) {
  const absentCount = [...attendance.values()].filter((status) => status === "Leave").length;
  const tasks = [
    { title: `${pendingLeaves} leave approvals`, detail: "Review pending requests before payroll lock." },
    { title: `${absentCount} people away today`, detail: "Confirm work coverage for active projects." },
    { title: "Payroll draft ready", detail: "Validate allowances and deductions for May 2026." }
  ];

  document.querySelector("#task-list").innerHTML = tasks
    .map((task) => `<li><strong>${task.title}</strong>${task.detail}</li>`)
    .join("");
}

function renderEmployees(filter = "") {
  const normalizedFilter = filter.trim().toLowerCase();
  const filteredEmployees = employees.filter((employee) =>
    [employee.name, employee.role, employee.department, employee.status].some((field) => field.toLowerCase().includes(normalizedFilter))
  );

  document.querySelector("#directory-count").textContent = `${filteredEmployees.length} records`;
  document.querySelector("#employee-table").innerHTML = filteredEmployees
    .map((employee) => `
      <tr>
        <td>${employee.name}</td>
        <td>${employee.role}</td>
        <td>${employee.department}</td>
        <td><span class="status ${employee.status.toLowerCase()}">${employee.status}</span></td>
        <td>${formatDate(employee.joined)}</td>
        <td>${currencyFormatter.format(employee.salary)}</td>
      </tr>
    `)
    .join("");
}

function renderLeaveOptions() {
  document.querySelector("#leave-employee").innerHTML = employees
    .map((employee) => `<option value="${employee.name}">${employee.name}</option>`)
    .join("");
}

function renderLeaves() {
  document.querySelector("#leave-list").innerHTML = leaves
    .map((leave, index) => `
      <article class="leave-card">
        <div>
          <h4>${leave.employee}</h4>
          <p>${leave.type} • ${formatDate(leave.from)} to ${formatDate(leave.to)}</p>
        </div>
        <button class="status ${leave.status.toLowerCase()}" data-leave-index="${index}">${leave.status}</button>
      </article>
    `)
    .join("");
}

function renderAttendance() {
  document.querySelector("#attendance-grid").innerHTML = employees
    .map((employee) => {
      const currentStatus = attendance.get(employee.name);
      return `
        <article class="attendance-card">
          <div>
            <h4>${employee.name}</h4>
            <p>${employee.department} • <span class="status ${currentStatus.toLowerCase()}">${currentStatus}</span></p>
          </div>
          <div class="attendance-actions" aria-label="Set attendance for ${employee.name}">
            ${["Present", "Remote", "Leave"].map((status) => `
              <button class="icon-btn ${currentStatus === status ? "active" : ""}" data-employee="${employee.name}" data-status="${status}">${status[0]}</button>
            `).join("")}
          </div>
        </article>
      `;
    })
    .join("");
}

function renderPayroll() {
  const rows = employees.map((employee) => {
    const allowance = Math.round(employee.salary * 0.08);
    const deduction = attendance.get(employee.name) === "Leave" ? Math.round(employee.salary * 0.03) : Math.round(employee.salary * 0.015);
    const net = employee.salary + allowance - deduction;
    return { employee, allowance, deduction, net };
  });

  const gross = rows.reduce((sum, row) => sum + row.employee.salary + row.allowance, 0);
  const deductions = rows.reduce((sum, row) => sum + row.deduction, 0);

  document.querySelector("#gross-pay").textContent = currencyFormatter.format(gross);
  document.querySelector("#deductions").textContent = currencyFormatter.format(deductions);
  document.querySelector("#net-pay").textContent = currencyFormatter.format(gross - deductions);
  document.querySelector("#payroll-table").innerHTML = rows
    .map(({ employee, allowance, deduction, net }) => `
      <tr>
        <td>${employee.name}</td>
        <td>${currencyFormatter.format(employee.salary)}</td>
        <td>${currencyFormatter.format(allowance)}</td>
        <td>${currencyFormatter.format(deduction)}</td>
        <td>${currencyFormatter.format(net)}</td>
      </tr>
    `)
    .join("");
}

function formatDate(dateString) {
  return dateFormatter.format(new Date(`${dateString}T00:00:00`));
}

function refreshAll() {
  renderDashboard();
  renderEmployees(searchInput.value);
  renderLeaveOptions();
  renderLeaves();
  renderAttendance();
  renderPayroll();
}

function setActiveSection(sectionId) {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.section === sectionId);
  });

  document.querySelectorAll(".section-view").forEach((section) => section.classList.remove("active"));
  if (sectionId === "dashboard") {
    document.querySelector("#dashboard").classList.add("active");
    document.querySelectorAll("[data-dashboard-block]").forEach((section) => section.classList.add("active"));
  } else {
    document.querySelector(`#${sectionId}`).classList.add("active");
  }
  pageTitle.textContent = sectionTitles[sectionId];
}

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => setActiveSection(button.dataset.section));
});

searchInput.addEventListener("input", (event) => {
  renderEmployees(event.target.value);
  if (event.target.value && !document.querySelector("#employees").classList.contains("active")) {
    setActiveSection("employees");
  }
});

document.querySelector("#leave-form").addEventListener("submit", (event) => {
  event.preventDefault();
  leaves.unshift({
    employee: document.querySelector("#leave-employee").value,
    type: document.querySelector("#leave-type").value,
    from: document.querySelector("#leave-from").value,
    to: document.querySelector("#leave-to").value,
    status: "Pending"
  });
  event.target.reset();
  refreshAll();
});

document.querySelector("#leave-list").addEventListener("click", (event) => {
  const index = event.target.dataset.leaveIndex;
  if (index !== undefined) {
    leaves[index].status = leaves[index].status === "Pending" ? "Approved" : "Pending";
    refreshAll();
  }
});

document.querySelector("#attendance-grid").addEventListener("click", (event) => {
  const { employee, status } = event.target.dataset;
  if (employee && status) {
    attendance.set(employee, status);
    refreshAll();
  }
});

document.querySelector("#mark-all-present").addEventListener("click", () => {
  employees.forEach((employee) => attendance.set(employee.name, "Present"));
  refreshAll();
});

const modal = document.querySelector("#employee-modal");
document.querySelector("#add-employee-btn").addEventListener("click", () => {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
});
document.querySelector("#close-modal").addEventListener("click", () => {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
});

document.querySelector("#employee-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const newEmployee = {
    name: document.querySelector("#new-name").value,
    role: document.querySelector("#new-role").value,
    department: document.querySelector("#new-department").value,
    status: "Active",
    joined: new Date().toISOString().slice(0, 10),
    salary: Number(document.querySelector("#new-salary").value)
  };
  employees.push(newEmployee);
  attendance.set(newEmployee.name, "Present");
  event.target.reset();
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  refreshAll();
});

refreshAll();
