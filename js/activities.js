window.activities = window.activities || {};

function _ensureAudioCtx() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!window._audioCtx && AudioCtx) {
            window._audioCtx = new AudioCtx();
        }
        if (window._audioCtx && window._audioCtx.state === 'suspended' && typeof window._audioCtx.resume === 'function') {
            window._audioCtx.resume();
        }
        return window._audioCtx || null;
    } catch (e) {
        return null;
    }
}

function _playTone(freq, duration = 220, type = 'sine') {
    const ctx = _ensureAudioCtx();
    if (!ctx) return;

    try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.15, now + 0.02);
        osc.start(now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration / 1000);
        osc.stop(now + duration / 1000 + 0.02);
    } catch (e) {
        // Ignore browser audio limitations.
    }
}

function _hexToRgb(hex) {
    const value = hex.replace('#', '');
    const bigint = parseInt(value, 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
    };
}

function _rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function _mixHexColors(hexList) {
    const rgbList = hexList.map(_hexToRgb);
    const total = rgbList.reduce((acc, cur) => {
        acc.r += cur.r;
        acc.g += cur.g;
        acc.b += cur.b;
        return acc;
    }, { r: 0, g: 0, b: 0 });

    const count = rgbList.length || 1;
    return _rgbToHex(
        Math.round(total.r / count),
        Math.round(total.g / count),
        Math.round(total.b / count)
    );
}

function _colorDistanceHex(a, b) {
    const ra = _hexToRgb(a);
    const rb = _hexToRgb(b);
    const dr = ra.r - rb.r;
    const dg = ra.g - rb.g;
    const db = ra.b - rb.b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
}

window.activities['music-maker'] = function() {
    const content = document.getElementById('activityContent');
    content.innerHTML = `
        <div class="game-card">
            <h2>🎵 Music Maker</h2>
            <p>Listen to the pattern and tap the same notes back.</p>
            <div id="musicPattern" class="score-badge">Pattern: ready</div>
            <div class="piano-keys" id="pianoKeys"></div>
            <div class="score-badge" style="margin-top:12px;">Notes played: <span id="notesCount">0</span></div>
            <div style="margin-top:12px;">
                <button id="playPatternBtn" class="mini-btn" type="button">Play Pattern</button>
                <button id="clearTuneBtn" class="mini-btn" type="button">Clear</button>
            </div>
            <div id="musicFeedback" class="feedback"></div>
        </div>
    `;

    const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'];
    const pattern = [];
    let userSequence = [];
    let notesPlayed = 0;

    function generatePattern() {
        const length = 3 + Math.floor(Math.random() * 2);
        pattern.length = 0;
        for (let i = 0; i < length; i++) {
            pattern.push(Math.floor(Math.random() * notes.length));
        }
        document.getElementById('musicPattern').textContent = `Pattern: ${pattern.map(i => notes[i]).join(' ')}`;
        userSequence = [];
        notesPlayed = 0;
        document.getElementById('notesCount').textContent = notesPlayed;
        setHelperText('Listen first, then repeat the pattern');
    }

    function playPattern() {
        const notesFreq = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25];
        const patternButtons = Array.from(document.querySelectorAll('.piano-key'));

        patternButtons.forEach(btn => btn.disabled = true);

        pattern.forEach((index, i) => {
            setTimeout(() => {
                const btn = patternButtons[index];
                if (btn) {
                    btn.classList.add('active');
                    _playTone(notesFreq[index], 180, 'sine');
                    setTimeout(() => btn.classList.remove('active'), 220);
                }
            }, i * 300);
        });

        setTimeout(() => {
            patternButtons.forEach(btn => btn.disabled = false);
            setHelperText('Your turn! Tap the notes in the same order');
        }, pattern.length * 340);
    }

    function checkSequence() {
        const expected = pattern[userSequence.length - 1];
        if (userSequence.length <= pattern.length) {
            if (expected !== undefined && userSequence[userSequence.length - 1] === expected) {
                if (userSequence.length === pattern.length) {
                    const feedback = document.getElementById('musicFeedback');
                    feedback.className = 'feedback success';
                    feedback.textContent = 'Great job! You matched the pattern!';
                    setHelperText('Awesome! You matched the pattern.');
                    _playTone(880, 220, 'sine');
                    setTimeout(generatePattern, 1000);
                }
            } else {
                const feedback = document.getElementById('musicFeedback');
                feedback.className = 'feedback error';
                feedback.textContent = 'Almost! Listen again and try the same pattern.';
                setHelperText('Almost! Try again.');
                _playTone(220, 180, 'sawtooth');
                setTimeout(playPattern, 800);
            }
        }
    }

    const keysContainer = document.getElementById('pianoKeys');
    keysContainer.innerHTML = '';

    const notesFreq = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25];
    notes.forEach((note, index) => {
        const key = document.createElement('button');
        key.type = 'button';
        key.className = 'piano-key';
        key.textContent = note;
        key.addEventListener('click', () => {
            _ensureAudioCtx();
            _playTone(notesFreq[index], 220, 'sine');
            key.classList.add('active');
            setTimeout(() => key.classList.remove('active'), 180);

            userSequence.push(index);
            notesPlayed++;
            document.getElementById('notesCount').textContent = notesPlayed;
            checkSequence();
        });
        keysContainer.appendChild(key);
    });

    document.getElementById('playPatternBtn').addEventListener('click', playPattern);
    document.getElementById('clearTuneBtn').addEventListener('click', () => {
        userSequence = [];
        notesPlayed = 0;
        document.getElementById('notesCount').textContent = notesPlayed;
        setHelperText('Pattern cleared');
    });

    generatePattern();
};

window.activities['draw-canvas'] = function() {
    const content = document.getElementById('activityContent');
    content.innerHTML = `
        <div class="game-card">
            <h2>🖌️ Magic Canvas</h2>
            <p>Choose a color and paint a cheerful picture on the canvas.</p>
            <div class="brush-row">
                <button class="brush-btn red" type="button" data-color="#ff5d8f">Red</button>
                <button class="brush-btn yellow" type="button" data-color="#ffd166">Yellow</button>
                <button class="brush-btn blue" type="button" data-color="#5ec8ff">Blue</button>
                <button class="brush-btn green" type="button" data-color="#70e089">Green</button>
            </div>
            <canvas id="paintCanvas" width="620" height="340" style="max-width:100%;border-radius:12px;background:#fff9ea"></canvas>
            <div style="margin-top:12px;">
                <button id="clearCanvas" class="mini-btn" type="button">Clear</button>
            </div>
            <div id="paintFeedback" class="feedback"></div>
        </div>
    `;

    const canvas = document.getElementById('paintCanvas');
    const ctx = canvas.getContext('2d');
    let currentColor = '#ff5d8f';

    ctx.fillStyle = '#fff9ea';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    document.querySelectorAll('.brush-btn').forEach(button => {
        button.addEventListener('click', () => {
            currentColor = button.dataset.color;
            document.querySelectorAll('.brush-btn').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            setHelperText('Brush chosen');
        });
    });

    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) * (canvas.width / rect.width);
        const y = (event.clientY - rect.top) * (canvas.height / rect.height);

        ctx.beginPath();
        ctx.fillStyle = currentColor;
        ctx.arc(x, y, 18, 0, Math.PI * 2);
        ctx.fill();

        _playTone(620, 90, 'triangle');
        const feedback = document.getElementById('paintFeedback');
        feedback.className = 'feedback success';
        feedback.textContent = 'Splash! Nice painting!';
    });

    document.getElementById('clearCanvas').addEventListener('click', () => {
        ctx.fillStyle = '#fff9ea';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setHelperText('Canvas cleared');
    });
};

window.activities['pattern-maker'] = function() {
    const content = document.getElementById('activityContent');
    content.innerHTML = `
        <div class="game-card">
            <h2>🎭 Pattern Maker</h2>
            <p>Follow the pattern in the same order.</p>
            <div class="challenge-box">
                <div class="target-swatch" style="background:#ff5d8f"></div>
                <div class="target-swatch" style="background:#ffd166"></div>
                <div class="target-swatch" style="background:#5ec8ff"></div>
                <div class="target-swatch" style="background:#70e089"></div>
            </div>
            <div class="pattern-grid" id="patternGrid"></div>
            <div id="patternFeedback" class="feedback"></div>
        </div>
    `;

    const grid = document.getElementById('patternGrid');
    const colors = ['#ff5d8f', '#ffd166', '#5ec8ff', '#70e089', '#b58cff'];

    for (let i = 0; i < 12; i++) {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'pattern-cell';
        cell.style.background = colors[i % colors.length];
        cell.addEventListener('click', () => {
            const currentColor = cell.style.background;
            const index = colors.indexOf(currentColor);
            const next = colors[(index + 1) % colors.length];
            cell.style.background = next;
            _playTone(600 + i * 20, 120, 'sine');
        });
        grid.appendChild(cell);
    }
};

window.activities['number-game'] = function() {
    const content = document.getElementById('activityContent');
    let round = 1;
    const maxRounds = 5;
    let score = 0;

    function renderRound() {
        const target = Math.floor(Math.random() * 10) + 1;
        content.innerHTML = `
            <div class="game-card">
                <h2>🎯 Number Jump</h2>
                <p>Round ${round}/${maxRounds} — tap the number <strong>${target}</strong>!</p>
                <div class="number-grid" id="numberGrid"></div>
                <div class="score-badge" style="margin-top:12px;">Score: <span id="gameScore">${score}</span></div>
                <div id="numberFeedback" class="feedback"></div>
            </div>
        `;

        const grid = document.getElementById('numberGrid');
        for (let n = 1; n <= 10; n++) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'number-btn';
            button.textContent = n;

            button.addEventListener('click', () => {
                if (button.disabled) return;

                if (Number(button.textContent) === target) {
                    button.classList.add('correct');
                    button.textContent = '✓';
                    button.disabled = true;
                    score += 10;
                    document.getElementById('gameScore').textContent = score;
                    setHelperText('Great job! You found the number!');
                    _playTone(880, 230, 'sine');

                    const feedback = document.getElementById('numberFeedback');
                    feedback.className = 'feedback success';
                    feedback.textContent = 'Correct! Great work!';

                    setTimeout(() => {
                        round++;
                        if (round <= maxRounds) {
                            renderRound();
                        } else {
                            content.innerHTML = `
                                <div class="game-card">
                                    <h2>🏆 You win!</h2>
                                    <p>You completed all rounds and scored <strong>${score}</strong> points.</p>
                                    <div class="score-badge">Final score: ${score}</div>
                                    <div style="margin-top: 12px;">
                                        <button id="playAgainBtn" class="cta-button" type="button">Play Again</button>
                                    </div>
                                </div>
                            `;
                            document.getElementById('playAgainBtn').addEventListener('click', () => {
                                round = 1;
                                score = 0;
                                renderRound();
                            });
                        }
                    }, 900);
                } else {
                    button.classList.add('wrong');
                    button.disabled = true;
                    _playTone(220, 160, 'sawtooth');
                    setHelperText('Try again!');
                    const feedback = document.getElementById('numberFeedback');
                    feedback.className = 'feedback error';
                    feedback.textContent = 'Not this one — try again!';
                    setTimeout(() => {
                        button.classList.remove('wrong');
                        button.disabled = false;
                    }, 450);
                }
            });

            grid.appendChild(button);
        }
    }

    renderRound();
};

window.activities['shape-sorter'] = function() {
    const content = document.getElementById('activityContent');
    const shapes = ['◯', '△', '◼', '★'];
    let collected = 0;

    content.innerHTML = `
        <div class="game-card">
            <h2>⬜ Shape Sorter</h2>
            <p>Tap each shape to collect it.</p>
            <div class="shape-row" id="shapeRow"></div>
            <div class="score-badge" style="margin-top:12px;">Collected: <span id="shapeCount">0</span></div>
            <div id="shapeFeedback" class="feedback"></div>
        </div>
    `;

    const shapeRow = document.getElementById('shapeRow');
    shapes.forEach((shape) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'shape-item';
        button.textContent = shape;

        button.addEventListener('click', () => {
            if (button.disabled) return;
            button.classList.add('selected-shape');
            collected++;
            document.getElementById('shapeCount').textContent = collected;
            _playTone(700 + collected * 40, 140, 'triangle');
            setHelperText('You collected a shape!');
            button.disabled = true;

            const feedback = document.getElementById('shapeFeedback');
            feedback.className = 'feedback success';
            feedback.textContent = collected === shapes.length ? 'You collected all the shapes! Great job!' : 'Nice! You found a shape!';
        });

        shapeRow.appendChild(button);
    });
};

window.activities['counting-game'] = function() {
    const content = document.getElementById('activityContent');
    const total = 5;
    let counted = 0;

    content.innerHTML = `
        <div class="game-card">
            <h2>🍎 Counting Game</h2>
            <p>Tap the apples to count them. You need to count all <strong>${total}</strong>.</p>
            <div class="apple-row" id="appleRow"></div>
            <div class="score-badge" style="margin-top:12px;">Counted: <span id="countedValue">0</span></div>
            <div id="countFeedback" class="feedback"></div>
        </div>
    `;

    const row = document.getElementById('appleRow');
    for (let i = 0; i < total; i++) {
        const apple = document.createElement('button');
        apple.type = 'button';
        apple.className = 'apple-item';
        apple.textContent = '🍏';

        apple.addEventListener('click', () => {
            if (apple.disabled) return;
            apple.classList.add('picked');
            counted++;
            document.getElementById('countedValue').textContent = counted;
            _playTone(520 + counted * 30, 120, 'sine');
            setHelperText('Counted one more apple!');

            const feedback = document.getElementById('countFeedback');
            feedback.className = 'feedback success';
            feedback.textContent = counted === total ? 'Excellent! You counted all the apples.' : 'Great counting!';

            apple.disabled = true;
        });
        row.appendChild(apple);
    }
};

window.activities['color-mixer'] = function() {
    const content = document.getElementById('activityContent');
    let round = 1;
    const maxRounds = 4;
    let score = 0;

    function render() {
        const targetColors = ['#b58cff', '#ffb86c', '#7fe7c1', '#6ec9ff', '#ffd166'];
        const targetColor = targetColors[Math.floor(Math.random() * targetColors.length)];
        const selected = [];

        content.innerHTML = `
            <div class="game-card">
                <h2>🎨 Color Mixer</h2>
                <p>Mix colors to match the target color.</p>
                <div class="challenge-box">
                    <div class="target-swatch" style="background:${targetColor};"></div>
                    <div>Match this color</div>
                </div>
                <div class="mix-row">
                    <button class="mix-color red" type="button" data-color="#ff5d8f">Red</button>
                    <button class="mix-color yellow" type="button" data-color="#ffd166">Yellow</button>
                    <button class="mix-color blue" type="button" data-color="#5ec8ff">Blue</button>
                    <button class="mix-color green" type="button" data-color="#70e089">Green</button>
                    <button class="mix-color purple" type="button" data-color="#b58cff">Purple</button>
                </div>
                <div style="margin-top:12px;">
                    <button class="mini-btn" id="mixBtn" type="button">Mix</button>
                    <button class="mini-btn" id="clearBtn" type="button">Clear</button>
                </div>
                <div id="mixResult" class="mix-result">Mix colors here!</div>
                <div id="mixFeedback" class="feedback"></div>
                <div class="score-badge" style="margin-top:12px;">Score: <span id="mixScore">${score}</span></div>
            </div>
        `;

        document.querySelectorAll('.mix-color').forEach((button) => {
            button.addEventListener('click', () => {
                if (button.classList.contains('picked')) {
                    button.classList.remove('picked');
                    const index = selected.indexOf(button.dataset.color);
                    if (index >= 0) selected.splice(index, 1);
              
