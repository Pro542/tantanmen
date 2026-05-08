import db from "../db.js";

const format = (row) =>
	row ? { ...row, completed: row.completed === 1 } : null;

export function listTodos() {
	return db.prepare("SELECT * FROM todos ORDER BY created_at DESC").all().map(format);
}

export function getTodo(id) {
	return format(db.prepare("SELECT * FROM todos WHERE id = ?").get(id));
}

export function createTodo(title) {
	const { lastInsertRowid } = db
		.prepare("INSERT INTO todos (title) VALUES (?)")
		.run(title);
	return getTodo(lastInsertRowid);
}

export function updateTodo(id, { title, completed }) {
	const fields = [];
	const values = [];
	if (title !== undefined) {
		fields.push("title = ?");
		values.push(title);
	}
	if (completed !== undefined) {
		fields.push("completed = ?");
		values.push(completed ? 1 : 0);
	}
	if (fields.length === 0) return getTodo(id);
	values.push(id);
	db.prepare(`UPDATE todos SET ${fields.join(", ")} WHERE id = ?`).run(...values);
	return getTodo(id);
}

export function deleteTodo(id) {
	return db.prepare("DELETE FROM todos WHERE id = ?").run(id);
}
