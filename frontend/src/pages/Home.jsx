import React, {useState, useEffect} from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import DashboardPreview from "../components/DashboardPreview";
import HowItWorks from "../components/HowItWorks";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";
import Login from "./Login";
import Signup from "./Signup";

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  useEffect(() => {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (isLoginOpen || isSignupOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`; // Prevents "jumping"
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [isLoginOpen, isSignupOpen]);

  const openLogin = () => {
    setIsSignupOpen(false);
    // Use a tiny timeout to ensure the previous modal unmounts before the next opens
    setTimeout(() => setIsLoginOpen(true), 10);
  };

  const openSignup = () => {
    setIsLoginOpen(false);
    setTimeout(() => setIsSignupOpen(true), 10);
  };

  const closeAll = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans selection:bg-blue-500/30">
      <Login 
        isOpen={isLoginOpen} 
        onClose={closeAll} 
        onSwitchToSignup={openSignup} 
      />
      <Signup 
        isOpen={isSignupOpen} 
        onClose={closeAll} 
        onSwitchToLogin={openLogin} 
      />

      {/* Pass setIsLoginOpen to Navbar so the login button can trigger it */}
      <Navbar onLoginClick={openLogin} onSignupClick={openSignup} />
      <div id="hero">
      <Hero />
      </div>
      <div id="features">
        <Features />
      </div>
      <DashboardPreview />
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <div id="pricing">  
        <Pricing />
      </div>
      <Footer />
    </div>
  );  
}