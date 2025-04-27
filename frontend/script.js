let token = null;
let selectedClientId = null;
let selectedProgramIds = []; // Track selected programs

function init() {
    token = localStorage.getItem('token');
    if (token) {
        document.getElementById('login').classList.add('hidden');
        document.getElementById('main').classList.remove('hidden');
        document.body.classList.add('logged-in');
        loadProgramsForRegistration(); // Load programs for registration form
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
        loadProgramsForRegistration(); // Load programs after login
    } else {
        document.getElementById('login-error').textContent = 'Invalid password';
    }
}

function logout() {
    token = null;
    selectedClientId = null;
    selectedProgramIds = [];
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
    setTimeout(() => {
        document.getElementById('search-dropdown').classList.add('hidden');
    }, 200);
}

function toggleProgramsDropdown() {
    const dropdown = document.getElementById('client-programs-dropdown');
    dropdown.classList.toggle('hidden');
}

function hideProgramsDropdown() {
    setTimeout(() => {
        document.getElementById('client-programs-dropdown').classList.add('hidden');
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
            loadProgramsForRegistration(); // Refresh programs dropdown
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
    const programIds = selectedProgramIds; // Use selected programs
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
            body: JSON.stringify({ name, dateOfBirth, gender, contact, programIds })
        });
        
        const data = await response.json();
        message.textContent = response.ok 
            ? programIds.length ? 'Client registered and enrolled in programs' : 'Client registered'
            : data.error;
        
        if (response.ok) {
            document.getElementById('client-name').value = '';
            document.getElementById('client-dob').value = '';
            document.getElementById('client-gender').value = '';
            document.getElementById('client-contact').value = '';
            selectedProgramIds = []; // Reset selections
            document.getElementById('client-programs-input').value = ''; // Clear input
            loadProgramsForRegistration(); // Refresh dropdown
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
            viewProfile(selectedClientId);
            document.getElementById('enroll-program-id').value = '';
        }
    } catch (err) {
        message.textContent = 'Error enrolling client';
        console.error('Enrollment error:', err);
    }
}

async function loadProgramDropdown() {
    try {
        const programs = await fetch('/api/programs', {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json());
        
        const select = document.getElementById('enroll-program-id');
        
        select.innerHTML = '<option value="">Select a program...</option>';
        
        programs.forEach(program => {
            const option = document.createElement('option');
            option.value = program.id;
            option.textContent = program.name;
            select.appendChild(option);
        });
    } catch (err) {
        console.error('Error loading programs for dropdown:', err);
    }
}

async function loadProgramsForRegistration() {
    try {
        const response = await fetch('/api/programs', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const programs = await response.json();
        
        // Sort programs alphabetically (case-insensitive) as a fallback
        programs.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
        
        const dropdown = document.getElementById('client-programs-dropdown');
        if (!dropdown) {
            console.error('Programs dropdown element not found');
            return;
        }
        dropdown.innerHTML = programs.length
            ? programs.map(program => `
                <li class="program-item">
                    <label class="program-label">
                        <input type="checkbox" 
                               value="${program.id}" 
                               ${selectedProgramIds.includes(program.id.toString()) ? 'checked' : ''} 
                               onchange="toggleProgramSelection(${program.id}, '${program.name}')">
                        <span class="program-name">${program.name}</span>
                    </label>
                </li>
            `).join('')
            : '<li class="program-item no-programs">No programs available</li>';

        // Update input field to show selected programs
        const selectedPrograms = programs.filter(p => selectedProgramIds.includes(p.id.toString()));
        const input = document.getElementById('client-programs-input');
        if (input) {
            input.value = selectedPrograms.map(p => p.name).join(', ') || 'Select programs...';
        }
    } catch (err) {
        console.error('Error loading programs for registration:', err);
        const dropdown = document.getElementById('client-programs-dropdown');
        if (dropdown) {
            dropdown.innerHTML = '<li class="program-item error">Error loading programs</li>';
        }
    }
}

function toggleProgramSelection(programId, programName) {
    const index = selectedProgramIds.indexOf(programId.toString());
    if (index === -1) {
        selectedProgramIds.push(programId.toString());
    } else {
        selectedProgramIds.splice(index, 1);
    }
    // Refresh dropdown to update checkbox states and input field
    loadProgramsForRegistration();
}

async function viewProfile(clientId) {
    if (!clientId) {
        console.error('No client ID provided to viewProfile function');
        return;
    }
    
    selectedClientId = clientId;
    document.getElementById('profile-modal').classList.remove('hidden');
    
    await loadProgramDropdown();
    
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

init();