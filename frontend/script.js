let token = null;
let selectedClientId = null;

function login() {
    const password = document.getElementById('password').value;
    if (password === 'doctor123') {
        token = 'doctor123';
        document.getElementById('login').classList.add('hidden');
        document.getElementById('main').classList.remove('hidden');
        document.getElementById('login-error').textContent = '';
        document.body.classList.add('logged-in');
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
    document.body.classList.remove('logged-in');
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

function handleSearchKeypress(event) {
    if (event.keyCode === 13) {
        searchClients();
    }
}

async function searchClients() {
    const query = document.getElementById('navbar-search-query').value;
    const results = document.getElementById('search-results');

    if (!query) {
        results.innerHTML = '<li>Please enter a search query</li>';
        return;
    }

    try {
        const response = await fetch(`/api/clients/search?query=${encodeURIComponent(query)}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const clients = await response.json();
        results.innerHTML = clients.length
            ? clients.map(c => `<li onclick="viewProfile(${c.id})">${c.name} (${c.contact})</li>`).join('')
            : '<li>No clients found</li>';
    } catch (err) {
        results.innerHTML = '<li>Error searching clients</li>';
    }
}

async function viewProfile(clientId) {
    selectedClientId = clientId;
    document.getElementById('profile').classList.remove('hidden');

    try {
        const response = await fetch(`/api/clients/${clientId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const client = await response.json();
        document.getElementById('profile-name').textContent = `Name: ${client.name}`;
        document.getElementById('profile-dob').textContent = `Date of Birth: ${client.dateOfBirth}`;
        document.getElementById('profile-gender').textContent = `Gender: ${client.gender || 'N/A'}`;
        document.getElementById('profile-contact').textContent = `Contact: ${client.contact || 'N/A'}`;
        document.getElementById('profile-programs').innerHTML = client.programs.length
            ? client.programs.map(p => `<li>${p.name}</li>`).join('')
            : '<li>No programs enrolled</li>';
    } catch (err) {
        document.getElementById('profile').innerHTML = '<p>Error loading profile</p>';
    }
}

async function enrollClient() {
    const programId = document.getElementById('enroll-program-id').value;
    const message = document.getElementById('enroll-message');

    if (!programId) {
        message.textContent = 'Program ID is required';
        return;
    }

    try {
        const response = await fetch(`/api/clients/${selectedClientId}/enroll`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ programId })
        });
        const data = await response.json();
        message.textContent = response.ok ? 'Client enrolled' : data.error;
        if (response.ok) {
            viewProfile(selectedClientId);
            document.getElementById('enroll-program-id').value = '';
        }
    } catch (err) {
        message.textContent = 'Error enrolling client';
    }
}