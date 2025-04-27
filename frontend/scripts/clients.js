import { token, selectedClientId, selectedProgramIds } from './auth.js';
import { loadProgramsForRegistration } from './programs.js';
import { viewProfile } from './client_profile.js';

console.log('Loading client.js');

export async function registerClient() {
    console.log('registerClient called');
    const name = document.getElementById('client-name').value;
    const dateOfBirth = document.getElementById('client-dob').value;
    const gender = document.getElementById('client-gender').value;
    const contact = document.getElementById('client-contact').value;
    const programIds = selectedProgramIds;
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
            selectedProgramIds.length = 0;
            document.getElementById('client-programs-input').value = '';
            loadProgramsForRegistration();
        }
    } catch (err) {
        message.textContent = 'Error registering client';
        console.error('Client registration error:', err);
    }
}

export async function enrollClient() {
    console.log('enrollClient called');
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

export function handleSearchKeypress(event) {
    console.log('handleSearchKeypress called');
    if (event.keyCode === 13) {
        searchClients();
    }
}

export async function searchClients() {
    console.log('searchClients called');
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

// Make functions globally accessible
window.registerClient = registerClient;
window.enrollClient = enrollClient;
window.searchClients = searchClients;
window.handleSearchKeypress = handleSearchKeypress;