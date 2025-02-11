import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { useWorkflowStore } from '@/store/workflowStore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const columnHelper = createColumnHelper<any>();

export default function WorkflowTable() {
  const { nodes, updateNodeConfig } = useWorkflowStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const { toast } = useToast();

  const startEditing = (id: string, value: string) => {
    setEditingId(id);
    setEditValue(value);
  };

  const saveEdit = (id: string) => {
    const node = nodes.find(n => n.id === id);
    if (node) {
      try {
        updateNodeConfig(id, {
          ...node.data,
          name: editValue,
        });
        toast({
          title: "Success",
          description: "Node name updated successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update node name",
          variant: "destructive",
        });
      }
    }
    setEditingId(null);
  };

  const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('data.name', {
      header: 'Name',
      cell: (info) => {
        const id = info.row.original.id;
        const value = info.getValue();

        if (editingId === id) {
          return (
            <div className="flex items-center gap-2">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="h-8"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => saveEdit(id)}
                className="h-8 w-8"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingId(null)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        }

        return (
          <div className="flex items-center gap-2">
            <span>{value}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => startEditing(id, value)}
              className="h-8 w-8 opacity-0 group-hover:opacity-100"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    }),
    columnHelper.accessor((row) => row, {
      id: 'actions',
      header: 'Actions',
      cell: (info) => {
        const { onNodesChange } = useWorkflowStore();
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              onNodesChange([{ type: 'remove', id: info.row.original.id }])
            }
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: nodes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className="group">
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {nodes.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No nodes in the workflow
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}