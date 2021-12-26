import React, { useState } from 'react';

export default function DisplayTodo({
  todo,
  handleUpdateTodo,
  handleToggleTodo,
  handleClearTodo,
  showCompleteTodo,
}) {
  const [editTodo, setEditTodo] = useState(false);

  function handleSubmit(e) {
    setEditTodo(false);
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
      <input
        type="checkbox"
        checked={todo.isComplete}
        onChange={() => handleToggleTodo(todo.id)}
      />
      {editTodo ? (
        <form onSubmit={handleSubmit}>
          <input
            onChange={(e) => handleUpdateTodo(todo.id, e.target.value)}
            value={todo.name}
          />
        </form>
      ) : (
        <span>{todo.name}</span>
      )}
      <button
        onClick={() => {
          setEditTodo(!editTodo);
        }}
      >
        Edit
      </button>
      <button onClick={() => handleClearTodo(todo.id)}>Clear Task</button>
    </div>
  );
}
