import { Background, BackgroundVariant, Controls, Handle, Position, ReactFlow, type NodeProps } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { IHomeUIHookProps, TASK_BLOCKS, TaskNode, TaskNodeData } from "./HomeUI.hook";

const TONE_CLASS: Record<TaskNodeData["tone"], string> = {
  todo: "border-zinc-300",
  doing: "border-amber-400",
  done: "border-emerald-500",
};

const TaskCard = ({ data }: NodeProps<TaskNode>) => {
  return (
    <div className={`w-44 rounded-lg border-2 bg-white px-3 py-2 shadow-sm ${TONE_CLASS[data.tone]}`}>
      <Handle type="target" position={Position.Left} />
      <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">{data.status}</p>
      <p className="text-sm font-medium text-zinc-900">{data.label}</p>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

const nodeTypes = { task: TaskCard };

export const HomeUIView = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onDragStart,
  onDragOver,
  onDrop,
}: IHomeUIHookProps) => {
  return (
    <div className="flex h-[calc(100dvh-96px)] min-h-[520px] overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
      <aside className="flex w-56 shrink-0 flex-col gap-3 border-r border-zinc-200 bg-white p-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">Bloques</h2>
          <p className="mt-1 text-xs leading-5 text-zinc-500">Arrastra uno al lienzo. Conecta los puntos. Supr elimina.</p>
        </div>
        {TASK_BLOCKS.map((block) => (
          <button
            key={block.tone}
            type="button"
            draggable
            onDragStart={(event) => onDragStart(event, block.tone)}
            className={`cursor-grab rounded-lg border-2 bg-white px-3 py-2 text-left active:cursor-grabbing ${TONE_CLASS[block.tone]}`}
          >
            <span className="block text-[10px] font-medium uppercase tracking-wide text-zinc-500">{block.status}</span>
            <span className="block text-sm font-medium text-zinc-900">{block.label}</span>
          </button>
        ))}
      </aside>
      <div className="h-full min-w-0 flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          fitView
          deleteKeyCode={["Backspace", "Delete"]}
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};
