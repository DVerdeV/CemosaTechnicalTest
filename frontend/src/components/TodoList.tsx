import React from "react";
import type { Todo } from "../types/todo";
import TodoItem from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  toggleTodo: (id: number) => Promise<void>;
  toggleFavorite: (id: number) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  disabled: boolean;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  toggleTodo,
  toggleFavorite,
  deleteTodo,
  disabled,
}) => {
  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleTodo={toggleTodo}
          toggleFavorite={toggleFavorite}
          deleteTodo={deleteTodo}
          disabled={disabled}
        />
      ))}
    </ul>
  );
};

export default TodoList;
