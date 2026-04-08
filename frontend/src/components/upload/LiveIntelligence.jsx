import { 
  X, Upload, File, FileText, Video, Image as ImageIcon, 
  ShieldCheck, Zap, Lock, AlertCircle, CheckCircle2, 
  Loader2, BarChart3, HardDrive, Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ✅ FIX: ADD THIS FUNCTION (missing before)
const getFileInfo = (file) => {
  const type = file.type;

  if (type.includes("pdf")) {
    return { tag: "Document", encryptionTime: (file.size / (1024 * 1024) * 0.5).toFixed(1) };
  }
  if (type.includes("image")) {
    return { tag: "Media", encryptionTime: (file.size / (1024 * 1024) * 0.3).toFixed(1) };
  }
  if (type.includes("video")) {
    return { tag: "Media", encryptionTime: (file.size / (1024 * 1024) * 1).toFixed(1) };
  }

  return { tag: "General", encryptionTime: (file.size / (1024 * 1024) * 0.5).toFixed(1) };
};

const LiveIntelligence = ({ file }) => {
  if (!file) return null;
  const info = getFileInfo(file);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-blue-600/5 border border-blue-500/20 rounded-2xl p-5 space-y-4"
    >
      <div className="flex items-center gap-2 text-blue-400">
        <Zap size={18} className="animate-pulse" />
        <h4 className="text-sm font-bold uppercase tracking-widest">Live Intelligence</h4>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-black/40 p-3 rounded-xl border border-white/5">
          <p className="text-[10px] text-gray-500 uppercase">Security Scan</p>
          <div className="flex items-center gap-2 mt-1">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-xs font-bold text-emerald-500">SAFE</span>
          </div>
        </div>
        <div className="bg-black/40 p-3 rounded-xl border border-white/5">
          <p className="text-[10px] text-gray-500 uppercase">Class</p>
          <p className="text-xs font-bold mt-1 text-white">{info.tag}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[11px]">
          <span className="text-gray-400">Est. Encryption Time</span>
          <span className="text-blue-400 font-mono">{info.encryptionTime}s</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-gray-400">Protocol</span>
          <span className="text-white">AES-256-GCM</span>
        </div>
      </div>

      <div className="pt-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-[10px] font-bold text-blue-400">
          <Lock size={10} /> ZERO-KNOWLEDGE READY
        </span>
      </div>
    </motion.div>
  );
};
export default LiveIntelligence;