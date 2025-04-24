document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const registerForm = document.getElementById('registerForm');
    const nameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const registerError = document.createElement('div');
    registerError.id = 'registerError';
    registerError.style.color = '#ff6b6b';
    registerError.style.marginBottom = '15px';
    registerError.style.display = 'none';
    registerForm.insertBefore(registerError, registerForm.querySelector('button[type="submit"]'));
    
    const passwordToggle = document.getElementById('togglePassword');
    const confirmPasswordToggle = document.getElementById('toggleConfirmPassword');

    // Check if user is already logged in
    const userData = localStorage.getItem('userData');
    if (userData) {
        // Redirect to dashboard if logged in
        window.location.href = 'index.html';
    }

    // Toggle password visibility
    passwordToggle.addEventListener('click', function() {
        togglePasswordVisibility(passwordInput, passwordToggle);
    });

    confirmPasswordToggle.addEventListener('click', function() {
        togglePasswordVisibility(confirmPasswordInput, confirmPasswordToggle);
    });

    function togglePasswordVisibility(input, toggleButton) {
        if (input.type === 'password') {
            input.type = 'text';
            toggleButton.classList.add('active');
        } else {
            input.type = 'password';
            toggleButton.classList.remove('active');
        }
    }
    
    // Handle form submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        registerError.style.display = 'none';
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        
        // Validate inputs
        if (!name || !email || !password || !confirmPassword) {
            registerError.textContent = 'Please fill in all fields';
            registerError.style.display = 'block';
            return;
        }
        
        if (password !== confirmPassword) {
            registerError.textContent = 'Passwords do not match';
            registerError.style.display = 'block';
            return;
        }
        
        if (password.length < 6) {
            registerError.textContent = 'Password must be at least 6 characters';
            registerError.style.display = 'block';
            return;
        }
        
        // Show loading state
        document.querySelector('button[type="submit"]').innerHTML = '<span class="spinner"></span> Creating account...';
        document.querySelector('button[type="submit"]').disabled = true;
        
        // Call the register API endpoint
        fetch('http://localhost:3002/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        })
        .then(response => {
            const statusCode = response.status;
            return response.json().then(data => {
                return { data, statusCode };
            });
        })
        .then(({ data, statusCode }) => {
            // Reset button state
            document.querySelector('button[type="submit"]').innerHTML = 'Create Account';
            document.querySelector('button[type="submit"]').disabled = false;
            
            if (statusCode === 201 || data.message === 'User registered successfully') {
                // Store user data
                localStorage.setItem('userData', JSON.stringify(data.user));
                
                // Show success message
                alert('Account created successfully! Redirecting to dashboard...');
                
                // Redirect to dashboard
                window.location.href = 'index.html';
            } else {
                registerError.textContent = data.error || 'Error creating account';
                registerError.style.display = 'block';
            }
        })
        .catch(error => {
            document.querySelector('button[type="submit"]').innerHTML = 'Create Account';
            document.querySelector('button[type="submit"]').disabled = false;
            registerError.textContent = 'An error occurred. Please try again.';
            registerError.style.display = 'block';
            console.error('Registration error:', error);
        });
    });
}); 