// Global variable
let db = null;
let isInitialized = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Loaded');
    setupTabs();
    initializeFirebase();
});

// Initialize Firebase
function initializeFirebase() {
    console.log('Initializing Firebase...');
    
    // Esperar a que Firebase esté disponible
    if (typeof firebase !== 'undefined' && firebase.database) {
        db = window.db;
        isInitialized = true;
        console.log('Firebase is ready');
        updateSyncStatus('🔄 Cargando datos...');
        loadDataFromFirebase();
    } else {
        console.log('Firebase not ready yet, retrying...');
        setTimeout(initializeFirebase, 500);
    }
}

// Setup tabs
function setupTabs() {
    console.log('Setting up tabs');
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
    if (!db) {
        console.log('DB not ready');
        setTimeout(loadDataFromFirebase, 500);
        return;
    }

    console.log('Loading data from Firebase...');
    updateSyncStatus('🔄 Cargando datos...');

    db.ref('tasks').on('value', function(snapshot) {
        console.log('Data received:', snapshot.val());
        const data = snapshot.val() || {};
        
        // Cargar todos los checkboxes desde Firebase
        Object.keys(data).forEach(taskId => {
            const checkbox = document.querySelector(`[data-task-id="${taskId}"]`);
            if (checkbox) {
                checkbox.checked = data[taskId].checked;
                console.log('Updated checkbox:', taskId, data[taskId].checked);
            }
        });

        updateAllProgress();
        updateSyncStatus('✅ Sincronizado');
    }, function(error) {
        console.error('Error loading data:', error);
        updateSyncStatus('❌ Error: ' + error.message);
    });
}

// Update task in Firebase
function updateTask(checkbox) {
    if (!isInitialized) {
        console.log('Firebase not initialized yet');
        return;
    }

    const taskId = checkbox.getAttribute('data-task-id');
    const isChecked = checkbox.checked;

    console.log('Updating task:', taskId, isChecked);
    updateSyncStatus('🔄 Guardando...');
    
    db.ref('tasks/' + taskId).set({
        checked: isChecked,
        label: checkbox.nextElementSibling.textContent,
        lastUpdated: new Date().toISOString()
    }).then(() => {
        console.log('Task saved successfully');
        updateSyncStatus('✅ Sincronizado');
    }).catch((error) => {
        console.error('Error saving task:', error);
        updateSyncStatus('❌ Error: ' + error.message);
    });

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
    
    const totalEl = document.getElementById('total-tasks');
    const completedEl = document.getElementById('completed-tasks');
    const pendingEl = document.getElementById('pending-tasks');
    
    if (totalEl) totalEl.textContent = allCheckboxes.length;
    if (completedEl) completedEl.textContent = checkedBoxes.length;
    if (pendingEl) pendingEl.textContent = allCheckboxes.length - checkedBoxes.length;
}

// Add new task
function addTask(section) {
    const taskName = prompt('¿Cuál es la nueva tarea?');
    if (taskName && taskName.trim()) {
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

        if (db) {
            updateSyncStatus('🔄 Agregando tarea...');
            db.ref('tasks/' + taskId).set({
                checked: false,
                label: taskName,
                section: section,
                createdAt: new Date().toISOString()
            }).then(() => {
                console.log('Task added successfully');
                updateSyncStatus('✅ Sincronizado');
            }).catch((error) => {
                console.error('Error adding task:', error);
                updateSyncStatus('❌ Error: ' + error.message);
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
        console.log('Status:', status);
    }
}