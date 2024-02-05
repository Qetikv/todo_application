document.addEventListener('DOMContentLoaded', function () {
  fetchTodos();
});

function fetchTodos() {
  fetch('https://jsonplaceholder.typicode.com/todos')
    .then(handleResponse)
    .then(populateTodoTable)
    .catch(handleError);
};

function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`Failed to fetch todos. Status: ${response.status}`);
  }
  return response.json();
};

function populateTodoTable(todos) {
  const taskList = document.getElementById('taskList');
  todos.forEach(addTaskToUI);
};

function addTaskToUI(task) {
  const taskList = document.getElementById('taskList');
  const row = createTaskRow(task);
  taskList.appendChild(row);
};

function createTaskRow(task) {
  const row = document.createElement('tr');
  row.setAttribute('data-task-id', task.id);
  row.innerHTML = `
      <td>${task.title}</td>
      <td class="status-cell">
          <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleCompletion(this, ${task.id})">
          <span>${task.completed ? 'Completed' : 'Todo'}</span>
      </td>
      <td><button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button></td>
  `;
  return row;
};

function addTask() {
  const taskInput = document.getElementById('taskInput');
  const trimmedValue = taskInput.value.trim();

  if (trimmedValue !== '') {
    const newTask = {
      title: trimmedValue,
      completed: false,
    };

    // Send a POST request to the JSONPlaceholder API to create a new task
    fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })
      .then(handleResponse)
      .then(addTaskToUI)
      .catch(handleError);

    taskInput.value = '';
  }
};

function toggleCompletion(checkbox, taskId) {
  const completed = checkbox.checked;
  const statusText = completed ? 'Completed' : 'Todo';

  fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      completed,
    }),
  })
    .then(handleResponse)
    .then(data => {
      updateStatusText(taskId, statusText);
    })
    .catch(handleError);
};

function updateStatusText(taskId, statusText) {
  const taskRow = document.querySelector(`#taskList tr[data-task-id="${taskId}"]`);
  if (taskRow) {
    const statusSpan = taskRow.querySelector('.status-cell span');
    if (statusSpan) {
      statusSpan.textContent = statusText;
    }
  }
};

function deleteTask(taskId) {
  fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {
    method: 'DELETE',
  })
    .then(handleResponse)
    .then(data => {
      removeTaskFromUI(taskId);
    })
    .catch(handleError);
};

function removeTaskFromUI(taskId) {
  const taskRow = document.querySelector(`#taskList tr[data-task-id="${taskId}"]`);
  if (taskRow) {
    taskRow.remove();
  }
};

function handleError(error) {
  console.error('Error:', error);
  displayErrorMessage('An error occurred. Please try again later.');
};

function displayErrorMessage(message) {
  alert(message);
};
