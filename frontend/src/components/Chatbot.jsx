import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Loader2 } from "lucide-react";

// 🧠 Simple Knowledge Base for the Bot
const KNOWLEDGE_BASE = {
  encryption: "We use AES-256-GCM encryption. Your data is encrypted locally before being uploaded.",
  price: "Our Starter plan is Free. Pro is ₹199/mo, and Business is ₹499/mo.",
  lost: "Since we are Zero-Knowledge, if you lose your password, we cannot recover your data. Keep it safe!",
  folder: "Yes! You can create folders, subfolders, and even navigate them via our built-in Terminal.",
  default: "That's an interesting question! For security reasons, I recommend checking our official FAQ section below."
};

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello! I'm CypherAI. Ready to secure your digital footprint?" },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const generateResponse = (query) => {
    const q = query.toLowerCase();
    if (q.includes("encrypt") || q.includes("secure")) return KNOWLEDGE_BASE.encryption;
    if (q.includes("price") || q.includes("cost") || q.includes("plan")) return KNOWLEDGE_BASE.price;
    if (q.includes("forgot") || q.includes("recover")) return KNOWLEDGE_BASE.lost;
    if (q.includes("folder") || q.includes("directory")) return KNOWLEDGE_BASE.folder;
    return KNOWLEDGE_BASE.default;
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    
    // Start "Thinking"
    setIsTyping(true);

    // Simulate Network Delay + Thinking
    setTimeout(() => {
      const responseText = generateResponse(userMsg.text);
      setIsTyping(false);
      setMessages((prev) => [...prev, { role: "bot", text: responseText }]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="mb-4 w-[350px] h-[500px] bg-[#0d0f14] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm text-white">CypherAI</p>
                  <p className="text-[10px] text-blue-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Online Now
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-white/[0.01]">
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: m.role === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] p-3.5 rounded-[20px] text-[13px] leading-relaxed shadow-sm ${
                    m.role === "user" 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-white/5 text-gray-300 border border-white/5 rounded-tl-none"
                  }`}>
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 p-3 rounded-2xl rounded-tl-none flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </motion.div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input Field */}
            <div className="p-4 bg-black/40 border-t border-white/5 backdrop-blur-md">
              <div className="relative flex items-center">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a message..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-sm text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 p-2 text-blue-500 hover:text-blue-400 disabled:opacity-30 transition-colors"
                >
                  {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[22px] flex items-center justify-center shadow-xl shadow-blue-600/30 text-white relative group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={28} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
              <MessageSquare size={28} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Subtle Notification Badge */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#050505] rounded-full" />
        )}
      </motion.button>
    </div>
  );
}