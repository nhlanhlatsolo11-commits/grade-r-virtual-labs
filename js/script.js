const gradeRApp = {
    audioCtx: null,
    musicLoop: null,
    musicNoteIndex: 0,
    musicEnabled: false,
    recognition: null,
    isListening: false,
    helperText: null,
};

window.gradeRApp = gradeRApp;

function setHelperText(message) {
    const helperText = document.getElementById('helperText');
    if (helperText) helperText.textContent = message;
}

function ensureAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!gradeRApp.audioCtx) {
        gradeRApp.audioCtx = new AudioContextClass();
    }
    if (gradeRApp.audioCtx.state === 'suspended') {
        gradeRApp.audioCtx.resume();
    }
    return gradeRApp.audioCtx;
}

function playTone(frequency = 440, duration = 0.2, type = 'triangle', volume = 0.08) {
    const ctx = ensureAudioContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
}

function playSuccessCue() {
    playTone(523.25, 0.16, 'triangle', 0.08);
    setTimeout(() => playTone(659.25, 0.16, 'triangle', 0.08), 120);
    setTimeout(() => playTone(783.99, 0.22, 'triangle', 0.08), 240);
}

function playBackgroundRhyme() {
    const ctx = ensureAudioContext();
    if (!ctx) return;

    const tune = [261.63, 261.63, 392.0, 392.0, 440.0, 440.0, 392.0, 349.23, 349.23, 329.63, 329.63, 293.66, 293.66, 261.63];

    gradeRApp.musicEnabled = true;
    const musicButton = document.getElementById('musicToggle');
    if (musicButton) {
        musicButton.textContent = '🎵 Pause rhyme';
    }
    setHelperText('The nursery rhyme is playing. Tap the cards and I will cheer you on!');

    if (gradeRApp.musicLoop) {
        clearInterval(gradeRApp.musicLoop);
    }

    gradeRApp.musicLoop = setInterval(() => {
        const note = tune[gradeRApp.musicNoteIndex % tune.length];
        playTone(note, 0.22, 'sine', 0.06);
        gradeRApp.musicNoteIndex += 1;
    }, 420);
}

function stopBackgroundRhyme() {
    if (gradeRApp.musicLoop) {
        clearInterval(gradeRApp.musicLoop);
        gradeRApp.musicLoop = null;
    }
    gradeRApp.musicEnabled = false;
    const musicButton = document.getElementById('musicToggle');
    if (musicButton) {
        musicButton.textContent = '🎵 Play rhyme';
    }
    setHelperText('The music is paused. Ready when you are!');
}

function speak(text, lang = 'en-ZA') {
    if (!('speechSynthesis' in window)) {
        setHelperText('Voice speech is not supported in this browser. You can still play and tap buttons.');
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.94;
    utterance.pitch = 1.15;
    utterance.onstart = () => setHelperText(text);
    utterance.onend = () => setHelperText('Great job! Ready for the next learning adventure.');
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
}

function handleVoiceCommand(command) {
    const text = command.toLowerCase();

    if (text.includes('play') || text.includes('music') || text.includes('sing')) {
        playBackgroundRhyme();
        speak('Let us sing a nursery rhyme together!');
        return;
    }

    if (text.includes('pause') || text.includes('stop')) {
        stopBackgroundRhyme();
        speak('Music paused. We can keep learning.');
        return;
    }

    if (text.includes('hello') || text.includes('hi')) {
        speak('Hello little learner! I am ready to help you learn.');
        return;
    }

    if (text.includes('science')) {
        navigateTo('science');
        speak('Science lab opened. Let us explore!');
        return;
    }

    if (text.includes('math')) {
        navigateTo('math');
        speak('Math lab opened. Time to count and play!');
        return;
    }

    if (text.includes('creative') || text.includes('art')) {
        navigateTo('creative');
        speak('Creative play opened. Let us paint and make music!');
        return;
    }

    if (text.includes('menu')) {
        navigateTo('menu');
        speak('Back to the menu. Choose your next adventure.');
        return;
    }

    if (text.includes('start') || text.includes('go')) {
        navigateTo('science');
        speak('Let us begin our science adventure!');
        return;
    }

    speak('I heard you. Please say play, pause, hello, science, math, creative, or menu.');
}

function bindVoiceRecognition() {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
        const voiceToggle = document.getElementById('voiceToggle');
        if (voiceToggle) {
            voiceToggle.disabled = true;
            voiceToggle.title = 'Voice recognition is not supported in this browser.';
            voiceToggle.textContent = '🎤 Voice unavailable';
        }
        return;
    }

    const recognition = new SpeechRecognitionClass();
    recognition.lang = 'en-ZA';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setHelperText(`I heard: “${transcript}”`);
        handleVoiceCommand(transcript);
    };

    recognition.onend = () => {
        gradeRApp.isListening = false;
        const voiceToggle = document.getElementById('voiceToggle');
        if (voiceToggle) {
            voiceToggle.textContent = '🎤 Voice helper';
        }
    };

    recognition.onerror = () => {
        setHelperText('Voice recognition could not hear you. Try tapping the buttons or saying louder.');
        gradeRApp.isListening = false;
    };

    gradeRApp.recognition = recognition;
}

function initializeInteractiveHub() {
    const musicToggle = document.getElementById('musicToggle');
    const voiceToggle = document.getElementById('voiceToggle');
    const speakDemo = document.getElementById('speakDemo');

    if (musicToggle) {
        musicToggle.addEventListener('click', () => {
            if (gradeRApp.musicEnabled) {
                stopBackgroundRhyme();
            } else {
                playBackgroundRhyme();
            }
        });
    }

    if (voiceToggle) {
        voiceToggle.addEventListener('click', () => {
            if (!gradeRApp.recognition) {
                bindVoiceRecognition();
            }

            if (gradeRApp.recognition) {
                if (gradeRApp.isListening) {
                    gradeRApp.recognition.stop();
                    gradeRApp.isListening = false;
                    voiceToggle.textContent = '🎤 Voice helper';
                    setHelperText('Voice helper paused.');
                    return;
                }

                try {
                    gradeRApp.recognition.start();
                    gradeRApp.isListening = true;
                    voiceToggle.textContent = '🎤 Listening...';
                    setHelperText('I am listening. Try saying: play, pause, hello, math, science, or creative.');
                } catch (error) {
                    setHelperText('I am already listening. Please wait a moment.');
                }
            }
        });
    }

    if (speakDemo) {
        speakDemo.addEventListener('click', () => {
            speak('Hello little learner! Nice to see you. Tap a lab and we will learn together!');
        });
    }

    bindVoiceRecognition();
    setHelperText('Tap a lab and I will speak, cheer, and sing with you.');
}

window.addEventListener('load', () => {
    initializeInteractiveHub();
    setTimeout(() => {
        speak('Welcome to Grade R Virtual Labs! Choose a learning adventure.');
    }, 500);
});

window.gradeRApp.speak = speak;
window.gradeRApp.playSuccessCue = playSuccessCue;
window.gradeRApp.playBackgroundRhyme = playBackgroundRhyme;
window.gradeRApp.stopBackgroundRhyme = stopBackgroundRhyme;
