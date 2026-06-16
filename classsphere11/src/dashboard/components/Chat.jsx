import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Smile, MoreVertical, User, FileText, X, Image as ImageIcon } from 'lucide-react';
import { chatService } from '../services/chatService';
import { joinClassRoom, leaveClassRoom } from '../utils/socketManager';

export default function Chat({ classId, user }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const loadChat = async () => {
      try {
        const history = await chatService.getChatHistory(classId);
        setMessages(history);
      } catch (err) {
        console.error('Failed to load chat history:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadChat();

    // Setup socket listener
    chatService.onReceiveMessage((message) => {
      if (message.classId === classId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    // Setup typing listener
    chatService.onUserTyping(({ username, isTyping }) => {
      setTypingUsers((prev) => {
        if (isTyping) {
          if (prev.includes(username)) return prev;
          return [...prev, username];
        } else {
          return prev.filter((u) => u !== username);
        }
      });
    });

    return () => {
      chatService.removeReceiveMessageListener();
      chatService.removeTypingListener();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        chatService.sendTypingStatus(classId, user.username, false);
      }
    };
  }, [classId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    chatService.sendTypingStatus(classId, user.username, true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      chatService.sendTypingStatus(classId, user.username, false);
    }, 2000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    chatService.sendTypingStatus(classId, user.username, false);

    chatService.sendMessage(classId, user, newMessage.trim());
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white">
            <Smile className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-slate-900">Class Sphere Chat</h3>
            <p className="text-[10px] text-teal-600 font-bold uppercase tracking-widest">Real-time Discussion</p>
          </div>
        </div>
        <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
               <Smile className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-sm font-bold text-slate-500 italic">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender === (user.id || user._id) || msg.sender?._id === (user.id || user._id);
            return (
              <motion.div
                key={msg._id || idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isMe && (
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-[10px] font-bold shrink-0 overflow-hidden">
                      {msg.senderProfilePicture ? (
                        <img src={msg.senderProfilePicture} alt="" className="w-full h-full object-cover" />
                      ) : (
                        msg.senderName?.charAt(0) || 'U'
                      )}
                    </div>
                  )}
                  <div className="space-y-1">
                    {!isMe && <p className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">{msg.senderName}</p>}
                    <div className={`p-4 rounded-2xl text-sm font-medium ${
                      isMe 
                        ? 'bg-teal-600 text-white rounded-tr-none' 
                        : 'bg-slate-100 text-slate-700 rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                    <p className={`text-[9px] text-slate-400 font-bold uppercase tracking-tighter ${isMe ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
        
        {/* Typing Indicator */}
        <AnimatePresence>
          {typingUsers.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-slate-400"
            >
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">
                {typingUsers.length === 1 ? `${typingUsers[0]} is typing...` : 'Multiple citizens typing...'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-slate-50 bg-white">
        <form onSubmit={handleSendMessage} className="relative flex items-center gap-3">
          <button type="button" className="p-3 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all">
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type your message..."
            className="flex-1 bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white p-4 rounded-2xl outline-none text-sm font-bold text-slate-700 transition-all"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-4 bg-teal-600 text-white rounded-2xl hover:bg-teal-700 disabled:opacity-50 disabled:grayscale transition-all shadow-lg shadow-teal-100"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
