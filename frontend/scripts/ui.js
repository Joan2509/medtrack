console.log('Loading ui.js');

export function closeProfileModal() {
    console.log('closeProfileModal called');
    document.getElementById('profile-modal').classList.add('hidden');
}

export function hideSearchDropdown() {
    console.log('hideSearchDropdown called');
    setTimeout(() => {
        document.getElementById('search-dropdown').classList.add('hidden');
    }, 200);
}

export function toggleProgramsDropdown() {
    console.log('toggleProgramsDropdown called');
    const dropdown = document.getElementById('client-programs-dropdown');
    dropdown.classList.toggle('hidden');
}

export function hideProgramsDropdown() {
    console.log('hideProgramsDropdown called');
    setTimeout(() => {
        document.getElementById('client-programs-dropdown').classList.add('hidden');
    }, 200);
}

// Make functions globally accessible
window.closeProfileModal = closeProfileModal;
window.hideSearchDropdown = hideSearchDropdown;
window.toggleProgramsDropdown = toggleProgramsDropdown;
window.hideProgramsDropdown = hideProgramsDropdown;