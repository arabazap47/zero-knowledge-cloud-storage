import React, { useState, useEffect } from "react";
import { Lock, ShieldCheck, Key, Mail, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Military-Grade Security",
    desc: "Your vault is protected by AES-256 encryption, the global standard for data safety.",
    icon: <Lock className="text-blue-500" size={32} />,
  },
  {
    title: "Instant Local Decryption",
    desc: "Decryption happens on your device. We never see your key or your files.",
    icon: <ShieldCheck className="text-blue-500" size={32} />,
  },
  {
    title: "Zero-Knowledge Access",
    desc: "Only the holder of the Private Key can unlock this storage. No exceptions.",
    icon: <Key className="text-blue-500" size={32} />,
  },
];

const Login = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">

      {/* CARD WRAPPER */}
      <div className="relative w-full max-w-6xl">

        {/* Glow Border */}
        <div className="absolute -inset-[1px] bg-gradient-to-b from-white/20 to-transparent rounded-[32px]" />

        {/* CARD CONTENT */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-16 p-10 rounded-[32px] bg-[#0a0a0a]/95 border border-white/5 backdrop-blur-2xl shadow-2xl">

          {/* CLOSE BUTTON */}
          <button 
            onClick={() => window.history.back()}
            className="absolute top-5 right-6 text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>

          {/* LEFT SIDE */}
          <div className="space-y-12">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                <Lock size={28} />
              </div>
              <h1 className="text-2xl font-bold tracking-tighter italic">PrivyDrive</h1>
            </div>

            <div className="space-y-4">
              <h2 className="text-5xl font-bold tracking-tight leading-[1.1]">
                Welcome back. <br />
                <span className="text-gray-500">Unlock your</span> <br />
                Digital Vault.
              </h2>
            </div>

            {/* Carousel */}
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
                    <p className="text-gray-400 text-sm">{features[index].desc}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="absolute -bottom-8 left-0 flex gap-2">
                {features.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === index ? "w-8 bg-blue-500" : "w-2 bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative">
            <div className="absolute -inset-[1px] bg-gradient-to-b from-white/20 to-transparent rounded-[32px]" />
            
            <div className="relative p-10 rounded-[32px] bg-[#0a0a0a]/90 border border-white/5 backdrop-blur-2xl shadow-2xl">
              <h2 className="text-3xl font-semibold text-center mb-1">Unlock Vault</h2>
              <p className="text-center text-gray-500 text-sm mb-10">
                Enter your credentials to access your data
              </p>

              <form className="space-y-6">
                <div className="space-y-4">
                  
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      placeholder="Email address"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50"
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500">
                      <Key size={18} />
                    </div>
                    <input
                      type="password"
                      placeholder="Enter Private Key"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50"
                    />
                  </div>

                </div>

                <button className="w-full mt-4 bg-white text-black hover:bg-gray-200 font-bold py-4 rounded-2xl flex items-center justify-center gap-2">
                  Open My Vault <ArrowRight size={18} />
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-10">
                Don't have a vault yet?{" "}
                <Link to="/signup" className="text-blue-500 hover:underline font-medium">
                  Create one ›
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;