const BASE_URL = "/api";

const todoList = document.getElementById("todoList");
const taskForm = document.getElementById("taskForm");

let tasks = [];

loadTasks = async () => {
    const res = await fetch(BASE_URL);
    const { tasks } = await res.json();
    while (todoList.firstChild) todoList.removeChild(todoList.firstChild);
    for (const task of tasks) {
        const newTask = document.createElement("tr");
        const description = document.createElement("th");
        const status = document.createElement("th");
        const actions = document.createElement("td");

        description.innerText = task.name;
        switch (task.completed) {
            case true:
                status.innerText = "Wykonano :)";
                status.classList = "bg-success text-white";
                break;
            case false:
                status.innerText = "W trakcie...";
                status.classList = "bg-warning ";
                break;
        }

        const deleteButton = document.createElement("button");
        deleteButton.classList = "btn btn-danger ml-5";
        deleteButton.innerText = "USUŃ";

        deleteButton.addEventListener("click", (e) => {
            deleteTask(task.id);
        });

        const changeStatusButton = document.createElement("button");
        changeStatusButton.classList = "btn btn-success ye";
        switch (task.completed) {
            case true:
                actions.append(changeStatusButton);
                changeStatusButton.innerText = "PRZYWRÓĆ";
                description.style.textDecoration = "Line-Through";
                description.style.color = "gray";
                break;
            case false:
                actions.append(changeStatusButton);
                changeStatusButton.innerText = "WYKONANO";
                break;
        }

        newTask.appendChild(description);
        newTask.appendChild(status);

        actions.appendChild(deleteButton);
        newTask.appendChild(actions);

        changeStatusButton.addEventListener("click", (e) => {
            updateTask(task.id);
        });

        todoList.appendChild(newTask);
    }
};

taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const addTaskInput = document.getElementById("addTaskInput");
    await addTask(addTaskInput.value);
    addTaskInput.value = "";
    await loadTasks();
});

addTask = async (name) => {
    try {
        const task = {
            id: ++tasks.length,
            name,
            completed: false,
        };

        const res = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(task),
        });

        const { message, isSuccess } = await res.json();
        await showToast(message, isSuccess);
    } catch (e) {
        await showToast(e.message, false);
    }
};

updateTask = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/${id}`, {
            method: "PATCH",
        });
        const { message, isSuccess } = await res.json();
        await showToast(message, isSuccess);
        await loadTasks();
    } catch (e) {
        await showToast(e.message, false);
    }
};

deleteTask = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE",
        });
        const { message, isSuccess } = await res.json();
        await showToast(message, isSuccess);
        await loadTasks();
    } catch (e) {
        await showToast(e.message, false);
    }
};

showToast = async (message, status) => {
    const toast = document.getElementById("myToast");
    const toastBody = document.getElementById("toastBody");
    const alert = new bootstrap.Toast(toast, {
        delay: 2000,
    });

    switch (status) {
        case true:
            toast.classList.remove("bg-danger");
            toast.classList.add("bg-success");
            break;
        case false:
            toast.classList.remove("bg-success");
            toast.classList.add("bg-danger");
    }

    toastBody.innerText = message;

    alert.show();
};

window.addEventListener("load", loadTasks);
