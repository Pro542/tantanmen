import { createServer } from "node:http";
import {
	listTodos,
	getTodo,
	createTodo,
	updateTodo,
	deleteTodo,
} from "./routes/todos.js";

const PORT = 3001;

function parseBody(req) {
	return new Promise((resolve, reject) => {
		let raw = "";
		req.on("data", (chunk) => {
			raw += chunk;
		});
		req.on("end", () => {
			try {
				resolve(raw ? JSON.parse(raw) : {});
			} catch {
				reject(new Error("Invalid JSON"));
			}
		});
	});
}

function send(res, status, data) {
	res.writeHead(status, { "Content-Type": "application/json" });
	res.end(data != null ? JSON.stringify(data) : undefined);
}

function idFromPath(path) {
	return Number(path.split("/").pop());
}

const TODO_PATH = /^\/api\/todos\/(\d+)$/;

const server = createServer(async (req, res) => {
	const { pathname } = new URL(req.url, `http://localhost:${PORT}`);
	const method = req.method;

	try {
		if (pathname === "/api/todos") {
			if (method === "GET") {
				return send(res, 200, listTodos());
			}
			if (method === "POST") {
				const { title } = await parseBody(req);
				if (!title?.trim()) return send(res, 400, { error: "title is required" });
				return send(res, 201, createTodo(title.trim()));
			}
		}

		if (TODO_PATH.test(pathname)) {
			const id = idFromPath(pathname);
			if (method === "GET") {
				const todo = getTodo(id);
				return todo
					? send(res, 200, todo)
					: send(res, 404, { error: "not found" });
			}
			if (method === "PUT") {
				const body = await parseBody(req);
				const todo = updateTodo(id, body);
				return todo
					? send(res, 200, todo)
					: send(res, 404, { error: "not found" });
			}
			if (method === "DELETE") {
				const { changes } = deleteTodo(id);
				return changes > 0
					? send(res, 204, null)
					: send(res, 404, { error: "not found" });
			}
		}

		send(res, 404, { error: "not found" });
	} catch (err) {
		console.error(err);
		send(res, 500, { error: "internal server error" });
	}
});

server.listen(PORT, () => {
	console.log(`API server listening on http://localhost:${PORT}`);
});
