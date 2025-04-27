import { token, selectedProgramIds } from './auth.js';

console.log('Loading programs.js');

export async function createProgram() {
    console.log('createProgram called');
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
            loadProgramsForRegistration();
        }
    } catch (err) {
        message.textContent = 'Error creating program';
        console.error('Program creation error:', err);
    }
}

export async function loadProgramDropdown() {
    console.log('loadProgramDropdown called');
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

export async function loadProgramsForRegistration() {
    console.log('loadProgramsForRegistration called');
    try {
        const response = await fetch('/api/programs', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const programs = await response.json();
        
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

export function toggleProgramSelection(programId, programName) {
    console.log('toggleProgramSelection called with programId:', programId);
    const index = selectedProgramIds.indexOf(programId.toString());
    if (index === -1) {
        selectedProgramIds.push(programId.toString());
    } else {
        selectedProgramIds.splice(index, 1);
    }
    loadProgramsForRegistration();
}

// Make functions globally accessible
window.createProgram = createProgram;
window.toggleProgramSelection = toggleProgramSelection;