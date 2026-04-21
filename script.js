import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

// Variables globales
let db = null;
let tasksRef = null;

document.addEventListener('DOMContentLoaded', function() {
    // Esperar a que Firebase esté listo
    setTimeout(() => {
        initializeApp();
    }, 500);
});

// Inicializar la app
function initializeApp() {
    db = window.db;
    if (!db) {
        console.log('Esperando Firebase...');
        setTimeout(initializeApp, 500);
        return;
    }

    tasksRef = ref(db, 'tasks');
    setupTabs();
    loadDataFromFirebase();
    updateSyncStatus('✅ Conectado');
}

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
    if (!tasksRef) {
        console.log('Tasksref no está listo');
        setTimeout(loadDataFromFirebase, 500);
        return;
    }

    updateSyncStatus('🔄 Cargando datos...');

    onValue(tasksRef, (snapshot) => {
        const data = snapshot.val() || {};
        
        // Cargar todos los checkboxes desde Firebase
        Object.keys(data).forEach(taskId => {
            const checkbox = document.querySelector(`[data-task-id="${taskId}"]`);
            if (checkbox) {
                checkbox.checked = data[taskId].checked;
            }
        });

        updateAllProgress();
        updateSyncStatus('✅ Sincronizado');
    }, (error) => {
        console.error('Error cargando datos:', error);
        updateSyncStatus('❌ Error de sincronización');
    });
}

// Update task in Firebase
function updateTask(checkbox) {
    const taskId = checkbox.getAttribute('data-task-id');
    const isChecked = checkbox.checked;

    if (db) {
        updateSyncStatus('🔄 Guardando...');
        
        const taskRef = ref(db, 'tasks/' + taskId);
        set(taskRef, {
            checked: isChecked,
            label: checkbox.nextElementSibling.textContent,
            lastUpdated: new Date().toISOString()
        }).then(() => {
            updateSyncStatus('✅ Sincronizado');
        }).catch((error) => {
            console.error('Error guardando:', error);
            updateSyncStatus('❌ Error');
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

        if (db) {
            updateSyncStatus('🔄 Agregando tarea...');
            const taskRef = ref(db, 'tasks/' + taskId);
            set(taskRef, {
                checked: false,
                label: taskName,
                section: section,
                createdAt: new Date().toISOString()
            }).then(() => {
                updateSyncStatus('✅ Sincronizado');
            }).catch((error) => {
                console.error('Error agregando tarea:', error);
                updateSyncStatus('❌ Error');
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