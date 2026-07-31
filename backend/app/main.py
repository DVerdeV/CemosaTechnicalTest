import json
from pathlib import Path
from threading import RLock

from fastapi import FastAPI, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator

DATA_FILE = Path(__file__).parent / "todos.json"
DATA_LOCK = RLock()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TodoCreate(BaseModel):
    title: str
    description: str = ""


class Todo(TodoCreate):
    id: int
    completed: bool = False
    favorite: bool = False


class TodoUpdate(BaseModel):
    completed: bool | None = None
    favorite: bool | None = None

    @field_validator("completed", "favorite")
    @classmethod
    def reject_null(cls, value: bool | None) -> bool:
        if value is None:
            raise ValueError("Value cannot be null")
        return value


def load_todos() -> list[Todo]:
    """Load todos from the JSON file."""
    with DATA_LOCK:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return [Todo(**todo) for todo in json.load(f)]


def save_todos(todos: list[Todo]):
    """
    Save todos to the JSON file.

    Args:
        todos (list[Todo]): List of Todo objects to save.
    """
    temporary_file = DATA_FILE.with_suffix(".tmp")
    with DATA_LOCK:
        with open(temporary_file, "w", encoding="utf-8") as f:
            json.dump([todo.model_dump() for todo in todos], f, indent=2)
        temporary_file.replace(DATA_FILE)


@app.get("/todos", response_model=list[Todo])
def get_todos():
    """Get all todos."""
    return load_todos()


@app.post("/todos", response_model=Todo, status_code=status.HTTP_201_CREATED)
def add_todo(todo: TodoCreate):
    """
    Add a new todo.

    Args:
        todo (TodoCreate): The todo to add.
    """
    with DATA_LOCK:
        todos = load_todos()
        new_todo = Todo(
            id=max((existing.id for existing in todos), default=0) + 1,
            **todo.model_dump(),
        )
        todos.append(new_todo)
        save_todos(todos)
        return new_todo


@app.patch("/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id: int, update: TodoUpdate):
    """Update a todo's completion or favorite status."""
    with DATA_LOCK:
        todos = load_todos()

        for index, todo in enumerate(todos):
            if todo.id == todo_id:
                updated_todo = todo.model_copy(
                    update=update.model_dump(exclude_unset=True)
                )
                todos[index] = updated_todo
                save_todos(todos)
                return updated_todo

    raise HTTPException(status_code=404, detail="Todo not found")


@app.delete("/todos/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(todo_id: int):
    """Delete a todo."""
    with DATA_LOCK:
        todos = load_todos()
        remaining_todos = [todo for todo in todos if todo.id != todo_id]

        if len(remaining_todos) == len(todos):
            raise HTTPException(status_code=404, detail="Todo not found")

        save_todos(remaining_todos)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
