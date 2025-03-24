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
    role: document.getElementById("role").value.trim(),
    city: document.getElementById("city").value.trim(),
    salary: document.getElementById("salary").value.trim(),
  };
}

function insertNewRecord(data) {
  let table = document
    .getElementById("employeeList")
    .getElementsByTagName("tbody")[0];

  let newRow = table.insertRow();

  newRow.insertCell(0).innerHTML = data.fullname;
  newRow.insertCell(1).innerHTML = data.role;
  newRow.insertCell(2).innerHTML = data.city;
  newRow.insertCell(3).innerHTML = data.salary;
  newRow.insertCell(4).innerHTML = `
      <a href="#" onclick="onEdit(this)" style="color:white; text-decoration:none">Edit</a> | 
      <a href="#" onclick="onDelete(this)" style="color:white; text-decoration:none">Delete</a>
  `;
}

function resetForm() {
  document.getElementById("fullname").value = "";
  document.getElementById("role").value = "";
  document.getElementById("city").value = "";
  document.getElementById("salary").value = "";
  currentRow = null;
}

function onEdit(td) {
  currentRow = td.parentElement.parentElement;
  document.getElementById("fullname").value = currentRow.cells[0].innerHTML;
  document.getElementById("role").value = currentRow.cells[1].innerHTML;
  document.getElementById("city").value = currentRow.cells[2].innerHTML;
  document.getElementById("salary").value = currentRow.cells[3].innerHTML;
}

function updateRecord(formData) {
  currentRow.cells[0].innerHTML = formData.fullname;
  currentRow.cells[1].innerHTML = formData.role;
  currentRow.cells[2].innerHTML = formData.city;
  currentRow.cells[3].innerHTML = formData.salary;
}

function onDelete(td) {
  if (confirm("Are you sure you want to delete this record?")) {
    let row = td.parentElement.parentElement;
    document.getElementById("employeeList").deleteRow(row.rowIndex);
    resetForm();
  }
}

function validate() {
  let fullNameField = document.getElementById("fullname");
  return fullNameField.value.trim() !== "";
}
