import { useState } from "react";

const useUndoRedo = () => {
  const [history, setHistory] = useState([]);
  const [currentState, setCurrentState] = useState(null);

  const addAction = (action) => {
    setHistory((prevHistory) => [...prevHistory, action]);
    setCurrentState(action);
  };

  const undo = () => {
    const prevState = history[history.length - 2];
    setCurrentState(prevState);
    setHistory(history.slice(0, history.length - 1));
  };

  const redo = () => {
    setHistory((prevHistory) => [...prevHistory, currentState]);
  };

  return {
    currentState,
    addAction,
    undo,
    redo,
  };
};

export default useUndoRedo;
