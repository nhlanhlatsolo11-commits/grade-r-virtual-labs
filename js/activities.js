window.activities['magnet-game'] = function() {
    const content = document.getElementById('activityContent');
    content.innerHTML = `
        <div class="magnet-game-container">
            <h2>🧲 Magnet Explorer</h2>
            <p>Tap each object. Which ones will stick to the magnet?</p>
            
            <div class="magnet-area">
                <div class="magnet-item" style="background: linear-gradient(135deg, #FFD700, #FFA500); cursor: pointer;" onclick="testMagnet('coin', '🪙')">🪙 Coin</div>
                <div class="magnet-item" style="background: linear-gradient(135deg, #87CEEB, #87CEEB); cursor: pointer;" onclick="testMagnet('water', '💧')">💧 Water Drop</div>
                <div class="magnet-item" style="background: linear-gradient(135deg, #A9A9A9, #808080); cursor: pointer;" onclick="testMagnet('nail', '⚙️')">⚙️ Metal Nail</div>
                <div class="magnet-item" style="background: linear-gradient(135deg, #D2691E, #8B4513); cursor: pointer;" onclick="testMagnet('wood', '🪵')">���� Wood</div>
                <div class="magnet-item" style="background: linear-gradient(135deg, #FF69B4, #FF1493); cursor: pointer;" onclick="testMagnet('plastic', '🎀')">🎀 Plastic</div>
                <div class="magnet-item" style="background: linear-gradient(135deg, #00CED1, #00BFFF); cursor: pointer;" onclick="testMagnet('glass', '🔷')">🔷 Glass</div>
            </div>
            
            <div class="water-container" id="magnetContainer" style="background: linear-gradient(to bottom, #FFE4B5, #FFDAB9);"></div>
            <p id="magnetResult" style="font-size: 1.2em; font-weight: bold; text-align: center;"></p>
        </div>
    `;

    announceActivity('Magnet Explorer', 'Find the objects that can be pulled by a magnet.');

    window.testMagnet = function(object, emoji) {
        const container = document.getElementById('magnetContainer');
        const result = document.getElementById('magnetResult');
        const magneticObjects = ['coin', 'nail'];
        const isMagnetic = magneticObjects.includes(object);

        container.innerHTML = '';

        if (isMagnetic) {
            const attractedDiv = document.createElement('div');
            attractedDiv.className = 'floating-object magnet-attract';
            attractedDiv.textContent = emoji;
            attractedDiv.style.top = '10px';
            attractedDiv.style.left = '50%';
            container.appendChild(attractedDiv);
            result.textContent = '✨ Magnetic! It sticks to the magnet!';
            result.style.color = 'var(--success)';
            if (window.gradeRApp && typeof window.gradeRApp.playSuccessCue === 'function') {
                window.gradeRApp.playSuccessCue();
            }
            if (window.gradeRApp && typeof window.gradeRApp.speak === 'function') {
                window.gradeRApp.speak('Yes! The magnet attracts it. Great job!');
            }
        } else {
            const notAttractedDiv = document.createElement('div');
            notAttractedDiv.className = 'sinking-object';
            notAttractedDiv.textContent = emoji;
            notAttractedDiv.style.left = Math.random() * 80 + '%';
            container.appendChild(notAttractedDiv);
            result.textContent = '❌ Not magnetic! It does not stick.';
            result.style.color = 'var(--danger)';
            if (window.gradeRApp && typeof window.gradeRApp.speak === 'function') {
                window.gradeRApp.speak('That one is not magnetic. Nice try!');
            }
        }
    };
};
