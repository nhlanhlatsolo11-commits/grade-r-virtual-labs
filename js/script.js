let currentLab = null;

function navigateTo(section) {
    const mainMenu = document.getElementById('mainMenu');
    const scienceLab = document.getElementById('scienceLab');
    const mathLab = document.getElementById('mathLab');
    const creativeLab = document.getElementById('creativeLab');
    const activityContainer = document.getElementById('activityContainer');

    if (!mainMenu || !scienceLab || !mathLab || !creativeLab || !activityContainer) return;

    mainMenu.classList.add('hidden');
    scienceLab.classList.add('hidden');
    mathLab.classList.add('hidden');
    creativeLab.classList.add('hidden');
    activityContainer.classList.add('hidden');

    switch (section) {
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
        default:
            mainMenu.classList.remove('hidden');
            currentLab = null;
            break;
    }
}

function loadActivity(activityName) {
    const container = document.getElementById('activityContainer');
    const content = document.getElementById('activityContent');

    if (!container || !content) return;

    document.getElementById('mainMenu')?.classList.add('hidden');
    document.getElementById('scienceLab')?.classList.add('hidden');
    document.getElementById('mathLab')?.classList.add('hidden');
    document.getElementById('creativeLab')?.classList.add('hidden');

    container.classList.remove('hidden');
    container.classList.add('fullscreen');
    document.body.classList.add('in-activity');

    if (window.activities && typeof window.activities[activityName] === 'function') {
        content.innerHTML = '';
        setTimeout(() => window.activities[activityName](), 30);
    } else {
        content.innerHTML = '<div class="game-card"><h2>Oops!</h2><p>Activity not found.</p></div>';
    }
}

function goBackToLab() {
    const container = document.getElementById('activityContainer');
    if (container) {
        container.classList.remove('fullscreen');
    }
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
