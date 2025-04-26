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

async function createProgram() {
    const name = document.getElementById('program-name').value;
    const description = document.getElementById('program-description').value;
    const message = document.getElementById('program-message');

    if (!name) {
        message.textContent = 'Program name is required';
        return;
    }

    try {
        const response = await fetch('/api/programs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, description })
        });
        const data = await response.json();
        message.textContent = response.ok ? 'Program created' : data.error;
        if (response.ok) {
            document.getElementById('program-name').value = '';
            document.getElementById('program-description').value = '';
        }
    } catch (err) {
        message.textContent = 'Error creating program';
    }
}

async function registerClient() {
    const name = document.getElementById('client-name').value;
    const dateOfBirth = document.getElementById('client-dob').value;
    const gender = document.getElementById('client-gender').value;
    const contact = document.getElementById('client-contact').value;
    const message = document.getElementById('client-message');

    if (!name || !dateOfBirth) {
        message.textContent = 'Name and date of birth are required';
        return;
    }

    try {
        const response = await fetch('/api/clients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, dateOfBirth, gender, contact })
        });
        const data = await response.json();
        message.textContent = response.ok ? 'Client registered' : data.error;
        if (response.ok) {
            document.getElementById('client-name').value = '';
            document.getElementById('client-dob').value = '';
            document.getElementById('client-gender').value = '';
            document.getElementById('client-contact').value = '';
        }
    } catch (err) {
        message.textContent = 'Error registering client';
    }
}
