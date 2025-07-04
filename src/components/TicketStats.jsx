import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Target,
  Ticket,
} from "lucide-react";
import { useTicketCreate } from "../context/TicketCreateContext";

const TicketStats = () => {
  const { ticketStats, fetchTicketStats, statsError } = useTicketCreate();

  useEffect(() => {
    fetchTicketStats();
    // eslint-disable-next-line
  }, []);

  const stats = [
    {
      title: "Total Tickets",
      value: ticketStats.total,
      icon: Ticket, 
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/20",
    },
    {
      title: "Open",
      value: ticketStats.open,
      icon: Target,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/20",
    },
    {
      title: "In Progress",
      value: ticketStats.inProgress,
      icon: Clock,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-500/20",
    },
    {
      title: "Resolved",
      value: ticketStats.resolved,
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/20",
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
        >
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-purple-500/20 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className="h-4 w-4 text-white" />
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
