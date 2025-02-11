import React from "react";
import { useForm } from "react-hook-form";

const TaskNodeForm = ({ node, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onFormSubmit = (data) => {
    onSubmit(node.id, data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <label>Task Name</label>
      <input {...register("taskName", { required: true })} />
      {errors.taskName && <p>This field is required</p>}

      <label>Assignee</label>
      <input {...register("assignee", { required: true })} />
      {errors.assignee && <p>This field is required</p>}

      <label>Due Date</label>
      <input type="date" {...register("dueDate", { required: true })} />
      {errors.dueDate && <p>This field is required</p>}

      <button type="submit">Save</button>
    </form>
  );
};

export default TaskNodeForm;
