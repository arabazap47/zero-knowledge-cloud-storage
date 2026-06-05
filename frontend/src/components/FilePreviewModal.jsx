import React, { useEffect, useState } from "react";
import { X, FileText, Film, Image as ImageIcon, Lock } from "lucide-react";

const FilePreviewModal = ({ file, url, isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);
  
  // Ensure we have a type, even if detection was fuzzy
  const type = file?.mimeType || "";
  const filename = file?.filename?.replace(".enc", "") || "Secure File";

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
    }
  }, [isOpen, url]);

  if (!isOpen) return null;

  // Logic to determine which player to show
  const isVideo = type.startsWith("video/");
  const isImage = type.startsWith("image/");
  const isAudio = type.startsWith("audio/");
  const isPdf = type === "application/pdf";
  const hasPreview = isVideo || isImage || isPdf || isAudio;

  return (
    <div className="fixed inset-0 bg-black/90 z-[200] flex flex-col items-center justify-center backdrop-blur-md">
      
      {/* HEADER */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent z-10">
        <div className="flex items-center gap-3 text-white">
          <div className="p-2 bg-blue-600 rounded-lg">
            {isVideo ? <Film size={20} /> : isImage ? <ImageIcon size={20} /> : <FileText size={20} />}
          </div>
          <span className="font-medium truncate max-w-xs sm:max-w-md">{filename}</span>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"
        >
          <X size={28} />
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
        
        {loading && hasPreview && (
  <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#05070a]">
    <div className="relative">
      <div className="w-20 h-20 border-4 border-blue-500/20 rounded-full"></div>
      <div className="absolute top-0 w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <Lock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500" size={24} />
    </div>
    <h3 className="mt-6 text-white font-bold tracking-tight">Decrypting your Vault...</h3>
    <p className="text-gray-500 text-xs mt-2 font-mono uppercase tracking-[0.2em]">
      Zero-Knowledge End-to-End Encryption
    </p>
  </div>
)}

        {/* VIDEO PLAYER */}
        {isVideo && (
          <video
            src={url}
            controls
            autoPlay
            onCanPlay={() => setLoading(false)}
            className={`max-w-full max-h-full rounded-lg shadow-2xl transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
          />
        )}
        {/* AUDIO PLAYER */}
{isAudio && (
  <audio
    controls
    autoPlay
    onCanPlay={() => setLoading(false)}
    className={`w-full max-w-xl transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
  >
    <source src={url} type={type} />
    Your browser does not support audio.
  </audio>
)}

        {/* PDF VIEWER */}
        {isPdf && (
          <iframe
            src={`${url}#toolbar=0`}
            onLoad={() => setLoading(false)}
            className="w-full h-full max-w-5xl bg-white rounded-lg"
          />
        )}

        {/* IMAGE VIEWER */}
        {isImage && (
          <img
            src={url}
            onLoad={() => setLoading(false)}
            className="max-w-full max-h-full object-contain rounded-lg"
            alt="Preview"
          />
        )}

        {/* FALLBACK (Only shows if it's definitely not a supported type) */}
        {!hasPreview && (
          <div className="text-center p-10 bg-[#0a0c10] border border-white/10 rounded-3xl">
            <Lock className="mx-auto text-gray-500 mb-4" size={48} />
            <h3 className="text-white font-bold">Preview not available</h3>
            <p className="text-gray-500 text-sm mt-2 mb-6">
              File type: <span className="text-blue-400 font-mono">{type || "Unknown"}</span>
            </p>
            <a 
              href={url} 
              download={filename}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all inline-block"
            >
              Download to View Locally
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilePreviewModal;