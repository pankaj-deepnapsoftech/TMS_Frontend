import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Flag, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TicketDetailHeader = ({
  ticket,
  status,
  user,
  isAssignedToCurrentUser,
  getPriorityColor,
  getStatusColor,
}) => {
  const navigate = useNavigate();

  // console.log(ticket.status);
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-purple-500/20 backdrop-blur-sm overflow-hidden"
          style={{ wordBreak: "break-word" }}
        >
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className={` ${getStatusColor(ticket.status)} `}>
                    {status?.name || ticket.status}
                  </Badge>
                  <Badge
                    className={`border ${getPriorityColor(
                      ticket.priority
                    )} !bg-opacity-20`}
                  >
                    <Flag className="w-3 h-3 mr-1" />
                    {ticket.priority.charAt(0).toUpperCase() +
                      ticket.priority.slice(1)}
                  </Badge>

                  {isAssignedToCurrentUser && (
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      Assigned to You
                    </Badge>
                  )}
                </div>
                <CardTitle
                  className="text-2xl text-white mb-2"
                  style={{ wordBreak: "break-word" }}
                >
                  {ticket.title}
                </CardTitle>
                {ticket.description && (
                  <p
                    className="text-gray-300 leading-relaxed"
                    style={{ wordBreak: "break-word" }}
                  >
                    {ticket.description}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>
    </>
  );
};

export default TicketDetailHeader;
