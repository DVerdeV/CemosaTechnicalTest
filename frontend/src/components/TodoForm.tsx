// src/components/TodoForm.tsx
import React from "react";

interface TodoFormProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  addTodo: () => Promise<void>;
  disabled: boolean;
}

const TodoForm: React.FC<TodoFormProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  addTodo,
  disabled,
}) => {
  return (
    <div className="grid gap-2 mb-8 sm:grid-cols-[1fr_auto]">
      <div className="grid gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          disabled={disabled}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          disabled={disabled}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        onClick={addTodo}
        disabled={disabled}
        className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition cursor-pointer"
      >
        Add
      </button>
    </div>
  );
};

export default TodoForm;
