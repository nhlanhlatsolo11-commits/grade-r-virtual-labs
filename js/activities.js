function visualPlayNote(keyIndex, keyElement) {
    keyElement.classList.add('active');

    const freqs = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        window._audioCtx = window._audioCtx || new AudioCtx();
        const ctx = window._audioCtx;

        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = freqs[keyIndex % freqs.length];
        o.connect(g);
        g.connect(ctx.destination);

        g.gain.setValueAtTime(0.001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.01);
        o.start();
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
        o.stop(ctx.currentTime + 0.25);
    } catch (e) {
        // audio ignored if unsupported
    }

    notesPlayed++;
    const notesEl = document.getElementById('notesCount');
    if (notesEl) {
        notesEl.textContent = notesPlayed;
        notesEl.classList.add('pulse');
        setTimeout(() => notesEl.classList.remove('pulse'), 200);
    }

    setTimeout(() => {
        keyElement.classList.remove('active');
    }, 180);
}
