import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Flag } from "lucide-react";
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

  return (
    <>
      {/* Back Button */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-purple-600 hover:text-purple-800 hover:bg-purple-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </motion.div>

      {/* Ticket Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card
          className="bg-white border border-gray-200 shadow-sm overflow-hidden"
          style={{ wordBreak: "break-word" }}
        >
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* Badges */}
                <div className="flex items-center gap-3 mb-3">
                  <Badge className={`${getStatusColor(ticket.status)} bg-gray-100 text-gray-800`}>
                    {status?.name || ticket.status}
                  </Badge>
                  <Badge
                    className={`border ${getPriorityColor(ticket.priority)} bg-gray-100/50 text-gray-800`}
                  >
                    <Flag className="w-3 h-3 mr-1" />
                    {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                  </Badge>

                  {isAssignedToCurrentUser && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Assigned to You
                    </Badge>
                  )}
                </div>

                {/* Ticket Title */}
                <CardTitle
                  className="text-2xl text-gray-900 mb-2"
                  style={{ wordBreak: "break-word" }}
                >
                  {ticket.title}
                </CardTitle>

                {/* Ticket Description */}
                {ticket.description && (
                  <p
                    className="text-gray-700 leading-relaxed"
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
