import React from "react";
import { motion } from "framer-motion";
// Import your image here. Adjust the path based on where you saved it.
import dashboardImg from "../assets/image.png"; 

export default function DashboardPreview() {
  return (
    <section className="bg-[#050505] py-24 px-4 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase italic mb-4">
            Next-Gen <span className="text-blue-500">Interface</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">
            Experience absolute control with our high-performance terminal and zero-knowledge file management system.
          </p>
        </div>

        {/* Browser Mockup Container */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative group"
        >
          {/* Mac-style Window Header */}
          <div className="w-full bg-[#0F1117] border-x border-t border-white/10 rounded-t-2xl py-3 px-4 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/50" />
              <div className="w-3 h-3 rounded-full bg-amber-500/50" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
            </div>
            <div className="mx-auto bg-white/5 px-4 py-1 rounded text-[10px] text-gray-500 font-mono">
              vault.cyphervault.io
            </div>
          </div>

          {/* Image Wrapper with Glass Shadow */}
          <div className="relative rounded-b-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:shadow-blue-500/10 transition-all duration-500">
            <img 
              src={dashboardImg} 
              alt="CypherVault Dashboard Preview" 
              className="w-full h-auto grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
            />
            
            {/* Dark overlay to make it blend with the site if image is too bright */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/40 via-transparent to-transparent pointer-events-none" />
          </div>
          
          {/* Floating Feature Tags (Optional extra detail) */}
          <div className="absolute -bottom-6 left-10 bg-blue-600 text-white text-[10px] font-bold px-4 py-2 rounded-lg shadow-xl hidden lg:block">
            TERMINAL MODE ACTIVE
          </div>
          <div className="absolute -top-10 -right-4 bg-white/5 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-4 py-2 rounded-lg shadow-xl hidden lg:block uppercase tracking-widest">
            AES-256-GCM
          </div>
        </motion.div>
      </div>
    </section>
  );
}