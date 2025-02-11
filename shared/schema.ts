import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nodes: jsonb("nodes").notNull(),
  edges: jsonb("edges").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWorkflowSchema = createInsertSchema(workflows).omit({
  id: true,
  createdAt: true,
});

export type InsertWorkflow = z.infer<typeof insertWorkflowSchema>;
export type Workflow = typeof workflows.$inferSelect;

export const nodeConfigSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["task", "condition", "notification"]),
  config: z.object({
    // Task node config
    assignee: z.string().optional().or(z.literal("")),
    dueDate: z.string().optional().or(z.literal("")),
    description: z.string().optional().or(z.literal("")),
    // Condition node config
    condition: z.string().min(1, "Condition is required").optional().or(z.literal("")),
    // Notification node config
    message: z.string().min(1, "Message is required").optional().or(z.literal("")),
    recipients: z.array(z.string()).optional(),
  }).refine((data) => {
    // Custom validation based on node type
    if (data.condition && !data.message && !data.assignee) return true; // Condition node
    if (data.message && !data.condition && !data.assignee) return true; // Notification node
    if (data.assignee && !data.condition && !data.message) return true; // Task node
    return false;
  }, "Invalid configuration for node type"),
});

export type NodeConfig = z.infer<typeof nodeConfigSchema>;