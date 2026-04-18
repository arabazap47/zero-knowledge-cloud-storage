import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Upload, File, FileText, Video, Image as ImageIcon, BarChart3, HardDrive, Trash2
} from "lucide-react";
import StorageIndicator from "../components/upload/StorageIndicator"
import LiveIntelligence from "../components/upload/LiveIntelligence"
import UploadTask from "../components/upload/UploadTask"
import { encryptFile, generateKey } from "../utils/encryption";
import { deriveKey, encryptFileChunks } from "../utils/cryptoEngine";



const CypherVaultUpload = ({ isOpen, onClose, storage, onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [activeIntelligence, setActiveIntelligence] = useState(null);
  

    useEffect(() => {
      if (!isOpen) {
        setFiles([]);
        setActiveIntelligence(null);
      }
    }, [isOpen]);

  // ✅ ADD THIS FUNCTION

const handleUpload = async (file) => {
  try {
    const password = sessionStorage.getItem("vaultKey");
    const user = JSON.parse(localStorage.getItem("user"));

    const key = await deriveKey(password, user._id);

    const encryptedData = await encryptFileChunks(file, key);

    const encryptedBlob = new Blob([encryptedData], {
      type: "application/json",
    });

    const formData = new FormData();
formData.append("file", encryptedBlob, file.name + ".enc");

    const res = await fetch("http://localhost:5000/api/files/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (res.ok) onUploadSuccess();

  } catch (err) {
    console.error("Upload failed:", err);
  }
};

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      // setFiles(prev => [
      //   ...droppedFiles.map(file => ({
      //   file,
      //   id: crypto.randomUUID() // ✅ ADD THIS
      //   })),      
      //   ...prev
      // ]);
      setActiveIntelligence(droppedFiles[0]);
      droppedFiles.forEach(file => handleUpload(file));
    }
  }, [handleUpload]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setFiles(prev => [
        ...selectedFiles.map(file => ({
        file,
        id: crypto.randomUUID() // ✅ ADD THIS
      })),
      ...prev
]);

      setActiveIntelligence(selectedFiles[0]);
      selectedFiles.forEach(file => handleUpload(file));
    }
  };

  // ✅ FIX: use updated state instead of old "files"
const removeFile = (id) => {
  setFiles(prev => {
    const updated = prev.filter(item => item.id !== id);

    // FIX: correct logic using updated array
    if (updated.length === 0) {
      setActiveIntelligence(null);
    }

    return updated;
  }); 
};

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start md:items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />

          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl h-[90vh] md:h-auto bg-[#0a0c12] border border-white/10 rounded-[32px] shadow-2xl flex flex-col md:flex-row overflow-hidden md:overflow-visible"
          >
            {/* Close Button */}
            <button 
              onClick={() => {
                setFiles([]);                
                setActiveIntelligence(null); 
                onClose();
              }}
              className="absolute top-2 right-2 md:top-6 md:right-6 z-[999] p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={20} />
            </button>

            {/* Main Section */}
            <div className="flex-1 p-8 lg:p-12 border-b md:border-b-0 md:border-r border-white/5">
              <header className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-600 p-2 rounded-xl">
                    <Upload size={20} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold italic tracking-tight">Vault Entry</h2>
                </div>
                <p className="text-gray-500 text-sm">Securely encrypt and transmit your assets.</p>
              </header>

              {/* Drag & Drop Area */}
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                className={`relative h-40 md:h-64 rounded-[20px] md:rounded-[24px] 
                            border-2 border-dashed transition-all duration-300 
                            flex flex-col items-center justify-center gap-2 md:gap-4
                            px-4 md:px-0
                        ${isDragging 
                            ? "bg-blue-600/10 border-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.2)] scale-[1.02]" 
                            : "bg-white/[0.02] border-white/10 hover:border-white/20"}
                        `}>
                <div className={`p-5 rounded-full bg-white/5 text-gray-400 ${isDragging ? "animate-bounce text-blue-500" : ""}`}>
                  <Upload size={28} className="md:size-[40px]" />
                </div>
                <div className="text-center">
                  <p className="text-xs md:text-sm font-bold">Drag & Drop files to encrypt</p>
                  <p className="text-[10px] md:text-xs text-gray-500 mt-1">Maximum single file size: 50MB</p>
                </div>
                <label className="cursor-pointer px-3 py-1.5 text-[10px] md:px-6 md:py-2.5 bg-white text-black text-xs font-black rounded-xl hover:scale-105 transition-transform active:scale-95">
                  BROWSE FILES
                  <input type="file" multiple className="hidden" onChange={handleFileChange} />
                </label>
              </div>

            </div>

            {/* Sidebar Section */}
            <div className="w-full md:w-[380px] bg-[#0d0f17] p-6 md:p-10 flex flex-col gap-6 overflow-y-auto h-full">
              <StorageIndicator used={storage.used} total={storage.total} />
              
              <AnimatePresence>
                {activeIntelligence && (
                  <LiveIntelligence file={activeIntelligence} />
                )}
              </AnimatePresence>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Queue ({files.length})</h4>
                  {files.length > 0 && (
                    <button onClick={() => {setFiles([])
                      setActiveIntelligence(null);
                      onClose();
                    }} className="text-[10px] text-red-400 hover:underline">Clear All</button>
                  )}
                </div>
                
                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
                  <AnimatePresence initial={false}>
                    {files.map((item) => (
                      <UploadTask 
                        key={item.id}             
                        file={item.file}  
                        onCancel={() => removeFile(item.id)} 
                      />
                    ))}
                    {files.length === 0 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-10"
                      >
                        <BarChart3 size={32} className="mx-auto text-white/5 mb-3" />
                        <p className="text-xs text-gray-600 italic">No active encryption tasks</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CypherVaultUpload;