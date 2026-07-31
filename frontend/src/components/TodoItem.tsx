import React from "react";
import type { Todo } from "../types/todo";

interface TodoItemProps {
  todo: Todo;
  toggleTodo: (id: number) => Promise<void>;
  toggleFavorite: (id: number) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  disabled: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  toggleTodo,
  toggleFavorite,
  deleteTodo,
  disabled,
}) => {
  return (
    <li className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
        disabled={disabled}
        className="mt-1 cursor-pointer"
      />
      <div className="min-w-0 flex-1">
        <p className={todo.completed ? "line-through text-gray-400" : ""}>
          {todo.title}
        </p>
        {todo.description && (
          <p
            className={`mt-1 text-sm ${
              todo.completed
                ? "line-through text-gray-400"
                : "text-gray-500"
            }`}
          >
            {todo.description}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => toggleFavorite(todo.id)}
        disabled={disabled}
        className={`text-sm disabled:opacity-50 cursor-pointer ${
          todo.favorite
            ? "text-amber-600 hover:text-amber-800"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        {todo.favorite ? "Unfavorite" : "Favorite"}
      </button>
      <button
        type="button"
        onClick={() => deleteTodo(todo.id)}
        disabled={disabled}
        className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50 cursor-pointer"
      >
        Delete
      </button>
    </li>
  );
};

export default TodoItem;
