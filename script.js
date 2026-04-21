// Firebase sync
let syncingData = false;

document.addEventListener('DOMContentLoaded', function() {
    setupTabs();
    loadDataFromFirebase();
});

// Setup tabs
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });
}

// Load data from Firebase
function loadDataFromFirebase() {
    if (!window.db) {
        console.log('Firebase not initialized yet');
        setTimeout(loadDataFromFirebase, 1000);
        return;
    }

    updateSyncStatus('🔄 Sincronizando...');

    window.db.ref('tasks').on('value', function(snapshot) {
        const data = snapshot.val() || {};
        
        Object.keys(data).forEach(taskId => {
            const checkbox = document.querySelector(`[data-task-id="${taskId}"]`);
            if (checkbox) {
                checkbox.checked = data[taskId].checked;
            }
        });

        updateAllProgress();
        updateSyncStatus('✅ Sincronizado');
        
        setTimeout(() => {
            const status = document.getElementById('sync-status');
            if (status) status.textContent = '✅ Sincronizado';
        }, 2000);
    });
}

// Update task in Firebase
function updateTask(checkbox) {
    const taskId = checkbox.getAttribute('data-task-id');
    const isChecked = checkbox.checked;

    if (window.db) {
        window.db.ref('tasks/' + taskId).set({
            checked: isChecked,
            label: checkbox.nextElementSibling.textContent,
            lastUpdated: new Date().toISOString()
        });
    }

    updateAllProgress();
}

// Update progress for all sections
function updateAllProgress() {
    updateProgress('baby-shower');
    updateProgress('mudanza');
    updateProgress('bebe');
    updateProgress('depa');
    updateProgress('manualidades');
    updateAllStats();
}

// Update progress
function updateProgress(section) {
    const tasks = document.querySelectorAll(`#${section} .task-checkbox`);
    const completed = document.querySelectorAll(`#${section} .task-checkbox:checked`);
    
    const total = tasks.length;
    const check = completed.length;
    const percent = total > 0 ? Math.round((check / total) * 100) : 0;

    const progressBar = document.getElementById(`progress-${section}`);
    const percentText = document.getElementById(`percent-${section}`);

    if (progressBar) {
        progressBar.style.width = percent + '%';
    }
    if (percentText) {
        percentText.textContent = percent + '% completado';
    }
}

// Update all stats
function updateAllStats() {
    const allCheckboxes = document.querySelectorAll('.task-checkbox');
    const checkedBoxes = document.querySelectorAll('.task-checkbox:checked');
    
    document.getElementById('total-tasks').textContent = allCheckboxes.length;
    document.getElementById('completed-tasks').textContent = checkedBoxes.length;
    document.getElementById('pending-tasks').textContent = allCheckboxes.length - checkedBoxes.length;
}

// Add new task
function addTask(section) {
    const taskName = prompt('¿Cuál es la nueva tarea?');
    if (taskName) {
        const timestamp = Date.now();
        const taskId = section + '-' + timestamp;

        const tasksContainer = document.getElementById(section);
        const newTask = document.createElement('div');
        newTask.className = 'task-item';
        newTask.innerHTML = `
            <input type="checkbox" class="task-checkbox" data-task-id="${taskId}" onchange="updateTask(this)">
            <label>${taskName}</label>
        `;
        tasksContainer.appendChild(newTask);

        if (window.db) {
            window.db.ref('tasks/' + taskId).set({
                checked: false,
                label: taskName,
                section: section,
                createdAt: new Date().toISOString()
            });
        }

        updateAllProgress();
    }
}

// Update sync status
function updateSyncStatus(status) {
    const statusEl = document.getElementById('sync-status');
    if (statusEl) {
        statusEl.textContent = status;
    }
}