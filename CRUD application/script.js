let currentRow = null;

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
    designation: document.getElementById("designation").value.trim(),
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
}

function onDelete(td) {
  if (confirm("Are you sure you want to delete this record?")) {
    let row = td.parentElement.parentElement;
    document.getElementById("employeeList").deleteRow(row.rowIndex);
    resetForm();
  }
}

function validate() {
  let fullName = document.getElementById("fullname").value.trim();
  let email = document.getElementById("email").value.trim();
  let designation = document.getElementById("designation").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let gender = document.querySelector('input[name="gender"]:checked');
  let hobbies = document.querySelectorAll('input[name="hobbies"]:checked');
  let address = document.getElementById("address").value.trim();
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let phoneRegex = /^[0-9]{10}$/;

  if (fullName === "") {
    alert("Full Name is required.");
    return false;
  }
  if (!emailRegex.test(email)) {
    alert("Enter a valid email address.");
    return false;
  }
  if (!phoneRegex.test(phone)) {
    alert("Enter a valid 10-digit phone number.");
    return false;
  }
  if (designation === "") {
    alert("Designation is required.");
    return false;
  }
  if (!gender) {
    alert("Please select your gender.");
    return false;
  }
  if (hobbies.length === 0) {
    alert("Please select at least one hobby.");
    return false;
  }
  if (address === "") {
    alert("Address is required.");
    return false;
  }

  return true;
}
