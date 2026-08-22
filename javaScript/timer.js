// ===== FOCUS TIMER - STRAW HAT LEDGER =====

// Timer variables
let timerInterval = null;
let timerSeconds = 25 * 60; // Default: 25 minutes
let timerRunning = false;
let timerTotal = 25 * 60; // Store original duration for reset
let timerPresets = [25, 5, 15, 45, 60]; // Minutes

// ===== UPDATE TIMER DISPLAY =====
function updateTimerDisplay() {
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    document.getElementById('timerDisplay').textContent = 
        String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
    
    // Update progress ring
    const fill = document.getElementById('timerFill');
    const pct = timerTotal === 0 ? 0 : (timerSeconds / timerTotal) * 100;
    fill.style.height = pct + '%';
}

// ===== START TIMER =====
function startTimer() {
    if (timerRunning) return;
    if (timerSeconds <= 0) {
        resetTimer();
        return;
    }
    
    timerRunning = true;
    const panel = document.getElementById('timerPanel');
    panel.classList.add('running');
    
    document.getElementById('timerStart').style.display = 'none';
    document.getElementById('timerPause').style.display = 'inline-block';
    
    timerInterval = setInterval(() => {
        timerSeconds--;
        updateTimerDisplay();
        
        // Timer completed
        if (timerSeconds <= 0) {
            timerSeconds = 0;
            clearInterval(timerInterval);
            timerRunning = false;
            
            document.getElementById('timerStart').style.display = 'inline-block';
            document.getElementById('timerPause').style.display = 'none';
            document.getElementById('timerPanel').classList.remove('running');
            
            // Flash effect
            const timerBox = document.querySelector('.timer-box');
            timerBox.style.borderColor = 'var(--gold)';
            timerBox.style.boxShadow = '0 0 40px rgba(212, 160, 23, 0.3)';
            
            // Play notification
            notifyTimerComplete();
            
            setTimeout(() => {
                timerBox.style.borderColor = '';
                timerBox.style.boxShadow = '';
            }, 3000);
            
            updateTimerDisplay();
        }
    }, 1000);
}

// ===== PAUSE TIMER =====
function pauseTimer() {
    if (!timerRunning) return;
    
    timerRunning = false;
    clearInterval(timerInterval);
    timerInterval = null;
    
    document.getElementById('timerStart').style.display = 'inline-block';
    document.getElementById('timerPause').style.display = 'none';
    document.getElementById('timerPanel').classList.remove('running');
}

// ===== RESET TIMER =====
function resetTimer() {
    pauseTimer();
    timerSeconds = timerTotal;
    updateTimerDisplay();
    document.querySelector('.timer-box').style.borderColor = '';
    document.querySelector('.timer-box').style.boxShadow = '';
    document.getElementById('timerPanel').classList.remove('running');
}

// ===== SET TIMER FROM PRESET =====
function setTimerPreset(minutes) {
    pauseTimer();
    timerTotal = minutes * 60;
    timerSeconds = timerTotal;
    updateTimerDisplay();
    document.querySelector('.timer-box').style.borderColor = '';
    document.querySelector('.timer-box').style.boxShadow = '';
    document.getElementById('timerPanel').classList.remove('running');
}

// ===== SET CUSTOM TIMER =====
function setCustomTimer() {
    const minsInput = document.getElementById('customMins');
    const secsInput = document.getElementById('customSecs');
    
    let mins = parseInt(minsInput.value) || 0;
    let secs = parseInt(secsInput.value) || 0;
    
    // Validate inputs
    if (mins < 0) mins = 0;
    if (mins > 180) mins = 180;
    if (secs < 0) secs = 0;
    if (secs > 59) secs = 59;
    
    const totalSeconds = (mins * 60) + secs;
    
    if (totalSeconds <= 0) {
        minsInput.value = '25';
        secsInput.value = '0';
        setTimerPreset(25);
        return;
    }
    
    pauseTimer();
    timerTotal = totalSeconds;
    timerSeconds = totalSeconds;
    updateTimerDisplay();
    document.querySelector('.timer-box').style.borderColor = '';
    document.querySelector('.timer-box').style.boxShadow = '';
    document.getElementById('timerPanel').classList.remove('running');
    
    // Update active preset buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show feedback
    const setBtn = document.getElementById('setBtn');
    setBtn.textContent = '✓ Set!';
    setTimeout(() => {
        setBtn.textContent = 'Set';
    }, 1500);
}

// ===== NOTIFICATION =====
function notifyTimerComplete() {
    // Try browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('⏰ Timer Complete!', {
            body: 'Your focus session has finished! 🎉',
            icon: '🏴‍☠️'
        });
    }
    
    // Play audio feedback (beep)
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.3;
        
        oscillator.start();
        setTimeout(() => {
            oscillator.stop();
        }, 300);
    } catch (e) {
        // Audio not supported, silent notification
        console.log('Timer complete!');
    }
    
    // Visual feedback on timer box
    const timerBox = document.querySelector('.timer-box');
    timerBox.style.transition = 'all 0.3s ease';
    timerBox.style.borderColor = 'var(--gold)';
    timerBox.style.boxShadow = '0 0 50px rgba(212, 160, 23, 0.2)';
    
    setTimeout(() => {
        timerBox.style.borderColor = '';
        timerBox.style.boxShadow = '';
    }, 3000);
}

// ===== REQUEST NOTIFICATION PERMISSION =====
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
    // Space to toggle timer
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        if (e.key === ' ' || e.key === 'Space') {
            e.preventDefault();
            if (timerRunning) {
                pauseTimer();
            } else {
                startTimer();
            }
        }
    }
    
    // 'R' key to reset timer
    if (e.key === 'r' || e.key === 'R') {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            resetTimer();
        }
    }
});

// ===== PRESET BUTTON HANDLING =====
document.addEventListener('DOMContentLoaded', function() {
    // Set up preset buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const mins = parseInt(this.dataset.mins, 10);
            setTimerPreset(mins);
        });
    });
    
    // Set up custom timer button
    document.getElementById('setBtn').addEventListener('click', setCustomTimer);
    
    // Enter key on custom inputs
    document.getElementById('customMins').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            setCustomTimer();
        }
    });
    
    document.getElementById('customSecs').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            setCustomTimer();
        }
    });
    
    // Request notification permission on load
    requestNotificationPermission();
    
    // Initial setup - set first preset as active
    const firstPreset = document.querySelector('.mode-btn');
    if (firstPreset) {
        firstPreset.classList.add('active');
        const mins = parseInt(firstPreset.dataset.mins, 10);
        timerTotal = mins * 60;
        timerSeconds = timerTotal;
        updateTimerDisplay();
    }
});

// ===== EXPORT FUNCTIONS FOR GLOBAL ACCESS =====
window.startTimer = startTimer;
window.pauseTimer = pauseTimer;
window.resetTimer = resetTimer;
window.setTimerPreset = setTimerPreset;
window.setCustomTimer = setCustomTimer;
window.updateTimerDisplay = updateTimerDisplay;