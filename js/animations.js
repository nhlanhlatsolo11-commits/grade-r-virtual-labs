// Confetti animation
function createConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    
    const colors = ['#FF6B6B', '#FFE66D', '#95E1D3', '#C7CEEA', '#FF8B94', '#A8E6CF'];
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.animation = `confettiFall ${2 + Math.random() * 1}s linear forwards`;
        
        container.appendChild(confetti);
    }
    
    setTimeout(() => container.remove(), 3000);
}

// Bounce animation for elements
function bounceElement(element) {
    element.style.animation = 'none';
    setTimeout(() => {
        element.style.animation = 'bounce 0.5s ease-in-out';
    }, 10);
}

// Pulse animation
function pulseElement(element, duration = 0.5) {
    element.style.animation = 'pulse ' + duration + 's ease-in-out';
    setTimeout(() => {
        element.style.animation = '';
    }, duration * 1000);
}

// Spin animation
function spinElement(element) {
    element.style.animation = 'spin 0.6s ease-in-out';
    setTimeout(() => {
        element.style.animation = '';
    }, 600);
}

// Shake animation for errors
function shakeElement(element) {
    element.style.animation = 'shake 0.4s ease-in-out';
    setTimeout(() => {
        element.style.animation = '';
    }, 400);
}

// Create floating text effect
function createFloatingText(text, element) {
    const floatingText = document.createElement('div');
    floatingText.textContent = text;
    floatingText.style.position = 'absolute';
    floatingText.style.fontSize = '2em';
    floatingText.style.fontWeight = 'bold';
    floatingText.style.pointerEvents = 'none';
    floatingText.style.color = '#4ade80';
    floatingText.style.zIndex = '1000';
    
    const rect = element.getBoundingClientRect();
    floatingText.style.left = (rect.left + rect.width / 2) + 'px';
    floatingText.style.top = rect.top + 'px';
    
    document.body.appendChild(floatingText);
    floatingText.style.animation = 'floatUp 1.5s ease-out forwards';
    
    setTimeout(() => floatingText.remove(), 1500);
}

// Celebrate function - combines confetti, sound, and animation
function celebrate(element = null) {
    soundEffects.victory();
    createConfetti();
    
    if (element) {
        bounceElement(element);
        pulseElement(element, 0.8);
    }
}

// Error reaction - shake and sound
function errorReaction(element) {
    soundEffects.error();
    if (element) {
        shakeElement(element);
    }
}

// Success reaction - no confetti, just sound and animation
function successReaction(element) {
    soundEffects.correct();
    if (element) {
        bounceElement(element);
    }
    createFloatingText('✨', element || document.body);
}

// Export for use in other files
window.createConfetti = createConfetti;
window.bounceElement = bounceElement;
window.pulseElement = pulseElement;
window.spinElement = spinElement;
window.shakeElement = shakeElement;
window.createFloatingText = createFloatingText;
window.celebrate = celebrate;
window.errorReaction = errorReaction;
window.successReaction = successReaction;
