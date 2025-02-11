import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Bell } from 'lucide-react';

export default memo(function NotificationNode({ data }: { data: any }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 min-w-[200px] border-2 border-accent">
      <div className="drag-handle">
        <Handle type="target" position={Position.Top} className="w-3 h-3" />
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-accent" />
          <div className="font-medium">{data.name}</div>
        </div>
        {data.config?.message && (
          <div className="mt-2 text-sm text-muted-foreground">
            Message: {data.config.message}
          </div>
        )}
        <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      </div>
    </div>
  );
});