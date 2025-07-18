import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext2";
import { socket } from "@/socket";
import { useNotifications } from "@/context/NotificationContext";
import { useTicketCreate } from "@/context/TicketCreateContext";

const TicketComments = ({
  ticket,
  user,
  onAddComment,
  formatDate,
  getInitials,
}) => {

  const [newComment, setNewComment] = useState("");
  const { allUsers } = useAuthContext();
  const commentRef = useRef();
  const { comments } = useTicketCreate();

  

  // useEffect(() => {
  //   setComments(ticket.comments || []);
  // }, [ticket.comments]);



  useEffect(() => {
    if (commentRef.current && comments.length > 0) {
      commentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    onAddComment(newComment.trim());
    setNewComment("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-purple-500/20 backdrop-blur-sm" style={{ wordBreak: "break-word" }}>
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            Comments ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
            {comments.length > 0 ? (
              comments.map((comment, index) => {
                const commentUser =
                  allUsers.find(
                    (u) =>
                      u._id === comment.author?._id || u._id === comment.author
                  ) || {
                    name: comment.author?.name || user?.name || "Unknown",
                    avatar: null,
                    _id: comment.author?._id || comment.author || "unknown",
                  };

                return (
                  <motion.div
                    ref={index === comments.length - 1 ? commentRef : null}
                    key={comment._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-3 p-4 rounded-lg bg-slate-700/30 border border-purple-500/10"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={commentUser.avatar || "/default-avatar.png"}
                        alt={commentUser.name}
                        onError={(e) => {
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                      <AvatarFallback className="text-xs">
                        {getInitials(commentUser.name || "U")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white text-sm">
                          {commentUser._id === user?._id
                            ? "You"
                            : commentUser.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(comment.timestamp || comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed" style={{ wordBreak: "break-word" }}>
                        {comment.text}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>

          {/* Add Comment Input */}
          <div className="flex gap-3 pt-4 border-t border-purple-500/20">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={user.avatar || "/default-avatar.png"}
                alt={user.name}
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />
              <AvatarFallback className="text-xs">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); 
                    handleAddComment();
                  }
                }}
                placeholder="Add a comment..."
                className="bg-slate-800/50 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400 min-h-[80px]"
              />
              <Button
                onClick={handleAddComment}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TicketComments;
