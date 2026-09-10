window.activities = {};

// ============================================
// SCIENCE LAB ACTIVITIES
// ============================================

window.activities['color-mixer'] = function() {
    const content = document.getElementById('activityContent');
    content.innerHTML = `
        <div class="color-mixer-container">
            <h2>🎨 Color Mixer</h2>
            <p>Click on two colors to mix them and see what new color you create!</p>
            
            <div class="color-boxes">
                <div class="color-box" style="background: #FF0000;" onclick="mixColors('red')"></div>
                <div class="color-box" style="background: #FFFF00;" onclick="mixColors('yellow')"></div>
                <div class="color-box" style="background: #0000FF;" onclick="mixColors('blue')"></div>
            </div>
            
            <div class="result-box" id="resultBox" style="background: #cccccc;">
                Mix colors!
            </div>
            
            <button class="cta-button" onclick="resetMixer()">Reset</button>
        </div>
    `;
    
    let selectedColors = [];
    
    window.mixColors = function(color) {
        selectedColors.push(color);
        
        if (selectedColors.length === 2) {
            const resultBox = document.getElementById('resultBox');
            let mixed = mixColor(selectedColors[0], selectedColors[1]);
            resultBox.style.background = mixed.color;
            resultBox.textContent = mixed.name;
            selectedColors = [];
            
            setTimeout(() => {
                resultBox.style.background = '#cccccc';
                resultBox.textContent = 'Mix colors!';
            }, 2000);
        }
    };
    
    window.resetMixer = function() {
        selectedColors = [];
        document.getElementById('resultBox').style.background = '#cccccc';
        document.getElementById('resultBox').textContent = 'Mix colors!';
    };
};

function mixColor(color1, color2) {
    const combinations = {
        'red-yellow': { color: '#FFA500', name: 'Orange' },
        'yellow-red': { color: '#FFA500', name: 'Orange' },
        'red-blue': { color: '#800080', name: 'Purple' },
        'blue-red': { color: '#800080', name: 'Purple' },
        'yellow-blue': { color: '#008000', name: 'Green' },
        'blue-yellow': { color: '#008000', name: 'Green' },
        'red-red': { color: '#FF0000', name: 'Red' },
        'yellow-yellow': { color: '#FFFF00', name: 'Yellow' },
        'blue-blue': { color: '#0000FF', name: 'Blue' }
    };
    
    return combinations[`${color1}-${color2}`] || { color: '#cccccc', name: 'Mix colors!' };
}

window.activities['floating-test'] = function() {
    const content = document.getElementById('activityContent');
    content.innerHTML = `
        <div class="floating-test-container">
            <h2>⛵ Floating & Sinking Test</h2>
            <p>Click on objects to drop them in water. See if they float or sink!</p>
            
            <div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center;">
                <div class="object-item" onclick="testFloating('ball', '⚽')">⚽ Ball</div>
                <div class="object-item" onclick="testFloating('rock', '🪨')">🪨 Rock</div>
                <div class="object-item" onclick="testFloating('apple', '🍎')">🍎 Apple</div>
                <div class="object-item" onclick="testFloating('feather', '🪶')">🪶 Feather</div>
            </div>
            
            <div class="water-container" id="waterContainer"></div>
            <p id="result" style="font-size: 1.2em; font-weight: bold; color: var(--primary);"></p>
        </div>
    `;
    
    window.testFloating = function(object, emoji) {
        const container = document.getElementById('waterContainer');
        const result = document.getElementById('result');
        const floatingObjects = ['ball', 'apple', 'feather'];
        const floats = floatingObjects.includes(object);
        
        container.innerHTML = '';
        
        if (floats) {
            const floatingDiv = document.createElement('div');
            floatingDiv.className = 'floating-object';
            floatingDiv.textContent = emoji;
            floatingDiv.style.top = '50px';
            floatingDiv.style.left = Math.random() * 80 + '%';
            container.appendChild(floatingDiv);
            result.textContent = '🎉 It floats!';
            result.style.color = 'var(--success)';
        } else {
            const sinkingDiv = document.createElement('div');
            sinkingDiv.className = 'sinking-object';
            sinkingDiv.textContent = emoji;
            sinkingDiv.style.left = Math.random() * 80 + '%';
            container.appendChild(sinkingDiv);
            result.textContent = '⬇️ It sinks!';
            result.style.color = 'var(--danger)';
        }
    };
};

window.activities['magnet-game'] = function() {
    const content = document.getElementById('activityContent');
    content.innerHTML = `
        <div class="magnet-game-container">
            <h2>🧲 Magnet Explorer</h2>
            <p>Click on objects. Magnetic objects will be attracted to the magnet! ✨</p>
            
            <div class="magnet-area">
                <div class="magnet-item" style="background: linear-gradient(135deg, #FFD700, #FFA500); cursor: pointer;" onclick="testMagnet('coin', '🪙')">🪙 Coin</div>
                <div class="magnet-item" style="background: linear-gradient(135deg, #87CEEB, #87CEEB); cursor: pointer;" onclick="testMagnet('water', '💧')">💧 Water Drop</div>
                <div class="magnet-item" style="background: linear-gradient(135deg, #A9A9A9, #808080); cursor: pointer;" onclick="testMagnet('nail', '⚙️')">⚙️ Metal Nail</div>
                <div class="magnet-item" style="background: linear-gradient(135deg, #D2691E, #8B4513); cursor: pointer;" onclick="testMagnet('wood', '🪵')">🪵 Wood</div>
                <div class="magnet-item" style="background: linear-gradient(135deg, #FF69B4, #FF1493); cursor: pointer;" onclick="testMagnet('plastic', '🎀')">🎀 Plastic</div>
                <div class="magnet-item" style="background: linear-gradient(135deg, #00CED1, #00BFFF); cursor: pointer;" onclick="testMagnet('glass', '🔷')">🔷 Glass</div>
            </div>
            
            <div class="water-container" id="magnetContainer" style="background: linear-gradient(to bottom, #FFE4B5, #FFDAB9);"></div>
            <p id="magnetResult" style="font-size: 1.2em; font-weight: bold; text-align: center;"></p>
        </div>
    `;
    
    window.testMagnet = function(object, emoji) {
        const container = document.getElementById('magnetContainer');
        const result = document.getElementById('magnetResult');
        const magneticObjects = ['coin', 'nail'];
        const isMagnetic = magneticObjects.includes(object);
        
        container.innerHTML = '';
        
        if (isMagnetic) {
            const attractedDiv = document.createElement('div');
            attractedDiv.className = 'floating-object';
            attractedDiv.textContent = emoji;
            attractedDiv.style.top = '10px';
            attractedDiv.style.left = '50%';
            attractedDiv.style.animation = 'none';
            container.appendChild(attractedDiv);
            result.textContent = '✨ Magnetic! It sticks to the magnet!';
            result.style.color = 'var(--success)';
        } else {
            const notAttractedDiv = document.createElement('div');
            notAttractedDiv.className = 'sinking-object';
            notAttractedDiv.textContent = emoji;
            notAttractedDiv.style.left = Math.random() * 80 + '%';
            container.appendChild(notAttractedDiv);
            result.textContent = '❌ Not magnetic! It doesn\'t stick.';
            result.style.color = 'var(--danger)';
        }
    };
};

// ============================================
// MATH LAB ACTIVITIES
// ============================================

window.activities['number-game'] = function() {
    const content = document.getElementById('activityContent');
    content.innerHTML = `
        <div class="number-game-container">
            <h2>🎯 Number Jump Game</h2>
            <p>What number comes next?</p>
            
            <div class="number-display" id="numberDisplay">0</div>
            <div class="score">Score: <span id="score">0</span>/5</div>
            
            <div class="answer-buttons" id="answerButtons"></div>
            <div id="gameMessage"></div>
        </div>
    `;
    
    let score = 0;
    let questions = 0;
    let currentQuestion = null;
    
    function generateQuestion() {
        const number = Math.floor(Math.random() * 8) + 1;
        const nextNumber = number + 1;
        const options = [nextNumber];
        
        while (options.length < 4) {
            const random = Math.floor(Math.random() * 10) + 1;
            if (!options.includes(random)) {
                options.push(random);
            }
        }
        
        options.sort(() => Math.random() - 0.5);
        
        currentQuestion = { number, nextNumber, options };
        document.getElementById('numberDisplay').textContent = number;
        
        const buttonsDiv = document.getElementById('answerButtons');
        buttonsDiv.innerHTML = '';
        
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'number-btn';
            btn.textContent = opt;
            btn.onclick = () => checkAnswer(opt);
            buttonsDiv.appendChild(btn);
        });
    }
    
    function checkAnswer(answer) {
        const message = document.getElementById('gameMessage');
        questions++;
        
        if (answer === currentQuestion.nextNumber) {
            score++;
            message.innerHTML = '<div class="message success">🎉 Correct! Great job!</div>';
        } else {
            message.innerHTML = `<div class="message error">❌ Not quite! The correct answer is ${currentQuestion.nextNumber}</div>`;
        }
        
        document.getElementById('score').textContent = score;
        
        if (questions < 5) {
            setTimeout(generateQuestion, 2000);
        } else {
            message.innerHTML = `<div class="message success">🏆 Game Over! You got ${score} out of 5!</div>`;
            document.getElementById('answerButtons').innerHTML = '';
        }
    }
    
    generateQuestion();
};

window.activities['shape-sorter'] = function() {
    const content = document.getElementById('activityContent');
    content.innerHTML = `
        <div class="shape-sorter-container">
            <h2>⬜ Shape Sorter</h2>
            <p>Click on shapes to sort them by color and type!</p>
            
            <div>
                <h3>Shapes to Sort:</h3>
                <div class="shapes-area" id="shapesArea"></div>
            </div>
            
            <div>
                <h3>📍 Red Shapes</h3>
                <div class="shape-bin" id="redBin"></div>
            </div>
            
            <div>
                <h3>💙 Blue Shapes</h3>
                <div class="shape-bin" id="blueBin"></div>
            </div>
            
            <div>
                <h3>💛 Yellow Shapes</h3>
                <div class="shape-bin" id="yellowBin"></div>
            </div>
            
            <div id="sortingMessage" style="text-align: center; margin-top: 20px;"></div>
        </div>
    `;
    
    const shapes = [
        { shape: '🔴', color: 'red', label: 'Red Circle' },
        { shape: '🔵', color: 'blue', label: 'Blue Circle' },
        { shape: '🟨', color: 'yellow', label: 'Yellow Square' },
        { shape: '🟥', color: 'red', label: 'Red Square' },
        { shape: '🟦', color: 'blue', label: 'Blue Square' },
        { shape: '🟪', color: 'purple', label: 'Purple Circle' }
    ];
    
    const shapesArea = document.getElementById('shapesArea');
    shapes.forEach((item, index) => {
        const shapeDiv = document.createElement('div');
        shapeDiv.className = 'shape';
        shapeDiv.textContent = item.shape;
        shapeDiv.onclick = () => sortShape(item.color, index, shapeDiv);
        shapesArea.appendChild(shapeDiv);
    });
    
    let sortedCount = 0;
    
    window.sortShape = function(color, index, element) {
        const bins = { red: 'redBin', blue: 'blueBin', yellow: 'yellowBin' };
        
        if (bins[color]) {
            const bin = document.getElementById(bins[color]);
            bin.appendChild(element);
            element.onclick = null;
            element.style.cursor = 'default';
            sortedCount++;
            
            const message = document.getElementById('sortingMessage');
            if (sortedCount === shapes.length) {
                message.innerHTML = '<div class="message success">🎉 Perfect! All shapes sorted!</div>';
            }
        }
    };
};

window.activities['counting-game'] = function() {
    const content = document.getElementById('activityContent');
    content.innerHTML = `
        <div class="counting-game-container">
            <h2>🍎 Counting Game</h2>
            <p>Count the fruits and type the number!</p>
            
            <div class="number-display" id="countQuestion">How many?</div>
            <div class="objects-display" id="objectsDisplay"></div>
            
            <div style="margin: 20px 0;">
                <input type="number" class="counting-input" id="countInput" placeholder="Enter number" min="0" max="10">
                <button class="cta-button" onclick="checkCount()">Check Answer</button>
            </div>
            
            <div id="countMessage"></div>
            <div class="score" id="countScore">Score: 0/5</div>
        </div>
    `;
    
    let score = 0;
    let questions = 0;
    let currentCount = 0;
    
    function generateQuestion() {
        const count = Math.floor(Math.random() * 8) + 1;
        currentCount = count;
        const fruit = ['🍎', '🍊', '🍌', '🍓', '🍇'][Math.floor(Math.random() * 5)];
        
        const display = document.getElementById('objectsDisplay');
        display.innerHTML = '';
        
        for (let i = 0; i < count; i++) {
            const fruitDiv = document.createElement('div');
            fruitDiv.className = 'fruit';
            fruitDiv.textContent = fruit;
            display.appendChild(fruitDiv);
        }
        
        document.getElementById('countInput').value = '';
    }
    
    window.checkCount = function() {
        const input = parseInt(document.getElementById('countInput').value);
        const message = document.getElementById('countMessage');
        questions++;
        
        if (input === currentCount) {
            score++;
            message.innerHTML = '<div class="message success">🎉 Correct! Great counting!</div>';
        } else {
            message.innerHTML = `<div class="message error">❌ Not quite! The answer was ${currentCount}</div>`;
        }
        
        document.getElementById('countScore').textContent = `Score: ${score}/${Math.min(questions, 5)}`;
        
        if (questions < 5) {
            setTimeout(generateQuestion, 2000);
        } else {
            message.innerHTML = `<div class="message success">🏆 Game Over! You got ${score} out of 5!</div>`;
        }
    };
    
    generateQuestion();
};

// ============================================
// CREATIVE LAB ACTIVITIES
// ============================================

window.activities['draw-canvas'] = function() {
    const content = document.getElementById('activityContent');
    content.innerHTML = `
        <div class="draw-container">
            <h2>🖌️ Magic Canvas</h2>
            <p>Draw whatever you want! Choose a color and paint.</p>
            
            <div class="color-palette" id="colorPalette">
                <div class="color-option" style="background: #000000;" onclick="selectColor('#000000')"></div>
                <div class="color-option" style="background: #FF0000;" onclick="selectColor('#FF0000')"></div>
                <div class="color-option" style="background: #00FF00;" onclick="selectColor('#00FF00')"></div>
                <div class="color-option" style="background: #0000FF;" onclick="selectColor('#0000FF')"></div>
                <div class="color-option" style="background: #FFFF00;" onclick="selectColor('#FFFF00')"></div>
                <div class="color-option" style="background: #FF00FF;" onclick="selectColor('#FF00FF')"></div>
                <div class="color-option" style="background: #00FFFF;" onclick="selectColor('#00FFFF')"></div>
                <div class="color-option" style="background: #FFA500;" onclick="selectColor('#FFA500')"></div>
            </div>
            
            <canvas id="drawingCanvas" class="canvas" width="600" height="400"></canvas>
            
            <div class="canvas-controls">
                <button class="canvas-btn" onclick="clearCanvas()">Clear Canvas</button>
                <button class="canvas-btn" onclick="downloadCanvas()">Download Drawing</button>
            </div>
        </div>
    `;
    
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let currentColor = '#000000';
    let brushSize = 5;
    
    // Mark first color as selected
    document.querySelector('.color-option').classList.add('selected');
    
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.stroke();
    });
    
    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
        ctx.closePath();
    });
    
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        ctx.beginPath();
        ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
    });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.stroke();
    });
    
    canvas.addEventListener('touchend', () => {
        isDrawing = false;
        ctx.closePath();
    });
    
    window.selectColor = function(color) {
        currentColor = color;
        document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
        event.target.classList.add('selected');
    };
    
    window.clearCanvas = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    
    window.downloadCanvas = function() {
        const link = document.createElement('a');
        link.download = 'my-drawing.png';
        link.href = canvas.toDataURL();
        link.click();
    };
};

window.activities['pattern-maker'] = function() {
    const content = document.getElementById('activityContent');
    content.innerHTML = `
        <div class="pattern-maker-container">
            <h2>🎭 Pattern Maker</h2>
            <p>Click on cells to create beautiful patterns!</p>
            
            <div class="pattern-colors" id="patternColors">
                <div class="color-option" style="background: #FF0000;" onclick="setPatternColor('#FF0000')"></div>
                <div class="color-option" style="background: #00FF00;" onclick="setPatternColor('#00FF00')"></div>
                <div class="color-option" style="background: #0000FF;" onclick="setPatternColor('#0000FF')"></div>
                <div class="color-option" style="background: #FFFF00;" onclick="setPatternColor('#FFFF00')"></div>
                <div class="color-option" style="background: #FF00FF;" onclick="setPatternColor('#FF00FF')"></div>
                <div class="color-option" style="background: #00FFFF;" onclick="setPatternColor('#00FFFF')"></div>
            </div>
            
            <div class="pattern-grid" id="patternGrid"></div>
            
            <button class="cta-button" onclick="resetPattern()">Clear Pattern</button>
        </div>
    `;
    
    let currentPatternColor = '#FF0000';
    const grid = document.getElementById('patternGrid');
    
    // Mark first color as selected
    document.querySelector('.color-option').classList.add('selected');
    
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.className = 'pattern-cell';
        cell.onclick = () => {
            cell.style.background = currentPatternColor;
        };
        grid.appendChild(cell);
    }
    
    window.setPatternColor = function(color) {
        currentPatternColor = color;
        document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
        event.target.classList.add('selected');
    };
    
    window.resetPattern = function() {
        document.querySelectorAll('.pattern-cell').forEach(cell => {
            cell.style.background = 'var(--light)';
        });
    };
};

window.activities['music-maker'] = function() {
    const content = document.getElementById('activityContent');
    content.innerHTML = `
        <div class="music-maker-container">
            <h2>🎵 Music Maker</h2>
            <p>Click on the keys to play different sounds!</p>
            
            <div class="piano-keys" id="pianoKeys"></div>
            <div class="score">Notes played: <span id="notesCount">0</span></div>
        </div>
    `;
    
    const notes = [
        { key: 'C', freq: 261.63, label: 'C' },
        { key: 'D', freq: 293.66, label: 'D' },
        { key: 'E', freq: 329.63, label: 'E' },
        { key: 'F', freq: 349.23, label: 'F' },
        { key: 'G', freq: 392.00, label: 'G' },
        { key: 'A', freq: 440.00, label: 'A' },
        { key: 'B', freq: 493.88, label: 'B' },
        { key: 'C2', freq: 523.25, label: 'C' }
    ];
    
    let notesPlayed = 0;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const keysContainer = document.getElementById('pianoKeys');
    
    notes.forEach((note, index) => {
        const key = document.createElement('button');
        key.className = 'piano-key';
        key.textContent = note.label;
        key.onclick = () => playNote(note.freq, index);
        keysContainer.appendChild(key);
    });
    
    function playNote(frequency, keyIndex) {
        const key = document.querySelectorAll('.piano-key')[keyIndex];
        key.style.transform = 'translateY(10px)';
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        
        notesPlayed++;
        document.getElementById('notesCount').textContent = notesPlayed;
        
        setTimeout(() => {
            key.style.transform = 'translateY(0)';
        }, 100);
    }
};