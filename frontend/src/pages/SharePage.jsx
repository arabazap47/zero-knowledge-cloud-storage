import React, { useState, useEffect  } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  decryptFileKey,
  deriveKey,
  decryptFileChunks,
  importFileKey ,
} from "../utils/cryptoEngine";

const SharePage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);

  const handleDownload = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/share/download", {
        method: "POST",
        headers: {  
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  token,
  password: password?.trim() || ""
}),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg);
        return;
      }

      setFileInfo(data);

      let fileKey;

if (data.isProtected) {
  // 🔐 password protected
  fileKey = await decryptFileKey(data.encryptedFileKey, password);
} else {
  // 🔓 public link
  fileKey = data.encryptedFileKey;
}
      const key = await importFileKey(fileKey);

      const urlRes = await fetch("http://localhost:5000/api/share/get-file-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: data.filePath }),
      });

      const { url } = await urlRes.json();

      const encryptedRes = await fetch(url);
      const encryptedText = await encryptedRes.text();

      const rawBlob = await decryptFileChunks(encryptedText, key);

      // 🔥 STEP 1: Fix MIME type
const mimeType = data.mimeType || "application/octet-stream";

// 🔥 STEP 2: Fix filename
let fileName = data.fileName || "CypherVault_File";
fileName = fileName.replace(".enc", "");

// 🔥 STEP 3: Add extension if missing
if (!fileName.includes(".")) {
  if (mimeType.includes("image")) fileName += ".jpg";
  else if (mimeType.includes("video")) fileName += ".mp4";
  else if (mimeType.includes("pdf")) fileName += ".pdf";
  else if (mimeType.includes("audio")) fileName += ".mp3";
}

// 🔥 STEP 4: Create correct blob
const blob = new Blob([rawBlob], { type: mimeType });

const downloadUrl = URL.createObjectURL(blob);

// 🔥 STEP 5: Download
const link = document.createElement("a");
link.href = downloadUrl;
link.download = fileName;
link.click();

URL.revokeObjectURL(downloadUrl);

    } catch (err) {
      console.error(err);
      alert("Download failed");
    } finally {
      setLoading(false);
    }
  };
  const checkLink = async () => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/share/info/${token}`
    );

    const data = await res.json();
    setFileInfo(data);

  } catch (err) {
    console.error(err);
  }
};
useEffect(() => {
  checkLink();
}, []);


  return (
    <div className="min-h-screen bg-[#05070a] text-white flex flex-col">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
        <h1 className="text-xl font-bold text-blue-500">CypherVault 🔐</h1>

        <button
          onClick={() => navigate("/")}
          className="bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20"
        >
          Open App →
        </button>
      </div>

      {/* MAIN */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-[#0a0c10] p-8 rounded-2xl border border-white/10 w-[380px] text-center shadow-xl">

          <h2 className="text-xl font-bold mb-2">🔗 Secure Share</h2>
          <p className="text-xs text-gray-400 mb-6">
  {fileInfo?.isProtected
    ? "🔐 Password protected file"
    : "🔓 Public shared file"}
</p>

          {/* FILE INFO */}
          {fileInfo && (
            <div className="mb-4 p-3 bg-white/5 rounded-lg text-xs text-gray-300">
              📄 {fileInfo.fileName}
              <br />
              📥 {fileInfo.downloadsLeft}/{fileInfo.maxDownloads} downloads left
            </div>
          )}

          {/* PASSWORD */}
          {fileInfo?.isProtected && (
  <input
    type="password"
    placeholder="Enter password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg mb-4"
  />
)}

          {/* BUTTON */}
          <button
            onClick={handleDownload}
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold"
          >
            {loading ? "Decrypting..." : "Download Securely"}
          </button>

          {/* FOOTER */}
          <p className="text-[10px] text-gray-500 mt-5">
            🔐 Zero Knowledge • End-to-End Encryption
          </p>

        </div>
      </div>
    </div>
  );
};

export default SharePage;