import React, { useEffect, useState } from "react";

const FilePreviewModal = ({ file, url, isOpen, onClose }) => {
    const type = file?.mimeType || "";
  const [isBlurred, setIsBlurred] = useState(false);
  const cleanName =
  file?.displayName ||
  file?.originalName ||
  file?.filename?.replace(".enc", "") ||
  "File";

  useEffect(() => {
    if (isOpen) {
      setIsBlurred(false);

      // 🔐 Secure Peek Timer
      const timer = setTimeout(() => {
        setIsBlurred(true);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">

      <div className="bg-[#0a0c10] p-4 rounded-xl w-[85%] h-[85%] relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-lg"
        >
          ✖
        </button>

        {/* FILE NAME */}
        <p className="text-sm mb-2 text-gray-400">
          {cleanName}
        </p>

        {/* PREVIEW */}
        <div className={`w-full h-full flex items-center justify-center ${isBlurred ? "blur-xl" : ""}`}>

  <div className={`w-full h-full flex items-center justify-center ${isBlurred ? "blur-xl" : ""}`}>

  {type.includes("image") ? (
    <img src={url} className="w-full h-full object-contain" />
  ) : type.includes("pdf") ? (
    <iframe src={url} className="w-full h-full" />
  ) : type.includes("video") ? (
    <video src={url} controls className="w-full h-full" />
  ) : type.includes("audio") ? (
    <audio src={url} controls className="w-full" />
  ) : (
    <p className="text-center text-gray-500">
      Preview not supported for this file type
    </p>
  )}

</div>

</div>

        {/* 🔐 Secure Reveal */}
        {isBlurred && (
          <button
            onClick={() => setIsBlurred(false)}
            className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-blue-600 px-4 py-2 rounded-lg"
          >
            Reveal Again 🔓
          </button>
        )}

      </div>
    </div>
  );
};

export default FilePreviewModal;