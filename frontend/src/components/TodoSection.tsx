import React from "react";
import type { Todo } from "../types/todo";
import TodoList from "./TodoList";

interface TodoSectionProps {
  title: string;
  todos: Todo[];
  emptyMessage: string;
  toggleTodo: (id: number) => Promise<void>;
  toggleFavorite: (id: number) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  disabled: boolean;
}

const TodoSection: React.FC<TodoSectionProps> = ({
  title,
  todos,
  emptyMessage,
  toggleTodo,
  toggleFavorite,
  deleteTodo,
  disabled,
}) => (
  <section>
    <h2 className="mb-2 text-lg font-semibold text-gray-700">{title}</h2>
    {todos.length > 0 ? (
      <TodoList
        todos={todos}
        toggleTodo={toggleTodo}
        toggleFavorite={toggleFavorite}
        deleteTodo={deleteTodo}
        disabled={disabled}
      />
    ) : (
      <p className="text-sm text-gray-500">{emptyMessage}</p>
    )}
  </section>
);

export default TodoSection;
