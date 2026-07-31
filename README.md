# Todo App

A small full-stack Todo application built with FastAPI, React, TypeScript, and
Vite. Tasks are persisted in a JSON file by the backend.

## Features

- Create tasks with an optional description
- Mark tasks as completed
- Delete tasks
- Mark and unmark favorites
- View favorite tasks in a separate section
- Automatically refresh tasks after every change

## Requirements

- Python 3.10 to 3.13
- Node.js and npm

## Setup

Create and activate a backend virtual environment:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Install the frontend dependencies:

```bash
cd ../frontend
npm install
```

## Run

Keep the Python virtual environment active, then start both applications from
the `frontend` directory:

```bash
npm run dev
```

Open `http://localhost:5173`. The API is available at
`http://localhost:8000`.

## API

- `GET /todos` returns all tasks.
- `POST /todos` creates a task.
- `PATCH /todos/{id}` updates completion or favorite status.
- `DELETE /todos/{id}` deletes a task.

Task data is stored in `backend/app/todos.json`.
