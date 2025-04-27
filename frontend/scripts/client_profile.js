import { token } from './auth.js';
import { loadProgramDropdown } from './programs.js';

console.log('Loading profile.js');

export async function viewProfile(clientId) {
    console.log('viewProfile called with clientId:', clientId);
    if (!clientId) {
        console.error('No client ID provided to viewProfile function');
        return;
    }
    
    window.selectedClientId = clientId; // Update global selectedClientId
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
        document.getElementById('modal-profile-contact').textContent = `Contact: ${client.contact || 'No contact'}`;
        
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

// Make function globally accessible
window.viewProfile = viewProfile;