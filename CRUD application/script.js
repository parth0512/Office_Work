let currentRow = null;

document.addEventListener("DOMContentLoaded", function () {
  Dropdown();
  loadDataFromLocalStorage();
  attachValidationListeners();

  document.getElementById("userForm").addEventListener("submit", function (e) {
    e.preventDefault();

    if (validateForm(true)) {
      let employeeData = getFormData();
      if (currentRow) {
        updateRecord(employeeData);
      } else {
        addTableRow(employeeData);
        saveToLocalStorage(employeeData);
      }
      this.reset();
      resetForm();
      currentRow = null;
    }
  });

  document
    .querySelectorAll("input, select, textarea")
    .forEach((input, index, fields) => {
      input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          let nextField = fields[index + 1];
          if (nextField) {
            nextField.focus();
          }
        }
      });
    });
});

function Dropdown() {
  const designations = [
    "Software Engineer",
    "QA Engineer",
    "Project Manager",
    "Business Analyst",
    "UI/UX Designer",
  ];
  const dropdown = document.getElementById("designation");
  dropdown.innerHTML = `<option value="">Select here</option>`;
  designations.forEach((designation) => {
    let option = document.createElement("option");
    option.value = designation;
    option.textContent = designation;
    dropdown.appendChild(option);
  });
}

function getFormData() {
  return {
    fullname: document.getElementById("fullname").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    designation: document.getElementById("designation").value,
    gender: document.querySelector('input[name="gender"]:checked')?.value || "",
    hobbies: Array.from(
      document.querySelectorAll('input[name="hobbies"]:checked')
    )
      .map((hobby) => hobby.value)
      .join(", "),
    address: document.getElementById("address").value.trim(),
  };
}

function addTableRow(employee) {
  let tableBody = document.querySelector("#employeeList tbody");
  let row = document.createElement("tr");
  row.innerHTML = `
    <td>${employee.fullname}</td>
    <td>${employee.email}</td>
    <td>${employee.designation}</td>
    <td>${employee.phone}</td>
    <td>${employee.gender}</td>
    <td>${employee.hobbies}</td>
    <td>${employee.address}</td>
    <td>
      <button onclick="deleteRow(this)" class="deleteBtn">Delete</button>
      <hr/>
      <button onclick="editRow(this)" class="editBtn">Edit</button>
    </td>`;
  tableBody.appendChild(row);
}

function saveToLocalStorage(employee) {
  let employees = JSON.parse(localStorage.getItem("employees")) || [];
  employees.push(employee);
  localStorage.setItem("employees", JSON.stringify(employees));
}

function loadDataFromLocalStorage() {
  let employees = JSON.parse(localStorage.getItem("employees")) || [];
  employees.forEach(addTableRow);
}

function deleteRow(button) {
  if (confirm("Are you sure you want to delete this record?")) {
    let row = button.parentElement.parentElement;
    let index = row.rowIndex - 1;
    row.remove();
    let employees = JSON.parse(localStorage.getItem("employees")) || [];
    employees.splice(index, 1);
    localStorage.setItem("employees", JSON.stringify(employees));
  }
}

function editRow(button) {
  currentRow = button.parentElement.parentElement;

  document.getElementById("fullname").value = currentRow.cells[0].innerHTML;
  document.getElementById("email").value = currentRow.cells[1].innerHTML;
  document.getElementById("designation").value = currentRow.cells[2].innerHTML;
  document.getElementById("phone").value = currentRow.cells[3].innerHTML;
  document.getElementById("address").value = currentRow.cells[6].innerHTML;

  let genderValue = currentRow.cells[4].innerHTML.trim();
  let genderRadio = document.querySelector(
    `input[name="gender"][value="${genderValue}"]`
  );
  if (genderRadio) genderRadio.checked = true;

  const hobbiesCellContent = currentRow.cells[5].innerHTML.trim();
  console.log("Raw hobbies cell content:", hobbiesCellContent);
  const hobbies = hobbiesCellContent ? hobbiesCellContent.split(/\s*,\s*/) : [];
  console.log("Split hobbies array:", hobbies);

  const checkboxes = document.querySelectorAll('input[name="hobbies"]');
  console.log(
    "Checkbox values:",
    Array.from(checkboxes).map((cb) => cb.value)
  );
  checkboxes.forEach((checkbox) => (checkbox.checked = false));

  checkboxes.forEach((checkbox) => {
    const checkboxValue = checkbox.value.trim().toLowerCase();
    const isChecked = hobbies.some(
      (hobby) => hobby.trim().toLowerCase() === checkboxValue
    );

    console.log(`Checking ${checkbox.value}:`, isChecked);
    checkbox.checked = isChecked;
  });
}

function updateRecord(data) {
  currentRow.cells[0].innerHTML = data.fullname;
  currentRow.cells[1].innerHTML = data.email;
  currentRow.cells[2].innerHTML = data.designation;
  currentRow.cells[3].innerHTML = data.phone;
  currentRow.cells[4].innerHTML = data.gender;
  currentRow.cells[5].innerHTML = data.hobbies;
  currentRow.cells[6].innerHTML = data.address;
  updateLocalStorage();
  currentRow = null;
}

function updateLocalStorage() {
  let employees = [];
  document.querySelectorAll("#employeeList tbody tr").forEach((row) => {
    let employee = {
      fullname: row.cells[0].innerHTML,
      email: row.cells[1].innerHTML,
      designation: row.cells[2].innerHTML,
      phone: row.cells[3].innerHTML,
      gender: row.cells[4].innerHTML,
      hobbies: row.cells[5].innerHTML,
      address: row.cells[6].innerHTML,
    };
    employees.push(employee);
  });
  localStorage.setItem("employees", JSON.stringify(employees));
}

function resetForm() {
  document.getElementById("userForm").reset();
  document
    .querySelectorAll('input[name="gender"]')
    .forEach((radio) => (radio.checked = false));
  document
    .querySelectorAll('input[name="hobbies"]')
    .forEach((checkbox) => (checkbox.checked = false));
}

function validateForm(onSubmit = false, field = null) {
  let isValid = true;
  let fields = {
    fullname: document.getElementById("fullname"),
    phone: document.getElementById("phone"),
    email: document.getElementById("email"),
    designation: document.getElementById("designation"),
    address: document.getElementById("address"),
    gender: document.querySelector('input[name="gender"]:checked'),
    hobbies: document.querySelectorAll('input[name="hobbies"]:checked'),
  };

  let errors = {
    fullname: "Full name is required and should not contain numbers.",
    email: "Email is required and should be valid.",
    designation: "Designation is required.",
    gender: "Select one gender.",
    hobbies: "Select at least one hobby.",
    address: "Address is required.",
    phone: "Phone number is required and should contain only numbers.",
  };

  if (onSubmit) {
    document.querySelectorAll(".error").forEach((el) => (el.innerHTML = ""));
  }

  for (let key in fields) {
    let element = fields[key];
    let errorElement = document.getElementById(`${key}Error`);

    if (!onSubmit && field !== key) continue;
    if (key === "fullname") {
      if (!element.value.trim()) {
        errorElement.innerHTML = errors[key];
        isValid = false;
      } else if (/\d/.test(element.value)) {
        errorElement.innerHTML = "Full name should not contain numbers.";
        isValid = false;
      } else {
        errorElement.innerHTML = "";
      }
    } else if (key === "email") {
      if (!element.value.trim()) {
        errorElement.innerHTML = errors[key];
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(element.value)) {
        errorElement.innerHTML = "Email should be valid.";
        isValid = false;
      } else {
        errorElement.innerHTML = "";
      }
    } else if (key === "phone") {
      if (!element.value.trim()) {
        errorElement.innerHTML = errors[key];
        isValid = false;
      } else if (!/^\d+$/.test(element.value)) {
        errorElement.innerHTML = "Phone number should contain only numbers.";
        isValid = false;
      } else {
        errorElement.innerHTML = "";
      }
    } else if (key === "gender") {
      if (!fields.gender) {
        errorElement.innerHTML = errors[key];
        isValid = false;
      } else {
        errorElement.innerHTML = "";
      }
    } else if (key === "hobbies") {
      if (fields.hobbies.length === 0) {
        errorElement.innerHTML = errors[key];
        isValid = false;
      } else {
        errorElement.innerHTML = "";
      }
    } else if (!element.value.trim()) {
      errorElement.innerHTML = errors[key];
      isValid = false;
    } else {
      errorElement.innerHTML = "";
    }
  }

  return isValid;
}

function attachValidationListeners() {
  document.querySelectorAll("input, select, textarea").forEach((input) => {
    input.addEventListener("input", function () {
      validateForm(false, this.id);
    });
  });
}
