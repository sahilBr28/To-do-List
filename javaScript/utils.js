// ===== UTILITY FUNCTIONS =====

function todayISO() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function esc(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}

function fmtDate(s) {
    if (!s) return 'N/A';
    try {
        const d = new Date(s);
        if (isNaN(d.getTime())) return 'N/A';
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return 'N/A'; }
}

function fmtTime(s) {
    if (!s) return 'N/A';
    try {
        const d = new Date(s);
        if (isNaN(d.getTime())) return 'N/A';
        return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    } catch { return 'N/A'; }
}

function fmtDur(sec) {
    if (!sec) return '0m';
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h > 0) return h + 'h ' + (m > 0 ? m + 'm' : '');
    if (m > 0) return m + 'm' + (s > 0 ? ' ' + s + 's' : '');
    return s + 's';
}

// Make functions globally available
window.todayISO = todayISO;
window.uid = uid;
window.esc = esc;
window.fmtDate = fmtDate;
window.fmtTime = fmtTime;
window.fmtDur = fmtDur;