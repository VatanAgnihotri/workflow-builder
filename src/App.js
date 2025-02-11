import React, { useState } from 'react';
import WorkflowCanvas from './components/WorkflowCanvas';
import WorkflowDataTable from './components/WorkflowDataTable';
import Sidebar from './components/Sidebar';
import useUndoRedo from './hooks/useUndoRedo';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

const AppWrapper = styled.div`
  display: flex;
`;

const App = () => {
  const [workflow, setWorkflow] = useState([]);
  const { currentState, addAction, undo, redo } = useUndoRedo();
  
  const addNode = (type) => {
    const newNode = {
      id: uuidv4(),
      type,
      name: `${type} Node`,
      status: 'Pending',
    };
    const newWorkflow = [...workflow, newNode];
    setWorkflow(newWorkflow);
    addAction(newWorkflow);
  };

  const removeNode = (id) => {
    const newWorkflow = workflow.filter(node => node.id !== id);
    setWorkflow(newWorkflow);
    addAction(newWorkflow);
  };

  const updateNode = (id, updatedData) => {
    const newWorkflow = workflow.map((node) =>
      node.id === id ? { ...node, ...updatedData } : node
    );
    setWorkflow(newWorkflow);
    addAction(newWorkflow);
  };

  return (
    <AppWrapper>
      <Sidebar addNode={addNode} />
      <div style={{ flex: 1 }}>
        <WorkflowCanvas
          workflow={workflow}
          removeNode={removeNode}
          updateNode={updateNode}
        />
        <WorkflowDataTable
          nodes={workflow}
          updateNode={updateNode}
        />
      </div>
    </AppWrapper>
  );
};

export default App;
