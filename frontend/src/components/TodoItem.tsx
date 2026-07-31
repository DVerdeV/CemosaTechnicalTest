import React from "react";
import type { Todo } from "../types/todo";

interface TodoItemProps {
  todo: Todo;
  toggleTodo: (id: number) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  disabled: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  toggleTodo,
  deleteTodo,
  disabled,
}) => {
  return (
    <li
      key={todo.id}
      className={`flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200 ${
        todo.completed ? "line-through text-gray-400" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
        disabled={disabled}
        className="cursor-pointer"
      />
      <span className="flex-1">{todo.title}</span>
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
