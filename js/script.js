let currentLab = null;

function navigateTo(section) {
    const mainMenu = document.getElementById('mainMenu');
    const scienceLab = document.getElementById('scienceLab');
    const mathLab = document.getElementById('mathLab');
    const creativeLab = document.getElementById('creativeLab');
    const activityContainer = document.getElementById('activityContainer');

    // hide everything first
    mainMenu.classList.add('hidden');
    scienceLab.classList.add('hidden');
    mathLab.classList.add('hidden');
    creativeLab.classList.add('hidden');
    activityContainer.classList.add('hidden');

    // also clear fullscreen state when navigating between sections
    activityContainer.classList.remove('fullscreen');
    document.body.classList.remove('in-activity');

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

    // hide other lists
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('scienceLab').classList.add('hidden');
    document.getElementById('mathLab').classList.add('hidden');
    document.getElementById('creativeLab').classList.add('hidden');

    // show activity container and make it fullscreen-style for focused play
    container.classList.remove('hidden');
    // apply full-screen-like presentation (CSS handles visual overlay)
    container.classList.add('fullscreen');
    document.body.classList.add('in-activity');

    // call activity function to populate content
    if (typeof window.activities === 'object' && typeof window.activities[activityName] === 'function') {
        content.innerHTML = '';
        // small timeout to ensure container styles apply before heavy rendering
        setTimeout(() => window.activities[activityName](), 50);
    } else {
        content.innerHTML = '<p>Activity not found</p>';
    }
}

function goBackToLab() {
    const container = document.getElementById('activityContainer');
    // remove fullscreen presentation
    container.classList.remove('fullscreen');
    document.body.classList.remove('in-activity');

    if (currentLab) {
        navigateTo(currentLab);
    } else {
        navigateTo('menu');
    }
}

function setHelperText(text) {
    const helperText = document.getElementById('helperText');
    if (helperText) {
        helperText.textContent = text;
    }
}

window.addEventListener('load', () => {
    navigateTo('menu');
    setHelperText('Choose a lab and start exploring!');
});
