import React, { useState, useEffect } from "react";
import { Lock, ShieldCheck, Share2, Key, User, Mail, Shield, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const features = [
  { title: "End-to-End Encryption", desc: "Your data is encrypted on your device, stays encrypted throughout its journey.", icon: <Lock className="text-blue-500" size={32} /> },
  { title: "Zero-Knowledge Architecture", desc: "Even we cannot access your files. Only you hold the key to unlock files.", icon: <ShieldCheck className="text-blue-500" size={32} /> },
  { title: "Secure File Sharing", desc: "Share access without exposing primary keys.", icon: <Share2 className="text-blue-500" size={32} /> },
];

const Signup = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [index, setIndex] = useState(0);
  const [showOtp, setShowOtp] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  // form validation
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [isLoading, setIsLoading] = useState(false);
// for term and conditions
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // --- 1. DYNAMIC ERROR CLEARING ---
  // This clears the red text as soon as the user starts fixing the input
  useEffect(() => {
    const newErrors = { ...errors };
    if (formData.name.trim()) delete newErrors.name;
    if (formData.email.includes("@")) delete newErrors.email;
    if (formData.password.length >= 8) delete newErrors.password;
    if (formData.password === formData.confirmPassword) delete newErrors.confirmPassword;
    setErrors(newErrors);
  }, [formData]);

  // --- 2. PASSWORD STRENGTH CALCULATION ---
  const getStrength = (pass) => {
    let s = 0;
    if (pass.length > 8) s++;
    if (/[A-Z]/.test(pass)) s++;
    if (/[0-9]/.test(pass)) s++;
    if (/[^A-Za-z0-9]/.test(pass)) s++;
    return s; // returns 0 to 4
  };
  const strength = getStrength(formData.password);

  // --- 3. OTP LOGIC ---
  const handleSendOtp = async () => {
  if (!formData.email.includes("@")) return setErrors({ email: "Valid email required" });
  
  setIsLoading(true); // Start loading
  try {
    const res = await fetch("http://localhost:5000/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email }),
    });
    if (res.ok) {
      setShowOtp(true);
      const newErrs = {...errors};
      delete newErrs.otp;
      setErrors(newErrs);
    }
  } catch (err) {
    setErrors({ server: "Failed to send OTP. Is backend running?" });
  } finally {
    setIsLoading(false); // Stop loading
  }
};

  const handleVerifyOtp = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: otpInput }),
      });
      if (res.ok) setIsOtpVerified(true);
      else setErrors({ otp: "Invalid OTP code" });
    } catch (err) {
      setErrors({ otp: "Verification failed" });
    }
  };

  useEffect(() => {
    let timer;
    if (isOpen) {
      resetForm();
      timer = setInterval(() => setIndex((prev) => (prev + 1) % features.length), 4000);
    }
    return () => clearInterval(timer);
  }, [isOpen]);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.includes("@")) newErrors.email = "Invalid email address";
    if (formData.password.length < 8) newErrors.password = "Key must be at least 8 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Keys do not match";
    if (!isOtpVerified) newErrors.otp = "Please verify your email first";
    if (!agreedToTerms) newErrors.terms = "You must agree to the terms";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          resetForm();
          onSwitchToLogin();
        }, 3000);
      } else {
        setErrors({ server: data.msg });
      }
    } catch (err) {
      setErrors({ server: "Server connection failed" });
    }
  };
  const resetForm = () => {
  setFormData({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  setOtpInput("");
  setShowOtp(false);
  setIsOtpVerified(false);
  setErrors({});
  setShowSuccess(false);
};

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          
          <AnimatePresence>
            {showSuccess && (
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="absolute z-[120] bg-white text-black p-8 rounded-[32px] shadow-2xl text-center max-w-sm flex flex-col items-center gap-4">
    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
      <CheckCircle2 size={40} className="text-green-600" />
    </div>
    <h3 className="text-2xl font-bold italic tracking-tight">Vault Generated!</h3>
    <p className="text-gray-500 text-sm">Your digital vault is secured.</p>
    
    {/* Redirect Loading Indicator */}
    <div className="flex items-center gap-2 text-blue-600 font-medium text-sm mt-2">
      <Loader2 className="animate-spin" size={18} />
      Redirecting to unlock...
    </div>
  </motion.div>
            )}
          </AnimatePresence>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-4xl overflow-hidden rounded-[24px] md:rounded-[32px] bg-[#0a0a0a] border border-white/10 shadow-2xl text-white">
            <button onClick={() => {resetForm();
               onClose();
               }} 
               className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white bg-white/5 rounded-full transition-colors"><X size={20} /></button>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="hidden lg:flex flex-col justify-between p-10 bg-blue-600/5 border-r border-white/5">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-600 p-1.5 rounded-lg"><Shield size={20} /></div>
                  <span className="font-bold italic tracking-tight">CypherVault</span>
                </div>
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold leading-tight">Your data. <br /><span className="text-gray-500">Your key.</span> <br />Your control.</h2>
                  <div className="relative h-28">
                    <AnimatePresence mode="wait">
                      <motion.div key={index} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex gap-4 items-start">
                        <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">{features[index].icon}</div>
                        <div><h3 className="font-semibold text-sm">{features[index].title}</h3><p className="text-gray-400 text-xs leading-relaxed">{features[index].desc}</p></div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
                <div className="flex gap-1.5">{features.map((_, i) => (<div key={i} className={`h-1 rounded-full transition-all ${i === index ? "w-6 bg-blue-500" : "w-1.5 bg-white/20"}`} />))}</div>
              </div>

              <div className="p-8 md:p-10 max-h-[90vh] overflow-y-auto">
                <div className="text-center lg:text-left mb-6">
                  <h2 className="text-2xl font-bold mb-1">Create Vault</h2>
                  <p className="text-gray-500 text-sm">Secure your digital life in seconds</p>
                </div>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  {errors.server && <div className="text-red-400 text-xs bg-red-500/10 p-3 rounded-xl border border-red-500/20 flex items-center gap-2"><AlertCircle size={14}/> {errors.server}</div>}

                  {/* Name */}
                  <div className="relative group">
                    <User size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.name ? 'text-red-500' : 'text-gray-500'}`} />
                    <input type="text" placeholder="Full Name" className={`w-full bg-white/[0.03] border ${errors.name ? 'border-red-500/50' : 'border-white/10'} rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-blue-500/50 text-sm transition-all`} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    {errors.name && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.name}</p>}
                  </div>

                  {/* Email & OTP */}
                  <div className="relative group flex gap-2">
                    <div className="relative flex-1">
                      <Mail size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.email ? 'text-red-500' : 'text-gray-500'}`} />
                      <input type="email" placeholder="Email" className={`w-full bg-white/[0.03] border ${errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-blue-500/50 text-sm transition-all`} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    {!isOtpVerified && (
                      <button 
  onClick={handleSendOtp} 
  disabled={isLoading}
  className="px-4 py-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center min-w-[90px]"
>
  {isLoading ? <Loader2 className="animate-spin" size={16} /> : (showOtp ? "Resend" : "Send OTP")}
</button>
                    )}
                  </div>
                  {errors.otp && <p className="text-[10px] text-red-500 ml-1">{errors.otp}</p>}

                  <AnimatePresence>
                    {showOtp && !isOtpVerified && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0 }} className="flex gap-2">
                        <input type="text" placeholder="6-digit OTP" className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl py-3.5 px-4 outline-none focus:border-blue-500/50 text-sm text-center tracking-widest" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} maxLength={6} />
                        <button onClick={handleVerifyOtp} className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold transition-all">Verify</button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {isOtpVerified && <div className="flex items-center gap-2 text-green-500 text-xs px-1"><CheckCircle2 size={14} /> Email Verified</div>}

                  {/* Password + Strength Bar */}
                  <div className="relative group">
                    <Key size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.password ? 'text-red-500' : 'text-gray-500'}`} />
                    <input type="password" placeholder="Create Private Key" className={`w-full bg-white/[0.03] border ${errors.password ? 'border-red-500/50' : 'border-white/10'} rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-blue-500/50 text-sm transition-all`} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    
                    {/* Strength Bar */}
                    <div className="flex gap-1 mt-2 px-1">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < strength ? (strength <= 2 ? 'bg-orange-500' : 'bg-blue-500') : 'bg-white/10'}`} />
                      ))}
                    </div>
                    {errors.password && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.password}</p>}
                  </div>

                  <div className="relative group">
                    <Key size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.confirmPassword ? 'text-red-500' : 'text-gray-500'}`} />
                    <input type="password" placeholder="Confirm Private Key" className={`w-full bg-white/[0.03] border ${errors.confirmPassword ? 'border-red-500/50' : 'border-white/10'} rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-blue-500/50 text-sm transition-all`} value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
                    {errors.confirmPassword && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.confirmPassword}</p>}
                  </div>

                  <div className="flex flex-col gap-1 px-1">
  <div className="flex items-start gap-3">
    <input 
      type="checkbox" 
      id="terms" 
      checked={agreedToTerms}
      onChange={(e) => {
        setAgreedToTerms(e.target.checked);
        // Automatically clear terms error when checked
        if(e.target.checked) {
          const newErrs = {...errors};
          delete newErrs.terms;
          setErrors(newErrs);
        }
      }}
      className={`mt-1 w-4 h-4 rounded border ${errors.terms ? 'border-red-500' : 'border-white/10'} bg-white/5 accent-blue-600 cursor-pointer`} 
    />
    <label htmlFor="terms" className="text-[11px] text-gray-500 leading-normal cursor-pointer">
      I agree to the <span className="text-blue-500">Terms of Service</span>.
    </label>
  </div>
  {/* Show error message for terms */}
  {errors.terms && <p className="text-[10px] text-red-500 ml-7">{errors.terms}</p>}
</div>

                  <button onClick={handleSignup} className="w-full mt-2 bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-all active:scale-[0.98] text-sm">
                    Generate My Vault
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-6">
                    Already have a vault? <button onClick={onSwitchToLogin} className="text-blue-500 hover:underline font-medium">Unlock it ›</button>
                  </p>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Signup;