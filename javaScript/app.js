// ===== MAIN APPLICATION =====

document.addEventListener('DOMContentLoaded', function() {

    // ===== DATE DISPLAY =====
    function updateDate() {
        const n = new Date();
        document.getElementById('dayNum').textContent = n.getDate();
        document.getElementById('dayName').textContent = n.toLocaleDateString(undefined, { weekday: 'long' });
        document.getElementById('monthYear').textContent = n.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
    }
    updateDate();

    // ===== EVENT LISTENERS =====
    document.getElementById('addBtn').addEventListener('click', addTask);

    document.getElementById('taskInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            addTask();
        }
    });

    document.getElementById('clearBtn').addEventListener('click', function() {
        if (confirm('Clear all completed tasks?')) {
            tasks = tasks.filter(x => !x.done);
            saveTasks();
            render();
        }
    });

    // Focus Timer
    document.getElementById('focusStart').addEventListener('click', startFocus);
    document.getElementById('focusPause').addEventListener('click', pauseFocus);
    document.getElementById('focusReset').addEventListener('click', resetFocus);
    document.getElementById('setTimerBtn').addEventListener('click', setCustomFocus);

    document.querySelectorAll('#focusBox .presets button').forEach(function(b) {
        b.addEventListener('click', function() {
            setFocusPreset(parseInt(this.dataset.mins));
        });
    });

    // Custom timer input - Enter key
    document.getElementById('customMins').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault();
            setCustomFocus(); }
    });
    document.getElementById('customSecs').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault();
            setCustomFocus(); }
    });

    // Work Hours
    document.getElementById('workStart').addEventListener('click', startWork);
    document.getElementById('workStop').addEventListener('click', stopWork);
    document.getElementById('workReset').addEventListener('click', resetWork);

    // Modal
    document.getElementById('modalClose').addEventListener('click', function() {
        document.getElementById('historyModal').classList.remove('show');
    });

    document.getElementById('historyModal').addEventListener('click', function(e) {
        if (e.target === this) this.classList.remove('show');
    });

    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

        if (e.key === ' ' || e.key === 'Space') {
            e.preventDefault();
            focusRunning ? pauseFocus() : startFocus();
        }

        if (e.key === 'r' || e.key === 'R') {
            e.preventDefault();
            resetFocus();
        }

        if ((e.ctrlKey || e.metaKey) && (e.key === 'w' || e.key === 'W')) {
            e.preventDefault();
            workRunning ? stopWork() : startWork();
        }

        if (e.key === 'Escape') {
            document.getElementById('historyModal').classList.remove('show');
        }
    });

    // ===== INIT =====
    document.getElementById('dueInput').value = todayISO();
    loadTasks();
    loadWork();
    updateFocusDisplay();

    // Check date change every minute
    setInterval(function() {
        const today = todayISO();
        const saved = localStorage.getItem('ledger:dateCheck');
        if (saved && saved !== today) {
            workSecs = 0;
            updateWorkDisplay();
            saveWork();
        }
        localStorage.setItem('ledger:dateCheck', today);
    }, 60000);

    // Update date display
    setInterval(updateDate, 60000);

});