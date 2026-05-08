import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "How does Zero-Knowledge encryption work?",
    a: "We use client-side AES-256-GCM encryption. Your files are encrypted in your browser before they ever touch our servers. We never see your password or your data.",
  },
  {
    q: "Can I recover my data if I lose my password?",
    a: "Because of our Zero-Knowledge architecture, we do not store your password. If lost, data recovery is impossible. We recommend using a password manager.",
  },
  {
    q: "Is there a limit on file sizes?",
    a: "Starter accounts have a 50MB total limit. Pro and Business accounts offer significantly higher individual file size support and total storage.",
  },
];

const FAQItem = ({ faq, isOpen, toggle }) => (
  <div className="border-b border-white/5 overflow-hidden">
    <button
      onClick={toggle}
      className="w-full py-6 flex items-center justify-between text-left hover:text-blue-400 transition-colors"
    >
      <span className="text-lg font-medium">{faq.q}</span>
      {isOpen ? <Minus className="text-blue-500" /> : <Plus className="text-gray-500" />}
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="pb-6 text-gray-400 leading-relaxed"
        >
          {faq.a}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-24 px-6 bg-[#050505]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center uppercase tracking-tighter italic">
          Frequently Asked <span className="text-blue-500">Questions</span>
        </h2>
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              isOpen={openIndex === i}
              toggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}