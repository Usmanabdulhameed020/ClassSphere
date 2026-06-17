import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  User, 
  FileText, 
  X, 
  Image as ImageIcon, 
  Mic, 
  Play, 
  Pause, 
  Check, 
  CheckCheck, 
  Loader2,
  Download
} from 'lucide-react';
import { chatService } from '../services/chatService';
import { getSocket } from '../utils/socketManager';

// Custom seekable interactive audio player
function AudioPlayer({ src }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const barHeights = [12, 24, 18, 32, 16, 28, 40, 22, 34, 14, 20, 30, 26, 18, 28, 38, 24, 30, 16, 22, 12, 18, 26, 14, 20];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (index) => {
    if (!duration) return;
    const time = (index / barHeights.length) * duration;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 max-w-xs sm:max-w-sm mt-1 shadow-sm">
      <audio ref={audioRef} src={src} preload="metadata" />
      <button 
        type="button" 
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center transition-all shrink-0 active:scale-95 shadow-md shadow-teal-100"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-white text-white" />
        ) : (
          <Play className="w-4 h-4 fill-white text-white translate-x-[1px]" />
        )}
      </button>

      <div className="flex flex-col gap-1 flex-1">
        {/* Custom Waveform bars */}
        <div className="flex items-end gap-[3px] h-10 px-1 pt-2">
          {barHeights.map((h, i) => {
            const barProgress = (i / barHeights.length) * 100;
            const isActive = barProgress <= progressPercent;
            return (
              <div 
                key={i}
                onClick={() => handleSeek(i)}
                className="w-[3px] rounded-full cursor-pointer transition-colors duration-150"
                style={{ 
                  height: `${h}px`,
                  backgroundColor: isActive ? '#0d9488' : '#cbd5e1'
                }}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}

export default function Chat({ classId, user }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);
  
  // Media / File attachment state
  const [attachments, setAttachments] = useState([]);
  
  // Voice Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const loadChat = async () => {
      try {
        const history = await chatService.getChatHistory(classId);
        setMessages(history);

        // Mark messages as read on load
        const socket = getSocket();
        if (socket) {
          socket.emit('read-class-messages', { 
            classId, 
            userId: user.id || user._id, 
            username: user.username 
          });
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadChat();

    const socket = getSocket();
    if (!socket) return;

    // Listen for incoming messages
    const handleReceiveMessage = (message) => {
      if (message.classId === classId) {
        setMessages((prev) => [...prev, message]);
        // Auto mark as read if chat is open
        socket.emit('read-class-messages', { 
          classId, 
          userId: user.id || user._id, 
          username: user.username 
        });
      }
    };

    // Listen for read receipts
    const handleUserReadMessages = ({ classId: readClassId, userId: readUserId, username: readUsername }) => {
      if (readClassId === classId) {
        setMessages(prev => prev.map(msg => {
          const msgSenderId = (msg.sender?._id || msg.sender || msg.sender?.id)?.toString();
          const isSender = msgSenderId === readUserId?.toString();
          const alreadyRead = msg.readBy?.some(r => {
            const rId = (r.userId?._id || r.userId || r.id)?.toString();
            return rId === readUserId?.toString();
          });
          if (isSender || alreadyRead) return msg;

          return {
            ...msg,
            readBy: [...(msg.readBy || []), { userId: readUserId, username: readUsername, readAt: new Date() }]
          };
        }));
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('userReadMessages', handleUserReadMessages);

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
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('userReadMessages', handleUserReadMessages);
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

  // Process files
  const processFiles = (files) => {
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Max allowed size is 10MB.`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachments(prev => [...prev, {
          name: file.name,
          url: reader.result,
          fileType: file.type
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle Drag Events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Trigger file selection dialog
  const handleAttachClick = () => {
    const fileInput = document.getElementById('chat-file-upload-input');
    if (fileInput) fileInput.click();
  };

  // Remove attachment preview
  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Voice recording triggers
  const startRecording = async () => {
    audioChunksRef.current = [];
    setRecordingTime(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          setAttachments(prev => [...prev, {
            name: `Voice Message (${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})`,
            url: reader.result,
            fileType: 'audio/webm'
          }]);
        };
        reader.readAsDataURL(audioBlob);

        // Stop all tracks on microphone stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Failed to start audio recording:', err);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      // Temporarily overwrite onstop so it doesn't process chunks
      mediaRecorderRef.current.onstop = () => {};
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
      audioChunksRef.current = [];
    }
  };

  const formatRecordingTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() && attachments.length === 0) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    chatService.sendTypingStatus(classId, user.username, false);

    const type = attachments.length > 0 ? 'file' : 'text';

    chatService.sendMessage(classId, user, newMessage.trim(), type, attachments);
    setNewMessage('');
    setAttachments([]);
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col h-[600px] bg-white rounded-[2rem] border shadow-sm overflow-hidden relative transition-all duration-200 ${
        isDragging ? 'border-teal-500 scale-[0.99] bg-teal-50/10' : 'border-slate-100'
      }`}
    >
      {/* Drag overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-teal-600/10 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none z-50">
          <div className="bg-white p-6 rounded-3xl border border-teal-200 shadow-xl flex flex-col items-center gap-2">
            <ImageIcon className="w-10 h-10 text-teal-600 animate-bounce" />
            <p className="text-sm font-black text-slate-800 uppercase tracking-widest">Drop files here to upload</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Max file size is 10MB</p>
          </div>
        </div>
      )}

      {/* Chat Header */}
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white">
            <Smile className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-slate-900">Class Sphere Discussion</h3>
            <p className="text-[10px] text-teal-600 font-bold uppercase tracking-widest animate-pulse flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-teal-600 rounded-full inline-block" /> Real-time discussion & file sharing
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/20">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
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
            const msgSenderId = (msg.sender?._id || msg.sender || msg.sender?.id)?.toString();
            const currentUserId = (user.id || user._id)?.toString();
            const isMe = msgSenderId === currentUserId;
            const messageReaders = msg.readBy?.filter(r => {
              const rId = (r.userId?._id || r.userId || r.id)?.toString();
              return rId && rId !== msgSenderId;
            }) || [];
            
            return (
              <motion.div
                key={msg._id || idx}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isMe && (
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-[10px] font-bold shrink-0 overflow-hidden shadow-sm">
                      {msg.senderProfilePicture ? (
                        <img src={msg.senderProfilePicture} alt="" className="w-full h-full object-cover" />
                      ) : (
                        msg.senderName?.charAt(0) || 'U'
                      )}
                    </div>
                  )}
                  <div className="space-y-1">
                    {!isMe && <p className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">{msg.senderName}</p>}
                    
                    <div className={`p-4 rounded-2xl text-sm font-medium relative group shadow-sm ${
                      isMe 
                        ? 'bg-teal-600 text-white rounded-tr-none' 
                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                    }`}>
                      {/* Attachments rendering */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="flex flex-col gap-3 mb-2">
                          {msg.attachments.map((file, fIdx) => {
                            const isImg = file.fileType?.startsWith('image/');
                            const isAudio = file.fileType?.startsWith('audio/');

                            if (isImg) {
                              return (
                                <a 
                                  key={fIdx} 
                                  href={file.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="block rounded-lg overflow-hidden border border-slate-100 max-w-xs hover:opacity-90 transition-opacity"
                                >
                                  <img src={file.url} alt={file.name} className="w-full h-auto object-cover max-h-60" />
                                </a>
                              );
                            }

                            if (isAudio) {
                              return <AudioPlayer key={fIdx} src={file.url} />;
                            }

                            // Document file representation
                            return (
                              <div 
                                key={fIdx} 
                                className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-bold transition-all ${
                                  isMe ? 'bg-teal-700/50 border-teal-500/30 text-white' : 'bg-slate-50 border-slate-100 text-slate-700'
                                }`}
                              >
                                <FileText className="w-6 h-6 shrink-0 text-teal-500" />
                                <div className="flex-1 min-w-0">
                                  <p className="truncate uppercase tracking-wider">{file.name}</p>
                                  <p className="text-[9px] opacity-65 uppercase">{file.fileType || 'Document'}</p>
                                </div>
                                <a 
                                  href={file.url} 
                                  download={file.name} 
                                  className={`p-2 rounded-lg transition-all ${
                                    isMe ? 'hover:bg-teal-500/50 text-white' : 'hover:bg-slate-200 text-slate-500'
                                  }`}
                                >
                                  <Download className="w-4 h-4" />
                                </a>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      
                      {/* Text content */}
                      {msg.content && <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>}
                    </div>

                    {/* Timestamp & Read receipts indicators */}
                    <div className={`flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-tighter ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>

                      {isMe && (
                        <div className="relative group/receipt flex items-center">
                          {messageReaders.length > 0 ? (
                            <>
                              <CheckCheck className="w-3.5 h-3.5 text-teal-600 cursor-pointer" />
                              <div className="absolute bottom-5 right-0 bg-slate-900/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider py-1.5 px-2.5 rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover/receipt:opacity-100 transition-opacity z-10 shadow-lg border border-slate-700">
                                Read by: {messageReaders.map(r => r.username).join(', ')}
                              </div>
                            </>
                          ) : (
                            <Check className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </div>
                      )}
                    </div>
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

      {/* Selected Attachment Previews */}
      {attachments.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-50 bg-slate-50/30 flex flex-wrap gap-3 max-h-36 overflow-y-auto">
          {attachments.map((file, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-100 text-xs font-bold shadow-sm relative group"
            >
              {file.fileType?.startsWith('image/') ? (
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                  <img src={file.url} alt="" className="w-full h-full object-cover" />
                </div>
              ) : (
                <FileText className="w-4 h-4 text-teal-600 shrink-0" />
              )}
              <span className="max-w-[120px] truncate text-slate-700 uppercase tracking-wider">{file.name}</span>
              <button 
                type="button" 
                onClick={() => removeAttachment(idx)}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-6 border-t border-slate-100 bg-white">
        <form onSubmit={handleSendMessage} className="relative flex items-center gap-3">
          
          {/* File Input */}
          <input 
            type="file" 
            id="chat-file-upload-input" 
            multiple 
            onChange={(e) => {
              if (e.target.files) processFiles(Array.from(e.target.files));
            }}
            className="hidden" 
          />

          {!isRecording ? (
            <>
              {/* Paperclip Button */}
              <button 
                type="button" 
                onClick={handleAttachClick}
                className="p-3.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all shrink-0"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={newMessage}
                onChange={handleTyping}
                placeholder="Type your message..."
                className="flex-1 bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white p-4 rounded-2xl outline-none text-sm font-bold text-slate-700 transition-all"
              />

              {/* Voice Record Start Button */}
              <button
                type="button"
                onClick={startRecording}
                className="p-3.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0"
              >
                <Mic className="w-5 h-5" />
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!newMessage.trim() && attachments.length === 0}
                className="p-4 bg-teal-600 text-white rounded-2xl hover:bg-teal-700 disabled:opacity-50 disabled:grayscale transition-all shadow-lg shadow-teal-100 shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              {/* Pulse Recording indicators */}
              <div className="flex items-center gap-4 bg-red-50 border border-red-100 px-4 py-3 rounded-2xl flex-1 animate-pulse">
                <span className="w-3 h-3 bg-red-600 rounded-full animate-ping shrink-0" />
                <span className="text-xs font-black text-red-600 uppercase tracking-widest">
                  Recording Audio ({formatRecordingTime(recordingTime)})
                </span>
                
                {/* Visual bouncing visualizer wave */}
                <div className="flex items-end gap-1 h-6 ml-auto mr-4">
                  <div className="w-[3px] bg-red-500 rounded-full animate-[bounce_0.8s_infinite_0.1s] h-3" />
                  <div className="w-[3px] bg-red-500 rounded-full animate-[bounce_0.8s_infinite_0.3s] h-5" />
                  <div className="w-[3px] bg-red-500 rounded-full animate-[bounce_0.8s_infinite_0.5s] h-3.5" />
                  <div className="w-[3px] bg-red-500 rounded-full animate-[bounce_0.8s_infinite_0.2s] h-4.5" />
                </div>
              </div>

              {/* Recording Controls */}
              <button 
                type="button" 
                onClick={cancelRecording}
                className="p-4 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-2xl transition-all font-bold text-xs uppercase tracking-wider"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={stopRecording}
                className="px-6 py-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-100 animate-pulse"
              >
                Stop & Done
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
