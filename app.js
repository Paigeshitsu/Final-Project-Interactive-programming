document.addEventListener("DOMContentLoaded", function () {
  const userForm = document.getElementById("userForm");
  const usersTable = document.getElementById("usersTable").getElementsByTagName("tbody")[0];
  const searchInput = document.getElementById("search");
  const totalUsersDisplay = document.getElementById("totalUsers");
  const activeUsersDisplay = document.getElementById("activeUsers");
  const inactiveUsersDisplay = document.getElementById("inactiveUsers");

  // Load users from localStorage when the page loads
  function loadUsers() {
    let users = JSON.parse(localStorage.getItem("users"));
    if (!users) {
      users = [];  // If no users are found, initialize it as an empty array.
    }
    displayUsers(users);
    updateMetrics(users); // Update metrics after loading users
  }

  // Display users in the table
  function displayUsers(users) {
    usersTable.innerHTML = "";  // Clear the table before adding new data
    const now = Date.now();  // Get current timestamp for checking recent users

    users.forEach(user => {
      const row = usersTable.insertRow();
      const isRecent = now - user.createdAt < 5 * 60 * 1000;  // 5 minutes in milliseconds
      if (isRecent) {
        row.classList.add('new-user');  // Add class only if the user is recent
      }

      const statusLabel = isRecent ? '<span class="new-label">New</span>' : user.status;

      row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>${statusLabel}</td>
        <td>
          <button onclick="editUser(${user.id})">Edit</button>
          <button onclick="deleteUser(${user.id})">Delete</button>
          <button onclick="toggleStatus(${user.id})">${user.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
        </td>
      `;
    });
  }

  // Update user metrics
  function updateMetrics(users) {
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.status === 'Active').length;
    const inactiveUsers = totalUsers - activeUsers;

    totalUsersDisplay.textContent = totalUsers;
    activeUsersDisplay.textContent = activeUsers;
    inactiveUsersDisplay.textContent = inactiveUsers;
  }

  // Search functionality
  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm)
    );
    displayUsers(filteredUsers);
    updateMetrics(filteredUsers); // Update metrics for filtered user list
  });

  // Add new user
  userForm.addEventListener("submit", function (event) {
    event.preventDefault();  // Prevent form from submitting and refreshing the page

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const role = document.getElementById("role").value;

    // Check if all fields are filled
    if (!name || !email || !phone || !role) {
      alert("Please fill out all fields.");
      return;
    }

    const newUser = {
      id: Date.now(), // Use timestamp as ID to ensure uniqueness
      name,
      email,
      phone,
      role,
      status: "Active",
      createdAt: Date.now()  // Add creation timestamp
    };

    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(newUser);

    // Save updated users back to localStorage
    localStorage.setItem("users", JSON.stringify(users));

    // Clear the form
    userForm.reset();

    // Reload users to display the new user
    loadUsers();
  });

  // Edit user (stub, you can add editing functionality here)
  window.editUser = function (userId) {
    alert("Edit functionality for user " + userId);
  };

  // Delete user
  window.deleteUser = function (userId) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.filter(user => user.id !== userId);

    // Save updated users back to localStorage
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Reload users
    loadUsers();
  };

  // Toggle user status (Activate/Deactivate)
  window.toggleStatus = function (userId) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(user => user.id === userId);

    if (user) {
      user.status = (user.status === 'Active') ? 'Inactive' : 'Active';

      // Save updated users back to localStorage
      localStorage.setItem("users", JSON.stringify(users));

      // Reload users
      loadUsers();
    }
  };

  // Initialize the page by loading the users
  loadUsers();
});
