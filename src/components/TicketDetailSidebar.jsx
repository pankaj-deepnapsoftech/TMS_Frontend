import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, User, Briefcase, Users } from 'lucide-react';

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
  return (
    <div className="space-y-6">
      {/* Ticket Details Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Ticket Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Assigned Users */}
            {assignedIds.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {assignedIds.length === 1 ? (
                    <User className="w-4 h-4 text-purple-600" />
                  ) : (
                    <Users className="w-4 h-4 text-purple-600" />
                  )}
                  <p className="text-sm text-gray-500">Assigned to ({assignedIds.length})</p>
                </div>
                <div className="space-y-2">
                  {assignedIds.map(assignedUser => (
                    <motion.div
                      key={assignedUser._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        assignedUser._id === user?._id
                          ? 'bg-purple-50 border-purple-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={assignedUser.avatar} alt={assignedUser.name} />
                        <AvatarFallback>{getInitials(assignedUser.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className={`font-medium text-sm ${
                          assignedUser._id === user?._id ? 'text-purple-600' : 'text-gray-900'
                        }`}>
                          {assignedUser._id === user?._id ? 'You' : assignedUser.name}
                        </p>
                        <p className="text-xs text-gray-500">{department?.label}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Department */}
            {department && (
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium text-gray-900">{department.label}</p>
                </div>
              </div>
            )}

            {/* Due Date */}
            {ticket.dueDate && (
              <div className={`flex items-center gap-3 ${isOverdue(ticket.dueDate) ? 'text-red-500' : ''}`}>
                {isOverdue(ticket.dueDate) ? <Clock className="w-4 h-4 text-red-500" /> : <Calendar className="w-4 h-4 text-purple-600" />}
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="font-medium text-gray-900">{formatDate(ticket.dueDate)}</p>
                  {isOverdue(ticket.dueDate) && <p className="text-xs text-red-500">Overdue</p>}
                </div>
              </div>
            )}

            {/* Created By */}
            {createdByUser && (
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Created by</p>
                  <p className="font-medium text-gray-900">{createdByUser.name}</p>
                </div>
              </div>
            )}

            {/* Created At */}
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium text-gray-900">{formatDate(ticket.createdAt)}</p>
              </div>
            </div>

            {/* Last Updated */}
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium text-gray-900">{formatDate(ticket.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Update Status Card */}
      {(user.role === 'admin' || assignedIds) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={ticket.status} onValueChange={onStatusChange}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  <SelectItem value="Open" className="text-gray-900">Open</SelectItem>
                  <SelectItem value="In Progress" className="text-gray-900">In Progress</SelectItem>
                  <SelectItem value="Under Review" className="text-gray-900">Under Review</SelectItem>
                  <SelectItem value="Resolved" className="text-gray-900">Resolved</SelectItem>
                  <SelectItem value="Closed" className="text-gray-900">Closed</SelectItem>
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
