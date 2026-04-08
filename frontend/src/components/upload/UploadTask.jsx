import React, { useState, useEffect, useCallback } from "react";
import { 
  X, Upload, File, FileText, Video, Image as ImageIcon, 
  ShieldCheck, Zap, Lock, AlertCircle, CheckCircle2, 
  Loader2, BarChart3, HardDrive, Trash2
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

// ✅ FIX: ADD THIS FUNCTION (same as above OR import from utils)
const getFileInfo = (file) => {
  const type = file.type;

  if (type.includes("pdf")) {
    return { icon: <FileText size={20} />, color: "text-red-400" };
  }
  if (type.includes("image")) {
    return { icon: <ImageIcon size={20} />, color: "text-emerald-400" };
  }
  if (type.includes("video")) {
    return { icon: <Video size={20} />, color: "text-purple-400" };
  }

  return { icon: <File size={20} />, color: "text-blue-400" };
};

const UploadTask = ({ file, onCancel }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Preparing"); // Preparing -> Encrypting -> Uploading -> Completed
  const info = getFileInfo(file);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus("Completed");
          return 100;
        }
        const next = prev + 2;
        if (next < 30) setStatus("Preparing");
        else if (next < 60) setStatus("Encrypting");
        else setStatus("Uploading");
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-3 group hover:border-white/10 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-white/5 ${info.color}`}>
            {status === "Completed" ? <CheckCircle2 size={20} className="text-emerald-500" /> : info.icon}
          </div>
          <div>
            <h5 className="text-sm font-bold truncate max-w-[150px]">{file.name}</h5>
            <p className="text-[10px] text-gray-500">{(file.size / 1024).toFixed(1)} KB • {status}</p>
          </div>
        </div>
        <button onClick={onCancel} className="text-gray-600 hover:text-red-400 transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full ${status === "Completed" ? "bg-emerald-500" : "bg-blue-600"}`}
          animate={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
};
export default UploadTask;