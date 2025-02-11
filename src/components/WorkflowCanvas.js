import React, { useState } from 'react';
import ReactFlow, { addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';

const WorkflowCanvas = ({ workflow, removeNode, updateNode }) => {
  const [elements, setElements] = useState(workflow);

  const onElementsRemove = (elementsToRemove) => {
    // Apply changes for removing nodes and edges
    const updatedNodes = applyNodeChanges(
      elementsToRemove.filter(el => el.id.includes('node'))
    , elements);

    const updatedEdges = applyEdgeChanges(
      elementsToRemove.filter(el => el.id.includes('edge'))
    , elements);

    const updatedElements = [...updatedNodes, ...updatedEdges];
    setElements(updatedElements);

    // Remove the corresponding node data from the state
    removeNode(elementsToRemove[0].id);
  };

  const onConnect = (params) => setElements((els) => addEdge(params, els));

  return (
    <ReactFlow
      elements={elements}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      deleteKeyCode={46} // Delete key for removing nodes
    />
  );
};

export default WorkflowCanvas;
