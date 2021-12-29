import React, { useState, useEffect, useRef } from 'react';
import DisplayTodo from './components/DisplayTodo';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import axios from 'axios';
import logo from './chisel-labs.png';

const App = () => {
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
      <div className="todoHeader">
        <div className="todoHeaderName">to-do list</div>
        <div className="todoHeaderDot">.</div>
        <div className="todoHeaderLogo">
          <img src={logo} width="35" height="35" alt="Chisel Labs"></img>
        </div>
        <span>Chisel</span>
      </div>

      <div className="divBoardSection">
        <div className="divBoardLeftSection">
          <button className="divAddBoardButton" onClick={handleAddBoard}>
            <i className="fas fa-plus"></i> Create new board
          </button>
          <div className="divBoardListSection">
            {boards.map((board, index) => {
              return (
                <div className="divBoardSubSection">
                  <span
                    onClick={() => {
                      setSelectedBoardId(board.id);
                    }}
                    className="IconActiveState"
                  >
                    <i className="fas fa-clipboard"></i> Board {index + 1}{' '}
                    {board.id === selectedBoardId && (
                      <i class="fas fa-circle"></i>
                    )}
                  </span>
                  <button
                    className="divDeleteBoardButton"
                    onClick={() => {
                      handleDeleteBoard(board.id);
                    }}
                  >
                    <i className="far fa-trash-alt"></i>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        {selectedBoard && (
          <div className="divBoardRightSection">
            <div className="divBoardAddSectionBody">
              <div className="divBoardAddSection">
                <div className="divTaskHeader">Active Tasks</div>
                <div className="divTaskHeaderLineOne"></div>
                <form onSubmit={handleSubmit}>
                  <label className="divAddInput">
                    <input
                      ref={todoNameRef}
                      type="text"
                      placeholder="Write a new task"
                    />
                    <button className="divButtonAdd" onClick={handleAddTodo}>
                      <i class="fas fa-plus-square"></i>
                    </button>
                    <button
                      className="divButtonClear"
                      onClick={handleClearBoardView}
                    >
                      <i class="fa fa-backspace"></i>
                    </button>
                  </label>
                </form>
              </div>
              <div>
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
            </div>

            <div className="divCompletedTasksSection">
              <div className="divTaskHeader">Completed Tasks</div>
              <div className="divTaskHeaderLineTwo"></div>
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
      </div>
    </>
  );
};

export default App;
