import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Search, MoreVertical, Send, Paperclip, Smile, User, UserPlus, X, Loader2, ArrowLeft } from 'lucide-react';
import { cn } from '../utils';
import { messageService } from '../services/messageService';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

function VoiceNotePlayer({ src }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    audio.load();

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [src]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(err => console.error("Audio playback error:", err));
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex items-center gap-3 py-2 px-1 min-w-[220px] max-w-[300px]">
      <button 
        type="button"
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-md hover:scale-105 transition-all shrink-0"
      >
        {isPlaying ? (
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        ) : (
          <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        )}
      </button>
      <div className="flex-1 space-y-1">
        <input 
          type="range" 
          min="0" 
          max={duration || 100} 
          value={currentTime}
          onChange={handleSeek}
          className="w-full accent-teal-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-bold">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const { t } = useTheme();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState('');
  const [sidebarSearchResults, setSidebarSearchResults] = useState([]);
  const [isSidebarSearching, setIsSidebarSearching] = useState(false);

  const messagesEndRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojis = ['😀', '😂', '😍', '👍', '🙏', '🔥', '🎉', '❤️', '👏', '🥳', '😎', '💡', '🌟', '🚀', '💯', '🤔', '👀', '✨'];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchConversations();

    messageService.onNewPrivateMessage((message) => {
      // If the message is for the active conversation, add it
      if (activeConversation && message.conversationId === activeConversation._id) {
        setMessages(prev => [...prev, message]);
        window.dispatchEvent(new CustomEvent('messagesRead'));
      }
      // Refresh conversation list to update last message
      fetchConversations();
    });

    messageService.onPrivateMessagesRead(({ conversationId }) => {
      if (activeConversation && conversationId === activeConversation._id) {
        setMessages(prev => prev.map(m => m.isRead ? m : { ...m, isRead: true }));
      }
    });

    return () => {
      messageService.removePrivateMessageListener();
      messageService.removePrivateMessagesReadListener();
    };
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const data = await messageService.getConversations();
      setConversations(data);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConversation = async (conv) => {
    setActiveConversation(conv);
    setIsMessagesLoading(true);
    try {
      const data = await messageService.getMessages(conv._id);
      setMessages(data);
      // Dispatch messagesRead event to update sidebar badge
      window.dispatchEvent(new CustomEvent('messagesRead'));
      // Mark as read locally in active conversation
      setConversations(prev => prev.map(c => c._id === conv._id ? { ...c, unreadCount: 0 } : c));
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setIsMessagesLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() || !activeConversation) return;

    const recipient = activeConversation.participants.find(p => (p._id || p.id) !== (user?.id || user?._id));
    if (!recipient) return;

    try {
      const newMessage = await messageService.sendMessage(recipient._id, messageInput);
      setMessages(prev => [...prev, newMessage]);
      setMessageInput('');
      
      if (activeConversation.isNew) {
        const conversationsData = await messageService.getConversations();
        setConversations(conversationsData);
        const actualConv = conversationsData.find(c => 
          c.participants.some(p => p._id === recipient._id)
        );
        if (actualConv) {
          setActiveConversation(actualConv);
        }
      } else {
        fetchConversations();
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = reader.result;
          await sendVoiceMessage(base64Audio);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Failed to start recording:', err);
      alert('Could not access microphone.');
    }
  };

  const stopRecordingAndSend = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      clearInterval(recordingTimerRef.current);
      setIsRecording(false);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.onstop = () => {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorderRef.current.stop();
      clearInterval(recordingTimerRef.current);
      setIsRecording(false);
      audioChunksRef.current = [];
    }
  };

  const sendVoiceMessage = async (base64Audio) => {
    if (!activeConversation) return;

    const recipient = activeConversation.participants.find(p => (p._id || p.id) !== (user?.id || user?._id));
    if (!recipient) return;

    try {
      const newMessage = await messageService.sendMessage(recipient._id, base64Audio);
      setMessages(prev => [...prev, newMessage]);
      fetchConversations();
    } catch (err) {
      console.error('Failed to send voice message:', err);
    }
  };

  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleEmojiClick = (emoji) => {
    setMessageInput(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleSearchUsers = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const data = await messageService.searchUsers(query);
      setSearchResults(data);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSidebarSearch = async (e) => {
    const query = e.target.value;
    setSidebarSearchQuery(query);
    if (query.length < 2) {
      setSidebarSearchResults([]);
      return;
    }

    setIsSidebarSearching(true);
    try {
      const data = await messageService.searchUsers(query);
      setSidebarSearchResults(data);
    } catch (err) {
      console.error('Sidebar search failed:', err);
    } finally {
      setIsSidebarSearching(false);
    }
  };


  const startNewConversation = async (recipient) => {
    // Optimistically check if conversation exists
    const existing = conversations.find(c => 
      c.participants.some(p => p._id === recipient._id)
    );

    if (existing) {
      handleSelectConversation(existing);
    } else {
      // Create a temporary "new" conversation state or just send the first message
      // For now, let's just close modal and set active to a "new" object
      const tempConv = {
        _id: 'new',
        participants: [user, recipient],
        isNew: true
      };
      setActiveConversation(tempConv);
      setMessages([]);
    }
    setShowSearchModal(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const getOtherParticipant = (conv) => {
    return conv.participants.find(p => (p._id || p.id) !== (user?.id || user?._id)) || { username: 'Unknown' };
  };

  if (isLoading) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600/20" />
      </div>
    );
  }

  const filteredConversations = conversations.filter(conv => {
    const other = getOtherParticipant(conv);
    return other.username?.toLowerCase().includes(sidebarSearchQuery.toLowerCase());
  });

  const existingChatUserIds = new Set(
    conversations.map(conv => getOtherParticipant(conv)._id)
  );

  const globalUsers = sidebarSearchResults.filter(
    u => !existingChatUserIds.has(u._id)
  );

  return (
    <div className="h-[calc(100vh-220px)] flex bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mb-10">
      {/* Sidebar */}
      <div className={cn(
        "w-full md:w-80 border-r border-slate-50 flex flex-col h-full bg-slate-50/20",
        activeConversation ? "hidden md:flex" : "flex"
      )}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-slate-900">{t('messages')}</h2>
            <button 
              onClick={() => setShowSearchModal(true)}
              className="p-2 bg-teal-600 text-white rounded-xl shadow-lg shadow-teal-100 hover:bg-teal-700 transition-all"
            >
              <UserPlus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={sidebarSearchQuery}
              onChange={handleSidebarSearch}
              placeholder={t('chatsSearch')} 
              className="w-full bg-white border border-slate-100 rounded-2xl py-3 px-12 text-sm font-bold outline-none focus:ring-4 focus:ring-teal-50"
            />
            {sidebarSearchQuery && (
              <button 
                onClick={() => {
                  setSidebarSearchQuery('');
                  setSidebarSearchResults([]);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-4 p-3 custom-scrollbar">
          {sidebarSearchQuery ? (
            <>
              {/* Existing Chats Section */}
              {filteredConversations.length > 0 && (
                <div>
                  <div className="px-3 mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('recentConversations') || 'Recent Conversations'}</span>
                  </div>
                  <div className="space-y-1">
                    {filteredConversations.map((conv) => {
                      const other = getOtherParticipant(conv);
                      return (
                        <button 
                          key={conv._id}
                          onClick={() => {
                            handleSelectConversation(conv);
                            setSidebarSearchQuery('');
                            setSidebarSearchResults([]);
                          }}
                          className={cn(
                            "w-full p-4 rounded-2xl flex items-center gap-4 transition-all group",
                            activeConversation?._id === conv._id ? "bg-white shadow-lg shadow-slate-200/50" : "hover:bg-white/50"
                          )}
                        >
                          <div className="relative shrink-0">
                            <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 font-bold group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors overflow-hidden">
                              {other.profilePicture ? (
                                <img src={other.profilePicture} alt="" className="w-full h-full object-cover" />
                              ) : other.username?.charAt(0)}
                            </div>
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-bold text-slate-900 text-sm truncate">{other.username}</h4>
                            </div>
                            <p className="text-xs text-slate-400 font-medium truncate">
                              {conv.lastMessage?.content || t('startedConversation')}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Global search results (other users in system) */}
              {isSidebarSearching ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-teal-600/40" />
                </div>
              ) : globalUsers.length > 0 ? (
                <div>
                  <div className="px-3 mb-2 mt-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('globalCitizens') || 'Global Citizens'}</span>
                  </div>
                  <div className="space-y-1">
                    {globalUsers.map(res => (
                      <button 
                        key={res._id}
                        onClick={() => {
                          startNewConversation(res);
                          setSidebarSearchQuery('');
                          setSidebarSearchResults([]);
                        }}
                        className="w-full p-4 rounded-2xl flex items-center gap-4 hover:bg-white/50 transition-all border border-transparent hover:border-slate-100 text-left"
                      >
                         <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 overflow-hidden">
                            {res.profilePicture ? <img src={res.profilePicture} className="w-full h-full object-cover" /> : res.username.charAt(0)}
                         </div>
                         <div>
                            <p className="font-bold text-slate-900 text-sm">{res.username}</p>
                         </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {filteredConversations.length === 0 && globalUsers.length === 0 && !isSidebarSearching && (
                <div className="text-center py-10 opacity-40">
                  <Search className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-bold text-slate-500">{t('noCitizensFound')}</p>
                </div>
              )}
            </>
          ) : (
            // Default active conversations list
            conversations.length === 0 ? (
              <div className="text-center py-10 opacity-40">
                <MessageCircle className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-bold text-slate-500">{t('noConversations')}</p>
              </div>
            ) : conversations.map((conv) => {
              const other = getOtherParticipant(conv);
              return (
                <button 
                  key={conv._id}
                  onClick={() => handleSelectConversation(conv)}
                  className={cn(
                    "w-full p-4 rounded-2xl flex items-center gap-4 transition-all group relative",
                    activeConversation?._id === conv._id ? "bg-white shadow-lg shadow-slate-200/50" : "hover:bg-white/50"
                  )}
                >
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 font-bold group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors overflow-hidden">
                      {other.profilePicture ? (
                        <img src={other.profilePicture} alt="" className="w-full h-full object-cover" />
                      ) : other.username?.charAt(0)}
                    </div>
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-slate-900 text-sm truncate">{other.username}</h4>
                      <span className="text-[8px] font-black text-slate-300 uppercase">
                        {conv.updatedAt ? new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-slate-400 font-medium truncate flex-1 mr-2">
                        {conv.lastMessage?.content?.startsWith('data:audio/') ? '🎙️ Voice Note' : (conv.lastMessage?.content || t('startedConversation'))}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="bg-rose-500 text-white font-black text-[9px] w-5 h-5 rounded-full flex items-center justify-center shrink-0 shadow-sm shadow-rose-100">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={cn(
        "flex-1 flex-col h-full bg-white",
        activeConversation ? "flex" : "hidden md:flex"
      )}>
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setActiveConversation(null)}
                  className="p-2 hover:bg-slate-50 rounded-xl text-slate-600 transition-colors md:hidden mr-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 font-bold overflow-hidden">
                  {getOtherParticipant(activeConversation).profilePicture ? (
                    <img src={getOtherParticipant(activeConversation).profilePicture} alt="" className="w-full h-full object-cover" />
                  ) : getOtherParticipant(activeConversation).username?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 leading-tight">{getOtherParticipant(activeConversation).username}</h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><Search className="w-5 h-5 text-slate-400" /></button>
                <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><MoreVertical className="w-5 h-5 text-slate-400" /></button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-4 bg-[#efeae2] custom-scrollbar" style={{ backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 0)', backgroundSize: '16px 16px' }}>
              {isMessagesLoading ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-teal-600/20" />
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                   <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-4">
                      <MessageCircle className="w-10 h-10 text-slate-400" />
                   </div>
                   <p className="font-black text-slate-500 uppercase tracking-widest text-xs">{t('noMessagesYet')}</p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isMe = msg.sender === (user?.id || user?._id) || msg.sender?._id === (user?.id || user?._id);
                  const isVoiceNote = msg.content?.startsWith('data:audio/');
                  return (
                    <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={cn(
                        "p-3.5 max-w-[70%] shadow-sm transition-all relative",
                        isMe 
                          ? "bg-[#d9fdd3] text-slate-800 rounded-2xl rounded-tr-none border border-[#c1ebd0]" 
                          : "bg-white text-slate-800 rounded-2xl rounded-tl-none border border-slate-100"
                      )}>
                        {isVoiceNote ? (
                          <VoiceNotePlayer src={msg.content} />
                        ) : (
                          <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                            {msg.content}
                          </p>
                        )}
                        <div className="flex items-center justify-end gap-1 mt-1.5 text-[9px] font-bold text-slate-400">
                          <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {isMe && (
                            msg.isRead ? (
                              <svg className="w-3.5 h-3.5 fill-current text-sky-500" viewBox="0 0 24 24">
                                <path d="M0.282,11.233c0.375-0.376,0.983-0.376,1.358,0l5.127,5.128L18.175,5.143c0.375-0.375,0.984-0.375,1.359,0 c0.375,0.375,0.375,0.984,0,1.359L7.433,18.604c-0.375,0.375-0.984,0.375-1.359,0l-5.792-5.792 C-0.094,12.436-0.094,11.608,0.282,11.233z" />
                                <path d="M5.592,16.549l5.127-5.128l11.408-11.408c0.375-0.375,0.984-0.375,1.359,0c0.375,0.375,0.375,0.984,0,1.359 L11.383,22.464c-0.375,0.375-0.984,0.375-1.359,0L4.233,16.672c-0.375-0.375-0.375-0.984,0-1.359 C4.608,14.937,5.217,14.937,5.592,16.549z" />
                              </svg>
                            ) : (
                              <svg className="w-3.5 h-3.5 fill-current text-slate-400" viewBox="0 0 24 24">
                                <path d="M0.282,11.233c0.375-0.376,0.983-0.376,1.358,0l5.127,5.128L18.175,5.143c0.375-0.375,0.984-0.375,1.359,0 c0.375,0.375,0.375,0.984,0,1.359L7.433,18.604c-0.375,0.375-0.984,0.375-1.359,0l-5.792-5.792 C-0.094,12.436-0.094,11.608,0.282,11.233z" />
                                <path d="M5.592,16.549l5.127-5.128l11.408-11.408c0.375-0.375,0.984-0.375,1.359,0c0.375,0.375,0.375,0.984,0,1.359 L11.383,22.464c-0.375,0.375-0.984,0.375-1.359,0L4.233,16.672c-0.375-0.375-0.375-0.984,0-1.359 C4.608,14.937,5.217,14.937,5.592,16.549z" />
                              </svg>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white border-t border-slate-50 relative">
               {/* Emoji Picker Popover */}
               {showEmojiPicker && (
                 <div className="absolute bottom-20 left-6 bg-white border border-slate-100 rounded-3xl p-4 shadow-xl z-50 max-w-[280px]">
                   <div className="grid grid-cols-6 gap-2">
                     {emojis.map((emoji) => (
                       <button 
                         key={emoji}
                         type="button" 
                         onClick={() => handleEmojiClick(emoji)}
                         className="w-8 h-8 flex items-center justify-center text-xl hover:bg-slate-50 rounded-lg transition-all"
                       >
                         {emoji}
                       </button>
                     ))}
                   </div>
                 </div>
               )}

               <form onSubmit={handleSendMessage} className="bg-slate-50 rounded-2xl p-2 flex items-center gap-2">
                 {isRecording ? (
                   <div className="flex-1 flex items-center justify-between px-4 py-2 bg-rose-50 rounded-2xl border border-rose-100 text-rose-600 font-bold text-sm">
                     <div className="flex items-center gap-2">
                       <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse shrink-0" />
                       <span className="animate-pulse">{t('recording') || 'Recording Voice Note...'} ({formatDuration(recordingTime)})</span>
                     </div>
                     <div className="flex items-center gap-3">
                       <button 
                         type="button" 
                         onClick={cancelRecording}
                         className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                       >
                         Cancel
                       </button>
                       <button 
                         type="button" 
                         onClick={stopRecordingAndSend}
                         className="text-teal-600 hover:text-teal-800 transition-colors p-1 font-black"
                       >
                         Send
                       </button>
                     </div>
                   </div>
                 ) : (
                   <>
                     <button 
                       type="button" 
                       onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                       className={cn("p-2 hover:bg-white rounded-xl transition-all text-slate-400", showEmojiPicker && "text-teal-600 bg-teal-50/50")}
                     >
                       <Smile className="w-5 h-5" />
                     </button>
                     <input 
                       type="text" 
                       placeholder={t('typeMessage')} 
                       value={messageInput}
                       onChange={(e) => setMessageInput(e.target.value)}
                       className="flex-1 bg-transparent py-2 px-2 text-sm font-bold outline-none"
                     />
                     <button 
                       type="button" 
                       onClick={startRecording}
                       className="p-2 hover:bg-white rounded-xl transition-all text-slate-400"
                       title="Record Voice Note"
                     >
                       <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4m-4 0h8"/></svg>
                     </button>
                     <button 
                       type="submit"
                       disabled={!messageInput.trim()}
                       className="bg-teal-600 text-white p-3 rounded-xl shadow-lg shadow-teal-100 hover:bg-teal-700 active:scale-95 transition-all disabled:opacity-50"
                     >
                       <Send className="w-5 h-5" />
                     </button>
                   </>
                 )}
               </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/10 p-10 text-center">
            <div className="w-24 h-24 bg-teal-50 text-teal-600 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-xl shadow-teal-100/50">
              <MessageCircle className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">{t('communicationHub')}</h3>
            <p className="text-slate-500 max-w-sm mt-2 font-medium">{t('communicationHubDesc')}</p>
            <button 
              onClick={() => setShowSearchModal(true)}
              className="mt-8 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl hover:bg-slate-800 transition-all"
            >
              {t('startNewChat')}
            </button>
          </div>
        )}
      </div>

      {/* Search Modal */}
      <AnimatePresence>
        {showSearchModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => setShowSearchModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden border border-white/20"
            >
              <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-900">{t('findCitizen')}</h3>
                <button onClick={() => setShowSearchModal(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchUsers}
                    placeholder={t('typeUsername')} 
                    className="w-full px-12 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white transition-all outline-none font-bold"
                  />
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
                  {isSearching ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="w-6 h-6 animate-spin text-teal-600/40" />
                    </div>
                  ) : searchResults.length === 0 && searchQuery.length >= 2 ? (
                    <p className="text-center text-xs font-bold text-slate-400 py-4 italic">{t('noCitizensFound')}</p>
                  ) : (
                    searchResults.map(res => (
                      <button 
                        key={res._id}
                        onClick={() => startNewConversation(res)}
                        className="w-full p-4 rounded-2xl flex items-center gap-4 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 text-left"
                      >
                         <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 overflow-hidden">
                            {res.profilePicture ? <img src={res.profilePicture} className="w-full h-full object-cover" /> : res.username.charAt(0)}
                         </div>
                         <div>
                            <p className="font-bold text-slate-900 text-sm">{res.username}</p>
                         </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
