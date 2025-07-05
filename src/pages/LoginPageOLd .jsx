// import React, { useState } from 'react';
// import { Helmet } from 'react-helmet';
// import { motion } from 'framer-motion';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import { useAuth } from '@/context/AuthContext';
// import { users, departments } from '@/data';
// import { User, Shield, Briefcase } from 'lucide-react';

// const LoginPage = () => {
//   const { login } = useAuth();
//   const [selectedUser, setSelectedUser] = useState(null);

//   const handleLogin = (userId) => {
//     login(userId);
//   };

//   const getInitials = (name) => {
//     return name.split(' ').map(n => n[0]).join('');
//   };

//   const getRoleIcon = (role) => {
//     return role === 'admin' ? Shield : User;
//   };

//   const getRoleColor = (role) => {
//     return role === 'admin' 
//       ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-300'
//       : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-300';
//   };

//   return (
//     <>
//       <Helmet>
//         <title>Login - ITSYBIZZ TMS</title>
//         <meta name="description" content="Login to access your ticket management dashboard." />
//       </Helmet>
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
//         <motion.div 
//           initial={{ opacity: 0, scale: 0.9 }} 
//           animate={{ opacity: 1, scale: 1 }} 
//           transition={{ duration: 0.5 }}
//           className="w-full max-w-4xl"
//         >
//           <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-purple-500/20 backdrop-blur-xl">
//             <CardHeader className="text-center pb-8">
//               <motion.div 
//                 initial={{ opacity: 0, y: -20 }} 
//                 animate={{ opacity: 1, y: 0 }} 
//                 transition={{ delay: 0.2 }}
//                 className="flex items-center justify-center gap-3 mb-4"
//               >
//                 <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
//                   <Shield className="w-6 h-6 text-white" />
//                 </div>
//                 <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
//                   ITSYBIZZ TMS
//                 </span>
//               </motion.div>
//               <CardTitle className="text-2xl text-white mb-2">Welcome Back!</CardTitle>
//               <p className="text-gray-400">Select your account to access the ticket management system</p>
//             </CardHeader>
            
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {users.map((user, index) => {
//                   const department = departments.find(d => d.id === user.departmentId);
//                   const RoleIcon = getRoleIcon(user.role);
                  
//                   return (
//                     <motion.div
//                       key={user.id}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: 0.1 * index }}
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                     >
//                       <Card 
//                         className={`cursor-pointer transition-all duration-300 hover:border-purple-400/50 ${
//                           selectedUser === user.id 
//                             ? 'border-purple-400/50 bg-gradient-to-br from-purple-500/10 to-pink-500/10' 
//                             : 'border-purple-500/20 bg-gradient-to-br from-slate-700/30 to-slate-800/30'
//                         }`}
//                         onClick={() => setSelectedUser(user.id)}
//                       >
//                         <CardContent className="p-6">
//                           <div className="flex flex-col items-center text-center space-y-4">
//                             <Avatar className="w-16 h-16 ring-2 ring-purple-500/30">
//                               <AvatarImage src={user.avatar} alt={user.name} />
//                               <AvatarFallback className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white font-semibold">
//                                 {getInitials(user.name)}
//                               </AvatarFallback>
//                             </Avatar>
                            
//                             <div className="space-y-2">
//                               <h3 className="font-semibold text-white text-lg">{user.name}</h3>
                              
//                               <div className="flex flex-col gap-2">
//                                 <Badge className={getRoleColor(user.role)}>
//                                   <RoleIcon className="w-3 h-3 mr-1" />
//                                   {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
//                                 </Badge>
                                
//                                 {department && (
//                                   <Badge variant="secondary" className="bg-slate-600/30 text-gray-300 border-slate-500/30">
//                                     <Briefcase className="w-3 h-3 mr-1" />
//                                     {department.name}
//                                   </Badge>
//                                 )}
//                               </div>
//                             </div>
                            
//                             <Button 
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleLogin(user.id);
//                               }}
//                               className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
//                             >
//                               Login as {user.name.split(' ')[0]}
//                             </Button>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     </motion.div>
//                   );
//                 })}
//               </div>
              
//               <motion.div 
//                 initial={{ opacity: 0 }} 
//                 animate={{ opacity: 1 }} 
//                 transition={{ delay: 0.8 }}
//                 className="mt-8 text-center"
//               >
//                 <p className="text-gray-400 text-sm">
//                   Demo accounts available - Admin can manage all tickets, Employees see only their assigned tickets
//                 </p>
//               </motion.div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>
//     </>
//   );
// };

// export default LoginPage;