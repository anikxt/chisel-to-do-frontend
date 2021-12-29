import React, { useState } from 'react';
import './displayTodo.css';

const DisplayTodo = ({
  todo,
  handleUpdateTodo,
  handleToggleTodo,
  handleClearTodo,
  showCompleteTodo,
}) => {
  const [editTodo, setEditTodo] = useState(false);
  const [todoName, setTodoName] = useState(todo.name);

  function handleTodoChange(id, text) {
    console.log(text);
    setTodoName(text);
    handleUpdateTodo(id, text);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (todoName === '') {
      handleClearTodo(todo.id);
      return;
    }
    setEditTodo(false);
  }

  if (!showCompleteTodo) {
    return (
      <div className="divCompletedTask">
        <span className="strikethrough">{todo.name}</span>
        <button
          className="divButtonRemove"
          onClick={() => handleClearTodo(todo.id)}
        >
          <i class="fas fa-minus-circle"></i>
        </button>
      </div>
    );
  }
  return (
    <div className="divActiveTask">
      <input
        className="ui checkbox"
        type="checkbox"
        checked={todo.isComplete}
        onChange={() => handleToggleTodo(todo.id)}
      />
      {editTodo ? (
        <form className="divEditTodo" onSubmit={handleSubmit}>
          <input
            onChange={(e) => handleTodoChange(todo.id, e.target.value)}
            value={todo.name}
          />
        </form>
      ) : (
        <span>{todo.name}</span>
      )}
      <button
        className="divButtonEdit"
        onClick={() => {
          setEditTodo(!editTodo);
        }}
      >
        <i className="fas fa-edit"></i>
      </button>
      <button
        className="divButtonDelete"
        onClick={() => handleClearTodo(todo.id)}
      >
        <i className="far fa-trash-alt"></i>
      </button>
    </div>
  );
};

export default DisplayTodo;
