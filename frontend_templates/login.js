document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMe = document.getElementById('remember');
    const loginError = document.getElementById('login-error') || document.createElement('div');
    
    if (!document.getElementById('login-error')) {
        loginError.id = 'login-error';
        loginError.className = 'login-error';
        loginForm.insertBefore(loginError, loginForm.querySelector('button[type="submit"]'));
    }
    
    // Check if user is already logged in
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    
    if (userId && userEmail) {
        // If already logged in, redirect to dashboard
        window.location.href = 'index.html';
        return;
    }

    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!email || !password) {
            loginError.textContent = 'Please enter both email and password';
            loginError.style.display = 'block';
            return;
        }
        
        // Show loading state
        const loginBtn = document.getElementById('login-btn');
        const originalBtnText = loginBtn.textContent;
        loginBtn.disabled = true;
        loginBtn.textContent = 'Logging in...';
        
        // Test account credentials
        const testAccount = {
            email: 'mariem@gmail.com',
            password: 'mariem',
            userId: '12345',
            name: 'Mariem'
        };
        
        // Simple validation
        setTimeout(() => {
            if (email === testAccount.email && password === testAccount.password) {
                // Successful login - store user data in localStorage
                localStorage.setItem('userId', testAccount.userId);
                localStorage.setItem('userEmail', testAccount.email);
                
                // For the dashboard compatibility
                const userData = {
                    id: testAccount.userId,
                    email: testAccount.email,
                    name: testAccount.name
                };
                localStorage.setItem('userData', JSON.stringify(userData));
                
                // Redirect to dashboard
                window.location.href = 'index.html';
            } else {
                // Failed login
                loginBtn.disabled = false;
                loginBtn.textContent = originalBtnText;
                loginError.textContent = 'Invalid email or password. Try our test account: mariem@gmail.com / mariem';
                loginError.style.display = 'block';
            }
        }, 1000); // Simulating network request delay
    });
}); 