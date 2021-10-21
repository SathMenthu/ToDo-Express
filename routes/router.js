const { Router } = require("express");
const { readFile, writeFile } = require("fs-extra");
const DATA_BASE = "./data/database.json";
const router = Router();

loadTasks = async () => {
    try {
        const file = await readFile(DATA_BASE, "utf8");
        return JSON.parse(file);
    } catch (e) {
        return [];
    }
};

router.get("/", async (req, res) => {
    try {
        const tasks = await loadTasks();
        res.json({
            isSuccess: true,
            tasks,
            message: "Pomyślnie pobrano zadania!",
        });
    } catch (e) {
        res.json({
            isSuccess: false,
            message: "Wystąpił błąd podczas pobierania zadań!",
        });
    }
});

router.post("/", async (req, res) => {
    const tasks = await loadTasks();
    try {
        const { id, name, completed } = req.body;
        const newTask = {
            id,
            name,
            completed,
        };
        tasks.push(newTask);
        await writeFile(DATA_BASE, JSON.stringify(tasks));
        res.json({
            isSuccess: true,
            message: "Zadanie zostało dodane do listy!",
        });
    } catch (e) {
        res.json({
            isSuccess: false,
            message: "Wystąpił błąd podczas dodawania zadania!",
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const tasks = await loadTasks();
        const updatedTasks = tasks.filter(function (task) {
            return task.id !== Number(req.params.id);
        });

        await writeFile(DATA_BASE, JSON.stringify(updatedTasks));
        res.json({
            isSuccess: true,
            message: "Pomyślnie usunięto zadanie!",
        });
    } catch (e) {
        res.json({
            isSuccess: false,
            message: "Wystąpił błąd podczas pobierania zadania!",
        });
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const tasks = await loadTasks();
        for (const task of tasks) {
            if (task.id === Number(req.params.id)) {
                task.completed = !task.completed;
            }
        }

        await writeFile(DATA_BASE, JSON.stringify(tasks));
        res.json({
            isSuccess: true,
            message: "Pomyślnie zaktualizowano zadanie!",
        });
    } catch (e) {
        res.json({
            isSuccess: false,
            message: "Wystąpił błąd podczas aktualizacji zadania!",
        });
    }
});

module.exports = router;