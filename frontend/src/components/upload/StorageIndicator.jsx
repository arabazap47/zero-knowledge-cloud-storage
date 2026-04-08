import { 
  X, Upload, File, FileText, Video, Image as ImageIcon, 
  ShieldCheck, Zap, Lock, AlertCircle, CheckCircle2, 
  Loader2, BarChart3, HardDrive, Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const StorageIndicator = ({ used = 0, total = 50 }) => {
  const percentage = total > 0 ? (used / total) * 100 : 0;

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 backdrop-blur-md">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 text-gray-400">
          <HardDrive size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">
            Vault Capacity
          </span>
        </div>
        <span className="text-xs font-mono text-blue-400">
          {used}MB / {total}MB
        </span>
      </div>

      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
        />
      </div>
    </div>
  );
};

export default StorageIndicator;