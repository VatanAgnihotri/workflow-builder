import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { ClipboardList } from 'lucide-react';

export default memo(function TaskNode({ data }: { data: any }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 min-w-[200px] border-2 border-primary">
      <div className="drag-handle">
        <Handle type="target" position={Position.Top} className="w-3 h-3" />
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          <div className="font-medium">{data.name}</div>
        </div>
        {data.config?.assignee && (
          <div className="mt-2 text-sm text-muted-foreground">
            Assignee: {data.config.assignee}
          </div>
        )}
        {data.config?.dueDate && (
          <div className="mt-1 text-sm text-muted-foreground">
            Due: {new Date(data.config.dueDate).toLocaleDateString()}
          </div>
        )}
        <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      </div>
    </div>
  );
});