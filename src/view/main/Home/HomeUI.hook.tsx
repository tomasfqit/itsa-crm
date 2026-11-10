import { DragEvent, useCallback } from "react";
import {
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";

export const TASK_BLOCKS = [
  { tone: "todo", status: "Por hacer", label: "Nueva tarea" },
  { tone: "doing", status: "En progreso", label: "En curso" },
  { tone: "done", status: "Hecho", label: "Listo" },
] as const;

export type TaskTone = (typeof TASK_BLOCKS)[number]["tone"];

export type TaskNodeData = {
  label: string;
  status: string;
  tone: TaskTone;
};

export type TaskNode = Node<TaskNodeData, "task">;

const initialNodes: TaskNode[] = [
  {
    id: "task-1",
    type: "task",
    position: { x: 48, y: 48 },
    data: { label: "Definir el tablero", status: "Por hacer", tone: "todo" },
  },
  {
    id: "task-2",
    type: "task",
    position: { x: 340, y: 190 },
    data: { label: "Conectar el flujo", status: "En progreso", tone: "doing" },
  },
];

const initialEdges: Edge[] = [{ id: "e-task-1-2", source: "task-1", target: "task-2" }];

let nodeSequence = 3;
const nextNodeId = () => `task-${nodeSequence++}`;

export interface IHomeUIHookProps {
  nodes: TaskNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange<TaskNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  onDragStart: (event: DragEvent<HTMLButtonElement>, tone: TaskTone) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
}

export const useHomeUIHook = (): IHomeUIHookProps => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((current) => addEdge({ ...connection, type: "smoothstep" }, current));
    },
    [setEdges],
  );

  const onDragStart = useCallback((event: DragEvent<HTMLButtonElement>, tone: TaskTone) => {
    event.dataTransfer.setData("application/reactflow", tone);
    event.dataTransfer.effectAllowed = "move";
  }, []);

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const tone = event.dataTransfer.getData("application/reactflow") as TaskTone;
      const block = TASK_BLOCKS.find((item) => item.tone === tone);
      if (!block) return;

      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const newNode: TaskNode = {
        id: nextNodeId(),
        type: "task",
        position,
        data: { label: block.label, status: block.status, tone: block.tone },
      };

      setNodes((current) => current.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  return { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDragStart, onDragOver, onDrop };
};
