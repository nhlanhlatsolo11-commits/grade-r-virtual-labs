window.activities['music-maker'] = function() {
    const content = document.getElementById('activityContent');
    content.innerHTML = `
        <div class="music-maker-container">
            <h2>🎵 Music Maker</h2>
            <p>Tap the keys to create a colorful rhythm!</p>

            <div class="piano-keys" id="pianoKeys"></div>
            <div class="score">Notes played: <span id="notesCount">0</span></div>
        </div>
    `;

    const notes = [
        { key: 'C', label: 'C' },
        { key: 'D', label: 'D' },
        { key: 'E', label: 'E' },
        { key: 'F', label: 'F' },
        { key: 'G', label: 'G' },
        { key: 'A', label: 'A' },
        { key: 'B', label: 'B' },
        { key: 'C2', label: 'C' }
    ];

    let notesPlayed = 0;
    const keysContainer = document.getElementById('pianoKeys');

    notes.forEach((note, index) => {
        const key = document.createElement('button');
        key.className = 'piano-key';
        key.textContent = note.label;
        key.type = 'button';
        key.onclick = () => visualPlayNote(index, key);
        keysContainer.appendChild(key);
    });

    function visualPlayNote(keyIndex, keyElement) {
        keyElement.style.transform = 'translateY(10px)';
        keyElement.style.background = '#ffd54f';
        notesPlayed++;
        document.getElementById('notesCount').textContent = notesPlayed;

        setTimeout(() => {
            keyElement.style.transform = 'translateY(0)';
            keyElement.style.background = '';
        }, 150);
    }
};

window.activities['draw-canvas'] = function() {
    const content = document.getElementById('activityContent');
    content.innerHTML = `
        <div class="canvas-container">
            <h2>🖌️ Magic Canvas</h2>
            <p>Tap colorful brushes to paint a joyful shape!</p>
            <div class="brush-row">
                <button class="brush-btn red" type="button" data-color="#ff5d8f">Red</button>
                <button class="brush-btn yellow" type="button" data-color="#ffd166">Yellow</button>
                <button class="brush-btn blue" type="button" data-color="#5ec8ff">Blue</button>
                <button class="brush-btn green" type="button" data-color="#70e089">Green</button>
            </div>
            <canvas id="paintCanvas" width="300" height="220"></canvas>
        </div>
    `;

    const canvas = document.getElementById('paintCanvas');
    const ctx = canvas.getContext('2d');
    let currentColor = '#ff5d8f';

    ctx.fillStyle = '#fffaf2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    document.querySelectorAll('.brush-btn').forEach(button => {
        button.addEventListener('click', () => {
            currentColor = button.dataset.color;
            document.querySelectorAll('.brush-btn').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
    });

    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        ctx.beginPath();
        ctx.fillStyle = currentColor;
        ctx.arc(x, y, 18, 0, Math.PI * 2);
        ctx.fill();
    });
};

window.activities['pattern-maker'] = function() {
    const content = document.getElementById('activityContent');
    content.innerHTML = `
        <div class="pattern-maker">
            <h2>🎭 Pattern Maker</h2>
            <p>Tap a color to build a bright pattern wall.</p>
            <div class="pattern-palette">
                <button class="pattern-color red" data-color="#ff5d8f" type="button"></button>
                <button class="pattern-color yellow" data-color="#ffd166" type="button"></button>
                <button class="pattern-color blue" data-color="#5ec8ff" type="button"></button>
                <button class="pattern-color green" data-color="#70e089" type="button"></button>
                <button class="pattern-color purple" data-color="#b58cff" type="button"></button>
            </div>
            <div class="pattern-grid" id="patternGrid"></div>
        </div>
    `;

    const grid = document.getElementById('patternGrid');
    const colors = ['#ff5d8f', '#ffd166', '#5ec8ff', '#70e089', '#b58cff'];

    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'pattern-cell';
        cell.dataset.color = colors[i % colors.length];
        cell.addEventListener('click', () => {
            const current = cell.dataset.color;
            const next = colors[(colors.indexOf(current) + 1) % colors.length];
            cell.dataset.color = next;
            cell.style.background = next;
        });
        cell.style.background = colors[i % colors.length];
        grid.appendChild(cell);
    }
};

window.activities['number-game'] = function() {
    const content = document.getElementById('activityContent');
    const target = Math.floor(Math.random() * 10) + 1;

    content.innerHTML = `
        <div class="number-game">
            <h2>🎯 Number Jump</h2>
            <p>Tap the number <strong>${target}</strong>!</p>
            <div class="number-buttons">
                <button class="number-btn" type="button">1</button>
                <button class="number-btn" type="button">2</button>
                <button class="number-btn" type="button">3</button>
                <button class="number-btn" type="button">4</button>
                <button class="number-btn" type="button">5</button>
                <button class="number-btn" type="button">6</button>
                <button class="number-btn" type="button">7</button>
                <button class="number-btn" type="button">8</button>
                <button class="number-btn" type="button">9</button>
                <button class="number-btn" type="button">10</button>
            </div>
        </div>
    `;

    document.querySelectorAll('.number-btn').forEach(button => {
        button.addEventListener('click', () => {
            const value = Number(button.textContent);

            if (value === target) {
                button.classList.add('correct');
                button.textContent = '✓';
                setHelper
