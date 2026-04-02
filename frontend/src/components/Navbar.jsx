import React, { useState } from 'react';
import { Shield, AlignRight, X } from "lucide-react";
import { Link } from "react-router-dom"; // ✅ ONLY ADDITION

export default function Navbar({ onLoginClick, onSignupClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const handleMobileLogin = () => {
    setIsOpen(false);
    onLoginClick();
  };

  return (
    <nav className="fixed to-0 z-50 w-full flex items-center justify-between px-8 py-6 bg-[#050505] text-white border-b border-white/5">

      {/* Logo */}
      <div className="flex items-center gap-2 font-bold text-xl cursor-pointer">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.3)]">
          <Shield size={20} fill="white" className="text-white" />
        </div>
        <a href='#hero' className="tracking-tight">CypherVault</a>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex gap-10 text-gray-400 text-sm font-medium">
        <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
        <a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</a>
        <a href="#how-it-works" className="hover:text-blue-400 transition-colors">How It Works?</a>
      </div>

      {/* Desktop Buttons & Mobile Toggle */} 
      <div className="flex items-center gap-4">

        <button
          onClick={onLoginClick}
          className="hidden md:block text-sm font-medium text-gray-300 hover:text-white transition"
        >
          Log In
        </button>

        <button 
          onClick={onSignupClick}
        className="hidden md:block bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95">
          Get Started
        </button>

        {/* --- TRENDY MOBILE ICON --- */}
        <button 
          className="md:hidden text-gray-400 hover:text-white transition-all"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <AlignRight size={28} className="rotate-180" />}
        </button>

      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-[#0B0C10] border-b border-white/5 p-8 flex flex-col gap-6 md:hidden animate-in slide-in-from-top duration-300">

          <a href="#features" onClick={() => setIsOpen(false)} className="text-lg text-gray-300">Features</a>
          <a href="#pricing" onClick={() => setIsOpen(false)} className="text-lg text-gray-300">Pricing</a>
          <a href="#story" onClick={() => setIsOpen(false)} className="text-lg text-gray-300">Story</a>

          <hr className="border-white/5" />

          
          <button
            onClick={handleMobileLogin}
            className="text-left text-lg text-gray-300 hover:text-blue-500 transition-colors"
          >
            Log In
          </button>

          <button className="bg-blue-600 py-4 rounded-xl font-bold">
            Get Started
          </button>

        </div>
      )}

    </nav>
  );
}