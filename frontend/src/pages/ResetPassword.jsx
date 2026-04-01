import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Key, ShieldCheck, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ResetPassword = () => {
  const { token } = useParams(); // Extracts the JWT from the URL
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" }); // "success" or "error"

  const handleReset = async (e) => {
    e.preventDefault();
    
    if (password.length < 8) {
      return setStatus({ type: "error", msg: "Key must be at least 8 characters." });
    }
    if (password !== confirmPassword) {
      return setStatus({ type: "error", msg: "Keys do not match." });
    }

    setIsLoading(true);
    setStatus({ type: "", msg: "" });

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", msg: "Vault Key updated! Redirecting to login..." });
        setTimeout(() => navigate("/"), 3000); // Redirect to Home (where Login modal is)
      } else {
        setStatus({ type: "error", msg: data.msg || "Link expired or invalid." });
      }
    } catch (err) {
      setStatus({ type: "error", msg: "Server connection failed." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-white font-sans">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-blue-600/10 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 p-8 md:p-10 rounded-[32px] shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="bg-blue-600 p-3 rounded-2xl mb-4 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-bold italic tracking-tight">Reset Vault Key</h1>
          <p className="text-gray-500 text-sm mt-2">Create a new private key to regain access to your vault.</p>
        </div>

        <form onSubmit={handleReset} className="space-y-5">
          <AnimatePresence mode="wait">
            {status.msg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`flex items-center gap-2 p-4 rounded-xl text-xs border ${
                  status.type === "success" 
                  ? "bg-green-500/10 border-green-500/20 text-green-400" 
                  : "bg-red-500/10 border-red-500/20 text-red-400"
                }`}
              >
                {status.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {status.msg}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative group">
            <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="password" 
              required
              placeholder="New Private Key"
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/40 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="relative group">
            <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="password" 
              required
              placeholder="Confirm New Key"
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/40 transition-all"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button 
            disabled={isLoading || status.type === "success"}
            className="w-full bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Update Private Key"}
          </button>

          <button 
            type="button"
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-white transition-colors pt-2"
          >
            <ArrowLeft size={16} /> Back to Home
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;