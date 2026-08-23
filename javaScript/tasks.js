// ===== TASK MANAGEMENT =====

const TASKS_KEY = 'ledger:tasks';
let tasks = [];

function loadTasks() {
    try {
        const d = localStorage.getItem(TASKS_KEY);
        tasks = d ? JSON.parse(d) : [];
    } catch { tasks = []; }
    render();
}

function saveTasks() {
    try { localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)); } catch {}
}

function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    if (!text) { input.focus(); return; }
    const priority = document.getElementById('prioritySelect').value;
    const due = document.getElementById('dueInput').value || todayISO();
    tasks.unshift({
        id: uid(),
        text,
        priority,
        due,
        done: false,
        createdAt: new Date().toISOString(),
        doneAt: null,
        completedIn: null
    });
    input.value = '';
    document.getElementById('dueInput').value = '';
    saveTasks();
    render();
}

function toggleTask(id) {
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    if (!t.done) {
        t.done = true;
        t.doneAt = new Date().toISOString();
        t.completedIn = Math.floor((new Date(t.doneAt) - new Date(t.createdAt)) / 1000);
    } else {
        t.done = false;
        t.doneAt = null;
        t.completedIn = null;
    }
    saveTasks();
    render();
}

function deleteTask(id) {
    tasks = tasks.filter(x => x.id !== id);
    saveTasks();
    render();
}

function showHistory(id) {
    const t = tasks.find(x => x.id === id);
    if (!t || !t.done) return;
    document.getElementById('historyContent').innerHTML = `
        <div class="row"><div class="label">Task</div><div class="value">${esc(t.text)}</div></div>
        <div class="row"><div class="label">Added</div><div class="value">${fmtDate(t.createdAt)} at ${fmtTime(t.createdAt)}</div></div>
        <div class="row"><div class="label">Completed</div><div class="value">${fmtDate(t.doneAt)} at ${fmtTime(t.doneAt)}</div></div>
        <div class="row"><div class="label">Time Taken</div><div class="value">${t.completedIn ? fmtDur(t.completedIn) : 'N/A'}</div></div>
        <div class="row"><div class="label">Priority</div><div class="value">${t.priority === 'high' ? '🔥 High' : t.priority === 'low' ? '🍃 Low' : '⚖️ Medium'}</div></div>
    `;
    document.getElementById('historyModal').classList.add('show');
}

function render() {
    const today = todayISO();
    const pending = tasks.filter(x => !x.done);
    const completed = tasks.filter(x => x.done);

    pending.sort((a, b) => {
        if (a.due < today && b.due >= today) return -1;
        if (a.due >= today && b.due < today) return 1;
        return a.due.localeCompare(b.due);
    });
    completed.sort((a, b) => (b.doneAt || '').localeCompare(a.doneAt || ''));

    const pList = document.getElementById('pendingList');
    if (!pending.length) {
        pList.innerHTML = `<div class="empty-state"><span>🏴‍☠️</span>Nothing pending</div>`;
    } else {
        pList.innerHTML = pending.map(t => `
            <div class="task-item priority-${t.priority}">
                <div class="check" onclick="toggleTask('${t.id}')">✓</div>
                <div class="info">
                    <div class="text">${esc(t.text)}</div>
                    <div class="meta">
                        <span>📅 ${fmtDate(t.due)}</span>
                        <span>${t.priority === 'high' ? '🔥 High' : t.priority === 'low' ? '🍃 Low' : '⚖️ Medium'}</span>
                        ${t.due < today ? '<span class="overdue">⚠️ Overdue</span>' : ''}
                    </div>
                </div>
                <button class="del" onclick="deleteTask('${t.id}')">✕</button>
            </div>
        `).join('');
    }

    const cList = document.getElementById('completedList');
    if (!completed.length) {
        cList.innerHTML = `<div class="empty-state"><span>🎯</span>Nothing completed</div>`;
    } else {
        cList.innerHTML = completed.map(t => `
            <div class="task-item completed priority-${t.priority}" onclick="showHistory('${t.id}')">
                <div class="check done" onclick="event.stopPropagation(); toggleTask('${t.id}')">✓</div>
                <div class="info">
                    <div class="text done-text">${esc(t.text)}</div>
                    <div class="meta">
                        <span>✅ ${fmtDate(t.doneAt)}</span>
                        <span>⏱️ ${t.completedIn ? fmtDur(t.completedIn) : 'N/A'}</span>
                    </div>
                </div>
                <button class="del" onclick="event.stopPropagation(); deleteTask('${t.id}')">✕</button>
            </div>
        `).join('');
    }

    document.getElementById('pendingCount').textContent = pending.length;
    document.getElementById('completedCount').textContent = completed.length;

    // Stats
    const open = tasks.filter(x => !x.done).length;
    const doneToday = tasks.filter(x => x.done && x.doneAt && x.doneAt.slice(0, 10) === today).length;
    const overdue = tasks.filter(x => !x.done && x.due < today).length;
    const totalToday = tasks.filter(x => x.due <= today).length;
    const pct = totalToday === 0 ? 0 : Math.round((tasks.filter(x => x.done && x.due <= today).length / totalToday) * 100);

    document.getElementById('statOpen').textContent = open;
    document.getElementById('statDone').textContent = doneToday;
    document.getElementById('statOverdue').textContent = overdue;
    document.getElementById('statPct').textContent = pct + '%';
}

// Make functions globally available
window.addTask = addTask;
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;
window.showHistory = showHistory;
window.loadTasks = loadTasks;
window.render = render;