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

function logout() {
    token = null;
    selectedClientId = null;
    document.getElementById('login').classList.remove('hidden');
    document.getElementById('main').classList.add('hidden');
    document.getElementById('profile').classList.add('hidden');
}