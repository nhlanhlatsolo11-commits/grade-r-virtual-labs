# 🇿🇦 Grade R Virtual Labs (Launch-ready)

> Interactive STEM learning platform for South African Grade R students - making early childhood education engaging, accessible, and fun.

This branch contains the launch-ready interactive experience with voice prompts, background nursery-rhyme-inspired audio, and improved child-friendly polish.

Live demo (after merging to main and publishing on GitHub Pages):
https://nhlanhlatsolo11-commits.github.io/grade-r-virtual-labs/

## ✅ Polished additions

- Microphone consent modal (explicit ask, local-only use)
- Caption/text transcript area for TTS speech
- Download ZIP button (links to this feature branch archive)
- Improved accessibility hints and larger touch targets
- Parental/teacher controls: Play/Pause music, Voice helper toggle
- Small audio cues for correct answers

## 📥 How to download the app (zip)

You can download a ready-to-run ZIP of this branch (includes all static files) using this link:

https://github.com/nhlanhlatsolo11-commits/grade-r-virtual-labs/archive/refs/heads/feature/interactive-launch-ready.zip

After merge to main, the official downloadable release will be available at:

https://github.com/nhlanhlatsolo11-commits/grade-r-virtual-labs/archive/refs/heads/main.zip

## 🚀 Deploy to GitHub Pages

1. Open a Pull Request from `feature/interactive-launch-ready` into `main`.
2. Once reviewed, merge the PR.
3. GitHub Pages is already configured for this repo — the site will be rebuilt and published from `main`.

If you want, I can prepare the PR description and checklist.

## 🔒 Privacy & security notes

- Voice recognition uses the browser's built-in SpeechRecognition (where available).
- Microphone access is requested only after explicit consent and is only used locally in the browser — no audio is sent to external servers.
- SpeechSynthesis (TTS) is used for spoken prompts and captions.

## 📱 Running locally

```bash
git clone https://github.com/nhlanhlatsolo11-commits/grade-r-virtual-labs.git
git checkout feature/interactive-launch-ready
python -m http.server 8000
# Open http://localhost:8000
```

## Next steps I can help with

- Draft and open the Pull Request to merge into main and deploy.
- Create a release and attach a ZIP for users to download directly from Releases.
- Add more nursery rhyme tracks (uploaded audio files) and a playlist UI.
- Add translations (Zulu, Xhosa, Sotho) for TTS prompts and captions.

