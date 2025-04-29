document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task-input");
    const addTaskBtn = document.getElementById("add-task"); // Corrigido o ID
    const taskList = document.getElementById("task-list");
    const filters = document.querySelectorAll(".filter");
    const toggleThemeBtn = document.getElementById("toggle-theme"); // Corrigido "Document" para "document"

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let theme = localStorage.getItem("theme") || "light";

    if (theme === "dark") {
        document.body.classList.add("dark");
    }

    toggleThemeBtn.addEventListener("click", function () {
        document.body.classList.toggle("dark");
        theme = document.body.classList.contains("dark") ? "dark" : "light";
        localStorage.setItem("theme", theme); // Corrigido "setitem" para "setItem"
    });

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function renderTasks(filter = "all") {
        taskList.innerHTML = "";

        tasks.forEach(function (task, index) {
            if (filter === "pending" && task.completed) return;
            if (filter === "completed" && !task.completed) return;

            const li = document.createElement("li");
            li.className = task.completed ? "completed" : "";

            li.innerHTML = `
                <span class="task-text">${task.text}</span>
                <button class="edit"><img class="btnTasks" src="assets/lapis.png" alt="Editar"></button>
                <button class="delete"><img class="btnTasks" src="assets/lixo.png" alt="Deletar"></button>
            `;

            li.addEventListener("click", function (e) {
                if (e.target.closest(".delete")) {
                    tasks.splice(index, 1);
                } else if (e.target.closest(".edit")) {
                    const newText = prompt("Editar tarefa:", task.text);
                    if (newText) tasks[index].text = newText;
                } else {
                    tasks[index].completed = !tasks[index].completed;
                }

                saveTasks();
                renderTasks(filter);
            });

            taskList.appendChild(li);
        });
    }

    addTaskBtn.addEventListener("click", function () {
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({ text: text, completed: false });
            saveTasks();
            renderTasks();
            taskInput.value = "";
        }
    });

    filters.forEach(function (button) {
        button.addEventListener("click", function () {
            filters.forEach(function (btn) {
                btn.classList.remove("active");
            });
            button.classList.add("active");
            renderTasks(button.dataset.filter);
        });
    });

    renderTasks();
});
