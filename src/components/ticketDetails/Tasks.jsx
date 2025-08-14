import { useTodoContext } from "@/context/TodoContext";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AsanaTodoTableInlineAdd() {
  const { getAllAssignedUser, assinedUser, CreateTask, totalTasks, GetTask } = useTodoContext();
  console.log("here is total task", totalTasks);
  const { ticketId } = useParams();
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Audit pages for redesign",
      status: "Backlog",
      priority: "High",
      assignee: "DT",
      due_date: "2025-08-15",
    },
    {
      id: 2,
      title: "Hero section layout",
      status: "In Progress",
      priority: "Medium",
      assignee: "RS",
      due_date: "2025-08-20",
    },
  ]);

  const [newTask, setNewTask] = useState({
    title: "",
    priority: "Medium",
    assinedTo: "",
    due_date: "",
    ticket_id: ticketId,
  });

  const handleAddTask = () => {
    CreateTask(newTask);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAddTask();
  };

  useEffect(() => {
    if (ticketId) {
      getAllAssignedUser(ticketId);
      GetTask(ticketId);
    }
  }, [ticketId]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <header className="mb-6 border-b border-gray-300 pb-4">
        <h1 className="text-2xl font-bold">FlowTasks Table</h1>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">Task</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Priority</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Assignee</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {/* Inline Add Row */}
            <tr className="bg-gray-50">
              <td className="px-4 py-2">
                <input
                  type="text"
                  placeholder="Add a new task..."
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent border-b border-gray-300 px-1 py-1 text-sm focus:outline-none focus:border-blue-500"
                />
              </td>
              <td className="px-4 py-2">
                <select
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                  className="bg-transparent border-b border-gray-300 px-1 py-1 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Status</option>
                  {["Backlog", "Pending", "In Progress", "Completed", "Re Open", "Under Review"].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-2">
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="bg-transparent border-b border-gray-300 px-1 py-1 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </td>
              <td className="px-4 py-2">
                <select
                  value={newTask.assinedTo}
                  onChange={(e) => setNewTask({ ...newTask, assinedTo: e.target.value })}
                  className="bg-transparent border-b border-gray-300 px-1 py-1 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Emp.</option>
                  {assinedUser.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.email}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-2">
                <input
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                  onKeyDown={handleKeyDown}
                  className="w-full h-10 bg-transparent border-b border-gray-300 px-1 py-1 text-sm focus:outline-none focus:border-blue-500"
                />
              </td>
            </tr>

            {/* Existing Tasks */}
            {tasks.map((task) => (
              <tr key={task.id} className="border-t border-gray-300 hover:bg-gray-100">
                <td className="px-4 py-2 text-sm">{task.title}</td>
                <td className="px-4 py-2 text-sm">{task.status}</td>
                <td
                  className={`px-4 py-2 text-sm ${task.priority === "High"
                    ? "text-red-500"
                    : task.priority === "Medium"
                      ? "text-yellow-500"
                      : "text-green-500"
                    }`}
                >
                  {task.priority}
                </td>
                <td className="px-4 py-2 text-sm">{task.assignee}</td>
                <td className="px-4 py-2 text-sm">{task.due_date || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
