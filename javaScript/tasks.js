// ===== TASK MANAGEMENT - STRAW HAT LEDGER =====

const STORAGE_KEY = 'ledger:tasks';
let tasks = [];

// ===== LOAD TASKS =====
function loadTasks() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        tasks = data ? JSON.parse(data) : [];
    } catch (e) {
        tasks = [];
    }
    render();
}

// ===== SAVE TASKS =====
function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
        console.error('Error saving tasks:', e);
    }
}

// ===== ADD TASK =====
function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    
    if (!text) {
        input.focus();
        input.style.borderColor = 'var(--luffy-red)';
        setTimeout(() => {
            input.style.borderColor = '';
        }, 2000);
        return;
    }
    
    const priority = document.getElementById('prioritySelect').value;
    const due = document.getElementById('dueInput').value || todayISO();
    
    const newTask = {
        id: uid(),
        text: text,
        priority: priority,
        due: due,
        done: false,
        createdAt: new Date().toISOString(),
        doneAt: null,
        completedIn: null
    };
    
    tasks.unshift(newTask);
    
    input.value = '';
    document.getElementById('dueInput').value = todayISO();
    
    saveTasks();
    render();
    
    // Show success feedback
    const addBtn = document.getElementById('addBtn');
    const originalText = addBtn.textContent;
    addBtn.textContent = '✅ Added!';
    setTimeout(() => {
        addBtn.textContent = originalText;
    }, 1500);
}

// ===== TOGGLE TASK (Complete/Uncomplete) =====
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    if (!task.done) {
        // Mark as complete
        task.done = true;
        task.doneAt = new Date().toISOString();
        
        // Calculate time taken from creation to completion
        const created = new Date(task.createdAt);
        const done = new Date(task.doneAt);
        task.completedIn = Math.floor((done - created) / 1000);
        
        // Animate completion
        const taskElement = document.querySelector(`.task-item .task-check[data-id="${id}"]`)?.closest('.task-item');
        if (taskElement) {
            taskElement.style.transition = 'all 0.3s ease';
            taskElement.style.transform = 'scale(0.95)';
            setTimeout(() => {
                taskElement.style.transform = 'scale(1)';
            }, 300);
        }
    } else {
        // Unmark as complete
        task.done = false;
        task.doneAt = null;
        task.completedIn = null;
    }
    
    saveTasks();
    render();
}

// ===== DELETE TASK =====
function deleteTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    // Animate deletion
    const taskElement = document.querySelector(`.task-item .task-delete[data-id="${id}"]`)?.closest('.task-item');
    if (taskElement) {
        taskElement.style.transition = 'all 0.3s ease';
        taskElement.style.transform = 'translateX(100%)';
        taskElement.style.opacity = '0';
        setTimeout(() => {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            render();
        }, 300);
        return;
    }
    
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    render();
}

// ===== SHOW TASK HISTORY =====
function showHistory(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.done) return;
    
    const modal = document.getElementById('historyModal');
    const content = document.getElementById('historyContent');
    
    const addedDate = formatDateForDisplay(task.createdAt);
    const addedTime = formatTimeForDisplay(task.createdAt);
    const completedDate = task.doneAt ? formatDateForDisplay(task.doneAt) : 'N/A';
    const completedTime = task.doneAt ? formatTimeForDisplay(task.doneAt) : 'N/A';
    
    const priorityEmoji = task.priority === 'high' ? '🔥' : task.priority === 'low' ? '🍃' : '⚖️';
    const priorityText = task.priority === 'high' ? 'High' : task.priority === 'low' ? 'Low' : 'Medium';
    
    content.innerHTML = `
        <div class="history-item">
            <div class="history-label">📝 Task</div>
            <div class="history-value">${escapeHtml(task.text)}</div>
        </div>
        <div class="history-item">
            <div class="history-label">📅 Added On</div>
            <div class="history-value">${addedDate} at ${addedTime}</div>
        </div>
        <div class="history-item">
            <div class="history-label">✅ Completed On</div>
            <div class="history-value">${completedDate} at ${completedTime}</div>
        </div>
        <div class="history-item">
            <div class="history-label">⏱️ Time Taken</div>
            <div class="history-value"><span class="highlight-time">${task.completedIn ? formatDuration(task.completedIn) : 'N/A'}</span></div>
        </div>
        <div class="history-item">
            <div class="history-label">⚖️ Priority</div>
            <div class="history-value">${priorityEmoji} ${priorityText}</div>
        </div>
    `;
    
    modal.classList.add('active');
    
    // Animate modal opening
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.animation = 'none';
    setTimeout(() => {
        modalContent.style.animation = 'modalIn 0.3s ease';
    }, 10);
}

// ===== RENDER TASKS =====
function render() {
    const today = todayISO();
    const pendingList = document.getElementById('pendingList');
    const completedList = document.getElementById('completedList');
    
    // Filter tasks
    const pending = tasks.filter(t => !t.done);
    const completed = tasks.filter(t => t.done);
    
    // Sort pending tasks
    pending.sort((a, b) => {
        // Overdue tasks first
        const aOverdue = a.due < today;
        const bOverdue = b.due < today;
        if (aOverdue && !bOverdue) return -1;
        if (!aOverdue && bOverdue) return 1;
        // Then by due date
        if (a.due !== b.due) return a.due.localeCompare(b.due);
        // Then by priority
        const priorityOrder = { high: 0, med: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    // Sort completed tasks (most recent first)
    completed.sort((a, b) => (b.doneAt || '').localeCompare(a.doneAt || ''));
    
    // Render Pending Tasks
    if (pending.length === 0) {
        pendingList.innerHTML = `
            <div class="empty-message">
                <span class="empty-icon">🏴‍☠️</span>
                No pending bounties!<br>
                <span style="font-size: 12px; color: var(--text-faint);">Add a new task above to get started</span>
            </div>
        `;
    } else {
        pendingList.innerHTML = pending.map(task => {
            const isOverdue = task.due < today;
            return `
            <div class="task-item priority-${task.priority} ${isOverdue ? 'overdue' : ''}" data-id="${task.id}">
                <div class="task-check" data-id="${task.id}">✓</div>
                <div class="task-info">
                    <div class="task-text">${escapeHtml(task.text)}</div>
                    <div class="task-meta">
                        <span>📅 ${formatDateForDisplay(task.due)}</span>
                        <span>${task.priority === 'high' ? '🔥 High' : task.priority === 'low' ? '🍃 Low' : '⚖️ Medium'}</span>
                        ${isOverdue ? '<span style="color: var(--luffy-red);">⚠️ Overdue</span>' : ''}
                    </div>
                </div>
                <button class="task-delete" data-id="${task.id}" title="Delete task">✕</button>
            </div>
        `}).join('');
    }
    
    // Render Completed Tasks
    if (completed.length === 0) {
        completedList.innerHTML = `
            <div class="empty-message">
                <span class="empty-icon">🎯</span>
                No bounties collected yet!<br>
                <span style="font-size: 12px; color: var(--text-faint);">Complete tasks to see them here</span>
            </div>
        `;
    } else {
        completedList.innerHTML = completed.map(task => `
            <div class="task-item completed priority-${task.priority}" data-id="${task.id}">
                <div class="task-check done" data-id="${task.id}">✓</div>
                <div class="task-info">
                    <div class="task-text done-text">${escapeHtml(task.text)}</div>
                    <div class="task-meta">
                        <span>✅ ${formatDateForDisplay(task.doneAt)}</span>
                        <span>⏱️ ${task.completedIn ? formatDuration(task.completedIn) : 'N/A'}</span>
                    </div>
                </div>
                <button class="task-delete" data-id="${task.id}" title="Delete task">✕</button>
            </div>
        `).join('');
    }
    
    // Update counters
    document.getElementById('pendingCount').textContent = pending.length;
    document.getElementById('completedCount').textContent = completed.length;
    
    // Update statistics
    updateStats();
}

// ===== UPDATE STATISTICS =====
function updateStats() {
    const today = todayISO();
    const openCount = tasks.filter(t => !t.done).length;
    const doneToday = tasks.filter(t => t.done && t.doneAt && t.doneAt.slice(0, 10) === today).length;
    const overdueCount = tasks.filter(t => !t.done && t.due < today).length;
    
    const totalToday = tasks.filter(t => t.due <= today).length;
    const completedToday = tasks.filter(t => t.done && t.doneAt && t.doneAt.slice(0, 10) === today).length;
    const pct = totalToday === 0 ? 0 : Math.round((completedToday / totalToday) * 100);
    
    // Update stat displays
    document.getElementById('statOpen').textContent = openCount;
    document.getElementById('statDoneToday').textContent = doneToday;
    document.getElementById('statOverdue').textContent = overdueCount;
    document.getElementById('statPct').textContent = pct + '%';
}

// ===== CLEAR ALL COMPLETED TASKS =====
function clearCompletedTasks() {
    const completed = tasks.filter(t => t.done);
    if (completed.length === 0) return;
    
    if (confirm(`Are you sure you want to clear all ${completed.length} completed tasks?`)) {
        tasks = tasks.filter(t => !t.done);
        saveTasks();
        render();
    }
}

// ===== EXPORT FUNCTIONS FOR GLOBAL ACCESS =====
// These functions need to be available globally for onclick handlers in HTML
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;
window.showHistory = showHistory;
window.addTask = addTask;
window.clearCompletedTasks = clearCompletedTasks;