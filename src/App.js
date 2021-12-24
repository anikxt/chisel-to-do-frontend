import React, { useState, useRef } from 'react';
import DisplayTodo from './components/DisplayTodo';
import useBoards from './hooks/useBoards';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import axios from 'axios';

const DEFAULT_BOARD = { id: uuidv4(), name: 'Board 1' };
const DEFAULT_TODO = {
  id: uuidv4(),
  name: 'todos',
  completed: false,
  boardId: DEFAULT_BOARD.id,
};

export default function App() {
  const [boards, setBoards] = useState([DEFAULT_BOARD]);
  const [selectedBoardId, setSelectedBoardId] = useState(boards?.[0]?.id);
  const [todos, setTodos] = useState([DEFAULT_TODO]);
  const selectedBoard = boards.find((board) => board.id === selectedBoardId);
  const selectedTodos = todos.filter(
    (todo) => todo.boardId === selectedBoardId
  );

  const todoNameRef = useRef();

  function handleAddBoard() {
    const id = uuidv4();
    const newBoard = { id, name: id };
    setBoards((prevBoards) => {
      return [...prevBoards, newBoard];
    });
    setSelectedBoardId(newBoard.id);
  }

  function handleDeleteBoard(id) {
    let newBoards = [...boards];
    newBoards = newBoards.filter((board) => board.id !== id);
    setBoards(newBoards);
  }

  function handleAddTodo() {
    const name = todoNameRef.current.value;
    if (name === '') return;
    const newTodos = [
      ...todos,
      { name, completed: false, id: uuidv4(), boardId: selectedBoardId },
    ];
    todoNameRef.current.value = null;
    setTodos(newTodos);
  }

  function handleSubmit(e) {
    handleAddTodo();
    e.preventDefault();
  }

  function handleClearBoardView() {
    todoNameRef.current.value = null;
  }

  function handleToggleTodo(id) {
    const newTodos = [...todos];
    const todo = newTodos.find((todo) => todo.id === id);
    todo.completed = !todo.completed;
    setTodos(newTodos);
  }

  function handleClearTodo(id) {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  }

  function handleUpdateTodo(id, text) {
    const newTodos = [...todos];
    const todo = newTodos.find((todo) => todo.id === id);
    todo.name = text;
    setTodos(newTodos);
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
                {board.name} {board.id === selectedBoardId && '[ ACTIVE ]'}
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
            {selectedTodos
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
            {selectedTodos
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
