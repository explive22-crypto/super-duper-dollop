const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskCounter = document.querySelector("#task-counter");

const tasks = [];

function updateCounter() {
  const completedTasks = tasks.filter(function (task) {
    return task.completed;
  });

  taskCounter.textContent = "Выполнено: " + completedTasks.length;
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach(function (task, index) {
    const taskItem = document.createElement("li");
    const checkbox = document.createElement("input");
    const taskText = document.createElement("span");

    taskItem.className = "task-item";
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    taskText.textContent = task.text;

    if (task.completed) {
      taskItem.classList.add("completed");
    }

    checkbox.addEventListener("change", function () {
      tasks[index].completed = checkbox.checked;
      renderTasks();
    });

    taskItem.append(checkbox, taskText);
    taskList.append(taskItem);
  });

  updateCounter();
}

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = taskInput.value.trim();

  if (text === "") {
    return;
  }

  tasks.push({
    text: text,
    completed: false
  });

  taskInput.value = "";
  taskInput.focus();
  renderTasks();
});
