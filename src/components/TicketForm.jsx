// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import { Card, CardContent } from '@/components/ui/card';
// import { Plus, Calendar, Ticket, X, Users, UserPlus, Search } from 'lucide-react';
// import { ticketStatuses } from '@/data';
// import { useFormik } from 'formik';

// const TicketForm = ({ isOpen, onClose, onSubmit, ticket = null, users = [], departments = [] }) => {
//   // const [formData, setFormData] = useState({
//   //   title: '',
//   //   description: '',
//   //   priority: 'medium',
//   //   status: 'open',
//   //   category: 'general',
//   //   dueDate: '',
//   //   assignedTo: [],
//   //   departmentId: '',
//   // });

//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState('all');


//   const formik = useFormik({
//     initialValues:{

//     }
//   })

//   // useEffect(() => {
//   //   if (ticket) {
//   //     // Ensure assignedTo is always an array and contains valid user IDs
//   //     let assignedToArray = [];
//   //     if (ticket.assignedTo) {
//   //       const rawAssignedTo = Array.isArray(ticket.assignedTo) ? ticket.assignedTo : [ticket.assignedTo];
//   //       assignedToArray = rawAssignedTo.filter(id => users.some(user => user.id === id));
//   //     }

//   //     setFormData({
//   //       title: ticket.title || '',
//   //       description: ticket.description || '',
//   //       priority: ticket.priority || 'medium',
//   //       status: ticket.status || 'open',
//   //       category: ticket.category || 'general',
//   //       dueDate: ticket.dueDate || '',
//   //       assignedTo: assignedToArray,
//   //       departmentId: ticket.departmentId || '',
//   //     });
//   //   } else {
//   //     setFormData({
//   //       title: '',
//   //       description: '',
//   //       priority: 'medium',
//   //       status: 'open',
//   //       category: 'general',
//   //       dueDate: '',
//   //       assignedTo: [],
//   //       departmentId: '',
//   //     });
//   //   }
//   //   setSearchTerm('');
//   //   setSelectedDepartmentFilter('all');
//   // }, [ticket, isOpen, users]);

//   // const handleSubmit = (e) => {
//   //   e.preventDefault();
//   //   if (!formData.title.trim() || formData.assignedTo.length === 0) return;
    
//   //   // Ensure only valid user IDs are submitted
//   //   const validAssignedTo = formData.assignedTo.filter(id => users.some(user => user.id === id));
    
//   //   const ticketData = {
//   //     ...formData,
//   //     assignedTo: validAssignedTo,
//   //     id: ticket?.id || Date.now().toString(),
//   //     ticketNumber: ticket?.ticketNumber || `TKT-${String(Date.now()).slice(-6)}`,
//   //     createdAt: ticket?.createdAt || new Date().toISOString(),
//   //     updatedAt: new Date().toISOString(),
//   //     createdBy: ticket?.createdBy || 'u1',
//   //     comments: ticket?.comments || [],
//   //     previousAssignees: ticket?.assignedTo ? (Array.isArray(ticket.assignedTo) ? ticket.assignedTo : [ticket.assignedTo]) : [],
//   //   };
    
//   //   onSubmit(ticketData);
//   //   onClose();
//   // };

//   // const handleChange = (field, value) => {
//   //   setFormData(prev => ({ ...prev, [field]: value }));
//   // };

//   // const handleAssigneeToggle = (userId) => {
//   //   // Ensure the user exists before adding/removing
//   //   if (!users.some(user => user.id === userId)) return;
    
//   //   setFormData(prev => ({
//   //     ...prev,
//   //     assignedTo: prev.assignedTo.includes(userId)
//   //       ? prev.assignedTo.filter(id => id !== userId)
//   //       : [...prev.assignedTo, userId]
//   //   }));
//   // };

//   // const removeAssignee = (userId) => {
//   //   setFormData(prev => ({
//   //     ...prev,
//   //     assignedTo: prev.assignedTo.filter(id => id !== userId)
//   //   }));
//   // };

//   // const getSelectedUsers = () => {
//   //   return users.filter(user => formData.assignedTo.includes(user.id));
//   // };

//   // const getInitials = (name) => {
//   //   return name.split(' ').map(n => n[0]).join('');
//   // };

//   // const filteredUsers = users.filter(user => {
//   //   const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
//   //   const matchesDepartment = selectedDepartmentFilter === 'all' || user.departmentId === selectedDepartmentFilter;
//   //   return matchesSearch && matchesDepartment;
//   // });

//   // const availableUsers = filteredUsers.filter(user => !formData.assignedTo.includes(user.id));
//   // const selectedUsers = getSelectedUsers();

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[800px] bg-gradient-to-br from-slate-900/95 to-purple-900/95 border-purple-500/20 backdrop-blur-xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
//             <Ticket className="w-6 h-6 text-purple-400" />
//             {ticket ? 'Edit Ticket' : 'Create New Ticket'}
//           </DialogTitle>
//         </DialogHeader>
        
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
//             <label className="text-sm font-medium text-purple-200 mb-2 block">Ticket Title</label>
//             <Input 
//               value={formData.title} 
//               onChange={(e) => handleChange('title', e.target.value)} 
//               placeholder="Enter ticket title..." 
//               className="bg-slate-800/50 border-purple-500/30 text-white placeholder:text-slate-400 focus:border-purple-400" 
//               required 
//             />
//           </motion.div>

//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
//             <label className="text-sm font-medium text-purple-200 mb-2 block">Description</label>
//             <Textarea 
//               value={formData.description} 
//               onChange={(e) => handleChange('description', e.target.value)} 
//               placeholder="Describe the ticket details..." 
//               className="bg-slate-800/50 border-purple-500/30 text-white placeholder:text-slate-400 focus:border-purple-400 min-h-[120px]" 
//             />
//           </motion.div>

//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
//             <label className="text-sm font-medium text-purple-200 mb-3 block flex items-center gap-2">
//               <Users className="w-4 h-4" />
//               Team Assignment ({selectedUsers.length} selected)
//             </label>
            
//             {/* Selected Users Display */}
//             {selectedUsers.length > 0 && (
//               <Card className="mb-4 bg-slate-800/30 border-purple-500/20">
//                 <CardContent className="p-4">
//                   <div className="flex items-center gap-2 mb-3">
//                     <UserPlus className="w-4 h-4 text-green-400" />
//                     <span className="text-sm font-medium text-green-400">Assigned Team Members</span>
//                   </div>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     {selectedUsers.map(user => (
//                       <motion.div 
//                         key={user.id}
//                         initial={{ opacity: 0, scale: 0.9 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         exit={{ opacity: 0, scale: 0.9 }}
//                         className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20"
//                       >
//                         <Avatar className="w-8 h-8">
//                           <AvatarImage src={user.avatar} alt={user.name} />
//                           <AvatarFallback className="text-xs bg-purple-500/20">{getInitials(user.name)}</AvatarFallback>
//                         </Avatar>
//                         <div className="flex-1 min-w-0">
//                           <p className="font-medium text-white text-sm truncate">{user.name}</p>
//                           <p className="text-xs text-gray-400 truncate">
//                             {departments.find(d => d.values === user.department)?.department || 'No Department'}
//                           </p>
//                         </div>
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => removeAssignee(user._id)}
//                           className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/20"
//                         >
//                           <X className="w-4 h-4" />
//                         </Button>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* User Selection Interface */}
//             <Card className="bg-slate-800/30 border-purple-500/20">
//               <CardContent className="p-4">
//                 <div className="flex items-center gap-2 mb-4">
//                   <Search className="w-4 h-4 text-purple-400" />
//                   <span className="text-sm font-medium text-purple-400">Select Team Members</span>
//                 </div>
                
//                 {/* Search and Filter */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                     <Input
//                       placeholder="Search employees..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-10 bg-slate-700/50 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400"
//                     />
//                   </div>
//                   <Select value={selectedDepartmentFilter} onValueChange={setSelectedDepartmentFilter}>
//                     <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
//                       <SelectValue placeholder="Filter by Department" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-slate-800 border-purple-500/30">
//                       {/* <SelectItem value="all">All Departments</SelectItem> */}
//                       {departments.map(d => (
//                         <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* Available Users */}
//                 <div className="max-h-64 overflow-y-auto space-y-2">
//                   {availableUsers.length > 0 ? (
//                     availableUsers.map(user => (
//                       <motion.div
//                         key={user.id}
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                         className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 border border-transparent hover:border-purple-500/30 cursor-pointer transition-all"
//                         onClick={() => handleAssigneeToggle(user.id)}
//                       >
//                         <Avatar className="w-8 h-8">
//                           <AvatarImage src={user.avatar} alt={user.name} />
//                           <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
//                         </Avatar>
//                         <div className="flex-1">
//                           <p className="font-medium text-white text-sm">{user.name}</p>
//                           <p className="text-xs text-gray-400">
//                             {departments.find(d => d.id === user.departmentId)?.name || 'No Department'}
//                           </p>
//                         </div>
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="icon"
//                           className="h-8 w-8 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20"
//                         >
//                           <Plus className="w-4 h-4" />
//                         </Button>
//                       </motion.div>
//                     ))
//                   ) : (
//                     <div className="text-center py-8 text-gray-400">
//                       <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
//                       <p className="text-sm">
//                         {searchTerm || selectedDepartmentFilter !== 'all' 
//                           ? 'No employees match your search criteria' 
//                           : 'All employees are already assigned'}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>

//             {formData.assignedTo.length === 0 && (
//               <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
//                 <X className="w-3 h-3" />
//                 Please assign at least one team member to this ticket
//               </p>
//             )}
//           </motion.div>

//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
//             <label className="text-sm font-medium text-purple-200 mb-2 block">Department</label>
//             <Select value={formData.departmentId} onValueChange={(value) => handleChange('departmentId', value)}>
//               <SelectTrigger className="bg-slate-800/50 border-purple-500/30 text-white">
//                 <SelectValue placeholder="Select Department" />
//               </SelectTrigger>
//               <SelectContent className="bg-slate-800 border-purple-500/30">
//                 {departments.map(d => (
//                   <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </motion.div>

//           <div className="grid grid-cols-3 gap-4">
//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
//               <label className="text-sm font-medium text-purple-200 mb-2 block">Priority</label>
//               <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
//                 <SelectTrigger className="bg-slate-800/50 border-purple-500/30 text-white">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent className="bg-slate-800 border-purple-500/30">
//                   <SelectItem value="low" className="text-green-400">Low</SelectItem>
//                   <SelectItem value="medium" className="text-yellow-400">Medium</SelectItem>
//                   <SelectItem value="high" className="text-red-400">High</SelectItem>
//                 </SelectContent>
//               </Select>
//             </motion.div>
//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
//               <label className="text-sm font-medium text-purple-200 mb-2 block">Status</label>
//               <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
//                 <SelectTrigger className="bg-slate-800/50 border-purple-500/30 text-white">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent className="bg-slate-800 border-purple-500/30">
//                   {ticketStatuses.map(status => (
//                     <SelectItem key={status.id} value={status.id}>{status.name}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </motion.div>
//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
//               <label className="text-sm font-medium text-purple-200 mb-2 block">Due Date</label>
//               <div className="relative">
//                 <Input 
//                   type="date" 
//                   value={formData.dueDate} 
//                   onChange={(e) => handleChange('dueDate', e.target.value)} 
//                   className="bg-slate-800/50 border-purple-500/30 text-white focus:border-purple-400" 
//                 />
//                 <Calendar className="absolute right-3 top-3 h-4 w-4 text-purple-400 pointer-events-none" />
//               </div>
//             </motion.div>
//           </div>
   
//           <DialogFooter className="gap-3 pt-4">
//             <Button type="button" variant="outline" onClick={onClose} className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
//               Cancel
//             </Button>
//             <Button 
//               type="submit" 
//               disabled={formData.assignedTo.length === 0 || !formData.title.trim()}
//               className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold disabled:opacity-50"
//             >
//               <Plus className="w-4 h-4 mr-2" />
//               {ticket ? 'Update Ticket' : 'Create Ticket'}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default TicketForm;



import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
// import {
//   Input, Textarea, Button, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, DialogFooter,
//   Avatar, AvatarImage, AvatarFallback, Card, CardContent
// } from '@/components/ui'; // Replace with your paths
import { Plus, Users, X, Search, UserPlus, Ticket } from 'lucide-react';
import { useTicketCreate } from '../context/TicketCreateContext';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { departmentFilters } from '../context/AuthContext2';

const TicketForm = ({ ticket, users, onClose, isOpen }) => {
  const { TicketCreate, UpdatedTicket } = useTicketCreate();
  const [selectedUsers, setSelectedUsers] = useState(
    users.filter(user => ticket?.assignedTo?.includes(user._id)) || []
  );

  const handleAssigneeToggle = (userId) => {
    const user = users.find(u => u._id === userId);
    if (!user) return;
    setSelectedUsers(prev =>
      prev.some(u => u._id === userId) ? prev.filter(u => u._id !== userId) : [...prev, user]
    );
  };

  const removeAssignee = (userId) => {
    setSelectedUsers(prev => prev.filter(u => u._id !== userId));
  };

  const formik = useFormik({
    initialValues: {
      title: ticket?.title || '',
      description: ticket?.description || '',
      departmentId: departmentFilters.find(d => d.label === ticket?.department)?.value || 'all',
      priority: ticket?.priority || 'Medium',
      status: ticket?.status || 'Open',
      dueDate: ticket?.dueDate?.split('T')[0] || '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string().required('Description is required'),
      departmentId: Yup.string().required('Department is required').notOneOf(['all'], 'Please select a department'),
      priority: Yup.string().oneOf(['Low', 'Medium', 'High']).required(),
      status: Yup.string().oneOf(['Open', 'In Progress', 'Under Review', 'Resolved', 'Closed']).required(),
      dueDate: Yup.date().required('Due date is required'),
    }),
    enableReinitialize:true,
    onSubmit: (values) => {
      const departmentObj = departmentFilters.find(d => d.value === values.departmentId);
      const payload = {
        title: values.title,
        description: values.description,
        department: departmentObj?.label || '',
        priority: values.priority,
        status: values.status,
        dueDate: values.dueDate,
        assignedTo: selectedUsers.map(u => u._id),
      };
     if(ticket){
       UpdatedTicket(ticket._id,payload)
     }else{
       TicketCreate(payload);
     }
      onClose()
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[800px] bg-gradient-to-br from-slate-900/95 to-purple-900/95 border-purple-500/20 backdrop-blur-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
                <Ticket className="w-6 h-6 text-purple-400" />
                {ticket ? 'Edit Ticket' : 'Create New Ticket'}
            </DialogTitle>
          </DialogHeader>
            
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Title */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <label className="text-sm font-medium text-purple-200 mb-2 block">Ticket Title</label>
            <Input
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              placeholder="Enter ticket title..."
              className="bg-slate-800/50 border-purple-500/30 text-white"
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-xs text-red-400">{formik.errors.title}</p>
            )}
          </motion.div>

          {/* Description */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <label className="text-sm font-medium text-purple-200 mb-2 block">Description</label>
            <Textarea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              placeholder="Describe the ticket..."
              className="bg-slate-800/50 border-purple-500/30 text-white"
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-xs text-red-400">{formik.errors.description}</p>
            )}
          </motion.div>

          {/* Assigned Users */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <label className="text-sm font-medium text-purple-200 mb-3 block">Team Assignment ({selectedUsers.length})</label>

            {/* Assigned User List */}
            {selectedUsers.length > 0 && (
              <Card className="mb-4 bg-slate-800/30 border-purple-500/20">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedUsers.map(user => (
                      <motion.div
                        key={user._id}
                        className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20"
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm truncate">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.department || 'No Department'}</p>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeAssignee(user._id)}>
                          <X className="w-4 h-4 text-red-400" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* User Selector */}
            <Card className="bg-slate-800/30 border-purple-500/20">
              <CardContent className="p-4">
                <div className="text-sm text-purple-400 mb-4">Select Team Members</div>
                <div className="grid gap-2 max-h-64 overflow-y-auto">
                  {users.map(user => (
                    <div
                      key={user._id}
                      onClick={() => handleAssigneeToggle(user._id)}
                      className="flex items-center gap-3 p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg cursor-pointer"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-white text-sm">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.department || 'No Department'}</p>
                      </div>
                      <Plus className="w-4 h-4 text-purple-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedUsers.length === 0 && (
              <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                <X className="w-3 h-3" />
                Please assign at least one team member to this ticket
              </p>
            )}
          </motion.div>

          {/* Department */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <label className="text-sm font-medium text-purple-200 mb-2 block">Department</label>
            <Select value={formik.values.departmentId} onValueChange={(value) => formik.setFieldValue('departmentId', value)}>
              <SelectTrigger className="bg-slate-800/50 border-purple-500/30 text-white">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-purple-500/30">
                {departmentFilters.map(dep => (
                  <SelectItem key={dep.id} value={dep.value}>{dep.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Priority, Status, Due Date */}
          <div className="grid grid-cols-3 gap-4">
            {/* Priority */}
            <div>
              <label className="text-sm font-medium text-purple-200 mb-2 block">Priority</label>
              <Select value={formik.values.priority} onValueChange={(value) => formik.setFieldValue('priority', value)}>
                <SelectTrigger className="bg-slate-800/50 border-purple-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-purple-500/30">
                  <SelectItem value="Low" className="text-green-400">Low</SelectItem>
                  <SelectItem value="Medium" className="text-yellow-400">Medium</SelectItem>
                  <SelectItem value="High" className="text-red-400">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-medium text-purple-200 mb-2 block">Status</label>
              <Select value={formik.values.status} onValueChange={(value) => formik.setFieldValue('status', value)}>
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
            </div>

            {/* Due Date */}
            <div>
              <label className="text-sm font-medium text-purple-200 mb-2 block">Due Date</label>
              <div className="relative">
                <Input
                  type="date"
                  name="dueDate"
                  value={formik.values.dueDate}
                  onChange={formik.handleChange}
                  className="bg-slate-800/50 border-purple-500/30 text-white"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <DialogFooter className="gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="border-purple-500/30 text-purple-300">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formik.values.title || selectedUsers.length === 0}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white disabled:opacity-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              {ticket ? 'Update Ticket' : 'Create Ticket'}
            </Button>
          </DialogFooter>
        </form>
          </DialogContent>
        </Dialog>
  );
};

export default TicketForm;
