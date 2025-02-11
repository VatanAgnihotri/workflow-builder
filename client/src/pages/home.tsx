import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FlowCanvas from '@/components/workflow/FlowCanvas';
import NodeConfig from '@/components/workflow/NodeConfig';
import WorkflowTable from '@/components/workflow/WorkflowTable';
import { ClipboardList, GitBranch, Bell } from 'lucide-react';

export default function Home() {
  const onDragStart = (event: React.DragEvent<HTMLButtonElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Workflow Builder</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            draggable
            onDragStart={(e) => onDragStart(e, 'task')}
            className="cursor-grab"
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            Task
          </Button>
          <Button
            variant="outline"
            draggable
            onDragStart={(e) => onDragStart(e, 'condition')}
            className="cursor-grab"
          >
            <GitBranch className="mr-2 h-4 w-4" />
            Condition
          </Button>
          <Button
            variant="outline"
            draggable
            onDragStart={(e) => onDragStart(e, 'notification')}
            className="cursor-grab"
          >
            <Bell className="mr-2 h-4 w-4" />
            Notification
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <FlowCanvas />
        </div>
        <div>
          <Card className="h-[600px] overflow-y-auto">
            <NodeConfig />
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Workflow Nodes</h2>
        <WorkflowTable />
      </div>
    </div>
  );
}