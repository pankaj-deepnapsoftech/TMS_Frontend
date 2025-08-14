import { useTodoContext } from "@/context/TodoContext";
import { DateModifier } from "@/lib/dateModifier";
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AsanaTodoTableInlineAdd() {

  const { getAllAssignedUser, assinedUser, CreateTask, totalTasks,GetTask } = useTodoContext();
  const { ticketId } = useParams();
  

  const [newTask, setNewTask] = useState({
    title: "",
    priority: "Medium",
    assinedTo: "",
    due_date: "",
    ticket_id: ticketId,
  });

  const handleAddTask = () => {
    CreateTask(newTask)
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAddTask();
  };

  useEffect(() => {
    if (ticketId) {
      getAllAssignedUser(ticketId);
      GetTask(ticketId);
    }

  }, [ticketId])

  return (
    <div className="min-h-screen bg-[#0f1024] text-white p-6">
      <header className="mb-6 border-b border-white/10 pb-4">
        <h1 className="text-2xl font-bold">FlowTasks Table</h1>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-white/10">
          <thead className="bg-black/10">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">Task</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Priority</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Assignee</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Due Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Action</th>

            </tr>
          </thead>
          <tbody>
            {/* Inline Add Row */}
            <tr className="bg-white/5">
              <td className="px-4 py-2">
                <input
                  type="text"
                  placeholder="Add a new task..."
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent border-b border-white/20 px-1 py-1 text-sm focus:outline-none focus:border-purple-400"
                />
              </td>
              <td className="px-4 py-2">
                <select
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                  className="bg-transparent border-b border-white/20 px-1 py-1 text-sm focus:outline-none focus:border-purple-400"
                >
                  <option value="">Select Status</option>
                  {[ "Pending", "In Progress", "Completed", "Re Open", "Under Review"].map((item) => (
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
                  className="bg-transparent border-b border-white/20 px-1 py-1 text-sm focus:outline-none focus:border-purple-400"
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
                  className="bg-transparent border-b border-white/20 px-1 py-1 text-sm focus:outline-none focus:border-purple-400"
                >
                  <option value="">Select Emp.</option>
                  {assinedUser.map((item) =>  <option key={item._id} value={item._id}>{item.email}</option>)}
                </select>
              </td>
              <td className="px-4 py-2">
                <input
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                  onKeyDown={handleKeyDown}
                  className="w-full h-10 bg-transparent border-b border-white/20 px-1 py-1 text-sm focus:outline-none focus:border-purple-400"
                />
              </td>
              <td className="px-4 py-2">
               <button className="flex px-3 py-1 bg-blue-600 rounded-lg" >Add more</button>
              </td>
            </tr>

            {/* Existing Tasks */}
            {totalTasks.map((task) => (
              <tr key={task.id} className="border-t border-white/10 hover:bg-white/5">
                <td className="px-4 py-2 text-sm">{task.title}</td>
                <td className="px-4 py-2 text-sm">{task?.statusHistory[task?.statusHistory.length - 1].
                  status}</td>
                <td
                  className={`px-4 py-2 text-sm ${task.priority === "High"
                    ? "text-red-400"
                    : task.priority === "Medium"
                      ? "text-yellow-400"
                      : "text-green-400"
                    }`}
                >
                  {task.priority}
                </td>
                <td className="px-4 py-2 text-sm">{task?.assinedTo?.email}</td>
                <td className="px-4 py-2 text-sm">{DateModifier(task.due_date) || "-"}</td>
                <td className="px-4 py-2 text-sm"><Trash2 /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
