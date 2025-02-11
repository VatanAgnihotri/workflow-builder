import { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Panel,
  NodeTypes,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '@/store/workflowStore';
import TaskNode from './nodes/TaskNode';
import ConditionNode from './nodes/ConditionNode';
import NotificationNode from './nodes/NotificationNode';
import { Button } from '@/components/ui/button';
import { Undo2, Redo2, Download, Upload } from 'lucide-react';

const nodeTypes: NodeTypes = {
  task: TaskNode,
  condition: ConditionNode,
  notification: NotificationNode,
};

export default function FlowCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    undo,
    redo,
    selectNode,
  } = useWorkflowStore();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (!type || !reactFlowBounds || !reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      addNode(type, position);
    },
    [addNode, reactFlowInstance]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    selectNode(node);
  }, [selectNode]);

  const exportFlow = () => {
    if (!reactFlowInstance) return;
    const flow = reactFlowInstance.toObject();
    const dataStr = JSON.stringify(flow);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'workflow.json');
    linkElement.click();
  };

  const importFlow = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const flow = JSON.parse(e.target?.result as string);
          useWorkflowStore.setState({ nodes: flow.nodes, edges: flow.edges });
        } catch (error) {
          console.error('Failed to parse workflow file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="h-[600px] bg-background border rounded-lg" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onInit={setReactFlowInstance}
        deleteKeyCode="Delete"
        fitView
      >
        <Background />
        <Controls />
        <Panel position="top-right" className="flex gap-2">
          <Button variant="outline" size="icon" onClick={undo}>
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={redo}>
            <Redo2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={exportFlow}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" asChild>
            <label>
              <Upload className="h-4 w-4" />
              <input
                type="file"
                className="hidden"
                accept=".json"
                onChange={importFlow}
              />
            </label>
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
}