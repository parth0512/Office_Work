let currentRow = null;

document.addEventListener("DOMContentLoaded", function () {
  Dropdown();
  loadDataFromLocalStorage();
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

function onSubmit(event) {
  event.preventDefault();
  if (validate()) {
    let formData = readData();
    if (currentRow == null) {
      insertNewRecord(formData);
    } else {
      updateRecord(formData);
    }
    resetForm();
  }
}

function readData() {
  return {
    fullname: document.getElementById("fullname").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    designation: document.getElementById("designation").value,
    gender: document.querySelector('input[name="gender"]:checked')?.value || "",
    hobbies: Array.from(
      document.querySelectorAll('input[name="hobbies"]:checked')
    )
      .map((checkbox) => checkbox.value)
      .join(", "),
    address: document.getElementById("address").value.trim(),
  };
}

function insertNewRecord(data) {
  let table = document
    .getElementById("employeeList")
    .getElementsByTagName("tbody")[0];
  let newRow = table.insertRow();

  newRow.insertCell(0).innerHTML = data.fullname;
  newRow.insertCell(1).innerHTML = data.email;
  newRow.insertCell(2).innerHTML = data.designation;
  newRow.insertCell(3).innerHTML = data.phone;
  newRow.insertCell(4).innerHTML = data.gender;
  newRow.insertCell(5).innerHTML = data.hobbies;
  newRow.insertCell(6).innerHTML = data.address;
  newRow.insertCell(7).innerHTML = `
      <a href="#" onclick="onEdit(this)" style="color:blue; text-decoration:none">Edit</a> | 
      <a href="#" onclick="onDelete(this)" style="color:red; text-decoration:none">Delete</a>
  `;

  saveDataToLocalStorage();
}

function resetForm() {
  document.getElementById("fullname").value = "";
  document.getElementById("email").value = "";
  document.getElementById("designation").value = "";
  document.getElementById("phone").value = "";
  document
    .querySelectorAll('input[name="gender"]')
    .forEach((radio) => (radio.checked = false));
  document
    .querySelectorAll('input[name="hobbies"]')
    .forEach((checkbox) => (checkbox.checked = false));
  document.getElementById("address").value = "";
  currentRow = null;
}

function onEdit(td) {
  currentRow = td.parentElement.parentElement;

  document.getElementById("fullname").value = currentRow.cells[0].innerHTML;
  document.getElementById("email").value = currentRow.cells[1].innerHTML;
  document.getElementById("designation").value = currentRow.cells[2].innerHTML;
  document.getElementById("phone").value = currentRow.cells[3].innerHTML;

  let genderValue = currentRow.cells[4].innerHTML.trim();
  if (genderValue) {
    document.querySelector(
      `input[name="gender"][value="${genderValue}"]`
    ).checked = true;
  }

  let hobbiesArray = currentRow.cells[5].innerHTML.split(", ");
  document.querySelectorAll('input[name="hobbies"]').forEach((checkbox) => {
    checkbox.checked = hobbiesArray.includes(checkbox.value);
  });

  document.getElementById("address").value = currentRow.cells[6].innerHTML;
}

function updateRecord(formData) {
  currentRow.cells[0].innerHTML = formData.fullname;
  currentRow.cells[1].innerHTML = formData.email;
  currentRow.cells[2].innerHTML = formData.designation;
  currentRow.cells[3].innerHTML = formData.phone;
  currentRow.cells[4].innerHTML = formData.gender;
  currentRow.cells[5].innerHTML = formData.hobbies;
  currentRow.cells[6].innerHTML = formData.address;

  saveDataToLocalStorage();
}

function onDelete(td) {
  if (confirm("Are you sure you want to delete this record?")) {
    let row = td.parentElement.parentElement;
    document.getElementById("employeeList").deleteRow(row.rowIndex);
    saveDataToLocalStorage();
    resetForm();
  }
}

function saveDataToLocalStorage() {
  let table = document
    .getElementById("employeeList")
    .getElementsByTagName("tbody")[0];
  let rows = table.getElementsByTagName("tr");
  let employees = [];

  for (let row of rows) {
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
  }

  localStorage.setItem("employees", JSON.stringify(employees));
}

function loadDataFromLocalStorage() {
  let employees = JSON.parse(localStorage.getItem("employees")) || [];
  let table = document
    .getElementById("employeeList")
    .getElementsByTagName("tbody")[0];

  employees.forEach((data) => {
    let newRow = table.insertRow();
    newRow.insertCell(0).innerHTML = data.fullname;
    newRow.insertCell(1).innerHTML = data.email;
    newRow.insertCell(2).innerHTML = data.designation;
    newRow.insertCell(3).innerHTML = data.phone;
    newRow.insertCell(4).innerHTML = data.gender;
    newRow.insertCell(5).innerHTML = data.hobbies;
    newRow.insertCell(6).innerHTML = data.address;
    newRow.insertCell(7).innerHTML = `
        <a href="#" onclick="onEdit(this)" style="color:blue; text-decoration:none">Edit</a> | 
        <a href="#" onclick="onDelete(this)" style="color:red; text-decoration:none">Delete</a>
    `;
  });
}

function validate() {
  setError("fullNameError", "");
  setError("emailError", "");
  setError("designationError", "");
  setError("phoneError", "");
  setError("genderError", "");
  setError("hobbiesError", "");
  setError("addressError", "");

  let fullName = document.getElementById("fullname").value.trim();
  let email = document.getElementById("email").value.trim();
  let designation = document.getElementById("designation").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let gender = document.querySelector('input[name="gender"]:checked');
  let hobbies = document.querySelectorAll('input[name="hobbies"]:checked');
  let address = document.getElementById("address").value.trim();
  let fullNameReq = /^[a-zA-Z ]+$/;
  let emailReq = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let phoneReq = /^[0-9]{10}$/;

  let isValid = true;

  if (fullName === "") {
    setError("fullNameError", "Full Name is required.");
    isValid = false;
  }
  if (!fullNameReq.test(fullName)) {
    setError("fullNameError", "Enter a valid name.");
    isValid = false;
  }
  if (!emailReq.test(email)) {
    setError("emailError", "Enter a valid email address.");
    isValid = false;
  }
  if (designation === "") {
    setError("designationError", "Designation is required.");
    isValid = false;
  }
  if (!phoneReq.test(phone)) {
    setError("phoneError", "Enter a valid 10-digit phone number.");
    isValid = false;
  }
  if (!gender) {
    setError("genderError", "Please select your gender.");
    isValid = false;
  }
  if (hobbies.length === 0) {
    setError("hobbiesError", "Please select at least one hobby.");
    isValid = false;
  }
  if (address === "") {
    setError("addressError", "Address is required.");
    isValid = false;
  }

  return isValid;
}

function setError(elementId, message) {
  document.getElementById(elementId).innerText = message;
}
