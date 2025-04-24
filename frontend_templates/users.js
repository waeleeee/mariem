document.addEventListener('DOMContentLoaded', function() {
    // Load theme for consistent UI
    loadTheme();
    
    // Get UI elements
    const usersTableBody = document.getElementById('usersTableBody');
    const addUserBtn = document.getElementById('addUserBtn');
    const addUserModal = document.getElementById('addUserModal');
    const editUserModal = document.getElementById('editUserModal');
    const addUserForm = document.getElementById('addUserForm');
    const editUserForm = document.getElementById('editUserForm');
    const closeButtons = document.querySelectorAll('.close');
    const cancelButtons = document.querySelectorAll('.cancel-btn');
    
    // Load users from Firebase
    loadUsers();
    
    // Event listeners for modal operations
    addUserBtn.addEventListener('click', () => openModal(addUserModal));
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(addUserModal);
            closeModal(editUserModal);
        });
    });
    
    cancelButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(addUserModal);
            closeModal(editUserModal);
        });
    });
    
    // Close modal if user clicks outside of it
    window.addEventListener('click', (e) => {
        if (e.target === addUserModal) closeModal(addUserModal);
        if (e.target === editUserModal) closeModal(editUserModal);
    });
    
    // Form submissions
    addUserForm.addEventListener('submit', handleAddUser);
    editUserForm.addEventListener('submit', handleEditUser);
    
    // Load theme from localStorage
    function loadTheme() {
        const isDarkMode = localStorage.getItem('darkMode') !== 'false';
        if (!isDarkMode) {
            document.documentElement.style.setProperty('--bg-color', '#f5f5f7');
            document.documentElement.style.setProperty('--card-bg', '#ffffff');
            document.documentElement.style.setProperty('--text-color', '#333333');
            document.documentElement.style.setProperty('--border-color', '#e0e0e0');
            document.querySelector('.theme-toggle').innerHTML = '<span class="icon">☀️</span>';
        }
    }
    
    // Load users from Firebase
    function loadUsers() {
        const usersRef = firebase.database().ref('users');
        usersRef.on('value', (snapshot) => {
            const users = snapshot.val();
            usersTableBody.innerHTML = ''; // Clear existing content
            
            if (users) {
                Object.keys(users).forEach(userId => {
                    const user = users[userId];
                    addUserRow(userId, user);
                });
            }
        });
    }
    
    // Add a user row to the table
    function addUserRow(userId, user) {
        // Get the last login info from login logs
        getLastLoginTime(user.email).then(lastLogin => {
            const row = document.createElement('tr');
            
            // Format dates
            const createdAt = new Date(user.createdAt);
            const createdAtStr = createdAt.toLocaleDateString() + ' ' + createdAt.toLocaleTimeString();
            
            // Format last login
            let lastLoginStr = 'Never';
            if (lastLogin) {
                const lastLoginDate = new Date(lastLogin);
                lastLoginStr = lastLoginDate.toLocaleDateString() + ' ' + lastLoginDate.toLocaleTimeString();
            }
            
            row.innerHTML = `
                <td>${user.name || 'N/A'}</td>
                <td>${user.email}</td>
                <td><span class="user-role role-${user.role}">${user.role}</span></td>
                <td>${createdAtStr}</td>
                <td>${lastLoginStr}</td>
                <td class="user-actions">
                    <button class="action-btn edit-btn" data-id="${userId}">✏️</button>
                    <button class="action-btn delete-btn" data-id="${userId}">🗑️</button>
                </td>
            `;
            
            usersTableBody.appendChild(row);
            
            // Add event listeners to the action buttons
            const editBtn = row.querySelector('.edit-btn');
            const deleteBtn = row.querySelector('.delete-btn');
            
            editBtn.addEventListener('click', () => openEditModal(userId, user));
            deleteBtn.addEventListener('click', () => confirmDeleteUser(userId, user.email));
        });
    }
    
    // Get the last login time for a user
    async function getLastLoginTime(email) {
        try {
            const logsRef = firebase.database().ref('loginLogs');
            const query = logsRef.orderByChild('email').equalTo(email);
            
            const snapshot = await query.once('value');
            const logs = snapshot.val();
            
            if (!logs) return null;
            
            // Find the most recent login
            let latestTimestamp = null;
            Object.values(logs).forEach(log => {
                if (!latestTimestamp || new Date(log.timestamp) > new Date(latestTimestamp)) {
                    latestTimestamp = log.timestamp;
                }
            });
            
            return latestTimestamp;
        } catch (error) {
            console.error("Error getting login logs:", error);
            return null;
        }
    }
    
    // Open a modal
    function openModal(modal) {
        modal.style.display = 'block';
    }
    
    // Close a modal
    function closeModal(modal) {
        modal.style.display = 'none';
        
        // Reset forms
        if (modal === addUserModal) {
            addUserForm.reset();
        } else if (modal === editUserModal) {
            editUserForm.reset();
        }
    }
    
    // Open edit user modal
    function openEditModal(userId, user) {
        document.getElementById('editUserId').value = userId;
        document.getElementById('editUserName').value = user.name || '';
        document.getElementById('editUserEmail').value = user.email || '';
        document.getElementById('editUserRole').value = user.role || 'user';
        document.getElementById('editUserPassword').value = '';
        
        openModal(editUserModal);
    }
    
    // Handle add user form submission
    function handleAddUser(e) {
        e.preventDefault();
        
        const name = document.getElementById('newUserName').value;
        const email = document.getElementById('newUserEmail').value;
        const password = document.getElementById('newUserPassword').value;
        const role = document.getElementById('newUserRole').value;
        
        // Disable the submit button
        const submitBtn = addUserForm.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Adding...';
        
        // Create the user in Firebase Auth
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                
                // Add user details to the database
                return firebase.database().ref('users/' + user.uid).set({
                    name: name,
                    email: email,
                    role: role,
                    createdAt: new Date().toISOString()
                });
            })
            .then(() => {
                // Success, close the modal
                closeModal(addUserModal);
                alert(`User ${email} has been added successfully.`);
            })
            .catch((error) => {
                console.error("Error adding user:", error);
                alert(`Error adding user: ${error.message}`);
            })
            .finally(() => {
                // Re-enable the button
                submitBtn.disabled = false;
                submitBtn.textContent = 'Add User';
            });
    }
    
    // Handle edit user form submission
    function handleEditUser(e) {
        e.preventDefault();
        
        const userId = document.getElementById('editUserId').value;
        const name = document.getElementById('editUserName').value;
        const email = document.getElementById('editUserEmail').value;
        const role = document.getElementById('editUserRole').value;
        const password = document.getElementById('editUserPassword').value;
        
        // Disable the submit button
        const submitBtn = editUserForm.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';
        
        // Update user details in the database
        const updates = {};
        updates[`users/${userId}/name`] = name;
        updates[`users/${userId}/role`] = role;
        
        firebase.database().ref().update(updates)
            .then(() => {
                // If password is provided, update it
                if (password) {
                    // This requires a recent login session, which might not be possible
                    // In a real app, you'd use Firebase Admin SDK or a custom auth server
                    alert('Password change requested. In a production app, this would be handled securely on the server.');
                }
                
                closeModal(editUserModal);
                alert(`User ${email} has been updated successfully.`);
            })
            .catch((error) => {
                console.error("Error updating user:", error);
                alert(`Error updating user: ${error.message}`);
            })
            .finally(() => {
                // Re-enable the button
                submitBtn.disabled = false;
                submitBtn.textContent = 'Save Changes';
            });
    }
    
    // Confirm and delete a user
    function confirmDeleteUser(userId, email) {
        if (confirm(`Are you sure you want to delete user ${email}? This action cannot be undone.`)) {
            // Delete user data from the database
            firebase.database().ref(`users/${userId}`).remove()
                .then(() => {
                    alert(`User ${email} has been deleted.`);
                    
                    // Note: In a real application, you would also delete the user from Firebase Auth
                    // This requires admin SDK access which is typically handled on a secure server
                    alert('In a production app, the user would also be removed from authentication system.');
                })
                .catch((error) => {
                    console.error("Error deleting user:", error);
                    alert(`Error deleting user: ${error.message}`);
                });
        }
    }
    
    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    let isDarkMode = localStorage.getItem('darkMode') !== 'false';

    themeToggle.addEventListener('click', function() {
        isDarkMode = !isDarkMode;
        localStorage.setItem('darkMode', isDarkMode);
        
        if (isDarkMode) {
            document.documentElement.style.setProperty('--bg-color', '#1e2130');
            document.documentElement.style.setProperty('--card-bg', '#2a2e43');
            document.documentElement.style.setProperty('--text-color', '#ffffff');
            document.documentElement.style.setProperty('--border-color', '#3d4157');
            themeToggle.innerHTML = '<span class="icon">🌙</span>';
        } else {
            document.documentElement.style.setProperty('--bg-color', '#f5f5f7');
            document.documentElement.style.setProperty('--card-bg', '#ffffff');
            document.documentElement.style.setProperty('--text-color', '#333333');
            document.documentElement.style.setProperty('--border-color', '#e0e0e0');
            themeToggle.innerHTML = '<span class="icon">☀️</span>';
        }
    });
}); 