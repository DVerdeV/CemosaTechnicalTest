import { useCallback, useEffect, useRef, useState } from "react";
import type { Todo } from "./types/todo";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "./api/todo";
import TodoForm from "./components/TodoForm";
import TodoSection from "./components/TodoSection";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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

  const mutateTodos = async (
    mutation: () => Promise<void>,
    errorMessage: string
  ) => {
    if (pendingRef.current) return false;
    pendingRef.current = true;
    setIsPending(true);
    try {
      await mutation();
      await loadTodos();
      return true;
    } catch {
      setError(errorMessage);
      return false;
    } finally {
      pendingRef.current = false;
      setIsPending(false);
    }
  };

  const addTodo = async () => {
    if (!title.trim()) return;
    const created = await mutateTodos(
      () => createTodo(title.trim(), description.trim()),
      "Unable to add the task."
    );
    if (created) {
      setTitle("");
      setDescription("");
    }
  };

  const toggleTodo = async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    await mutateTodos(
      () => updateTodo(id, { completed: !todo.completed }),
      "Unable to update the task."
    );
  };

  const toggleFavorite = async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    await mutateTodos(
      () => updateTodo(id, { favorite: !todo.favorite }),
      "Unable to update the favorite."
    );
  };

  const removeTodo = async (id: number) => {
    await mutateTodos(
      () => deleteTodo(id),
      "Unable to delete the task."
    );
  };

  const favoriteTodos = todos.filter((todo) => todo.favorite);
  const regularTodos = todos.filter((todo) => !todo.favorite);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">ToDo List</h1>

        <TodoForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          addTodo={addTodo}
          disabled={isPending}
        />

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <div className="space-y-6">
          <TodoSection
            title="Favorites"
            todos={favoriteTodos}
            emptyMessage="No favorite tasks yet."
            toggleTodo={toggleTodo}
            toggleFavorite={toggleFavorite}
            deleteTodo={removeTodo}
            disabled={isPending}
          />
          <TodoSection
            title="Tasks"
            todos={regularTodos}
            emptyMessage="No tasks yet."
            toggleTodo={toggleTodo}
            toggleFavorite={toggleFavorite}
            deleteTodo={removeTodo}
            disabled={isPending}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
