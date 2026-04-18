import React, { useState, useEffect } from "react";
import {
  Shield,
  ShieldCheck,
  Key,
  Mail,
  ArrowRight,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import VaultLoader from "../components/VaultLoader";

const features = [
  {
    title: "Military-Grade",
    desc: "AES-256 encryption for your data.",
    icon: <Shield className="text-blue-500" size={24} />,
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
  const navigate = useNavigate(); // ✅ Initialize navigate
  const [index, setIndex] = useState(0);
  const [view, setView] = useState("login"); // "login" or "forgot"
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [showResetSuccess, setShowResetSuccess] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  useEffect(() => {
    let timer;
    if (isOpen) {
      timer = setInterval(() => {
        setIndex((prev) => (prev + 1) % features.length);
      }, 4000);
    }
    return () => {
    clearInterval(timer);
    setFormData({ email: "", password: "" });
    setErrors({});
    setView("login");
    setSuccessMsg("");
    setShowResetSuccess("");
  }
  }, [isOpen]);

  //login logic
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    if (formData.email === "admin@gmail.com" && formData.password === "admin") {
    setIsUnlocking(true);
    setTimeout(() => {
      setIsUnlocking(false);
      onClose();
      navigate("/admin-dashboard"); // Redirect to admin route
    }, 2000);
    return;
  }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        sessionStorage.setItem("vaultKey", formData.password); //session storage
        setIsUnlocking(true);
        setTimeout(() => {
          setIsUnlocking(false);
          onClose();
          navigate("/dashboard"); // Redirect to dashboard
        }, 2500);
      } else {
        setErrors({ server: data.msg || "Login failed" });
      }
    } catch (err) {
      setErrors({ server: "Server error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  //forget passwpord logic
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        },
      );
      if (res.ok) {
      // ✅ CHANGE THIS: Trigger Popup instead of simple text
      setShowResetSuccess(true); 
      const emailSentTo = formData.email; // Store for the popup
      setFormData({ ...formData, email: "" });

      setTimeout(() => {
        setShowResetSuccess(false);
        setView("login");
      }, 4000);
    } else {
      setErrors({ server: "Email not found" });
    }
  } catch (err) {
    setErrors({ server: "Failed to send reset link" });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <>
    <AnimatePresence>
        {isUnlocking && <VaultLoader mode="unlocking" />}
      </AnimatePresence>
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
          <AnimatePresence>
          {showResetSuccess && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute z-[130] bg-white text-black p-8 rounded-[32px] shadow-2xl text-center max-w-sm flex flex-col items-center gap-4 border border-white/20"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                <Mail size={32} className="text-blue-600 animate-bounce" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold italic tracking-tight">Link Sent!</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  A reset link has been dispatched to your email. Please check your inbox.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-2 font-medium">
                <Loader2 className="animate-spin" size={14} />
                Returning to login...
              </div>
            </motion.div>
          )}
        </AnimatePresence>

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl overflow-hidden rounded-[24px] md:rounded-[32px] bg-[#0a0a0a] text-white border border-white/10 shadow-2xl"
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
                    <Shield size={20} className="text-white" />
                  </div>
                  <span className="font-bold italic tracking-tight">
                    CypherVault
                  </span>
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
                          <h3 className="font-semibold text-sm">
                            {features[index].title}
                          </h3>
                          <p className="text-gray-400 text-xs leading-relaxed">
                            {features[index].desc}
                          </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex gap-1.5">
                  {features.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 rounded-full transition-all ${i === index ? "w-6 bg-blue-500" : "w-1.5 bg-white/20"}`}
                    />
                  ))}
                </div>
              </div>

              {/* RIGHT SIDE - Form */}
              <div className="p-8 md:p-10">
                <AnimatePresence mode="wait">
                  {view === "login" ? (
                    <motion.div key="login" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>

                <div className="text-center lg:text-left mb-8">
                  <h2 className="text-2xl font-bold mb-1">Unlock Vault</h2>
                  <p className="text-gray-500 text-sm">
                    Enter credentials to access your data
                  </p>
                </div>

                <form
                  className="space-y-4"
                  onSubmit={handleLogin}
                >
                   {errors.server && <div className="text-red-400 text-xs bg-red-500/10 p-3 rounded-xl border border-red-500/20 flex items-center gap-2"><AlertCircle size={14}/> {errors.server}</div>}
                        {successMsg && <div className="text-green-400 text-xs bg-green-500/10 p-3 rounded-xl border border-green-500/20 flex items-center gap-2"><CheckCircle2 size={14}/> {successMsg}</div>}

                  <div className="relative group">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500"
                      size={18}
                    />
                    <input
                      type="email"
                      placeholder="Email address"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all"
                      value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>

                  <div className="relative group">
                    <Key
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500"
                      size={18}
                    />
                    <input
                      type="password"
                      placeholder="Private Key"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all"
                      value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                    />
                  </div>
                  <div className="text-right">
                          <button type="button" onClick={() => setView("forgot")} className="text-xs text-blue-500 hover:underline">Forgot Private Key?</button>
                        </div>
                  <button disabled={isLoading} className="w-full bg-white text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
                          {isLoading ? <Loader2 className="animate-spin" size={18} /> : <>Open Vault <ArrowRight size={18} /></>}
                        </button>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div key="forgot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <div className="text-center lg:text-left mb-8">
                        <h2 className="text-2xl font-bold mb-1">Reset Key</h2>
                        <p className="text-gray-500 text-sm">We'll send a reset link to your email</p>
                      </div>
                      <form className="space-y-4" onSubmit={handleForgotPassword}>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                          <input type="email" required placeholder="Registered Email" className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                        </div>
                        <button disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2">
                          {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Send Reset Link"}
                        </button>
                        <button type="button" onClick={() => setView("login")} className="w-full text-sm text-gray-400 hover:text-white">Back to Login</button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="text-center text-xs text-gray-500 mt-8">
                  Don't have a vault yet? <button onClick={onSwitchToSignup} className="text-blue-500 hover:underline font-medium">Create one</button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
};


                  
export default Login;
