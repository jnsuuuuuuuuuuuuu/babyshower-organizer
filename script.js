// Datos guardados en localStorage
const STORAGE_KEY = 'babyshower_checklist';

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupTabs();
    updateProgress('baby-shower');
    updateProgress('mudanza');
    updateProgress('bebe');
    updateProgress('depa');
    updateProgress('manualidades');
    updateAllStats();
});

// Funcionalidad de tabs
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Desactivar todos
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Activar seleccionado
            this.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });
}

// Actualizar progreso
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

    saveData();
    updateAllStats();
}

// Actualizar estadísticas generales
function updateAllStats() {
    const allCheckboxes = document.querySelectorAll('.task-checkbox');
    const checkedBoxes = document.querySelectorAll('.task-checkbox:checked');
    
    document.getElementById('total-tasks').textContent = allCheckboxes.length;
    document.getElementById('completed-tasks').textContent = checkedBoxes.length;
    document.getElementById('pending-tasks').textContent = allCheckboxes.length - checkedBoxes.length;
}

// Agregar tarea nueva
function addTask(section) {
    const taskName = prompt('¿Cuál es la nueva tarea?');
    if (taskName) {
        const tasksContainer = document.getElementById(section);
        const newTask = document.createElement('div');
        newTask.className = 'task-item';
        newTask.innerHTML = `
            <input type="checkbox" class="task-checkbox" onchange="updateProgress('${section}')">
            <label>${taskName}</label>
        `;
        tasksContainer.appendChild(newTask);
        saveData();
        updateProgress(section);
    }
}

// Guardar datos en localStorage
function saveData() {
    const data = {};
    const checkboxes = document.querySelectorAll('.task-checkbox');
    
    checkboxes.forEach((checkbox, index) => {
        data[index] = {
            checked: checkbox.checked,
            label: checkbox.nextElementSibling.textContent
        };
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Cargar datos de localStorage
function loadData() {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    const checkboxes = document.querySelectorAll('.task-checkbox');
    
    checkboxes.forEach((checkbox, index) => {
        if (data[index]) {
            checkbox.checked = data[index].checked;
        }
    });
}

// Exportar a PDF
function exportToPDF() {
    window.print();
}