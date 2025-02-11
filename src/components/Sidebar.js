import React from "react";

const Sidebar = ({ addNode }) => {
  return (
    <div style={{ width: 200, padding: 20, background: "#f0f0f0" }}>
      <h3>Node Types</h3>
      <button onClick={() => addNode("Task")}>Add Task</button>
      <button onClick={() => addNode("Condition")}>Add Condition</button>
      <button onClick={() => addNode("Notification")}>Add Notification</button>
    </div>
  );
};

export default Sidebar;
