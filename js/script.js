let currentLab = null;

function navigateTo(section) {
    const mainMenu = document.getElementById('mainMenu');
    const scienceLab = document.getElementById('scienceLab');
    const mathLab = document.getElementById('mathLab');
    const creativeLab = document.getElementById('creativeLab');
    const activityContainer = document.getElementById('activityContainer');

    // Hide all sections
    mainMenu.classList.add('hidden');
    scienceLab.classList.add('hidden');
    mathLab.classList.add('hidden');
    creativeLab.classList.add('hidden');
    activityContainer.classList.add('hidden');

    // Show selected section
    switch(section) {
        case 'menu':
            mainMenu.classList.remove('hidden');
            currentLab = null;
            break;
        case 'science':
            scienceLab.classList.remove('hidden');
            currentLab = 'science';
            break;
        case 'math':
            mathLab.classList.remove('hidden');
            currentLab = 'math';
            break;
        case 'creative':
            creativeLab.classList.remove('hidden');
            currentLab = 'creative';
            break;
    }
}

function loadActivity(activityName) {
    const container = document.getElementById('activityContainer');
    const content = document.getElementById('activityContent');

    // Hide labs
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('scienceLab').classList.add('hidden');
    document.getElementById('mathLab').classList.add('hidden');
    document.getElementById('creativeLab').classList.add('hidden');

    // Show activity container
    container.classList.remove('hidden');

    // Load activity
    if (typeof window.activities[activityName] === 'function') {
        content.innerHTML = '';
        window.activities[activityName]();
    } else {
        content.innerHTML = '<p>Activity not found</p>';
    }
}

function goBackToLab() {
    if (currentLab) {
        navigateTo(currentLab);
    } else {
        navigateTo('menu');
    }
}

// Initialize - show main menu on load
window.addEventListener('load', () => {
    navigateTo('menu');
});