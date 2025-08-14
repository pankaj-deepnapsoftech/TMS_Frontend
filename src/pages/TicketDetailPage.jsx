import React, { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from '@/components/ticketDetails/Dashboard';
import Tasks from '@/components/ticketDetails/Tasks';
import Comments from '@/components/ticketDetails/Comments';

const TicketDetailPage = () => {
  const [topNavbar, setTopNavbar] = useState("Dashboard");

  return (
    <>
      <div>
        {/* Top Navbar */}
        <div className="bg-white text-gray-900 px-6 shadow-sm">
          <nav className="flex space-x-8 border-b border-gray-300">
            <button
              onClick={() => setTopNavbar('Dashboard')}
              className={`py-3 text-sm font-medium hover:text-blue-600 ${topNavbar === "Dashboard" && "text-blue-600 border-b-2 border-blue-600"} hover:border-b-2 hover:border-blue-600 transition-all`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setTopNavbar('Tasks')}
              className={`py-3 text-sm font-medium hover:text-blue-600 ${topNavbar === "Tasks" && "text-blue-600 border-b-2 border-blue-600"} hover:border-b-2 hover:border-blue-600 transition-all`}
            >
              Tasks
            </button>
            <button
              onClick={() => setTopNavbar('Comments')}
              className={`py-3 text-sm font-medium hover:text-blue-600 ${topNavbar === "Comments" && "text-blue-600 border-b-2 border-blue-600"} hover:border-b-2 hover:border-blue-600 transition-all`}
            >
              Comments
            </button>
          </nav>
        </div>

        {/* Conditional Rendering of Components */}
        <div className="bg-gray-50 min-h-screen p-6">
          {topNavbar === 'Dashboard' ? <Dashboard /> : topNavbar === 'Tasks' ? <Tasks /> : <Comments />}
        </div>
      </div>

      <Toaster />
    </>
  );
};

export default TicketDetailPage;
