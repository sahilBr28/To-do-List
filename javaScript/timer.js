// ===== FOCUS TIMER =====

let focusSeconds = 25 * 60;
let focusTotal = 25 * 60;
let focusRunning = false;
let focusInterval = null;

function updateFocusDisplay() {
    const m = Math.floor(focusSeconds / 60);
    const s = focusSeconds % 60;
    document.getElementById('focusDisplay').textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

function startFocus() {
    if (focusRunning) return;
    if (focusSeconds <= 0) { resetFocus(); return; }
    focusRunning = true;
    document.getElementById('focusBox').classList.add('running');
    document.getElementById('focusStart').style.display = 'none';
    document.getElementById('focusPause').style.display = 'inline-block';
    focusInterval = setInterval(() => {
        focusSeconds--;
        updateFocusDisplay();
        if (focusSeconds <= 0) {
            focusSeconds = 0;
            clearInterval(focusInterval);
            focusRunning = false;
            document.getElementById('focusStart').style.display = 'inline-block';
            document.getElementById('focusPause').style.display = 'none';
            document.getElementById('focusBox').classList.remove('running');
            // Flash
            const box = document.querySelector('#focusBox');
            box.style.borderColor = '#d4a017';
            setTimeout(() => box.style.borderColor = '', 2000);
        }
    }, 1000);
}

function pauseFocus() {
    if (!focusRunning) return;
    focusRunning = false;
    clearInterval(focusInterval);
    document.getElementById('focusStart').style.display = 'inline-block';
    document.getElementById('focusPause').style.display = 'none';
    document.getElementById('focusBox').classList.remove('running');
}

function resetFocus() {
    pauseFocus();
    focusSeconds = focusTotal;
    updateFocusDisplay();
    document.querySelector('#focusBox').style.borderColor = '';
}

function setFocusPreset(mins) {
    pauseFocus();
    focusTotal = mins * 60;
    focusSeconds = focusTotal;
    updateFocusDisplay();
    document.querySelectorAll('#focusBox .presets button').forEach(b => b.classList.remove('active'));
    document.querySelector(`#focusBox .presets button[data-mins="${mins}"]`)?.classList.add('active');
    document.querySelector('#focusBox').style.borderColor = '';
}

function setCustomFocus() {
    const m = parseInt(document.getElementById('customMins').value) || 0;
    const s = parseInt(document.getElementById('customSecs').value) || 0;
    const total = (m * 60) + s;
    if (total <= 0) return;
    pauseFocus();
    focusTotal = total;
    focusSeconds = total;
    updateFocusDisplay();
    document.querySelectorAll('#focusBox .presets button').forEach(b => b.classList.remove('active'));
    document.querySelector('#focusBox').style.borderColor = '';
}

// Make functions globally available
window.startFocus = startFocus;
window.pauseFocus = pauseFocus;
window.resetFocus = resetFocus;
window.setFocusPreset = setFocusPreset;
window.setCustomFocus = setCustomFocus;
window.updateFocusDisplay = updateFocusDisplay;