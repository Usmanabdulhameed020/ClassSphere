import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  MessageSquare, 
  Bot, 
  User,
  Loader2,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dashboardService } from '../services/dashboardService';

function renderInlineMarkdown(text) {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="font-black text-slate-800">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={idx} className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-xs text-teal-600 border border-slate-200/40">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

function renderMarkdown(text) {
  if (!text) return null;
  const paragraphs = text.split(/\n\n+/);
  return paragraphs.map((para, pIdx) => {
    if (para.startsWith('* ') || para.startsWith('- ') || para.startsWith('1. ')) {
      const items = para.split(/\n/);
      return (
        <ul key={pIdx} className="list-disc pl-5 space-y-1.5 my-2">
          {items.map((item, iIdx) => {
            const cleanItem = item.replace(/^(\*\s*|-\s*|\d+\.\s*)/, '');
            return <li key={iIdx}>{renderInlineMarkdown(cleanItem)}</li>;
          })}
        </ul>
      );
    }
    const lines = para.split(/\n/);
    return (
      <p key={pIdx} className="mb-2 leading-relaxed">
        {lines.map((line, lIdx) => (
          <React.Fragment key={lIdx}>
            {lIdx > 0 && <br />}
            {renderInlineMarkdown(line)}
          </React.Fragment>
        ))}
      </p>
    );
  });
}

export default function AIAssistant({ classId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am ClassSphere AI. How can I help you with your studies today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await dashboardService.aiChat(input, classId);
      setMessages(prev => [...prev, { role: 'assistant', content: res.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[200] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden mb-4 transition-all duration-300 ${
              isMinimized ? 'h-20 w-80' : 'h-[500px] w-[400px]'
            }`}
          >
            {/* Header */}
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-teal-500 rounded-xl shadow-lg shadow-teal-500/20">
                    <Sparkles className="w-5 h-5" />
                 </div>
                 <div>
                   <h3 className="font-black text-sm tracking-tight">ClassSphere AI</h3>
                   <p className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">Active & Ready</p>
                 </div>
               </div>
               <div className="flex items-center gap-2">
                 <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                   {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                 </button>
                 <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-rose-500/20 rounded-lg transition-colors text-rose-300">
                   <X className="w-4 h-4" />
                 </button>
               </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-slate-50/50">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-3xl ${
                        msg.role === 'user' 
                          ? 'bg-teal-600 text-white rounded-tr-none' 
                          : 'bg-white text-slate-700 rounded-tl-none shadow-sm border border-slate-100 font-medium'
                      }`}>
                         <div className="flex items-center gap-2 mb-1">
                           {msg.role === 'assistant' ? <Bot className="w-3 h-3 opacity-50" /> : <User className="w-3 h-3 opacity-50" />}
                           <span className="text-[8px] font-black uppercase tracking-widest opacity-50">
                             {msg.role === 'assistant' ? 'AI Assistant' : 'You'}
                           </span>
                         </div>
                          <div className="text-sm leading-relaxed text-slate-700">
                            {msg.role === 'assistant' ? renderMarkdown(msg.content) : msg.content}
                          </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white p-4 rounded-3xl rounded-tl-none shadow-sm border border-slate-100 flex items-center gap-2">
                         <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                         <span className="text-xs font-bold text-slate-400">Thinking...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-6 border-t border-slate-100 bg-white">
                   <form onSubmit={handleSend} className="relative">
                     <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask anything about your class..."
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white rounded-2xl py-4 px-6 pr-16 font-bold outline-none transition-all text-sm"
                     />
                     <button 
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-teal-600 text-white rounded-xl shadow-lg shadow-teal-100 hover:bg-teal-700 disabled:opacity-50 transition-all"
                     >
                       <Send className="w-4 h-4" />
                     </button>
                   </form>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-slate-900 text-white rounded-3xl shadow-2xl flex items-center justify-center relative overflow-hidden group border-2 border-teal-500/20"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? <X className="w-8 h-8" /> : <Bot className="w-8 h-8 text-teal-400" />}
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-1 -right-1 w-4 h-4 bg-teal-500 rounded-full border-2 border-slate-900" 
        />
      </motion.button>
    </div>
  );
}
