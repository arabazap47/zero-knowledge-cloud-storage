import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import DashboardPreview from "../components/DashboardPreview";
import HowItWorks from "../components/HowItWorks";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] font-sans selection:bg-blue-500/30">
      <Navbar />
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