import React, { useState, useEffect } from "react";
import { Lock, ShieldCheck, Key, Mail, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const features = [
  {
    title: "Military-Grade",
    desc: "AES-256 encryption for your data.",
    icon: <Lock className="text-blue-500" size={24} />,
  },
  {
    title: "Local Decryption",
    desc: "Keys never leave your device.",
    icon: <ShieldCheck className="text-blue-500" size={24} />,
  },
  {
    title: "Zero-Knowledge",
    desc: "Only you hold the private key.",
    icon: <Key className="text-blue-500" size={24} />,
  },
];

const Login = ({ isOpen, onClose, onSwitchToSignup }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let timer;
    if (isOpen) {
      timer = setInterval(() => {
        setIndex((prev) => (prev + 1) % features.length);
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isOpen]);
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl overflow-hidden rounded-[24px] md:rounded-[32px] bg-[#0a0a0a] border border-white/10 shadow-2xl"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white bg-white/5 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              
              {/* LEFT SIDE - Hidden on mobile to keep it short */}
              <div className="hidden lg:flex flex-col justify-between p-8 bg-blue-600/5 border-r border-white/5">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-600 p-1.5 rounded-lg">
                    <Lock size={20} className="text-white" />
                  </div>
                  <span className="font-bold italic tracking-tight">CypherVault</span>
                </div>

                <div className="space-y-6">
                  <h2 className="text-3xl font-bold leading-tight">
                    Welcome back. <br />
                    <span className="text-gray-500">Secure your</span> <br />
                    Digital Vault.
                  </h2>

                  <div className="relative h-32">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex gap-4 items-start"
                      >
                        <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                          {features[index].icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{features[index].title}</h3>
                          <p className="text-gray-400 text-xs leading-relaxed">{features[index].desc}</p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex gap-1.5">
                  {features.map((_, i) => (
                    <div key={i} className={`h-1 rounded-full transition-all ${i === index ? "w-6 bg-blue-500" : "w-1.5 bg-white/20"}`} />
                  ))}
                </div>
              </div>

              {/* RIGHT SIDE - Form */}
              <div className="p-8 md:p-10">
                <div className="text-center lg:text-left mb-8">
                  <h2 className="text-2xl font-bold mb-1">Unlock Vault</h2>
                  <p className="text-gray-500 text-sm">Access your encrypted files</p>
                </div>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500" size={18} />
                    <input
                      type="email"
                      placeholder="Email address"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>

                  <div className="relative group">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500" size={18} />
                    <input
                      type="password"
                      placeholder="Private Key"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>

                  <button className="w-full mt-2 bg-white text-black hover:bg-gray-200 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
                    Open Vault <ArrowRight size={18} />
                  </button>
                </form>

                <p className="text-center text-xs text-gray-500 mt-8">
                  Don't have a vault yet?{" "}
                  <button onClick={onSwitchToSignup} className="text-blue-500 hover:underline font-medium">Create one</button>
                </p>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Login;