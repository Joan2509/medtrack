let token = null;
let selectedClientId = null;

function init() {
    token = localStorage.getItem('token');
    if (token) {
        document.getElementById('login').classList.add('hidden');
        document.getElementById('main').classList.remove('hidden');
        document.body.classList.add('logged-in');
    }
}

function login() {
    const password = document.getElementById('password').value;
    if (password === '123') {
        token = '123';
        localStorage.setItem('token', token);
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
    localStorage.removeItem('token');
    document.getElementById('login').classList.remove('hidden');
    document.getElementById('main').classList.add('hidden');
    document.getElementById('profile-modal').classList.add('hidden');
    document.getElementById('search-dropdown').classList.add('hidden');
    document.body.classList.remove('logged-in');
}

function closeProfileModal() {
    document.getElementById('profile-modal').classList.add('hidden');
}

function hideSearchDropdown() {
    // Add a small delay to allow click events to complete before hiding the dropdown
    setTimeout(() => {
        document.getElementById('search-dropdown').classList.add('hidden');
    }, 200);
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
        console.error('Program creation error:', err);
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
        console.error('Client registration error:', err);
    }
}

function handleSearchKeypress(event) {
    if (event.keyCode === 13) {
        searchClients();
    }
}

async function searchClients() {
    const query = document.getElementById('navbar-search-query').value;
    const dropdown = document.getElementById('search-dropdown');
    
    if (!query) {
        dropdown.innerHTML = '<li>Please enter a search query</li>';
        dropdown.classList.remove('hidden');
        return;
    }
    
    try {
        const response = await fetch(`/api/clients/search?query=${encodeURIComponent(query)}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const clients = await response.json();
        
        dropdown.innerHTML = clients.length
            ? clients.map(c => `<li onclick="viewProfile(${c.id})">${c.name} (${c.contact || 'No contact'})</li>`).join('')
            : '<li>No clients found</li>';
        
        dropdown.classList.remove('hidden');
    } catch (err) {
        dropdown.innerHTML = '<li>Error searching clients</li>';
        dropdown.classList.remove('hidden');
        console.error('Search error:', err);
    }
}

async function viewProfile(clientId) {
    if (!clientId) {
        console.error('No client ID provided to viewProfile function');
        return;
    }
    
    selectedClientId = clientId;
    document.getElementById('profile-modal').classList.remove('hidden');
    
    try {
        console.log(`Fetching profile for client ID: ${clientId}`);
        const response = await fetch(`/api/clients/${clientId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const client = await response.json();
        
        document.getElementById('modal-profile-name').textContent = `Name: ${client.name}`;
        document.getElementById('modal-profile-dob').textContent = `Date of Birth: ${client.dateOfBirth}`;
        document.getElementById('modal-profile-gender').textContent = `Gender: ${client.gender || 'N/A'}`;
        document.getElementById('modal-profile-contact').textContent = `Contact: ${client.contact || 'N/A'}`;
        
        const programsList = document.getElementById('modal-profile-programs');
        programsList.innerHTML = client.programs && client.programs.length
            ? client.programs.map(p => `<li>${p.name}</li>`).join('')
            : '<li>No programs enrolled</li>';
        
        document.getElementById('enroll-message').textContent = '';
    } catch (err) {
        document.getElementById('modal-profile-name').textContent = 'Error loading profile';
        document.getElementById('modal-profile-dob').textContent = '';
        document.getElementById('modal-profile-gender').textContent = '';
        document.getElementById('modal-profile-contact').textContent = '';
        document.getElementById('modal-profile-programs').innerHTML = '';
        console.error('Profile view error:', err);
    }
}

async function enrollClient() {
    const programId = document.getElementById('enroll-program-id').value;
    const message = document.getElementById('enroll-message');
    
    if (!programId) {
        message.textContent = 'Program ID is required';
        return;
    }
    
    if (!selectedClientId) {
        message.textContent = 'No client selected';
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
            // Refresh the profile view to show the newly enrolled program
            viewProfile(selectedClientId);
            document.getElementById('enroll-program-id').value = '';
        }
    } catch (err) {
        message.textContent = 'Error enrolling client';
        console.error('Enrollment error:', err);
    }
}

// Additional helper function to list all programs (useful for enrollment)
async function listAllPrograms() {
    try {
        const response = await fetch('/api/programs', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (err) {
        console.error('Error fetching programs:', err);
        return [];
    }
}

init();