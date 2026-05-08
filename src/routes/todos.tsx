import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useReducer, useRef, useState } from "react";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/todos")({
	component: TodosPage,
});

interface Todo {
	id: number;
	title: string;
	completed: boolean;
	created_at: string;
}

type Action =
	| { type: "set"; todos: Todo[] }
	| { type: "add"; todo: Todo }
	| { type: "update"; todo: Todo }
	| { type: "remove"; id: number };

function todosReducer(state: Todo[], action: Action): Todo[] {
	switch (action.type) {
		case "set":
			return action.todos;
		case "add":
			return [action.todo, ...state];
		case "update":
			return state.map((t) => (t.id === action.todo.id ? action.todo : t));
		case "remove":
			return state.filter((t) => t.id !== action.id);
	}
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
	const res = await fetch(path, {
		...init,
		headers: { "Content-Type": "application/json", ...init?.headers },
	});
	if (res.status === 204) return undefined as T;
	if (!res.ok) throw new Error(`${res.status}`);
	return res.json();
}

function TodosPage() {
	const [todos, dispatch] = useReducer(todosReducer, []);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		apiFetch<Todo[]>("/api/todos")
			.then((data) => dispatch({ type: "set", todos: data }))
			.catch(() => setError("Failed to load todos"))
			.finally(() => setLoading(false));
	}, []);

	async function handleAdd(e: React.SyntheticEvent) {
		e.preventDefault();
		const title = input.trim();
		if (!title) return;
		setInput("");
		try {
			const todo = await apiFetch<Todo>("/api/todos", {
				method: "POST",
				body: JSON.stringify({ title }),
			});
			dispatch({ type: "add", todo });
		} catch {
			setError("Failed to add todo");
		}
		inputRef.current?.focus();
	}

	async function handleToggle(todo: Todo) {
		try {
			const updated = await apiFetch<Todo>(`/api/todos/${todo.id}`, {
				method: "PUT",
				body: JSON.stringify({ completed: !todo.completed }),
			});
			dispatch({ type: "update", todo: updated });
		} catch {
			setError("Failed to update todo");
		}
	}

	async function handleDelete(id: number) {
		try {
			await apiFetch(`/api/todos/${id}`, { method: "DELETE" });
			dispatch({ type: "remove", id });
		} catch {
			setError("Failed to delete todo");
		}
	}

	const remaining = todos.filter((t) => !t.completed).length;

	return (
		<div className="flex-1 overflow-auto p-8">
			<div className="max-w-xl mx-auto">
				{/* Header */}
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-slate-800">Todos</h1>
					{todos.length > 0 && (
						<p className="text-sm text-slate-500 mt-1">
							{remaining} of {todos.length} remaining
						</p>
					)}
				</div>

				{/* Add form */}
				<form onSubmit={handleAdd} className="flex gap-2 mb-6">
					<input
						ref={inputRef}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="What needs to be done?"
						className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					/>
					<button
						type="submit"
						disabled={!input.trim()}
						className="px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
					>
						Add
					</button>
				</form>

				{/* Error */}
				{error && (
					<div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between">
						{error}
						<button
							type="button"
							onClick={() => setError(null)}
							className="text-red-400 hover:text-red-600 ml-3"
						>
							✕
						</button>
					</div>
				)}

				{/* List */}
				{loading ? (
					<div className="text-center py-12 text-slate-400 text-sm">
						Loading…
					</div>
				) : todos.length === 0 ? (
					<div className="text-center py-12 text-slate-400 text-sm">
						No todos yet. Add one above.
					</div>
				) : (
					<ul className="flex flex-col gap-1">
						{todos.map((todo) => (
							<li
								key={todo.id}
								className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white border border-slate-100 hover:border-slate-200 group transition-colors"
							>
								<button
									type="button"
									onClick={() => handleToggle(todo)}
									aria-label={
										todo.completed ? "Mark incomplete" : "Mark complete"
									}
									className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
										todo.completed
											? "bg-indigo-600 border-indigo-600"
											: "border-slate-300 hover:border-indigo-400"
									}`}
								>
									{todo.completed && (
										<svg
											className="w-3 h-3 text-white"
											viewBox="0 0 12 12"
											fill="none"
										>
											<path
												d="M2 6l3 3 5-5"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									)}
								</button>
								<span
									className={`flex-1 text-sm ${
										todo.completed
											? "line-through text-slate-400"
											: "text-slate-700"
									}`}
								>
									{todo.title}
								</span>
								<button
									type="button"
									onClick={() => handleDelete(todo.id)}
									aria-label="Delete"
									className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"
								>
									<Trash2 size={15} />
								</button>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
