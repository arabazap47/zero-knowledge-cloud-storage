import React, { useState } from "react";
import { useParams } from "react-router-dom";

import {
  decryptFileKey,
  deriveKey,
  decryptFileChunks,
} from "../utils/cryptoEngine";


const SharePage = () => {
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
  try {
    setLoading(true);

    // 🔥 STEP 1: verify share
    const res = await fetch("http://localhost:5000/api/share/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg);
      return;
    }

    // 🔥 STEP 2: decrypt file key
    const fileKey = await decryptFileKey(
      data.encryptedFileKey,
      password
    );

    // 🔥 STEP 3: derive key
    const key = await deriveKey(fileKey, "cyphervault");

    // 🔥 STEP 4: get signed URL
    const urlRes = await fetch("http://localhost:5000/api/share/get-file-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: data.filePath }),
    });

    const urlData = await urlRes.json();

    if (!urlRes.ok || !urlData.url) {
      console.error("URL ERROR:", urlData);
      alert("Failed to get file URL");
      return;
    }

    console.log("SIGNED URL:", urlData.url);

    // 🔥 STEP 5: fetch encrypted file
    const encryptedRes = await fetch(urlData.url);

    if (!encryptedRes.ok) {
      console.error("FILE FETCH ERROR:", encryptedRes.status);
      alert("File fetch failed");
      return;
    }

    const encryptedText = await encryptedRes.text();

    // 🔥 DEBUG (VERY IMPORTANT)
    console.log("RESPONSE START:", encryptedText.slice(0, 80));

    // ❌ prevent crash if HTML comes
    if (!encryptedText.startsWith("[")) {
      console.error("INVALID FILE DATA:", encryptedText);
      alert("Invalid encrypted file");
      return;
    }

    // 🔥 STEP 6: decrypt
    const blob = await decryptFileChunks(encryptedText, key);

    // 🔥 STEP 7: download
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "shared-file";
    link.click();

    URL.revokeObjectURL(url);

  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    alert("Download failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="h-screen flex items-center justify-center bg-[#05070a] text-white">
      <div className="bg-[#0a0c10] p-8 rounded-2xl border border-white/10 w-[350px] text-center">

        <h2 className="text-xl font-bold mb-4">Secure File Access</h2>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-sm mb-4"
        />

        <button
          onClick={handleDownload}
          disabled={loading}
          className="w-full py-2 bg-blue-600 rounded-lg text-sm font-bold"
        >
          {loading ? "Decrypting..." : "Download File"}
        </button>

      </div>
    </div>
  );
};

export default SharePage;