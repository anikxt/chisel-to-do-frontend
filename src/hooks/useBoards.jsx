import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function useBoards() {
  const [boards, setBoards] = useState(
    JSON.parse(localStorage.getItem('boards')) || [{ id: uuidv4(), todos: [] }]
  );
  useEffect(() => {
    localStorage.setItem('boards', JSON.stringify(boards));
  }, [boards]);

  return [boards, setBoards];
}
