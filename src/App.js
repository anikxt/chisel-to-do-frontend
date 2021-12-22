import React, { useState, useRef } from 'react';
import DisplayTodo from './components/DisplayTodo';
import useBoards from './hooks/useBoards';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

export default function App() {
  const [boards, setBoards] = useBoards([{ id: uuidv4(), todos: [] }]);
  const [selectedBoardId, setSelectedBoardId] = useState(boards?.[0]?.id);
  const selectedBoard = boards.find((board) => board.id === selectedBoardId);
  const todoNameRef = useRef();

  function handleAddBoard() {
    setBoards((prevBoards) => {
      const newBoard = { id: uuidv4(), todos: [] };
      setSelectedBoardId(newBoard.id);
      return [...prevBoards, newBoard];
    });
  }

  function handleDeleteBoard(id) {
    let newBoards = [...boards];
    newBoards = newBoards.filter((board) => board.id !== id);
    setBoards(newBoards);
  }

  function handleAddTodo() {
    const name = todoNameRef.current.value;
    if (name === '') return;
    const newBoards = [...boards];
    const board = newBoards.find((board) => board.id === selectedBoardId);
    board.todos = [...board.todos, { name, completed: false, id: uuidv4() }];
    todoNameRef.current.value = null;
    setBoards(newBoards);
  }

  function handleSubmit(e) {
    handleAddTodo();
    e.preventDefault();
  }

  function handleClearBoardView() {
    todoNameRef.current.value = null;
  }

  function handleToggleTodo(id) {
    const newBoards = [...boards];
    const board = newBoards.find((board) => board.id === selectedBoardId);
    const todo = board.todos.find((todo) => todo.id === id);
    todo.completed = !todo.completed;
    setBoards(newBoards);
  }

  function handleClearTodo(id) {
    const newBoards = [...boards];
    const board = newBoards.find((board) => board.id === selectedBoardId);
    board.todos = board.todos.filter((todo) => todo.id !== id);
    setBoards(newBoards);
  }

  function handleUpdateTodo(id, text) {
    const newBoards = [...boards];
    const board = newBoards.find((board) => board.id === selectedBoardId);
    const todo = board.todos.find((todo) => todo.id === id);
    todo.name = text;
    setBoards(newBoards);
  }

  return (
    <>
      <h1>TODO APP</h1>
      <div className="boardBar">
        {boards.map((board, index) => {
          return (
            <div className="board">
              <span
                onClick={() => {
                  setSelectedBoardId(board.id);
                }}
              >
                Board {index + 1} {board.id === selectedBoardId && '[ ACTIVE ]'}
              </span>
              <button
                className="deleteBoardBtn"
                onClick={() => {
                  handleDeleteBoard(board.id);
                }}
              >
                Delete
              </button>
            </div>
          );
        })}
        <button className="addBoardBtn" onClick={handleAddBoard}>
          Add Board
        </button>
      </div>
      {selectedBoard && (
        <div className="divBoardSubsection">
          <div className="divNewTasks">
            <h3>New Tasks</h3>
            {selectedBoard.todos
              .filter((todo) => {
                return !todo.completed;
              })
              .map((todo) => {
                return (
                  <DisplayTodo
                    todo={todo}
                    handleUpdateTodo={handleUpdateTodo}
                    handleToggleTodo={handleToggleTodo}
                    handleClearTodo={handleClearTodo}
                    showCompleteTodo={true}
                  />
                );
              })}
          </div>

          <div className="divBoardView">
            <h3>Add tasks to Board</h3>
            <form onSubmit={handleSubmit}>
              <label>
                <input ref={todoNameRef} type="text" />
                <button onClick={handleAddTodo}>Add Todo</button>
                <button onClick={handleClearBoardView}>Clear</button>
              </label>
            </form>
          </div>

          <div className="divCompletedTasks">
            <h3>Completed Tasks</h3>
            {selectedBoard.todos
              .filter((todo) => {
                return todo.completed;
              })
              .map((todo) => {
                return (
                  <DisplayTodo
                    todo={todo}
                    showCompleteTodo={false}
                    handleClearTodo={handleClearTodo}
                  />
                );
              })}
          </div>
        </div>
      )}
    </>
  );
}
