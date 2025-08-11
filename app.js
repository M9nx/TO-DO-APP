// Focus To-Do Application JavaScript
// All core functionality with detailed comments for manual completion

class FocusToDoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('focusTasks')) || [];
        this.currentCategory = 'today';
        this.isTimerRunning = false;
        this.timerInterval = null;
        this.timerMinutes = 25;
        this.timerSeconds = 0;
        this.theme = localStorage.getItem('focusTheme') || 'dark';

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.applyTheme();
        this.renderTasks();
        this.updateStats();
        this.updateCategoryCounts();
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.querySelector('.theme-toggle');
        themeToggle.addEventListener('click', () => this.toggleTheme());

        // Navigation items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => this.switchCategory(e.currentTarget.dataset.category));
        });

        // Task input
        const taskInput = document.getElementById('taskInput');
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
                this.addTask(e.target.value.trim());
                e.target.value = '';
            }
        });

        // Timer controls
        const timerBtn = document.getElementById('timerBtn');
        timerBtn.addEventListener('click', () => this.toggleTimer());

        // Double click on timer to open fullscreen modal
        const pomodoroTimer = document.getElementById('pomodoroTimer');
        pomodoroTimer.addEventListener('dblclick', () => this.openTimerModal());

        // Completed tasks toggle
        const toggleCompleted = document.getElementById('toggleCompleted');
        toggleCompleted.addEventListener('click', () => this.toggleCompletedTasks());

        // Add project button
        const addProjectBtn = document.querySelector('.add-project-btn');
        addProjectBtn.addEventListener('click', () => this.addProject());

        // Settings and other buttons (placeholder functions)
        document.querySelector('.settings').addEventListener('click', () => this.openSettings());
        document.querySelector('.notifications').addEventListener('click', () => this.showNotifications());
        document.querySelector('.stats').addEventListener('click', () => this.showDetailedStats());
        document.querySelector('.star').addEventListener('click', () => this.showFavorites());

        // Timer modal controls
        const timerCloseBtn = document.getElementById('timerCloseBtn');
        const modalContinueBtn = document.getElementById('modalContinueBtn');
        const modalStopBtn = document.getElementById('modalStopBtn');
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const timerModeBtn = document.getElementById('timerModeBtn');
        const whiteNoiseBtn = document.getElementById('whiteNoiseBtn');

        timerCloseBtn.addEventListener('click', () => this.closeTimerModal());
        modalContinueBtn.addEventListener('click', () => this.toggleTimer());
        modalStopBtn.addEventListener('click', () => this.stopTimer());
        fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        timerModeBtn.addEventListener('click', () => this.changeTimerMode());
        whiteNoiseBtn.addEventListener('click', () => this.toggleWhiteNoise());
    }

    // Theme Management
    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        localStorage.setItem('focusTheme', this.theme);
    }

    applyTheme() {
        document.body.className = this.theme === 'dark' ? 'dark-theme' : 'light-theme';
    }

    // Task Management
    addTask(title) {
        const task = {
            id: Date.now().toString(),
            title: title,
            completed: false,
            priority: 'medium', // default priority
            category: this.currentCategory,
            createdAt: new Date().toISOString(),
            dueDate: null,
            estimatedTime: 0, // in minutes
            actualTime: 0, // in minutes
            tags: []
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.updateCategoryCounts();
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.updateCategoryCounts();
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.updateCategoryCounts();
    }

    editTask(taskId, updates) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            Object.assign(task, updates);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.updateCategoryCounts();
        }
    }

    // Category Management
    switchCategory(category) {
        this.currentCategory = category;

        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        // Update section title
        const titles = {
            'today': 'Today',
            'overdue': 'Overdue',
            'tomorrow': 'Tomorrow',
            'thisweek': 'This Week',
            'next7days': 'Next 7 Days',
            'high': 'High Priority',
            'medium': 'Medium Priority',
            'low': 'Low Priority',
            'planned': 'Planned',
            'all': 'All Tasks',
            'someday': 'Someday',
            'completed': 'Completed',
            'tasks': 'Tasks'
        };

        document.querySelector('.section-title').textContent = titles[category] || 'Tasks';

        this.renderTasks();
        this.updateStats();
    }

    getFilteredTasks() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

        switch (this.currentCategory) {
            case 'today':
                // TODO: Implement logic to filter tasks due today
                return this.tasks.filter(task => !task.completed);

            case 'overdue':
                // TODO: Implement logic to filter overdue tasks
                return this.tasks.filter(task => !task.completed && task.dueDate && new Date(task.dueDate) < today);

            case 'tomorrow':
                // TODO: Implement logic to filter tasks due tomorrow
                return this.tasks.filter(task => !task.completed && task.dueDate &&
                    new Date(task.dueDate).toDateString() === tomorrow.toDateString());

            case 'thisweek':
                // TODO: Implement logic to filter tasks due this week
                return this.tasks.filter(task => !task.completed);

            case 'next7days':
                // TODO: Implement logic to filter tasks due in next 7 days
                return this.tasks.filter(task => !task.completed);

            case 'high':
                return this.tasks.filter(task => !task.completed && task.priority === 'high');

            case 'medium':
                return this.tasks.filter(task => !task.completed && task.priority === 'medium');

            case 'low':
                return this.tasks.filter(task => !task.completed && task.priority === 'low');

            case 'planned':
                // TODO: Implement logic for planned tasks (tasks with due dates)
                return this.tasks.filter(task => !task.completed && task.dueDate);

            case 'someday':
                // TODO: Implement logic for someday tasks (no due date)
                return this.tasks.filter(task => !task.completed && !task.dueDate);

            case 'completed':
                return this.tasks.filter(task => task.completed);

            case 'all':
            case 'tasks':
            default:
                return this.tasks;
        }
    }

    // Rendering
    renderTasks() {
        const taskList = document.getElementById('taskList');
        const emptyState = document.getElementById('emptyState');
        const filteredTasks = this.getFilteredTasks();
        const incompleteTasks = filteredTasks.filter(task => !task.completed);

        if (incompleteTasks.length === 0) {
            taskList.innerHTML = '';
            taskList.appendChild(emptyState);
        } else {
            emptyState.style.display = 'none';
            taskList.innerHTML = incompleteTasks.map(task => this.createTaskHTML(task)).join('');

            // Add event listeners to new task elements
            this.attachTaskEventListeners();
        }
    }

    createTaskHTML(task) {
        const priorityColors = {
            'high': '🔴',
            'medium': '🟡',
            'low': '🟢'
        };

        return `
            <div class="task-item" data-task-id="${task.id}">
                <div class="task-checkbox ${task.completed ? 'completed' : ''}" data-task-id="${task.id}"></div>
                <div class="task-content">
                    <div class="task-title ${task.completed ? 'completed' : ''}">${task.title}</div>
                    <div class="task-meta">
                        <div class="task-priority">
                            ${priorityColors[task.priority]} ${task.priority}
                        </div>
                        ${task.estimatedTime ? `<span>⏱️ ${task.estimatedTime}min</span>` : ''}
                        ${task.dueDate ? `<span>📅 ${new Date(task.dueDate).toLocaleDateString()}</span>` : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-action-btn edit-task" data-task-id="${task.id}">✏️</button>
                    <button class="task-action-btn delete-task" data-task-id="${task.id}">🗑️</button>
                </div>
            </div>
        `;
    }

    attachTaskEventListeners() {
        // Checkbox toggles
        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('click', (e) => {
                this.toggleTask(e.target.dataset.taskId);
            });
        });

        // Edit buttons
        document.querySelectorAll('.edit-task').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // TODO: Implement task editing modal/interface
                const taskId = e.target.dataset.taskId;
                this.openEditTaskModal(taskId);
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-task').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.target.dataset.taskId;
                if (confirm('Are you sure you want to delete this task?')) {
                    this.deleteTask(taskId);
                }
            });
        });
    }

    // Statistics
    updateStats() {
        const filteredTasks = this.getFilteredTasks();
        const incompleteTasks = filteredTasks.filter(task => !task.completed);
        const completedTasks = filteredTasks.filter(task => task.completed);

        const estimatedTime = incompleteTasks.reduce((total, task) => total + (task.estimatedTime || 0), 0);
        const elapsedTime = completedTasks.reduce((total, task) => total + (task.actualTime || 0), 0);

        // Update stat cards
        const statCards = document.querySelectorAll('.stat-card');
        const statNumbers = document.querySelectorAll('.stat-number');

        if (statNumbers.length >= 4) {
            statNumbers[0].textContent = estimatedTime;
            statNumbers[1].textContent = incompleteTasks.length;
            statNumbers[2].innerHTML = `${Math.floor(elapsedTime / 60)}<span class="unit">h</span>`;
            statNumbers[3].textContent = completedTasks.length;
        }
    }

    updateCategoryCounts() {
        // TODO: Implement real-time count updates for each category
        const categories = {
            'today': this.tasks.filter(task => !task.completed).length, // TODO: Filter by today's date
            'overdue': 0, // TODO: Calculate overdue tasks
            'tomorrow': 0, // TODO: Calculate tomorrow's tasks
            'thisweek': 0, // TODO: Calculate this week's tasks
            'next7days': 0, // TODO: Calculate next 7 days tasks
            'high': this.tasks.filter(task => !task.completed && task.priority === 'high').length,
            'medium': this.tasks.filter(task => !task.completed && task.priority === 'medium').length,
            'low': this.tasks.filter(task => !task.completed && task.priority === 'low').length,
            'planned': this.tasks.filter(task => !task.completed && task.dueDate).length,
            'all': this.tasks.length,
            'someday': this.tasks.filter(task => !task.completed && !task.dueDate).length,
            'completed': this.tasks.filter(task => task.completed).length,
            'tasks': this.tasks.length
        };

        Object.keys(categories).forEach(category => {
            const countElement = document.querySelector(`[data-category="${category}"] .nav-count`);
            if (countElement) {
                countElement.textContent = categories[category];
            }
        });
    }

    // Pomodoro Timer
    toggleTimer() {
        if (this.isTimerRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }

    startTimer() {
        this.isTimerRunning = true;
        const timerBtn = document.getElementById('timerBtn');
        timerBtn.innerHTML = '<span class="play-icon">⏸️</span>';

        this.timerInterval = setInterval(() => {
            if (this.timerSeconds === 0) {
                if (this.timerMinutes === 0) {
                    // Timer finished
                    this.timerFinished();
                    return;
                }
                this.timerMinutes--;
                this.timerSeconds = 59;
            } else {
                this.timerSeconds--;
            }
            this.updateTimerDisplay();
        }, 1000);
    }

    pauseTimer() {
        this.isTimerRunning = false;
        clearInterval(this.timerInterval);
        const timerBtn = document.getElementById('timerBtn');
        timerBtn.innerHTML = '<span class="play-icon">▶</span>';
    }

    resetTimer() {
        this.pauseTimer();
        this.timerMinutes = 25;
        this.timerSeconds = 0;
        this.updateTimerDisplay();
    }

    timerFinished() {
        this.pauseTimer();
        // TODO: Play notification sound, show notification, etc.
        alert('Pomodoro session completed! Time for a break.');
        this.resetTimer();
    }

    updateTimerDisplay() {
        const timerTime = document.getElementById('timerTime');
        const modalTimerTime = document.getElementById('modalTimerTime');
        const displayMinutes = this.timerMinutes;
        const displaySeconds = this.timerSeconds;

        let timeText;
        if (displaySeconds === 0) {
            timeText = displayMinutes;
        } else {
            timeText = `${displayMinutes}:${displaySeconds.toString().padStart(2, '0')}`;
        }

        timerTime.textContent = timeText;
        if (modalTimerTime) {
            modalTimerTime.textContent = timeText;
        }

        // Update circular progress
        this.updateCircularProgress();
    }

    updateCircularProgress() {
        const progressCircle = document.getElementById('timerProgress');
        if (progressCircle) {
            const totalSeconds = 25 * 60; // 25 minutes in seconds
            const currentSeconds = this.timerMinutes * 60 + this.timerSeconds;
            const progress = (totalSeconds - currentSeconds) / totalSeconds;
            const circumference = 2 * Math.PI * 140; // radius = 140
            const offset = circumference - (progress * circumference);
            progressCircle.style.strokeDashoffset = offset;
        }
    }

    // Timer Modal Functions
    openTimerModal() {
        const modal = document.getElementById('timerModal');
        modal.classList.add('active');
        this.updateCircularProgress();
    }

    closeTimerModal() {
        const modal = document.getElementById('timerModal');
        modal.classList.remove('active');
    }

    stopTimer() {
        this.pauseTimer();
        this.resetTimer();
        this.closeTimerModal();
    }

    toggleFullscreen() {
        // TODO: Implement fullscreen functionality
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    changeTimerMode() {
        // TODO: Implement timer mode switching (Pomodoro, Short Break, Long Break)
        console.log('Changing timer mode');
    }

    toggleWhiteNoise() {
        // TODO: Implement white noise functionality
        console.log('Toggling white noise');
    }

    // Completed Tasks Toggle
    toggleCompletedTasks() {
        const toggleBtn = document.getElementById('toggleCompleted');
        const isActive = toggleBtn.classList.contains('active');

        if (isActive) {
            toggleBtn.classList.remove('active');
            toggleBtn.querySelector('span').textContent = 'Show Completed Tasks';
        } else {
            toggleBtn.classList.add('active');
            toggleBtn.querySelector('span').textContent = 'Hide Completed Tasks';
        }

        // TODO: Implement showing/hiding completed tasks in the current view
        this.renderTasks();
    }

    // Modal and Interface Methods (To be implemented)
    openEditTaskModal(taskId) {
        // TODO: Create and show task editing modal
        // Should allow editing: title, priority, due date, estimated time, tags
        console.log('Opening edit modal for task:', taskId);
    }

    addProject() {
        // TODO: Implement add project functionality
        // Should open a modal to create new project/category
        console.log('Adding new project');
    }

    openSettings() {
        // Show settings modal
        document.getElementById('settingsModal').style.display = 'flex';
        // Default to General section
        this.showSettingsSection('General');
        // Sidebar menu click
        document.querySelectorAll('.settings-menu-item').forEach(item => {
            item.onclick = (e) => {
                document.querySelectorAll('.settings-menu-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                this.showSettingsSection(item.textContent.trim());
            };
        });
        // Close button
        document.getElementById('settingsCloseBtn').onclick = () => {
            document.getElementById('settingsModal').style.display = 'none';
        };
    }

    showSettingsSection(section) {
        document.getElementById('settingsGeneral').style.display = section === 'General' ? 'block' : 'none';
        document.getElementById('settingsPomodoro').style.display = section === 'Pomodoro Timer' ? 'block' : 'none';
        document.getElementById('settingsAlarm').style.display = section === 'Alarm Sound' ? 'block' : 'none';
        document.getElementById('settingsAbout').style.display = section === 'About' ? 'block' : 'none';
    }
}

showNotifications() {
    // TODO: Implement notifications panel
    // Should show recent activities, reminders, etc.
    console.log('Showing notifications');
}

showDetailedStats() {
    // TODO: Implement detailed statistics view
    // Should show charts, productivity trends, time tracking, etc.
    console.log('Showing detailed stats');
}

showFavorites() {
    // TODO: Implement favorites/starred tasks view
    console.log('Showing favorites');
}

// Data Persistence
saveTasks() {
    localStorage.setItem('focusTasks', JSON.stringify(this.tasks));
}

// Export/Import functionality (bonus features to implement)
exportData() {
    // TODO: Export tasks to JSON file
    const dataStr = JSON.stringify({ tasks: this.tasks, theme: this.theme }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = 'focus-todo-backup.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

importData(file) {
    // TODO: Import tasks from JSON file
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.tasks && Array.isArray(data.tasks)) {
                this.tasks = data.tasks;
                this.saveTasks();
                this.renderTasks();
                this.updateStats();
                this.updateCategoryCounts();
            }
        } catch (error) {
            alert('Error importing data. Please check the file format.');
        }
    };
    reader.readAsText(file);
}
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.focusToDoApp = new FocusToDoApp();
});

// Keyboard shortcuts (bonus feature)
document.addEventListener('keydown', (e) => {
    // TODO: Implement keyboard shortcuts
    // Examples:
    // Ctrl+N: New task
    // Ctrl+/: Focus search
    // Space: Start/pause timer
    // Esc: Close modals

    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'n':
                e.preventDefault();
                document.getElementById('taskInput').focus();
                break;
            case 'e':
                e.preventDefault();
                window.focusToDoApp.exportData();
                break;
            // Add more shortcuts as needed
        }
    }

    if (e.key === ' ' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        window.focusToDoApp.toggleTimer();
    }
});

// Service Worker registration for offline functionality (advanced feature)
if ('serviceWorker' in navigator) {
    // TODO: Create and register service worker for offline functionality
    // window.addEventListener('load', () => {
    //     navigator.serviceWorker.register('/sw.js')
    //         .then((registration) => {
    //             console.log('SW registered: ', registration);
    //         })
    //         .catch((registrationError) => {
    //             console.log('SW registration failed: ', registrationError);
    //         });
    // });
}