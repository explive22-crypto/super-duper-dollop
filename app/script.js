const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskCounter = document.querySelector("#task-counter");

// Здесь хранятся все задачи приложения.
// Сначала пробуем взять задачи из localStorage.
const savedTasks = localStorage.getItem("tasks");
const tasks = savedTasks ? JSON.parse(savedTasks) : [];

// Эта функция сохраняет задачи в браузере.
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Эта функция обновляет текст счётчика.
function updateCounter() {
  const completedTasks = tasks.filter(function (task) {
    return task.completed;
  });

  taskCounter.textContent = "Выполнено: " + completedTasks.length + " из " + tasks.length;
}

// Эта функция заново рисует список задач на странице.
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach(function (task, index) {
    const taskItem = document.createElement("li");
    const checkbox = document.createElement("input");
    const taskText = document.createElement("span");
    const deleteButton = document.createElement("button");

    taskItem.className = "task-item";
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    taskText.textContent = task.text;
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Удалить";

    if (task.completed) {
      taskItem.classList.add("completed");
    }

    // Когда пользователь нажимает на чекбокс, меняем статус задачи.
    checkbox.addEventListener("change", function () {
      tasks[index].completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    // Когда пользователь нажимает "Удалить", убираем задачу из массива.
    deleteButton.addEventListener("click", function () {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    taskItem.append(checkbox, taskText, deleteButton);
    taskList.append(taskItem);
  });

  updateCounter();
}

// Эта часть срабатывает при отправке формы.
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

  saveTasks();
  taskInput.value = "";
  taskInput.focus();
  renderTasks();
});

// Рисуем сохранённые задачи сразу после загрузки страницы.
renderTasks();
