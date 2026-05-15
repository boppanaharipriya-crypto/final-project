const taskContainer = document.getElementById('taskContainer');

// Register User
async function registerUser() {

    const username = document.getElementById('username').value;

    const password = document.getElementById('password').value;

    // Form validation
    if(username.trim() === '' || password.trim() === '') {

        alert('Please fill all fields');

        return;
    }

    await fetch('/register', {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            username,
            password
        })
    });

    alert('User registered successfully');
}

// Add Task
async function addTask() {

    const task = document.getElementById('taskInput').value;

    // Form validation
    if(task.trim() === '') {

        alert('Task cannot be empty');

        return;
    }

    await fetch('/add-task', {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            task
        })
    });

    document.getElementById('taskInput').value = '';

    loadTasks();
}

// Load tasks
async function loadTasks() {

    const response = await fetch('/tasks');

    const tasks = await response.json();

    taskContainer.innerHTML = '';

    tasks.forEach(task => {

        const div = document.createElement('div');

        div.classList.add('card');

        div.innerHTML = `
            <h3>${task.task}</h3>
            <p>Status: ${task.status}</p>

            <button onclick="deleteTask(${task.id})">
                Delete
            </button>
        `;

        taskContainer.appendChild(div);
    });
}

// Delete task
async function deleteTask(id) {

    await fetch(`/delete-task/${id}`, {

        method: 'DELETE'
    });

    loadTasks();
}

// Search tasks
function searchTasks() {

    const input =
        document.getElementById('searchInput')
        .value
        .toLowerCase();

    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {

        if(card.innerText.toLowerCase().includes(input)) {

            card.style.display = 'block';

        } else {

            card.style.display = 'none';
        }
    });
}

// Load tasks on startup
if(taskContainer) {

    loadTasks();
}