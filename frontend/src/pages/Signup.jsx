import React, { useState, useEffect } from "react";
import { Lock, ShieldCheck, Share2, Key, User, Mail, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const features = [
  {
    title: "End-to-End Encryption",
    desc: "Your data is encrypted on your device, stays encrypted throughout its journey.",
    icon: <Lock className="text-blue-500" size={32} />,
  },
  {
    title: "Zero-Knowledge Architecture",
    desc: "Even we cannot access your files. Only you hold the key to unlock them.",
    icon: <ShieldCheck className="text-blue-500" size={32} />,
  },
  {
    title: "Secure File Sharing",
    desc: "Share access to your vault with trusted partners without exposing your primary key.",
    icon: <Share2 className="text-blue-500" size={32} />,
  },
];

const Signup = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-black text-white flex items-center justify-center p-6 overflow-hidden selection:bg-blue-500/30">
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/10 blur-[120px] rounded-full" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Left Side: Carousel */}
        <div className="space-y-12">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <Shield size={28} />
            </div>
            <h1 className="text-2xl font-bold tracking-tighter italic">PrivyDrive</h1>
          </div>

          <div className="space-y-4">
            <h2 className="text-6xl font-bold tracking-tight leading-[1.1]">
              Your data. <br />
              <span className="text-gray-500">Your key.</span> <br />
              Your control.
            </h2>
          </div>

          <div className="relative h-[180px] max-w-md group">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex gap-6 items-start"
              >
                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                  {features[index].icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{features[index].title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">{features[index].desc}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Create Vault Form */}
        <div className="relative">
          <div className="absolute -inset-[1px] bg-gradient-to-b from-white/20 to-transparent rounded-[32px]" />
          <div className="relative p-10 rounded-[32px] bg-[#0a0a0a]/90 border border-white/5 backdrop-blur-2xl shadow-2xl">
            <h2 className="text-3xl font-semibold text-center mb-1">Create Secure Vault</h2>
            <p className="text-center text-gray-500 text-sm mb-8">Zero-knowledge encryption enabled</p>

            <form className="space-y-4">
              <div className="space-y-4">
                <div className="relative group">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500" />
                  <input type="text" placeholder="Full name" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all" />
                </div>
                <div className="relative group">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500" />
                  <input type="email" placeholder="Email" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all" />
                </div>
                <div className="relative group">
                  <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500" />
                  <input type="password" placeholder="Private Key" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all" />
                </div>
              </div>

              {/* Password Strength Meter */}
              <div className="pt-2 px-1">
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '70%' }} className="h-full bg-blue-600" />
                </div>
                <div className="flex justify-between text-[10px] text-gray-600 mt-2 font-bold uppercase tracking-widest">
                  <span>Weak</span> <span className="text-blue-500">Secure</span>
                </div>
              </div>

              {/* Confirm Private Key */}
              <div className="relative group">
                <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500" />
                <input type="password" placeholder="Confirm Private Key" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all" />
              </div>

              {/* Checkbox */}
              <div className="flex items-center gap-3 px-1 pt-2">
                <input type="checkbox" id="terms" className="w-4 h-4 rounded border-white/10 bg-white/5 checked:bg-blue-500 cursor-pointer" />
                <label htmlFor="terms" className="text-xs text-gray-500 cursor-pointer">
                  I agree to the <span className="text-blue-500 font-medium">Privacy Policy</span> and <span className="text-blue-500 font-medium">Terms of Service</span>.
                </label>
              </div>

              <button className="w-full mt-4 bg-white text-black font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all active:scale-[0.98]">
                Generate Secure Vault
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-8">
              Already have a vault? <Link to="/login" className="text-blue-500 hover:underline font-medium">Unlock it ›</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;