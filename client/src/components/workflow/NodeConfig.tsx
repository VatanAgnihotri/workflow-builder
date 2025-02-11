import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { nodeConfigSchema, type NodeConfig } from '@shared/schema';
import { useWorkflowStore } from '@/store/workflowStore';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export default function NodeConfig() {
  const { selectedNode, updateNodeConfig } = useWorkflowStore();
  const { toast } = useToast();

  const form = useForm<NodeConfig>({
    resolver: zodResolver(nodeConfigSchema),
    defaultValues: {
      name: '',
      type: 'task',
      config: {},
    },
  });

  // Update form when selected node changes
  useEffect(() => {
    if (selectedNode) {
      form.reset({
        name: selectedNode.data?.name || '',
        type: selectedNode.type as NodeConfig['type'],
        config: selectedNode.data?.config || {},
      });
    }
  }, [selectedNode, form]);

  if (!selectedNode) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Select a node to configure
      </div>
    );
  }

  const onSubmit = (data: NodeConfig) => {
    try {
      updateNodeConfig(selectedNode.id, data);
      toast({
        title: "Success",
        description: "Node configuration updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update node configuration",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter node name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedNode.type === 'task' && (
          <>
            <FormField
              control={form.control}
              name="config.assignee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignee</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter assignee name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="config.dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(new Date(field.value), 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date?.toISOString())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {selectedNode.type === 'condition' && (
          <FormField
            control={form.control}
            name="config.condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condition</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Enter condition" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {selectedNode.type === 'notification' && (
          <FormField
            control={form.control}
            name="config.message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Enter notification message" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </Form>
  );
}