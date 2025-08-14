import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  Target,
  Ticket,
  CalendarX,
} from "lucide-react";
import { useTicketCreate } from "../context/TicketCreateContext";

const TicketStats = ({ onStatClick }) => {
  const { ticketStats, fetchTicketStats, statsError } = useTicketCreate();

  useEffect(() => {
    fetchTicketStats();
  }, []);

  const stats = [
    {
      title: "Total Tickets",
      value: ticketStats.total,
      icon: Ticket,
      filterValue: "all",
      color: "from-yellow-600 to-yellow-700",
      bgColor: "bg-yellow-200",
      borderColor: "border-gray-200",
      iconBg: "bg-yellow-200/70",
    },
    {
      title: "Open",
      value: ticketStats.open,
      icon: Target,
      filterValue: "open",
      color: "from-blue-600 to-blue-700",
      bgColor: "bg-blue-200",
      borderColor: "border-gray-200",
      iconBg: "bg-blue-200/70",
    },
    {
      title: "In Progress",
      value: ticketStats.inProgress,
      icon: Clock,
      filterValue: "in progress",
      color: "from-blue-600 to-blue-700",
      bgColor: "bg-blue-200",
      borderColor: "border-gray-200",
      iconBg: "bg-blue-200/70",
    },
    {
      title: "Resolved",
      value: ticketStats.resolved,
      icon: CheckCircle,
      filterValue: "resolved",
      color: "from-green-600 to-green-700",
      bgColor: "bg-green-200",
      borderColor: "border-gray-200",
      iconBg: "bg-green-200/70",
    },
    {
      title: "Overdue Date",
      value: ticketStats.overdue,
      icon: CalendarX,
      filterValue: "overdue",
      color: "from-red-600 to-red-700",
      bgColor: "bg-red-200",
      borderColor: "border-gray-200",
      iconBg: "bg-red-200/70",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
      {statsError && (
        <div className="col-span-full text-red-500 text-center">
          {statsError}
        </div>
      )}
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => {
            onStatClick?.(stat.filterValue);
          }}
          className="cursor-pointer"
        >
          <Card
            className={` ${stat.bgColor} ${stat.borderColor} rounded-xl shadow-sm hover:shadow-md transition-all duration-300`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-800">
                {stat.title}
              </CardTitle>
              <div
                className={`p-2 rounded-lg flex items-center justify-center ${stat.iconBg}`}
              >
                <stat.icon className="h-5 w-5 text-gray-800" />
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
              >
                {stat.value}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default TicketStats;
