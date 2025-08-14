import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  // Sample static data
  const ticketStatusData = [
    { status: "Open", tickets: 12 },
    { status: "In Progress", tickets: 8 },
    { status: "Resolved", tickets: 5 },
    { status: "Closed", tickets: 3 },
  ];

  const ticketPriorityData = [
    { name: "High", value: 5 },
    { name: "Medium", value: 12 },
    { name: "Low", value: 11 },
  ];

  const ticketTrendData = [
    { day: "Mon", tickets: 2 },
    { day: "Tue", tickets: 5 },
    { day: "Wed", tickets: 7 },
    { day: "Thu", tickets: 4 },
    { day: "Fri", tickets: 8 },
  ];

  const COLORS = ["#EF4444", "#FACC15", "#22C55E"]; // Red, Yellow, Green

  return (
    <div className="bg-white text-black min-h-screen p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Bar Chart for Ticket Status */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Tickets by Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ticketStatusData}>
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="tickets" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart for Ticket Priority */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Tickets by Priority</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={ticketPriorityData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {ticketPriorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart for Ticket Trend */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-md md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Ticket Trend (Weekly)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ticketTrendData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="tickets" stroke="#6366F1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
