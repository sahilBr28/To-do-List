// ===== MAIN APPLICATION - STRAW HAT LEDGER =====

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== DATE DISPLAY =====
    function updateDate() {
        const now = new Date();
        document.getElementById('dateDay').textContent = now.getDate();
        document.getElementById('dateDetail').textContent = 
            now.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
        document.getElementById('dateDayName').textContent = 
            now.toLocaleDateString(undefined, { weekday: 'long' });
    }
    
    // ===== CHECK FOR DATE CHANGE =====
    function checkDateChange() {
        const today = todayISO();
        const saved = localStorage.getItem('ledger:lastDate');
        if (saved && saved !== today) {
            // Reset work hours for new day
            workSeconds = 0;
            updateWorkDisplay();
            saveWorkHours();
        }
        localStorage.setItem('ledger:lastDate', today);
    }
    
    // ===== SET DEFAULT DUE DATE =====
    function setDefaultDueDate() {
        document.getElementById('dueInput').value = todayISO();
    }
    
    // ===== EVENT LISTENERS =====
    
    // Add Task Button
    document.getElementById('addBtn').addEventListener('click', addTask);
    
    // Task Input - Enter key
    document.getElementById('taskInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            addTask();
        }
    });
    
    // Timer Controls
    document.getElementById('timerStart').addEventListener('click', startTimer);
    document.getElementById('timerPause').addEventListener('click', pauseTimer);
    document.getElementById('timerReset').addEventListener('click', resetTimer);
    
    // Work Hours Controls
    document.getElementById('startWorkBtn').addEventListener('click', startWork);
    document.getElementById('stopWorkBtn').addEventListener('click', stopWork);
    document.getElementById('resetHoursBtn').addEventListener('click', resetWorkHours);
    
    // Modal Controls
    document.getElementById('modalClose').addEventListener('click', function() {
        document.getElementById('historyModal').classList.remove('active');
    });
    
    document.getElementById('historyModal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
    
    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', function(e) {
        // Escape key to close modal
        if (e.key === 'Escape') {
            document.getElementById('historyModal').classList.remove('active');
        }
        
        // Ctrl+Enter to add task
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            const input = document.getElementById('taskInput');
            if (document.activeElement === input) {
                e.preventDefault();
                addTask();
            }
        }
    });
    
    // ===== TASK LIST CLICK HANDLING (Event Delegation) =====
    document.addEventListener('click', function(e) {
        // Handle checkbox clicks
        const checkbox = e.target.closest('.task-check');
        if (checkbox) {
            const id = checkbox.dataset.id;
            if (id) {
                toggleTask(id);
            }
        }
        
        // Handle delete button clicks
        const deleteBtn = e.target.closest('.task-delete');
        if (deleteBtn) {
            const id = deleteBtn.dataset.id;
            if (id) {
                deleteTask(id);
            }
        }
        
        // Handle completed task clicks (show history)
        const taskItem = e.target.closest('.task-item.completed');
        if (taskItem && !e.target.closest('.task-delete') && !e.target.closest('.task-check')) {
            const id = taskItem.querySelector('.task-check')?.dataset.id;
            if (id) {
                showHistory(id);
            }
        }
    });
    
    // ===== AUTO-SAVE WORK HOURS ON PAGE UNLOAD =====
    window.addEventListener('beforeunload', function() {
        if (workRunning) {
            saveWorkHours();
        }
    });
    
    // ===== INITIALIZATION =====
    function init() {
        updateDate();
        checkDateChange();
        loadWorkHours();
        updateTimerDisplay();
        loadTasks();
        setDefaultDueDate();
        
        // Update date every minute
        setInterval(updateDate, 60000);
        
        // Check for date change every 30 seconds
        setInterval(checkDateChange, 30000);
        
        // Log startup message
        console.log('🏴‍☠️ Straw Hat Ledger initialized successfully!');
        console.log('📅 Today:', todayISO());
        console.log('📋 Total Tasks:', tasks.length);
        console.log('⏱️ Work Hours:', workSeconds + ' seconds');
    }
    
    // Start the application
    init();
});