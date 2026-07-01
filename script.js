const passwordForm = document.getElementById("passwordForm");
const websiteInput = document.getElementById("website");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const searchInput = document.getElementById("searchInput");
const passwordTable = document.getElementById("passwordTable");
const togglePasswordBtn = document.getElementById("togglePassword");
const toast = document.getElementById("toast");
let passwords = [];
const savedPasswords = localStorage.getItem("passwords");
if (savedPasswords) {
    passwords = JSON.parse(savedPasswords);
    displayPasswords();
}
// Event Listeners

passwordForm.addEventListener("submit", addPassword);
searchInput.addEventListener("input", searchPasswords);
togglePasswordBtn.addEventListener("click", () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePasswordBtn.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
    } else {
        passwordInput.type = "password";
        togglePasswordBtn.innerHTML = '<i class="fa-regular fa-eye"></i>';
    }
});

// Add Password

function addPassword(event) {
    event.preventDefault();
    const website = websiteInput.value;
    const username = usernameInput.value;
    const password = passwordInput.value;
    if (!website || !username || !password) {
        return;
    }
    const newPassword = {
        website: website,
        username: username,
        password: password
    };
    passwords.push(newPassword);
    localStorage.setItem("passwords", JSON.stringify(passwords));
    displayPasswords();
    passwordForm.reset();
    passwordInput.type = "password";
    togglePasswordBtn.innerHTML = '<i class="fa-regular fa-eye"></i>';
}

// Display Passwords

function displayPasswords() {
    passwordTable.innerHTML = "";
    passwords.forEach((password, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${password.website}</td>
      <td>${password.username}</td>
      <td id="password-${index}">******</td>
      <td>
        <button class="action-btn show-btn">
          <i class="fa-regular fa-eye"></i>
        </button>
        <button class="action-btn copy-btn">
          <i class="fa-regular fa-copy"></i>
        </button>

        <button class="action-btn delete-btn">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;
        const showBtn = row.querySelector(".show-btn");
        const copyBtn = row.querySelector(".copy-btn");
        const deleteBtn = row.querySelector(".delete-btn");
        showBtn.addEventListener("click", () => {
            togglePassword(index, showBtn);
        });
        copyBtn.addEventListener("click", () => {
            copyPassword(index);
        });
        deleteBtn.addEventListener("click", () => {
            deletePassword(index);
        });
        passwordTable.appendChild(row);
    });
}

// Delete Password

function deletePassword(index) {
    passwords.splice(index, 1);
    localStorage.setItem("passwords", JSON.stringify(passwords));
    displayPasswords();
}

// Show / Hide Password

function togglePassword(index, button) {
    const cell = document.getElementById(`password-${index}`);
    if (cell.textContent === "******") {
        cell.textContent = passwords[index].password;
        button.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
    } else {
        cell.textContent = "******";
        button.innerHTML = '<i class="fa-regular fa-eye"></i>';
    }
}

// Copy Password

function copyPassword(index) {
    navigator.clipboard.writeText(passwords[index].password);
    showToast();
}

// Toast Message

function showToast() {
    toast.style.display = "block";
    setTimeout(() => {
        toast.style.display = "none";
    }, 2000);
}

// Search Passwords

function searchPasswords() {
    const searchValue = searchInput.value.toLowerCase();
    const rows = passwordTable.querySelectorAll("tr");
    rows.forEach((row) => {
        const website = row.cells[0].textContent.toLowerCase();
        if (website.includes(searchValue)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}