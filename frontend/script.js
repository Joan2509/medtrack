let token = null;
let selectedClientId = null;

function login() {
    const password = document.getElementById('password').value;
    if (password === 'doctor123') {
        token = 'doctor123';
        document.getElementById('login').classList.add('hidden');
        document.getElementById('main').classList.remove('hidden');
        document.getElementById('login-error').textContent = '';
    } else {
        document.getElementById('login-error').textContent = 'Invalid password';
    }
}

