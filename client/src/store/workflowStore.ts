import { create } from 'zustand';
import { Edge, Node, addEdge, Connection, NodeChange, EdgeChange, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { NodeConfig } from '@shared/schema';

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  history: { nodes: Node[]; edges: Edge[] }[];
  currentStep: number;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  updateNodeConfig: (nodeId: string, config: NodeConfig) => void;
  selectNode: (node: Node | null) => void;
  addNode: (type: string, position: { x: number; y: number }) => void;
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  history: [],
  currentStep: -1,

  setNodes: (nodes) => {
    set({ nodes });
    get().saveToHistory();
  },

  setEdges: (edges) => {
    set({ edges });
    get().saveToHistory();
  },

  onNodesChange: (changes) => {
    const { nodes, selectedNode } = get();
    // Use ReactFlow's built-in changes handler
    const newNodes = applyNodeChanges(changes, nodes);

    // Update selected node if it was modified
    const updatedSelectedNode = selectedNode
      ? newNodes.find((n) => n.id === selectedNode.id) ?? null
      : null;

    set({ nodes: newNodes, selectedNode: updatedSelectedNode });
    get().saveToHistory();
  },

  onEdgesChange: (changes) => {
    const { edges } = get();
    const newEdges = applyEdgeChanges(changes, edges);
    set({ edges: newEdges });
    get().saveToHistory();
  },

  onConnect: (connection) => {
    const { edges } = get();
    set({ edges: addEdge(connection, edges) });
    get().saveToHistory();
  },

  updateNodeConfig: (nodeId, config) => {
    const { nodes } = get();
    const newNodes = nodes.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            data: {
              ...node.data,
              name: config.name,
              config: config.config,
            },
          }
        : node
    );
    set({ nodes: newNodes });
    get().saveToHistory();
  },

  selectNode: (node) => set({ selectedNode: node }),

  addNode: (type, position) => {
    const { nodes } = get();
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: {
        label: `New ${type}`,
        name: `New ${type}`,
        type,
        config: {}
      },
      dragHandle: '.drag-handle'
    };
    set({ nodes: [...nodes, newNode] });
    get().saveToHistory();
  },

  saveToHistory: () => {
    const { nodes, edges, currentStep, history } = get();
    // Remove future history if we're in the middle of the history
    const newHistory = history.slice(0, currentStep + 1);
    newHistory.push({
      nodes: nodes.map(node => ({ ...node })), // Deep copy nodes
      edges: edges.map(edge => ({ ...edge })), // Deep copy edges
    });
    set({ history: newHistory, currentStep: currentStep + 1 });
  },

  undo: () => {
    const { currentStep, history } = get();
    if (currentStep > 0) {
      const prevState = history[currentStep - 1];
      set({
        nodes: prevState.nodes.map(node => ({ ...node })), // Deep copy nodes
        edges: prevState.edges.map(edge => ({ ...edge })), // Deep copy edges
        currentStep: currentStep - 1,
      });
    }
  },

  redo: () => {
    const { currentStep, history } = get();
    if (currentStep < history.length - 1) {
      const nextState = history[currentStep + 1];
      set({
        nodes: nextState.nodes.map(node => ({ ...node })), // Deep copy nodes
        edges: nextState.edges.map(edge => ({ ...edge })), // Deep copy edges
        currentStep: currentStep + 1,
      });
    }
  },
}));