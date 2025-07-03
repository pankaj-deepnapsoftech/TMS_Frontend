import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2, Calendar, Clock, Flag, User, Briefcase } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { users, departments } from '@/data';

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const { user: currentUser } = useAuth();
  const assignedUser = users.find(u => u.id === task.assignedTo);
  const department = departments.find(d => d.id === task.departmentId);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !task.completed;
  };

  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-purple-500/20 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-300 ${task.completed ? 'opacity-75' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <Checkbox checked={task.completed} onCheckedChange={() => onToggleComplete(task.id)} className="mt-1 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500" />
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-lg leading-tight ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>{task.title}</h3>
                {task.description && <p className={`text-sm mt-1 ${task.completed ? 'text-gray-500' : 'text-gray-300'}`}>{task.description}</p>}
              </div>
            </div>
            {currentUser && currentUser.role === 'admin' && (
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => onEdit(task)} className="h-8 w-8 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20"><Edit className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => onDelete(task.id)} className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/20"><Trash2 className="h-4 w-4" /></Button>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge className={getPriorityColor(task.priority)}><Flag className="w-3 h-3 mr-1" />{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</Badge>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30"><Briefcase className="w-3 h-3 mr-1" />{department?.name || 'N/A'}</Badge>
          </div>
          
          <div className="flex flex-col gap-2 text-sm text-gray-400">
            {assignedUser && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-purple-400" />
                <span>Assigned to: <span className="font-medium text-white">{assignedUser.name}</span></span>
              </div>
            )}
            {task.dueDate && (
              <div className={`flex items-center gap-2 ${isOverdue(task.dueDate) ? 'text-red-400' : ''}`}>
                {isOverdue(task.dueDate) ? <Clock className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                <span>{isOverdue(task.dueDate) ? 'Overdue: ' : 'Due: '} {formatDate(task.dueDate)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TaskCard;