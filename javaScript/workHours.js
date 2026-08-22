// ===== WORK HOURS TRACKER - STRAW HAT LEDGER =====

const WORK_HOURS_KEY = 'ledger:workhours';
let workSeconds = 0;
let workInterval = null;
let workRunning = false;
let workStartTime = null;

// ===== LOAD WORK HOURS =====
function loadWorkHours() {
    try {
        const data = localStorage.getItem(WORK_HOURS_KEY);
        if (data) {
            const parsed = JSON.parse(data);
            const today = todayISO();
            if (parsed.date === today) {
                workSeconds = parsed.seconds || 0;
            } else {
                // New day - reset work hours
                workSeconds = 0;
                localStorage.removeItem(WORK_HOURS_KEY);
            }
        }
    } catch (e) {
        workSeconds = 0;
    }
    updateWorkDisplay();
}

// ===== SAVE WORK HOURS =====
function saveWorkHours() {
    try {
        localStorage.setItem(WORK_HOURS_KEY, JSON.stringify({
            date: todayISO(),
            seconds: workSeconds
        }));
    } catch (e) {
        console.error('Error saving work hours:', e);
    }
}

// ===== UPDATE WORK HOURS DISPLAY =====
function updateWorkDisplay() {
    const hours = Math.floor(workSeconds / 3600);
    const mins = Math.floor((workSeconds % 3600) / 60);
    const secs = workSeconds % 60;
    document.getElementById('workHoursDisplay').textContent = 
        String(hours).padStart(2, '0') + ':' + 
        String(mins).padStart(2, '0') + ':' + 
        String(secs).padStart(2, '0');
}

// ===== START WORK =====
function startWork() {
    if (workRunning) {
        // If already running, show feedback
        const startBtn = document.getElementById('startWorkBtn');
        startBtn.textContent = '▶ Running...';
        setTimeout(() => {
            startBtn.textContent = '▶ Start Work';
        }, 1000);
        return;
    }
    
    workRunning = true;
    workStartTime = Date.now() - (workSeconds * 1000);
    
    document.getElementById('startWorkBtn').style.display = 'none';
    document.getElementById('stopWorkBtn').style.display = 'inline-block';
    
    // Add visual feedback
    const hoursBox = document.querySelector('.hours-box');
    hoursBox.style.borderColor = 'var(--olive)';
    hoursBox.style.boxShadow = '0 0 30px rgba(107, 142, 90, 0.15)';
    
    // Add pulse animation to the timer
    const display = document.getElementById('workHoursDisplay');
    display.style.transition = 'all 0.3s ease';
    display.style.color = 'var(--olive-light)';
    
    workInterval = setInterval(() => {
        const now = Date.now();
        workSeconds = Math.floor((now - workStartTime) / 1000);
        updateWorkDisplay();
        
        // Auto-save every 10 seconds
        if (workSeconds % 10 === 0) {
            saveWorkHours();
        }
    }, 1000);
}

// ===== STOP WORK =====
function stopWork() {
    if (!workRunning) {
        // If not running, show feedback
        const stopBtn = document.getElementById('stopWorkBtn');
        stopBtn.textContent = '⏹ Not running';
        setTimeout(() => {
            stopBtn.textContent = '⏹ Stop';
        }, 1000);
        return;
    }
    
    workRunning = false;
    clearInterval(workInterval);
    workInterval = null;
    
    document.getElementById('startWorkBtn').style.display = 'inline-block';
    document.getElementById('stopWorkBtn').style.display = 'none';
    
    // Remove visual feedback
    const hoursBox = document.querySelector('.hours-box');
    hoursBox.style.borderColor = '';
    hoursBox.style.boxShadow = '';
    
    const display = document.getElementById('workHoursDisplay');
    display.style.color = '';
    
    // Save final time
    saveWorkHours();
    
    // Show success feedback
    const startBtn = document.getElementById('startWorkBtn');
    startBtn.textContent = '✅ Saved!';
    setTimeout(() => {
        startBtn.textContent = '▶ Start Work';
    }, 1500);
}

// ===== RESET WORK HOURS =====
function resetWorkHours() {
    // Stop the timer if running
    if (workRunning) {
        workRunning = false;
        clearInterval(workInterval);
        workInterval = null;
        
        document.getElementById('startWorkBtn').style.display = 'inline-block';
        document.getElementById('stopWorkBtn').style.display = 'none';
        
        // Remove visual feedback
        const hoursBox = document.querySelector('.hours-box');
        hoursBox.style.borderColor = '';
        hoursBox.style.boxShadow = '';
        
        const display = document.getElementById('workHoursDisplay');
        display.style.color = '';
    }
    
    // Show confirmation dialog
    const resetBtn = document.getElementById('resetHoursBtn');
    resetBtn.textContent = '⚠️ Confirm?';
    resetBtn.style.background = 'var(--luffy-red)';
    
    // If user confirms, reset
    const confirmReset = function() {
        workSeconds = 0;
        updateWorkDisplay();
        saveWorkHours();
        
        resetBtn.textContent = '✓ Reset!';
        resetBtn.style.background = '';
        setTimeout(() => {
            resetBtn.textContent = '↺ Reset';
            resetBtn.style.background = '';
        }, 1500);
        
        // Remove event listener after confirmation
        resetBtn.removeEventListener('click', confirmReset);
    };
    
    // Add temporary click handler for confirmation
    resetBtn.addEventListener('click', confirmReset);
    
    // Auto-cancel after 3 seconds if not confirmed
    setTimeout(() => {
        if (resetBtn.textContent === '⚠️ Confirm?') {
            resetBtn.textContent = '↺ Reset';
            resetBtn.style.background = '';
            resetBtn.removeEventListener('click', confirmReset);
        }
    }, 3000);
}

// ===== GET WORK HOURS SUMMARY =====
function getWorkHoursSummary() {
    const hours = Math.floor(workSeconds / 3600);
    const mins = Math.floor((workSeconds % 3600) / 60);
    const secs = workSeconds % 60;
    
    if (hours > 0) {
        return hours + 'h ' + mins + 'm';
    } else if (mins > 0) {
        return mins + 'm ' + secs + 's';
    } else {
        return secs + 's';
    }
}

// ===== CHECK FOR DATE CHANGE =====
function checkWorkDateChange() {
    const today = todayISO();
    const saved = localStorage.getItem('ledger:workDate');
    if (saved && saved !== today) {
        // Reset work hours for new day
        workSeconds = 0;
        updateWorkDisplay();
        saveWorkHours();
    }
    localStorage.setItem('ledger:workDate', today);
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
    // Ctrl+W to toggle work timer (only when not in input fields)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'w' || e.key === 'W')) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'SELECT') {
            e.preventDefault();
            if (workRunning) {
                stopWork();
            } else {
                startWork();
            }
        }
    }
});

// ===== INITIALIZE WORK HOURS =====
document.addEventListener('DOMContentLoaded', function() {
    // Check for date change
    checkWorkDateChange();
    
    // Load work hours
    loadWorkHours();
    
    // Update display every minute to keep time accurate
    setInterval(() => {
        if (workRunning) {
            const now = Date.now();
            workSeconds = Math.floor((now - workStartTime) / 1000);
            updateWorkDisplay();
        }
    }, 10000); // Update every 10 seconds
});

// ===== EXPORT FUNCTIONS FOR GLOBAL ACCESS =====
window.loadWorkHours = loadWorkHours;
window.saveWorkHours = saveWorkHours;
window.updateWorkDisplay = updateWorkDisplay;
window.startWork = startWork;
window.stopWork = stopWork;
window.resetWorkHours = resetWorkHours;
window.getWorkHoursSummary = getWorkHoursSummary;
window.checkWorkDateChange = checkWorkDateChange;