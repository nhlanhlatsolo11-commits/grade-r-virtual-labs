function showAudioOverlay() {
    const overlay = document.getElementById('audioOverlay');
    if (overlay) overlay.classList.remove('hidden');
}

function hideAudioOverlay() {
    const overlay = document.getElementById('audioOverlay');
    if (overlay) overlay.classList.add('hidden');
}

function unlockAudioOnFirstGesture() {
    function initOnce() {
        try {
            ensureAudioContext();
            playTone(880, 0.06, 'sine', 0.06);
            if ('speechSynthesis' in window) {
                const u = new SpeechSynthesisUtterance('Sound ready!');
                u.lang = 'en-ZA';
                u.volume = 0.9;
                speechSynthesis.cancel();
                speechSynthesis.speak(u);
            }
            hideAudioOverlay();
        } catch (e) {
            console.log('Audio/TTS unlock error', e);
        }
        document.removeEventListener('pointerdown', initOnce);
        document.removeEventListener('touchstart', initOnce);
        document.removeEventListener('keydown', initOnce);
    }

    const enableButton = document.getElementById('enableAudioBtn');
    if (enableButton) {
        enableButton.addEventListener('click', initOnce);
    }

    document.addEventListener('pointerdown', initOnce, { once: true });
    document.addEventListener('touchstart', initOnce, { once: true });
    document.addEventListener('keydown', initOnce, { once: true });
}

function initializeInteractiveHub() {
    const musicToggle = document.getElementById('musicToggle');
    const voiceToggle = document.getElementById('voiceToggle');
    const speakDemo = document.getElementById('speakDemo');
    const downloadZip = document.getElementById('downloadZip');

    unlockAudioOnFirstGesture();

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
            if (!gradeRApp.micConsent) {
                requestMicConsentFlow();
                return;
            }

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

    if (downloadZip) {
        downloadZip.addEventListener('click', () => {
            const zipUrl = 'https://github.com/nhlanhlatsolo11-commits/grade-r-virtual-labs/archive/refs/heads/feature/interactive-launch-ready.zip';
            window.open(zipUrl, '_blank');
        });
    }

    bindVoiceRecognition();
    setHelperText('Tap a lab and I will speak, cheer, and sing with you.');
}

window.addEventListener('load', () => {
    initializeInteractiveHub();
    showAudioOverlay();
    setTimeout(() => {
        speak('Welcome to Grade R Virtual Labs! Choose a learning adventure.');
    }, 500);
});
