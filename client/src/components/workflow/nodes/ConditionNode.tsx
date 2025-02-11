import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { GitBranch } from 'lucide-react';

export default memo(function ConditionNode({ data }: { data: any }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 min-w-[200px] border-2 border-secondary">
      <div className="drag-handle">
        <Handle type="target" position={Position.Top} className="w-3 h-3" />
        <div className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-secondary" />
          <div className="font-medium">{data.name}</div>
        </div>
        {data.config?.condition && (
          <div className="mt-2 text-sm text-muted-foreground">
            If: {data.config.condition}
          </div>
        )}
        <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      </div>
    </div>
  );
});