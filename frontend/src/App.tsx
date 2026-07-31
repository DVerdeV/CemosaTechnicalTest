import { useCallback, useEffect, useRef, useState } from "react";
import type { Todo } from "./types/todo";
import {
  createTodo,
  deleteTodo,
  getTodos,
  toggleTodoStatus,
} from "./api/todo";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const pendingRef = useRef(false);
  const latestLoadRef = useRef(0);

  const loadTodos = useCallback(async () => {
    const loadId = ++latestLoadRef.current;
    try {
      const data = await getTodos();
      if (loadId !== latestLoadRef.current) return;
      setTodos(data);
      setError("");
    } catch {
      if (loadId !== latestLoadRef.current) return;
      setError("Unable to load tasks.");
    }
  }, []);

  useEffect(() => {
    void loadTodos();
  }, [loadTodos]);

  const addTodo = async () => {
    if (!title.trim() || pendingRef.current) return;
    pendingRef.current = true;
    setIsPending(true);
    try {
      await createTodo(title.trim());
      setTitle("");
      await loadTodos();
    } catch {
      setError("Unable to add the task.");
    } finally {
      pendingRef.current = false;
      setIsPending(false);
    }
  };

  const toggleTodo = async (id: number) => {
    if (pendingRef.current) return;
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    pendingRef.current = true;
    setIsPending(true);
    try {
      await toggleTodoStatus(id, todo.completed);
      await loadTodos();
    } catch {
      setError("Unable to update the task.");
    } finally {
      pendingRef.current = false;
      setIsPending(false);
    }
  };

  const removeTodo = async (id: number) => {
    if (pendingRef.current) return;
    pendingRef.current = true;
    setIsPending(true);
    try {
      await deleteTodo(id);
      await loadTodos();
    } catch {
      setError("Unable to delete the task.");
    } finally {
      pendingRef.current = false;
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">ToDo List</h1>

        <TodoForm
          title={title}
          setTitle={setTitle}
          addTodo={addTodo}
          disabled={isPending}
        />

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <TodoList
          todos={todos}
          toggleTodo={toggleTodo}
          deleteTodo={removeTodo}
          disabled={isPending}
        />
      </div>
    </div>
  );
}

export default App;
