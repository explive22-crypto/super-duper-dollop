const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskCounter = document.querySelector("#task-counter");
const filterButtons = document.querySelectorAll(".filter-button");
const storageKey = "super-duper-dollop-tasks";

// Создаём id для задачи.
// В современных браузерах используем crypto.randomUUID().
function createTaskId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
}

// Безопасно читаем задачи из localStorage.
// Если данные сломаны или это не массив, начинаем с пустого списка.
function loadTasks() {
  const savedTasks = localStorage.getItem(storageKey);

  if (!savedTasks) {
    return [];
  }

  try {
    const parsedTasks = JSON.parse(savedTasks);

    if (Array.isArray(parsedTasks)) {
      return parsedTasks;
    }
  } catch (error) {
    return [];
  }

  return [];
}

// Эта функция сохраняет задачи в браузере.
function saveTasks() {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

// Здесь хранятся все задачи приложения.
const loadedTasks = loadTasks();
let wasMigrated = false;

// У старых сохранённых задач может не быть id, поэтому добавляем его.
const tasks = loadedTasks.map(function (task) {
  if (task.id) {
    return task;
  }

  wasMigrated = true;

  return {
    id: createTaskId(),
    text: task.text,
    completed: task.completed
  };
});

if (wasMigrated) {
  saveTasks();
}

let currentFilter = "all";

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

  if (visibleTasks.length === 0) {
    const emptyItem = document.createElement("li");

    emptyItem.className = "empty-state";
    emptyItem.textContent = "Задач пока нет";
    taskList.append(emptyItem);
    updateCounter();
    return;
  }

  visibleTasks.forEach(function (task) {
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

    // Когда пользователь нажимает на чекбокс, ищем задачу по id и меняем статус.
    checkbox.addEventListener("change", function () {
      const currentTask = tasks.find(function (savedTask) {
        return savedTask.id === task.id;
      });

      // Если задача не найдена, просто выходим из функции.
      if (!currentTask) {
        return;
      }

      currentTask.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    // Когда пользователь нажимает "Удалить", ищем задачу по id и удаляем её.
    deleteButton.addEventListener("click", function () {
      const taskIndex = tasks.findIndex(function (savedTask) {
        return savedTask.id === task.id;
      });

      // Если индекс -1, значит задача не найдена.
      if (taskIndex === -1) {
        return;
      }

      tasks.splice(taskIndex, 1);
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
    id: createTaskId(),
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
