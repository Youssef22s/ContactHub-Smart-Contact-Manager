document.getElementById("btnAddContact").onclick = function () {
  new bootstrap.Modal(document.getElementById("addContactModal")).show();
  document.getElementById("btnEditContact").classList.add("d-none")
  document.getElementById("btnSaveContact").classList.remove("d-none");
};

var contacts = JSON.parse(localStorage.getItem("contacts")) || [];
var favArray = []
var emergencyArray = []

var currentEditingID;

const inputName = document.getElementById("inputName");
const inputPhone = document.getElementById("inputPhone");
const inputEmail = document.getElementById("inputEmail");
const inputAddress = document.getElementById("inputAddress");
const inputGroup = document.getElementById("inputGroup");
const inputNotes = document.getElementById("inputNotes");
const checkFavorite = document.getElementById("checkFavorite");
const checkEmergency = document.getElementById("checkEmergency");

const contactsCount = document.getElementById("totalCount");
const favouriteCount = document.getElementById("favoriteCount");
const emergencyCount = document.getElementById("emergencyCount");

const contactsList = document.getElementById("contactsList");
const favoritesList = document.getElementById("favoritesList");
const emergencyList = document.getElementById("emergencyList")

const emptyState = document.getElementById("emptyState");
const emptyFavoriteList = document.getElementById("emptyFavoriteList");
const emptyEmergencyList = document.getElementById("emptyEmergencyList")

function updateLocalStorage() {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

function saveContact() {
  if (validateForm()) {
    const newContact = {
      name: inputName.value.trim(),
      phone: inputPhone.value.trim(),
      email: inputEmail.value.trim(),
      address: inputAddress.value.trim(),
      group: inputGroup.value,
      notes: inputNotes.value.trim(),
      favorite: checkFavorite.checked,
      emergency: checkEmergency.checked
  };

  contacts.push(newContact);
  updateLocalStorage()

  const modal = bootstrap.Modal.getInstance(document.getElementById("addContactModal"));
  modal.hide();

  clearForm();

  renderContacts();  
  
  Swal.fire({
    title: "Success",
    text: "The contact has been added successfully",
    icon: "success"
  });
  }
}

function clearForm() {
    inputName.value = "";
    inputPhone.value = "";
    inputEmail.value = "";
    inputAddress.value = "";
    inputGroup.value = "Select Group";
    inputNotes.value = "";
    checkFavorite.checked = false;
    checkEmergency.checked = false;
}

function renderContacts() {
  const container = contactsList;
  container.innerHTML = "";

  renderFavorites();
  renderEmergency()

  if (contacts.length != 0) {
    emptyState.classList.add("d-none");
  }
  else {
    emptyState.classList.remove("d-none");
  }

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const firstLetter = contact.name.charAt(0).toUpperCase();

    container.innerHTML += `
        <div class="col-12 col-md-6">
          <div class="card shadow-sm border-0 rounded-4 contact-card">
            <!-- HEADER -->
            <div class="d-flex flex-column gap-3 p-4 py-3 border-bottom">
  
              <div class="d-flex gap-3">
                <div
                  class="rounded-4 d-flex justify-content-center align-items-center fs-5 text-white"
                  style="width:60px;height:60px;background:linear-gradient(135deg,#d926ff,#ff3d6f);">
                  ${firstLetter}
                </div>
  
                <div class="d-flex flex-column justify-content-center gap-1">
                  <h6 class="mb-1 fw-bold">${contact.name}</h6>
  
                  <div class="d-flex align-items-center text-secondary gap-2">
                    <div class="p-1 rounded-3 d-flex justify-content-center align-items-center"
                      style="background-color:RGB(219,234,255);height:25px;width:25px;">
                      <i class="fa-solid fa-phone text-primary" style="font-size:10px;"></i>
                    </div>
                    <h6 class="mb-0" style="font-size:14px;">${contact.phone}</h6>
                  </div>
  
                </div>
              </div>
  
              <div class="d-flex flex-column align-items-start">
  
                <div class="d-flex align-items-center text-secondary gap-2 mt-2">
                  <div class="p-1 rounded-3 d-flex justify-content-center align-items-center"
                    style="background-color:RGB(236,233,255);color:RGB(128,35,255);height:25px;width:25px;">
                    <i class="fa-solid fa-envelope" style="font-size:10px;"></i>
                  </div>
                  <span style="font-size:14px;">${contact.email}</span>
                </div>
  
                <div class="d-flex align-items-center text-secondary gap-2 mt-2">
                  <div class="p-1 rounded-3 d-flex justify-content-center align-items-center"
                    style="background-color:RGB(209,250,228);height:25px;width:25px;">
                    <i class="fa-solid fa-location-dot text-success" style="font-size:10px;"></i>
                  </div>
                  <span style="font-size:14px;">${contact.address}</span>
                </div>
  
                <div class="badge bg-success-subtle text-success mt-2 px-2 py-2" style="font-size:10px;">
                  ${contact.group}
                </div>
              </div>
  
            </div>
  
            <!-- FOOTER ICONS -->
            <div class="d-flex flex-wrap rounded-4 justify-content-between align-items-center bg-light px-4 py-3 gap-3">
              <div class="d-flex gap-3">
                <button class="btn btn-light callBtn rounded-3 p-2" style="height:40px;width:40px">
                  <i class="fa-solid fa-phone"></i>
                </button>
                <button class="btn btn-light emailBtn rounded-3 p-2" style="height:40px;width:40px">
                  <i class="fa-solid fa-envelope"></i>
                </button>
              </div>
  
              <div class="d-flex gap-3">
                <button onclick="setFavorite(${contacts.indexOf(contact)})" class="btn btn-light starBtn rounded-3 p-2 ${contact.favorite ? 'starBtnActive' : ''}" style="height:40px;width:40px">
                  <i class="${contact.favorite ? 'fa-solid fa-star' : 'fa-regular fa-star'} fs-6"></i>
                </button>
                <button onclick="setEmergency(${contacts.indexOf(contact)})" class="btn btn-light heartBtn rounded-3 p-2 ${contact.emergency ? 'heartBtnActive' : ''}" style="height:40px;width:40px">
                  <i class="${contact.emergency ? 'fa-solid fa-heart-pulse' : 'fa-regular fa-heart'} fs-6"></i>
                </button>
                <button onclick="editBtn(${contacts.indexOf(contact)})" class="btn btn-light editBtn rounded-3 p-2" style="height:40px;width:40px">
                  <i class="fa-solid fa-pen fs-6"></i>
                </button>
                <button onclick="deleteContact(${contacts.indexOf(contact)})" class="btn btn-light trashBtn rounded-3 p-2" style="height:40px;width:40px">
                  <i class="fa-solid fa-trash fs-6"></i>
                </button>
              </div>
            </div>

          </div>
        </div>
      `;
  }
  contactsCount.textContent = contacts.length
}

function renderFavorites() {

  favArray = []

  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].favorite) {
      favArray.push(contacts[i]);
    }
  }

  favoritesList.innerHTML = "";

  favouriteCount.textContent = favArray.length;

  if (favArray.length === 0) {
    emptyFavoriteList.classList.remove("d-none");
    favoritesList.classList.add("d-none");
    return;
  } else {
    favoritesList.classList.remove("d-none");
    emptyFavoriteList.classList.add("d-none");
  }

  for (let i = 0; i < favArray.length; i++) {
    const firstLetter = favArray[i].name.charAt(0).toUpperCase();

    favoritesList.innerHTML += `
      <div class="favorite-card p-2 rounded-3 bg-light shadow-sm d-flex gap-3 justify-content-between mt-3">
        <div class="d-flex align-items-center">
          <div class="rounded-3 d-flex justify-content-center align-items-center text-white"
               style="width: 40px; height: 40px; background: #f59e0b;">
            ${firstLetter}
          </div>
          <div class="lh-1 ms-2">
            <h6 class="m-0">${favArray[i].name}</h6>
            <small class="text-secondary" style="font-size: 11px;">${favArray[i].phone}</small>
          </div>
        </div>

        <div class = "d-flex align-items-center">
          <button class="btn btn-light callBtn rounded-3 p-2 d-flex align-items-center"
          style="height:35px;width:35px">
            <i class="fa-solid fa-phone"></i>
          </button>
        </div>
      </div>
    `;
  } 
}

function renderEmergency() {
  
  emergencyArray = []

  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].emergency) {
      emergencyArray.push(contacts[i])
    }
  }

  emergencyCount.textContent = emergencyArray.length

  emergencyList.innerHTML = '';

  if (emergencyArray.length == 0) {
    emptyEmergencyList.classList.remove("d-none");
    emergencyList.classList.add("d-none");
  } else {
    emptyEmergencyList.classList.add("d-none");
    emergencyList.classList.remove("d-none");
  }

  for (let i = 0; i < emergencyArray.length; i++) {
    const firstLetter = emergencyArray[i].name.charAt(0).toUpperCase();

    emergencyList.innerHTML += `
    <div
    class="emergency-card p-2 rounded-3 bg-light shadow-sm d-flex gap-3 justify-content-between mt-2"
  >
    <div class="d-flex align-items-center">
      <div
        class="rounded-3 d-flex justify-content-center align-items-center text-white"
        style="
          width: 40px;
          height: 40px;
          background: RGB(239, 68, 68);
        "
      >
        ${firstLetter}
      </div>
      <div class="lh-1 ms-2">
        <h6 class="m-0">${emergencyArray[i].name}</h6>
        <small class="text-secondary" style="font-size: 11px"
          >${emergencyArray[i].number}</small
        >
      </div>
    </div>

    <div class="d-flex align-items-center">
      <button
        class="btn btn-light emergencyCallBtn rounded-3 p-2 d-flex align-items-center"
        style="height: 35px; width: 35px"
      >
        <i class="fa-solid fa-phone"></i>
      </button>
    </div>
  </div>
    `
  }
}

renderContacts();

function deleteContact(ID) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      contacts.splice(ID, 1)
      updateLocalStorage()
      renderContacts()
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success"
      });
    }
  });
}

function setFavorite(ID) {
  contacts[ID].favorite = !contacts[ID].favorite;
  updateLocalStorage()
  renderContacts()
}

function setEmergency(ID) {
  contacts[ID].emergency = !contacts[ID].emergency;
  updateLocalStorage()
  renderContacts()
}

function editBtn(ID) {
  document.getElementById("btnEditContact").classList.remove("d-none")
  document.getElementById("btnSaveContact").classList.add("d-none");

  const c = contacts[ID];

  inputName.value      = c.name;
  inputPhone.value     = c.phone;
  inputEmail.value     = c.email;
  inputAddress.value   = c.address;
  inputGroup.value     = c.group;
  inputNotes.value     = c.notes || ""; 
  checkFavorite.checked  = c.favorite;
  checkEmergency.checked = c.emergency;

  new bootstrap.Modal(document.getElementById("addContactModal")).show();

  currentEditingID = ID;
}

function updateContact() {
  if (validateForm()) {
    const c = contacts[currentEditingID];

    c.name = inputName.value.trim();
    c.phone = inputPhone.value.trim();
    c.email = inputEmail.value.trim();
    c.address = inputAddress.value.trim();
    c.group = inputGroup.value;
    c.notes = inputNotes.value;
    c.favorite = checkFavorite.checked;
    c.emergency = checkEmergency.checked;
  
    updateLocalStorage()
    renderContacts();
    clearForm()

    const modal = bootstrap.Modal.getInstance(document.getElementById("addContactModal"));
    modal.hide();

    Swal.fire({
      title: "Success",
      text: "The contact has been updated successfully",
      icon: "success"
    });
  }
}

function searchContacts() {
  const text = document.getElementById("searchBox").value.toLowerCase();

  let results = [];

  for (let i = 0; i < contacts.length; i++) {
    const c = contacts[i];

    const name = c.name.toLowerCase();
    const phone = c.phone.toLowerCase();
    const email = c.email.toLowerCase();

    if (
      name.includes(text) ||
      phone.includes(text) ||
      email.includes(text)
    ) {
      results.push(c);
    }
  }

  renderFilteredContacts(results);
}

function renderFilteredContacts(list) {
  const container = contactsList;
  container.innerHTML = "";

  if (list.length === 0) {
    emptyState.classList.remove("d-none");
    return;
  } else {
    emptyState.classList.add("d-none");
  }

  for (let i = 0; i < list.length; i++) {
    const originalIndex = contacts.indexOf(list[i]); 
    const contact = list[i];
    const firstLetter = contact.name.charAt(0).toUpperCase();

    container.innerHTML += `
        <div class="col-12 col-md-6">
          <div class="card shadow-sm border-0 rounded-4 contact-card">
            <!-- HEADER -->
            <div class="d-flex flex-column gap-3 p-4 py-3 border-bottom">
  
              <div class="d-flex gap-3">
                <div
                  class="rounded-4 d-flex justify-content-center align-items-center fs-5 text-white"
                  style="width:60px;height:60px;background:linear-gradient(135deg,#d926ff,#ff3d6f);">
                  ${firstLetter}
                </div>
  
                <div class="d-flex flex-column justify-content-center gap-1">
                  <h6 class="mb-1 fw-bold">${contact.name}</h6>
  
                  <div class="d-flex align-items-center text-secondary gap-2">
                    <div class="p-1 rounded-3 d-flex justify-content-center align-items-center"
                      style="background-color:RGB(219,234,255);height:25px;width:25px;">
                      <i class="fa-solid fa-phone text-primary" style="font-size:10px;"></i>
                    </div>
                    <h6 class="mb-0" style="font-size:14px;">${contact.phone}</h6>
                  </div>
  
                </div>
              </div>
  
              <div class="d-flex flex-column align-items-start">
  
                <div class="d-flex align-items-center text-secondary gap-2 mt-2">
                  <div class="p-1 rounded-3 d-flex justify-content-center align-items-center"
                    style="background-color:RGB(236,233,255);color:RGB(128,35,255);height:25px;width:25px;">
                    <i class="fa-solid fa-envelope" style="font-size:10px;"></i>
                  </div>
                  <span style="font-size:14px;">${contact.email}</span>
                </div>
  
                <div class="d-flex align-items-center text-secondary gap-2 mt-2">
                  <div class="p-1 rounded-3 d-flex justify-content-center align-items-center"
                    style="background-color:RGB(209,250,228);height:25px;width:25px;">
                    <i class="fa-solid fa-location-dot text-success" style="font-size:10px;"></i>
                  </div>
                  <span style="font-size:14px;">${contact.address}</span>
                </div>
  
                <div class="badge bg-success-subtle text-success mt-2 px-2 py-2" style="font-size:10px;">
                  ${contact.group}
                </div>
              </div>
  
            </div>
  
            <!-- FOOTER ICONS -->
            <div class="d-flex flex-wrap rounded-4 justify-content-between align-items-center bg-light px-4 py-3 gap-3">
              <div class="d-flex gap-3">
                <button class="btn btn-light callBtn rounded-3 p-2" style="height:40px;width:40px">
                  <i class="fa-solid fa-phone"></i>
                </button>
                <button class="btn btn-light emailBtn rounded-3 p-2" style="height:40px;width:40px">
                  <i class="fa-solid fa-envelope"></i>
                </button>
              </div>
  
              <div class="d-flex gap-3">
                <button onclick="setFavorite(${originalIndex})" class="btn btn-light starBtn rounded-3 p-2 ${contact.favorite ? 'starBtnActive' : ''}" style="height:40px;width:40px">
                  <i class="${contact.favorite ? 'fa-solid fa-star' : 'fa-regular fa-star'} fs-6"></i>
                </button>
                <button onclick="setEmergency(${originalIndex})" class="btn btn-light heartBtn rounded-3 p-2 ${contact.emergency ? 'heartBtnActive' : ''}" style="height:40px;width:40px">
                  <i class="${contact.emergency ? 'fa-solid fa-heart-pulse' : 'fa-regular fa-heart'} fs-6"></i>
                </button>
                <button onclick="editBtn(${originalIndex})" class="btn btn-light editBtn rounded-3 p-2" style="height:40px;width:40px">
                  <i class="fa-solid fa-pen fs-6"></i>
                </button>
                <button onclick="deleteContact(${originalIndex})" class="btn btn-light trashBtn rounded-3 p-2" style="height:40px;width:40px">
                  <i class="fa-solid fa-trash fs-6"></i>
                </button>
              </div>
            </div>

          </div>
        </div>
      `;
  }
}

function validateForm() {
  const name = inputName.value.trim();
  const phone = inputPhone.value.trim();
  const email = inputEmail.value.trim();
  const address = inputAddress.value.trim();
  const group = inputGroup.value;

  if (name === "") {
    Swal.fire("Please enter the full name.");
    return false;
  }

  const phoneRegex = /^(010|011|012|015)[0-9]{8}$/;
  if (phone === "") {
    Swal.fire("Phone number is required.");
    return false;
  }
  if (!phoneRegex.test(phone)) {
    Swal.fire("Please enter a valid Egyptian phone number.");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email !== "" && !emailRegex.test(email)) {
    Swal.fire("Invalid email format.");
    return false;
  }

  if (address === "") {
    Swal.fire("Address is required.");
    return false;
  }

  if (group === "Select Group") {
    Swal.fire("Please select a group.");
    return false;
  }

  return true; 
}








