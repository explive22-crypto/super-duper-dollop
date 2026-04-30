const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskCounter = document.querySelector("#task-counter");
const filterButtons = document.querySelectorAll(".filter-button");

// Здесь хранятся все задачи приложения.
// Сначала пробуем взять задачи из localStorage.
const savedTasks = localStorage.getItem("tasks");
const tasks = savedTasks ? JSON.parse(savedTasks) : [];
let currentFilter = "all";

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

// Эта функция выбирает, какие задачи показывать.
function getVisibleTasks() {
  if (currentFilter === "active") {
    return tasks.filter(function (task) {
      return !task.completed;
    });
  }

  if (currentFilter === "completed") {
    return tasks.filter(function (task) {
      return task.completed;
    });
  }

  return tasks;
}

// Эта функция заново рисует список задач на странице.
function renderTasks() {
  taskList.innerHTML = "";

  const visibleTasks = getVisibleTasks();

  visibleTasks.forEach(function (task) {
    const index = tasks.indexOf(task);
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

// Эти обработчики переключают фильтр задач.
filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.dataset.filter;

    filterButtons.forEach(function (filterButton) {
      filterButton.classList.remove("active");
    });

    button.classList.add("active");
    renderTasks();
  });
});

// Рисуем сохранённые задачи сразу после загрузки страницы.
renderTasks();
