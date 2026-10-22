// TaskMate Frontend JavaScript Client

const API_BASE_URL = '/api/tasks';

// State Management
let allTasks = [];
let currentFilter = {
    status: 'ALL',       // ALL | PENDING | COMPLETED
    priority: '',        // '' | HIGH | MEDIUM | LOW
    category: '',        // '' | WORK | STUDY | PERSONAL | HEALTH | FINANCE
    search: ''
};
let isEditing = false;
let editingTaskId = null;

// DOM Elements
const taskGrid = document.getElementById('taskGrid');
const emptyState = document.getElementById('emptyState');
const taskModal = document.getElementById('taskModal');
const modalTitle = document.getElementById('modalTitle');
const taskForm = document.getElementById('taskForm');
const taskIdInput = document.getElementById('taskId');
const taskTitleInput = document.getElementById('taskTitle');
const taskDescInput = document.getElementById('taskDescription');
const taskCategoryInput = document.getElementById('taskCategory');
const taskPriorityInput = document.getElementById('taskPriority');
const taskDueDateInput = document.getElementById('taskDueDate');

const statTotal = document.getElementById('statTotal');
const statPending = document.getElementById('statPending');
const statCompleted = document.getElementById('statCompleted');
const statRate = document.getElementById('statRate');
const tasksCountHeading = document.getElementById('tasksCountHeading');

const searchInput = document.getElementById('searchInput');
const priorityFilter = document.getElementById('priorityFilter');
const categoryFilter = document.getElementById('categoryFilter');
const tabButtons = document.querySelectorAll('.tab-btn');

const openCreateModalBtn = document.getElementById('openCreateModalBtn');
const emptyStateCreateBtn = document.getElementById('emptyStateCreateBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const refreshBtn = document.getElementById('refreshBtn');
const toastContainer = document.getElementById('toastContainer');
const apiStatus = document.getElementById('apiStatus');

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    fetchTasksAndStats();
    setupEventListeners();
});

function setupEventListeners() {
    // Open create modal
    openCreateModalBtn.addEventListener('click', openCreateModal);
    emptyStateCreateBtn.addEventListener('click', openCreateModal);

    // Close modal
    closeModalBtn.addEventListener('click', closeModal);
    cancelModalBtn.addEventListener('click', closeModal);
    taskModal.addEventListener('click', (e) => {
        if (e.target === taskModal) closeModal();
    });

    // Form submit
    taskForm.addEventListener('submit', handleFormSubmit);

    // Refresh button
    refreshBtn.addEventListener('click', () => {
        showToast('Refreshing tasks...', 'info');
        fetchTasksAndStats();
    });

    // Search input with debounce
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            currentFilter.search = e.target.value.trim();
            renderTasks();
        }, 200);
    });

    // Status tabs
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter.status = btn.dataset.status;
            renderTasks();
        });
    });

    // Select filters
    priorityFilter.addEventListener('change', (e) => {
        currentFilter.priority = e.target.value;
        renderTasks();
    });

    categoryFilter.addEventListener('change', (e) => {
        currentFilter.category = e.target.value;
        renderTasks();
    });
}

// Fetch all tasks and statistics from Spring Boot API
async function fetchTasksAndStats() {
    try {
        const [tasksResponse, statsResponse] = await Promise.all([
            fetch(API_BASE_URL),
            fetch(`${API_BASE_URL}/stats`)
        ]);

        if (!tasksResponse.ok || !statsResponse.ok) {
            throw new Error('Failed to communicate with Spring Boot API');
        }

        allTasks = await tasksResponse.json();
        const stats = await statsResponse.json();

        updateStats(stats);
        renderTasks();
        updateApiStatus(true);
    } catch (error) {
        console.error('Error fetching data:', error);
        showToast('Unable to connect to backend API', 'error');
        updateApiStatus(false);
    }
}

// Update KPI cards
function updateStats(stats) {
    statTotal.textContent = stats.total || 0;
    statPending.textContent = stats.pending || 0;
    statCompleted.textContent = stats.completed || 0;
    statRate.textContent = `${stats.completionRate || 0}%`;
}

// Update backend connection badge
function updateApiStatus(isOnline) {
    if (isOnline) {
        apiStatus.style.display = 'flex';
        apiStatus.innerHTML = '<span class="status-dot"></span><span class="status-text">Backend Connected</span>';
    } else {
        apiStatus.style.display = 'flex';
        apiStatus.style.borderColor = 'rgba(239, 68, 68, 0.3)';
        apiStatus.style.background = 'rgba(239, 68, 68, 0.1)';
        apiStatus.innerHTML = '<span class="status-dot" style="background:#ef4444;box-shadow:0 0 10px #ef4444"></span><span class="status-text" style="color:#f87171">Offline</span>';
    }
}

// Filter and render task cards
function renderTasks() {
    let filtered = [...allTasks];

    // Status filter
    if (currentFilter.status === 'PENDING') {
        filtered = filtered.filter(t => !t.completed);
    } else if (currentFilter.status === 'COMPLETED') {
        filtered = filtered.filter(t => t.completed);
    }

    // Priority filter
    if (currentFilter.priority) {
        filtered = filtered.filter(t => t.priority === currentFilter.priority);
    }

    // Category filter
    if (currentFilter.category) {
        filtered = filtered.filter(t => t.category === currentFilter.category);
    }

    // Search query filter
    if (currentFilter.search) {
        const q = currentFilter.search.toLowerCase();
        filtered = filtered.filter(t =>
            (t.title && t.title.toLowerCase().includes(q)) ||
            (t.description && t.description.toLowerCase().includes(q))
        );
    }

    tasksCountHeading.textContent = `Tasks (${filtered.length})`;

    if (filtered.length === 0) {
        taskGrid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    taskGrid.style.display = 'grid';
    emptyState.style.display = 'none';

    taskGrid.innerHTML = filtered.map(task => createTaskCardHtml(task)).join('');

    // Attach card event listeners
    filtered.forEach(task => {
        const checkbox = document.getElementById(`toggle-${task.id}`);
        const editBtn = document.getElementById(`edit-${task.id}`);
        const deleteBtn = document.getElementById(`delete-${task.id}`);

        if (checkbox) {
            checkbox.addEventListener('change', () => toggleTask(task.id));
        }
        if (editBtn) {
            editBtn.addEventListener('click', () => openEditModal(task));
        }
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
        }
    });
}

function createTaskCardHtml(task) {
    const isCompleted = task.completed ? 'completed' : '';
    const checkedAttr = task.completed ? 'checked' : '';
    const formattedDate = task.dueDate ? formatDate(task.dueDate) : 'No due date';

    return `
        <div class="task-card ${isCompleted} priority-${task.priority}">
            <div class="task-card-header">
                <div class="tags-group">
                    <span class="tag tag-category">${task.category}</span>
                    <span class="tag tag-priority-${task.priority}">${task.priority}</span>
                </div>
                <div class="task-actions">
                    <button class="icon-btn" id="edit-${task.id}" title="Edit task">✏️</button>
                    <button class="icon-btn delete-btn" id="delete-${task.id}" title="Delete task">🗑️</button>
                </div>
            </div>

            <div class="task-body">
                <input type="checkbox" class="task-checkbox" id="toggle-${task.id}" ${checkedAttr}>
                <div class="task-content">
                    <h4 class="task-title">${escapeHtml(task.title)}</h4>
                    ${task.description ? `<p class="task-desc">${escapeHtml(task.description)}</p>` : ''}
                </div>
            </div>

            <div class="task-card-footer">
                <span class="task-due">📅 ${formattedDate}</span>
                <span>${task.completed ? 'Status: Done' : 'Status: In Progress'}</span>
            </div>
        </div>
    `;
}

// Open modal in Create mode
function openCreateModal() {
    isEditing = false;
    editingTaskId = null;
    modalTitle.textContent = 'Create New Task';
    taskForm.reset();
    taskIdInput.value = '';
    taskPriorityInput.value = 'MEDIUM';
    taskCategoryInput.value = 'WORK';
    taskModal.classList.add('active');
    taskTitleInput.focus();
}

// Open modal in Edit mode
function openEditModal(task) {
    isEditing = true;
    editingTaskId = task.id;
    modalTitle.textContent = 'Edit Task';
    taskIdInput.value = task.id;
    taskTitleInput.value = task.title || '';
    taskDescInput.value = task.description || '';
    taskCategoryInput.value = task.category || 'WORK';
    taskPriorityInput.value = task.priority || 'MEDIUM';
    taskDueDateInput.value = task.dueDate || '';
    taskModal.classList.add('active');
    taskTitleInput.focus();
}

function closeModal() {
    taskModal.classList.remove('active');
    taskForm.reset();
}

// Submit Create or Edit form
async function handleFormSubmit(e) {
    e.preventDefault();

    const title = taskTitleInput.value.trim();
    if (!title) {
        showToast('Please enter a task title', 'error');
        return;
    }

    const payload = {
        title: title,
        description: taskDescInput.value.trim(),
        category: taskCategoryInput.value,
        priority: taskPriorityInput.value,
        dueDate: taskDueDateInput.value || null
    };

    try {
        let response;
        if (isEditing && editingTaskId) {
            // Find existing completion status
            const existing = allTasks.find(t => t.id === editingTaskId);
            payload.completed = existing ? existing.completed : false;

            response = await fetch(`${API_BASE_URL}/${editingTaskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            payload.completed = false;
            response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        if (!response.ok) {
            throw new Error('Failed to save task');
        }

        closeModal();
        showToast(isEditing ? 'Task updated successfully!' : 'Task created successfully!', 'success');
        await fetchTasksAndStats();
    } catch (error) {
        console.error('Error saving task:', error);
        showToast('Failed to save task. Check server logs.', 'error');
    }
}

// Toggle Task Complete / Pending
async function toggleTask(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}/toggle`, {
            method: 'PATCH'
        });

        if (!response.ok) {
            throw new Error('Failed to toggle status');
        }

        const updated = await response.json();
        showToast(updated.completed ? 'Task marked as completed! 🎉' : 'Task marked as pending.', 'info');
        await fetchTasksAndStats();
    } catch (error) {
        console.error('Error toggling status:', error);
        showToast('Error updating task status', 'error');
    }
}

// Delete Task
async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete task');
        }

        showToast('Task deleted successfully', 'info');
        await fetchTasksAndStats();
    } catch (error) {
        console.error('Error deleting task:', error);
        showToast('Error deleting task', 'error');
    }
}

// Utility: Show Toast Notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️';
    toast.innerHTML = `<span>${icon}</span><span>${escapeHtml(message)}</span>`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        toast.style.transition = 'all 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Utility: Format Date (YYYY-MM-DD to friendly string)
function formatDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return dateStr;
}

// Utility: Escape HTML
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
