window.activities = window.activities || {};

// small helper for audio: create/resume AudioContext and play tones
function _ensureAudioCtx() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!window._audioCtx) window._audioCtx = new AudioCtx();
    if (window._audioCtx.state === 'suspended' && typeof window._audioCtx.resume === 'function') {
      window._audioCtx.resume();
    }
    return window._audioCtx;
  } catch (e) {
    return null;
  }
}

function _playTone(freq, duration = 220, type = 'sine') {
  const ctx = _ensureAudioCtx();
  if (!ctx) return;
  try {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    o.connect(g);
    g.connect(ctx.destination);
    const now = ctx.currentTime;
    g.gain.setValueAtTime(0.001, now);
    g.gain.exponentialRampToValueAtTime(0.18, now + 0.01);
    o.start(now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration / 1000);
    o.stop(now + duration / 1000 + 0.02);
  } catch (e) {
    // ignore audio errors
  }
}

// ----- MUSIC MAKER (visual + audio) -----
window.activities['music-maker'] = function() {
  const content = document.getElementById('activityContent');
  content.innerHTML = `
    <div class="music-maker-container">
      <h2>🎵 Music Maker</h2>
      <p>Tap keys to make a tune. Try a short melody!</p>
      <div class="piano-keys" id="pianoKeys"></div>
      <div class="score">Notes played: <span id="notesCount">0</span></div>
      <div style="margin-top:12px"><button class="mini-btn" id="clearTune" type="button">Clear</button></div>
    </div>
  `;

  const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
  let notesPlayed = 0;
  const keysContainer = document.getElementById('pianoKeys');
  keysContainer.innerHTML = '';

  // build keys large for touch
  notes.forEach((freq, i) => {
    const key = document.createElement('button');
    key.className = 'piano-key';
    key.type = 'button';
    key.textContent = ['C','D','E','F','G','A','B','C'][i];
    key.addEventListener('click', () => {
      // resume audio context on first user gesture
      _ensureAudioCtx();
      visualPlayNote(i, key, freq);
    });
    keysContainer.appendChild(key);
  });

  document.getElementById('clearTune').addEventListener('click', () => {
    notesPlayed = 0;
    const el = document.getElementById('notesCount');
    if (el) el.textContent = notesPlayed;
    setHelperText('Tune cleared');
  });

  function visualPlayNote(keyIndex, keyElement, freq) {
    keyElement.classList.add('active');
    _playTone(freq, 220, 'sine');

    notesPlayed++;
    const notesEl = document.getElementById('notesCount');
    if (notesEl) {
      notesEl.textContent = notesPlayed;
      notesEl.classList.add('pulse');
      setTimeout(() => notesEl.classList.remove('pulse'), 200);
    }

    setTimeout(() => keyElement.classList.remove('active'), 180);
  }
};

// ----- DRAW CANVAS (improvements) -----
window.activities['draw-canvas'] = function() {
  const content = document.getElementById('activityContent');
  content.innerHTML = `
    <div class="canvas-play">
      <h2>🖌️ Magic Canvas</h2>
      <p>Pick a brush then tap to paint. Try making a pattern!</p>
      <div class="brush-row">
        <button class="brush-btn red" type="button" data-color="#ff5d8f">Red</button>
        <button class="brush-btn yellow" type="button" data-color="#ffd166">Yellow</button>
        <button class="brush-btn blue" type="button" data-color="#5ec8ff">Blue</button>
        <button class="brush-btn green" type="button" data-color="#70e089">Green</button>
      </div>
      <canvas id="paintCanvas" width="640" height="360" style="max-width:100%;border-radius:12px;background:#fff9ea"></canvas>
      <div style="margin-top:10px"><button class="mini-btn" id="clearCanvas">Clear</button></div>
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
      setHelperText('Brush selected');
    });
  });

  canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);
    ctx.beginPath();
    ctx.fillStyle = currentColor;
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
    _playTone(600, 100, 'triangle'); // gentle sound on paint
  });

  document.getElementById('clearCanvas').addEventListener('click', () => {
    ctx.fillStyle = '#fff9ea';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHelperText('Canvas cleared');
  });
};

// ----- PATTERN MAKER (unchanged but better layout) -----
window.activities['pattern-maker'] = function() {
  const content = document.getElementById('activityContent');
  content.innerHTML = `
    <div class="pattern-maker">
      <h2>🎭 Pattern Maker</h2>
      <p>Tap cells to change colors and create a pattern. Try repeating sequences!</p>
      <div class="pattern-grid" id="patternGrid"></div>
    </div>
  `;
  const grid = document.getElementById('patternGrid');
  grid.innerHTML = '';
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
      _playTone(800 + (i * 10), 80, 'sine');
    });
    cell.style.background = colors[i % colors.length];
    grid.appendChild(cell);
  }
};

// ----- NUMBER GAME with progression, scoring, feedback -----
window.activities['number-game'] = function() {
  const content = document.getElementById('activityContent');
  let round = 1;
  const maxRounds = 5;
  let score = 0;

  function renderRound() {
    const target = Math.floor(Math.random() * 10) + 1;
    content.innerHTML = `
      <div class="number-game">
        <h2>🎯 Number Jump</h2>
        <p id="roundPrompt">Round ${round} / ${maxRounds} — Tap the number <strong>${target}</strong>!</p>
        <div class="number-grid" id="numberGrid"></div>
        <div style="margin-top:12px">Score: <span id="gameScore">${score}</span></div>
      </div>
    `;

    const grid = document.getElementById('numberGrid');
    grid.innerHTML = '';

    for (let n = 1; n <= 10; n++) {
      const b = document.createElement('button');
      b.className = 'number-btn';
      b.type = 'button';
      b.textContent = n;
      b.addEventListener('click', () => handlePick(n, target, b));
      grid.appendChild(b);
    }

    function handlePick(value, targetValue, buttonEl) {
      // prevent double clicks
      if (buttonEl.disabled) return;
      if (value === targetValue) {
        buttonEl.classList.add('correct');
        buttonEl.textContent = '✓';
        _playTone(880, 220, 'sine');
        score += 10;
        setHelperText('Great job! You found the number!');
        document.getElementById('gameScore').textContent = score;
        // next round after short delay
        setTimeout(() => {
          round++;
          if (round <= maxRounds) renderRound();
          else showResults();
        }, 900);
      } else {
        buttonEl.classList.add('wrong');
        _playTone(220, 180, 'sawtooth');
        setHelperText('Try again!');
        buttonEl.disabled = true;
        setTimeout(() => buttonEl.classList.remove('wrong'), 400);
      }
    }
  }

  function showResults() {
    content.innerHTML = `
      <div class="number-game-results">
        <h2>🏆 Well done!</h2>
        <p>You scored <strong>${score}</strong> points</p>
        <div style="margin-top:12px"><button class="cta-button" id="playAgain">Play Again</button></div>
      </div>
    `;
    document.getElementById('playAgain').addEventListener('click', () => {
      round = 1; score = 0; renderRound();
    });
  }

  renderRound();
};

// ----- SHAPE SORTER (small improvement) -----
window.activities['shape-sorter'] = function() {
  const content = document.getElementById('activityContent');
  content.innerHTML = `
    <div class="shape-sorter">
      <h2>⬜ Shape Sorter</h2>
      <p>Tap the shapes to collect them. Tap all to finish the round.</p>
      <div class="shape-row" id="shapeRow"></div>
      <div style="margin-top:12px">Collected: <span id="collected">0</span></div>
    </div>
  `;

  const row = document.getElementById('shapeRow');
  row.innerHTML = '';
  const shapes = ['◯','◼','△','★'];
  let collected = 0;
  shapes.forEach((s) => {
    const btn = document.createElement('button');
    btn.className = 'shape-item';
    btn.type = 'button';
    btn.textContent = s;
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      btn.classList.add('selected-shape');
      collected++;
      document.getElementById('collected').textContent = collected;
      _playTone(700 + collected * 40, 120, 'triangle');
      btn.disabled = true;
      setTimeout(() => btn.classList.remove('selected-shape'), 300);
      if (collected === shapes.length) {
        setHelperText('You collected all shapes! Great!');
      }
    });
    row.appendChild(btn);
  });
};

// ----- COUNTING GAME (improve scoring and disable) -----
window.activities['counting-game'] = function() {
  const content = document.getElementById('activityContent');
  const total = 5;
  let counted = 0;
  content.innerHTML = `
    <div class="counting-game">
      <h2>🍎 Counting Game</h2>
      <p>Tap the apples to count them: <strong>${total}</strong></p>
      <div class="apple-row" id="appleRow"></div>
      <div style="margin-top:12px">Counted: <span id="counted">0</span></div>
    </div>
  `;

  const row = document.getElementById('appleRow');
  row.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const apple = document.createElement('button');
    apple.type = 'button';
    apple.className = 'apple-item';
    apple.textContent = '🍏';
    apple.addEventListener('click', () => {
      if (apple.disabled) return;
      apple.classList.add('picked');
      counted++;
      document.getElementById('counted').textContent = counted;
      setHelperText('Counted one more apple!');
      _playTone(520 + counted * 30, 120, 'sine');
      apple.disabled = true;
      if (counted === total) {
        setTimeout(() => setHelperText('Great counting!'), 500);
      }
    });
    row.appendChild(apple);
  }
};

// ----- COLOR MIXER & FLOATING & MAGNET (keep interactive + feedback) -----
window.activities['color-mixer'] = function() {
  const content = document.getElementById('activityContent');
  content.innerHTML = `
    <div class="color-mixer">
      <h2>🎨 Color Mixer</h2>
      <p>Tap colors to mix a new shade</p>
      <div class="mix-row">
        <button class="mix-color red" type="button" data-color="#ff5d8f">Red</button>
        <button class="mix-color yellow" type="button" data-color="#ffd166">Yellow</button>
        <button class="mix-color blue" type="button" data-color="#5ec8ff">Blue</button>
      </div>
      <div id="mixResult" class="mix-result">Mix colors here!</div>
    </div>
  `;
  const result = document.getElementById('mixResult');
  document.querySelectorAll('.mix-color').forEach(button => {
    button.addEventListener('click', () => {
      const color = button.dataset.color;
      result.style.background = color;
      result.textContent = 'Beautiful color!';
      setHelperText('You made a new color!');
      _playTone(720, 120, 'sine');
    });
  });
};

window.activities['floating-test'] = function() {
  const content = document.getElementById('activityContent');
  content.innerHTML = `
    <div class="floating-game">
      <h2>⛵ Floating & Sinking</h2>
      <p>Tap the objects to explore what floats and what sinks.</p>
      <div class="float-row" id="floatRow"></div>
    </div>
  `;
  const items = ['🪙','💧','🪵','⚙️'];
  const row = document.getElementById('floatRow');
  row.innerHTML = '';
  items.forEach((it, idx) => {
    const b = document.createElement('button');
    b.className = 'float-item';
    b.type = 'button';
    b.textContent = it;
    b.addEventListener('click', () => {
      b.classList.add('float-selected');
      _playTone(420 + idx * 40, 120, 'triangle');
      setTimeout(() => b.classList.remove('float-selected'), 300);
      setHelperText('Nice thinking!');
    });
    row.appendChild(b);
  });
};

window.activities['magnet-game'] = function() {
  const content = document.getElementById('activityContent');
  content.innerHTML = `
    <div class="magnet-game-container">
      <h2>🧲 Magnet Explorer</h2>
      <p>Tap an object - does it stick to the magnet?</p>
      <div class="magnet-area" id="magnetArea"></div>
      <div id="magnetResult" style="margin-top:10px;font-weight:700;text-align:center"></div>
    </div>
  `;
  const area = document.getElementById('magnetArea');
  area.innerHTML = '';
  const items = [
    { id: 'coin', label: '🪙 Coin', mag: true },
    { id: 'water', label: '💧 Water', mag: false },
    { id: 'nail', label: '⚙️ Nail', mag: true },
    { id: 'wood', label: '🪵 Wood', mag: false },
    { id: 'plastic', label: '🎀 Plastic', mag: false },
    { id: 'glass', label: '🔷 Glass', mag: false }
  ];
  items.forEach(it => {
    const d = document.createElement('div');
    d.className = 'magnet-item';
    d.textContent = it.label;
    d.style.cursor = 'pointer';
    d.addEventListener('click', () => {
      const res = document.getElementById('magnetResult');
      if (it.mag) {
        res.textContent = '✨ Magnetic! It sticks to the magnet!';
        res.style.color = 'var(--success)';
        _playTone(900, 200, 'sine');
      } else {
        res.textContent = '❌ Not magnetic! It does not stick.';
        res.style.color = 'var(--danger)';
        _playTone(240, 160, 'sawtooth');
      }
    });
    area.appendChild(d);
  });
};
