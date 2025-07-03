import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Calendar } from 'lucide-react';

const TaskForm = ({ isOpen, onClose, onSubmit, task = null, users = [], departments = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'work',
    dueDate: '',
    assignedTo: '',
    departmentId: '',
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        category: task.category || 'work',
        dueDate: task.dueDate || '',
        assignedTo: task.assignedTo || '',
        departmentId: task.departmentId || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: 'work',
        dueDate: '',
        assignedTo: '',
        departmentId: '',
      });
    }
  }, [task, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.assignedTo) return;
    
    onSubmit({
      ...formData,
      id: task?.id || Date.now().toString(),
      completed: task?.completed || false,
      createdAt: task?.createdAt || new Date().toISOString(),
    });
    
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-slate-900/95 to-purple-900/95 border-purple-500/20 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {task ? 'Edit Task' : 'Create & Assign Task'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <label className="text-sm font-medium text-purple-200 mb-2 block">Task Title</label>
            <Input value={formData.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="Enter task title..." className="bg-slate-800/50 border-purple-500/30 text-white placeholder:text-slate-400 focus:border-purple-400" required />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <label className="text-sm font-medium text-purple-200 mb-2 block">Description</label>
            <Textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Add task description..." className="bg-slate-800/50 border-purple-500/30 text-white placeholder:text-slate-400 focus:border-purple-400 min-h-[100px]" />
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <label className="text-sm font-medium text-purple-200 mb-2 block">Assign To</label>
              <Select value={formData.assignedTo} onValueChange={(value) => handleChange('assignedTo', value)} required>
                <SelectTrigger className="bg-slate-800/50 border-purple-500/30 text-white"><SelectValue placeholder="Select Employee" /></SelectTrigger>
                <SelectContent className="bg-slate-800 border-purple-500/30">{users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent>
              </Select>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <label className="text-sm font-medium text-purple-200 mb-2 block">Department</label>
              <Select value={formData.departmentId} onValueChange={(value) => handleChange('departmentId', value)}>
                <SelectTrigger className="bg-slate-800/50 border-purple-500/30 text-white"><SelectValue placeholder="Select Department" /></SelectTrigger>
                <SelectContent className="bg-slate-800 border-purple-500/30">{departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
              </Select>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <label className="text-sm font-medium text-purple-200 mb-2 block">Priority</label>
              <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
                <SelectTrigger className="bg-slate-800/50 border-purple-500/30 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-800 border-purple-500/30">
                  <SelectItem value="low" className="text-green-400">Low</SelectItem>
                  <SelectItem value="medium" className="text-yellow-400">Medium</SelectItem>
                  <SelectItem value="high" className="text-red-400">High</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <label className="text-sm font-medium text-purple-200 mb-2 block">Due Date</label>
              <div className="relative">
                <Input type="date" value={formData.dueDate} onChange={(e) => handleChange('dueDate', e.target.value)} className="bg-slate-800/50 border-purple-500/30 text-white focus:border-purple-400" />
                <Calendar className="absolute right-3 top-3 h-4 w-4 text-purple-400 pointer-events-none" />
              </div>
            </motion.div>
          </div>

          <DialogFooter className="gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10">Cancel</Button>
            <Button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              {task ? 'Update Task' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;