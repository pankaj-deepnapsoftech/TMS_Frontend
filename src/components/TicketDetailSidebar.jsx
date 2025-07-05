import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, User, Briefcase, Users } from 'lucide-react';
// import {  departments, ticketStatuses } from '@/data';

const TicketDetailSidebar = ({
  ticket,
  user,
  assignedIds,
  department,
  createdByUser,
  isAssignedToCurrentUser,
  onStatusChange,
  formatDate,
  getInitials,
  isOverdue
}) => {

  // console.log(assignedUsers)
console.log(department)
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-purple-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-white">Ticket Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {assignedIds.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {assignedIds.length === 1 ? (
                    <User className="w-4 h-4 text-purple-400" />
                  ) : (
                    <Users className="w-4 h-4 text-purple-400" />
                  )}
                  <p className="text-sm text-gray-400">
                    Assigned to ({assignedIds.length})
                  </p>
                </div>
                <div className="space-y-2">
                  {assignedIds.map(assignedUser => (
                    <motion.div
                      key={assignedUser._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${assignedUser._id === user?._id
                          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/50'
                          : 'bg-gradient-to-r from-slate-700/30 to-slate-600/30 border-purple-500/20'
                        }`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={assignedUser.avatar} alt={assignedUser.name} />
                        <AvatarFallback>{getInitials(assignedUser.name)}</AvatarFallback>

                      </Avatar>
                      <div>
                        <p className={`font-medium text-sm ${assignedUser._id === user?._id ? 'text-purple-200' : 'text-white'
                          }`}>
                          {assignedUser._id === user?._id ? 'You' : assignedUser.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {/* {Array.isArray(department)
                            ? (department.find(
                              d => d.value.toLowerCase() === assignedUser.department?.toLowerCase()
                            )?.label || 'No Department')
                            : 'No Department'} */}
                            {department?.label}
                        </p>


                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {department && (
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-purple-400" />
                <div>
                  <p className="text-sm text-gray-400">Department</p>
                  <p className="font-medium text-white">{department.label}</p>
                </div>
              </div>
            )}

            {ticket.dueDate && (
              <div className={`flex items-center gap-3 ${isOverdue(ticket.dueDate) ? 'text-red-400' : ''}`}>
                {isOverdue(ticket.dueDate) ? <Clock className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                <div>
                  <p className="text-sm text-gray-400">Due Date</p>
                  <p className="font-medium">{formatDate(ticket.dueDate)}</p>
                  {isOverdue(ticket.dueDate) && <p className="text-xs text-red-400">Overdue</p>}
                </div>
              </div>
            )}

            {createdByUser && (
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-purple-400" />
                <div>
                  <p className="text-sm text-gray-400">Created by</p>
                  <p className="font-medium text-white">{createdByUser.name}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Created</p>
                <p className="font-medium text-white">{formatDate(ticket.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Last Updated</p>
                <p className="font-medium text-white">{formatDate(ticket.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {(user.role === 'admin' || isAssignedToCurrentUser) &&  (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-white">Update Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={ticket.status} onValueChange={onStatusChange}>
                  <SelectTrigger className="bg-slate-800/50 border-purple-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                <SelectContent className="bg-slate-800 border-purple-500/30">
                  <SelectItem value="Open" className="text-white">Open</SelectItem>
                  <SelectItem value="In Progress" className="text-white">In Progress</SelectItem>
                  <SelectItem value="Under Review" className="text-white">Under Review</SelectItem>
                  <SelectItem value="Resolved" className="text-white">Resolved</SelectItem>
                  <SelectItem value="Closed" className="text-white">Closed</SelectItem>
                </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </motion.div>
        )}
    </div>
  );
};

export default TicketDetailSidebar;