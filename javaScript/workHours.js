// ===== WORK HOURS TRACKER =====

const WORK_KEY = 'ledger:work';
let workSecs = 0;
let workRunning = false;
let workInterval = null;
let workStart = null;

function loadWork() {
    try {
        const d = localStorage.getItem(WORK_KEY);
        if (d) {
            const p = JSON.parse(d);
            if (p.date === todayISO()) workSecs = p.seconds || 0;
            else workSecs = 0;
        }
    } catch { workSecs = 0; }
    updateWorkDisplay();
}

function saveWork() {
    try { localStorage.setItem(WORK_KEY, JSON.stringify({ date: todayISO(), seconds: workSecs })); } catch {}
}

function updateWorkDisplay() {
    const h = Math.floor(workSecs / 3600);
    const m = Math.floor((workSecs % 3600) / 60);
    const s = workSecs % 60;
    document.getElementById('workDisplay').textContent = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    document.getElementById('workToday').textContent = h + 'h ' + m + 'm';
    document.getElementById('workTotal').textContent = h + 'h ' + m + 'm';
}

function startWork() {
    if (workRunning) return;
    workRunning = true;
    workStart = Date.now() - (workSecs * 1000);
    document.getElementById('workBox').classList.add('running');
    document.getElementById('workStart').style.display = 'none';
    document.getElementById('workStop').style.display = 'inline-block';
    workInterval = setInterval(() => {
        workSecs = Math.floor((Date.now() - workStart) / 1000);
        updateWorkDisplay();
        if (workSecs % 10 === 0) saveWork();
    }, 1000);
}

function stopWork() {
    if (!workRunning) return;
    workRunning = false;
    clearInterval(workInterval);
    document.getElementById('workBox').classList.remove('running');
    document.getElementById('workStart').style.display = 'inline-block';
    document.getElementById('workStop').style.display = 'none';
    saveWork();
}

function resetWork() {
    if (workRunning) stopWork();
    if (confirm('Reset today\'s hours?')) {
        workSecs = 0;
        updateWorkDisplay();
        saveWork();
    }
}

// Make functions globally available
window.loadWork = loadWork;
window.startWork = startWork;
window.stopWork = stopWork;
window.resetWork = resetWork;
window.updateWorkDisplay = updateWorkDisplay;