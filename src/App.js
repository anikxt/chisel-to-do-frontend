import React, { useState, useEffect, useRef } from 'react';
import DisplayTodo from './components/DisplayTodo';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import axios from 'axios';

export default function App() {
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState(
    parseInt(localStorage.getItem('selectedBoardId') || '0')
  );
  const [todos, setTodos] = useState([]);
  const selectedBoard = boards.find((board) => board.id === selectedBoardId);
  const selectedTodos = todos.filter(
    (todo) => todo.boardId === selectedBoardId
  );

  useEffect(() => {
    localStorage.setItem('selectedBoardId', selectedBoardId);
  }, [selectedBoardId]);

  const todoNameRef = useRef();

  useEffect(() => {
    axios.get('http://localhost:1337/board').then((res) => {
      setBoards(res.data);
    });
    axios.get('http://localhost:1337/todo').then((res) => {
      setTodos(res.data);
    });
  }, []);

  const handleAddBoard = async () => {
    try {
      const id = uuidv4();
      const resp = await axios.post('http://localhost:1337/board', {
        name: id,
      });
      const newBoard = resp.data;
      setBoards((prevBoards) => {
        return [...prevBoards, newBoard];
      });
      setSelectedBoardId(newBoard.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBoard = async (id) => {
    try {
      let newBoards = [...boards];
      newBoards = newBoards.filter((board) => board.id !== id);
      await axios.delete('http://localhost:1337/board', {
        data: {
          id: parseInt(id),
        },
      });
      setBoards(newBoards);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddTodo = async () => {
    try {
      const name = todoNameRef.current.value;
      if (name === '') return;

      todoNameRef.current.value = null;
      const resp = await axios.post('http://localhost:1337/todo', {
        name: name,
        isComplete: false,
        boardId: selectedBoardId,
      });
      const newTodos = [...todos, resp.data];
      setTodos(newTodos);
    } catch (err) {
      console.error(err);
    }
  };

  function handleSubmit(e) {
    handleAddTodo();
    e.preventDefault();
  }

  function handleClearBoardView() {
    todoNameRef.current.value = null;
  }

  const handleToggleTodo = async (id) => {
    try {
      const newTodos = [...todos];
      const todo = newTodos.find((todo) => todo.id === id);
      todo.isComplete = !todo.isComplete;
      console.log(todo.isComplete);
      await axios.put('http://localhost:1337/todo', {
        ...todo,
      });
      setTodos(newTodos);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearTodo = async (id) => {
    try {
      const newTodos = todos.filter((todo) => todo.id !== id);
      await axios.delete('http://localhost:1337/todo', {
        data: {
          id: parseInt(id),
        },
      });
      setTodos(newTodos);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTodo = async (id, text) => {
    try {
      const newTodos = [...todos];
      const todo = newTodos.find((todo) => todo.id === id);
      todo.name = text;
      await axios.put('http://localhost:1337/todo', {
        ...todo,
      });
      setTodos(newTodos);
    } catch (err) {
      console.error(err);
    }
  };

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
            {selectedTodos
              .filter((todo) => {
                return !todo.isComplete;
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
                return todo.isComplete;
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
