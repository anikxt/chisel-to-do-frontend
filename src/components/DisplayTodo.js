import React, { useState } from 'react';

export default function DisplayTodo({
  todo,
  handleUpdateTodo,
  handleToggleTodo,
  handleClearTodo,
  showCompleteTodo,
}) {
  const [edit, setEdit] = useState(false);

  function handleSubmit(e) {
    setEdit(false);
    e.preventDefault();
  }

  if (!showCompleteTodo) {
    return (
      <div>
        <span>{todo.name}</span>
        <button onClick={() => handleClearTodo(todo.id)}>Clear Task</button>
      </div>
    );
  }
  return (
    <div>
      {edit ? (
        <form onSubmit={handleSubmit}>
          <input
            onChange={(e) => handleUpdateTodo(todo.id, e.target.value)}
            value={todo.name}
          />
        </form>
      ) : (
        <span>{todo.name}</span>
      )}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => handleToggleTodo(todo.id)}
      />
      <button
        onClick={() => {
          setEdit(!edit);
        }}
      >
        Edit
      </button>
      <button onClick={() => handleClearTodo(todo.id)}>Clear Task</button>
    </div>
  );
}
