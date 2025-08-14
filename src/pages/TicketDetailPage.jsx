import React, { useState } from 'react';

import { Helmet } from 'react-helmet';

import { Toaster } from '@/components/ui/toaster';
import Dashboard from '@/components/ticketDetails/Dashboard';
import Tasks from '@/components/ticketDetails/Tasks';
import Comments from '@/components/ticketDetails/Comments';


const TicketDetailPage = () => {
  const [topNavbar, setTopNavbar] = useState("Dashboard")

  return (
    <>
      {/* <Helmet>
        <title>
          {ticket
            ? `${ticket.ticketNumber} - ${ticket.title} - ITSYBIZZ TMS`
            : "Ticket Not Found - ITSYBIZZ TMS"}
        </title>
        <meta
          name="description"
          content={
            ticket
              ? `Ticket details for ${ticket.ticketNumber}: ${ticket.title}`
              : "Ticket not found"
          }
        />
      </Helmet> */}


      <div>
        <div className="bg-[#120338] text-white px-6">
          <nav className="flex space-x-8 border-b border-purple-500">
            <button
              onClick={() => setTopNavbar('Dashboard')}
              className={`py-3 text-sm font-medium hover:text-purple-400 ${topNavbar === "Dashboard" && " text-purple-400 border-b-2 border-purple-500"} hover:border-b-2 hover:border-purple-500 transition-all`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setTopNavbar('Tasks')}
              className={`py-3 text-sm font-medium hover:text-purple-400 ${topNavbar === "Tasks" && " text-purple-400 border-b-2 border-purple-500"} hover:border-b-2 hover:border-purple-500 transition-all`}
            >
              Tasks
            </button>
            <button
              onClick={() => setTopNavbar('Comments')}
              className={`py-3 text-sm font-medium hover:text-purple-400 ${topNavbar === "Comments" && " text-purple-400 border-b-2 border-purple-500"} hover:border-b-2 hover:border-purple-500 transition-all`}
            >
              Comments
            </button>

          </nav>
        </div>

        {/* here sohow components conditinally  */}
        {
          topNavbar === 'Dashboard' ? (<Dashboard />) : topNavbar === 'Tasks' ? (<Tasks />) : <Comments />
        }
      </div>

      <Toaster />
    </>
  );
};

export default TicketDetailPage;
