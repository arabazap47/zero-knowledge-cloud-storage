import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Unlock, Loader2 } from "lucide-react";

const VaultLoader = ({ mode = "unlocking" }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#05070a] flex flex-col items-center justify-center text-white"
    >
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-blue-600/5 radial-gradient" />

      <div className="relative flex flex-col items-center">
        {/* Animated Shield Icon */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotateY: mode === "unlocking" ? [0, 180, 360] : [360, 180, 0]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mb-8 p-6 rounded-3xl bg-blue-600/10 border border-blue-500/20 shadow-[0_0_50px_rgba(37,99,235,0.2)]"
        >
          {mode === "unlocking" ? (
            <Unlock size={48} className="text-blue-500" />
          ) : (
            <Lock size={48} className="text-blue-500" />
          )}
        </motion.div>

        {/* Text Animations */}
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold italic tracking-tight mb-2"
        >
          {mode === "unlocking" ? "Unlocking CypherVault" : "Securing CypherVault"}
        </motion.h2>
        
        <div className="flex items-center gap-3 text-gray-500 font-mono text-xs tracking-widest uppercase">
          <Loader2 size={14} className="animate-spin" />
          {mode === "unlocking" ? "Decrypting local keys..." : "Clearing session data..."}
        </div>

        {/* Progress Bar */}
        <div className="mt-8 w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="h-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.8)]"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default VaultLoader;