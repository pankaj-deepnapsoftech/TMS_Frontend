// import React, { useState } from 'react';
// // import { useAuth } from '@/context/AuthContext';
// import { useNotifications } from '@/context/NotificationContext';
// import { Button } from '@/components/ui/button';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
// import { CheckSquare, LogOut, Bell, BellRing } from 'lucide-react';
// import { motion } from 'framer-motion'; 
// import { useNavigate } from 'react-router-dom';
// import { useAuthContext } from '../context/AuthContext2';

// const Header = () => {
//   // const { user, logout } = useAuth();
//   const {user,LogOut}  = useAuthContext() 
// //   const { getUserNotifications, getUnreadCount, markAsRead, markAllAsRead } = useNotifications();
// //   const [showNotifications, setShowNotifications] = useState(false);
// //   const navigate = useNavigate();

// //   const userNotifications = getUserNotifications(user._id);
// //   const unreadCount = getUnreadCount(user._id);

// //   const getInitials = (name) => {
// //     return name.split(' ').map(n => n[0]).join('');
// //   };

// //   const handleNotificationClick = (notification) => {
// //     markAsRead(notification._id);
// //     if (notification.ticketId) {
// //       navigate(`/ticket/${notification.ticketId}`);
// //     }
// //     setShowNotifications(false);
// //   };

// //   const handleMarkAllRead = () => {
// //     markAllAsRead(user._id);
// //   };

// //  console.log(user)

// //   const formatTimeAgo = (dateString) => {
// //     const date = new Date(dateString);
// //     const now = new Date();
// //     const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
// //     if (diffInMinutes < 1) return 'Just now';
// //     if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
// //     if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
// //     return `${Math.floor(diffInMinutes / 1440)}d ago`;
// //   };

//   return (
//     <header className="bg-slate-900/50 backdrop-blur-lg border-b border-purple-500/20 sticky top-0 z-40">
//       <div className="max-w-7xl mx-auto px-4 lg:px-8">
//         <div className="flex items-center justify-between h-20">
//           <motion.div 
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="flex items-center gap-3"
//           >
//             <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
//               <CheckSquare className="w-6 h-6 text-purple-400" />
//             </div>
//             <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ITSYBIZZ TMS</span>
//           </motion.div>
          
//           {user && (
//             <motion.div 
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               className="flex items-center gap-4"
//             >
//               {/* <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" size="icon" className="relative text-purple-400 hover:text-purple-300 hover:bg-purple-500/10">
//                     {unreadCount > 0 ? <BellRing className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
//                     {unreadCount > 0 && (
//                       <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
//                         {unreadCount > 9 ? '9+' : unreadCount}
//                       </Badge>
//                     )}
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-80 bg-slate-800 border-purple-500/30">
//                   <div className="flex items-center justify-between p-3 border-b border-purple-500/20">
//                     <span className="font-semibold text-white">Notifications</span>
//                     {unreadCount > 0 && (
//                       <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="text-purple-400 hover:text-purple-300">
//                         Mark all read
//                       </Button>
//                     )}
//                   </div>
//                   <div className="max-h-96 overflow-y-auto">
//                     {userNotifications.length > 0 ? (
//                       userNotifications.slice(0, 10).map((notification) => (
//                         <DropdownMenuItem
//                           key={notification.id}
//                           className={`p-3 cursor-pointer border-b border-purple-500/10 ${!notification.read ? 'bg-purple-500/5' : ''}`}
//                           onClick={() => handleNotificationClick(notification)}
//                         >
//                           <div className="flex items-start gap-3 w-full">
//                             <div className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? 'bg-purple-400' : 'bg-transparent'}`} />
//                             <div className="flex-1 min-w-0">
//                               <p className="font-medium text-white text-sm">{notification.title}</p>
//                               <p className="text-gray-300 text-xs mt-1 line-clamp-2">{notification.message}</p>
//                               <p className="text-gray-400 text-xs mt-1">{formatTimeAgo(notification.createdAt)}</p>
//                             </div>
//                           </div>
//                         </DropdownMenuItem>
//                       ))
//                     ) : (
//                       <div className="p-6 text-center text-gray-400">
//                         <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
//                         <p>No notifications yet</p>
//                       </div>
//                     )}
//                   </div>
//                 </DropdownMenuContent>
//               </DropdownMenu> */}

//               <div className="flex items-center gap-3">
//                 <Avatar>
//                   <AvatarImage src={user.name} alt={user.name} />
//                   {/* <AvatarFallback>{(user.name)}</AvatarFallback> */}
//                 </Avatar>
//                 <div className="text-right">
//                   <p className="font-semibold text-white">{user.name}</p>
//                   <p className="text-xs text-purple-300 capitalize">{user.role}</p>
//                 </div>
//               </div>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={LogOut}
//                 className="text-purple-400 hover:text-red-400 hover:bg-red-500/10"
//               >
//                 <LogOut className="h-5 w-5" />
//               </Button>
//             </motion.div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckSquare, LogOut, LogOutIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthContext } from '../context/AuthContext2';

const Header = () => {
  const { user, LogOut } = useAuthContext();

  return (
    <section className="bg-slate-900/50 backdrop-blur-lg border-b border-purple-500/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
              <CheckSquare className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ITSYBIZZ TMS
            </span>
          </motion.div>

          {user && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.avatarUrl || ''} alt={user.name} />
                  <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <p className="font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-purple-300 capitalize">{user.role}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={LogOut}
                className="text-purple-400 hover:text-red-400 hover:bg-red-500/10"
              >
                <LogOutIcon className="h-5 w-5" /> 
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Header;
