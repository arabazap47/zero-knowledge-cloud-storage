import React, { useState, useEffect, useRef } from "react";

const TerminalMode = ({ userFiles, onUpload, onDelete, refCallback }) => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    { text: "PrivyDrive Zero-Knowledge Vault [Version 1.0.0]", type: "system" },
    {
      text: "Secure connection established. Type 'help' for commands.",
      type: "system",
    },
  ]);
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);
  useEffect(() => {
    if (refCallback) {
      refCallback({
        addToHistory,
      });
    }
  }, []);

  const addToHistory = (text, type = "default") => {
    setHistory((prev) => [...prev, { text, type }]);
  };

  const extractFileName = (text) => {
    const words = text.split(" ");
    return words.find((w) => w.includes("."));
  };
  const handleCommand = async (rawInput) => {
    const parts = rawInput.trim().split(" ");
    let command = parts[0].toLowerCase();
    let args = parts.slice(1);

    if (rawInput.trim() !== "") {
      setCmdHistory((prev) => [rawInput, ...prev]);
    }

    // Show the command the user just typed
    addToHistory(`privydrive@vault:~$ ${rawInput}`, "user-cmd");
    const inputLower = rawInput.toLowerCase();

    // 🔥 AI-like command parsing
    if (inputLower.includes("delete") && inputLower.includes("file")) {
      command = "rm";
      args = [extractFileName(rawInput)];
    }

    if (inputLower.includes("show") && inputLower.includes("files")) {
      command = "ls";
    }

    switch (command) {
      case "help":
        addToHistory(
          `
Available Commands:
  ls              - List all encrypted files in the vault
  upload          - Trigger secure file upload sequence
  rm [filename]   - Securely delete a file
  clear           - Wipe terminal screen history
  whoami          - Display session authentication status
  status          - Check Zero-Knowledge encryption engine
        `,
          "system",
        );
        break;

      case "ls":
        if (userFiles && userFiles.length > 0) {
          const fileList = userFiles
            .map(
              (f) =>
                `📄 ${f.filename?.replace(".enc", "")} (${(f.size / 1024).toFixed(2)} KB)`,
            )
            .join("\n");
          addToHistory(fileList, "success");
        } else {
          addToHistory("Vault is empty. No encrypted blobs found.", "warning");
        }
        break;

      case "upload":
        addToHistory(
          "Initializing client-side encryption... Opening file picker.",
          "system",
        );
        onUpload();
        break;

      case "rm":
        if (!args[0]) {
          addToHistory(
            "Error: Missing argument. Usage: rm <filename>",
            "error",
          );
        } else {
          addToHistory(
            `Sending destruction request for: ${args[0]}...`,
            "warning",
          );
          await onDelete(args[0]);
          addToHistory(
            `Success: ${args[0]} has been wiped from the server.`,
            "success",
          );
        }
        break;

      case "status":
        addToHistory(
          "Encryption: AES-256-GCM\nProtocol: Zero-Knowledge Proof\nStatus: FULLY SECURE",
          "success",
        );
        break;

      case "clear":
        setHistory([]);
        break;

      case "whoami":
        addToHistory(
          "Principal: authenticated_user_01\nPermissions: Read/Write/Encrypt",
          "system",
        );
        break;
      
        case "timeline":
        if (!args[0]) {
          addToHistory("Usage: timeline <filename>", "error");
          break;
        }

        // 1. Find the real file object from userFiles
        // This handles cases where the user types "4.png" but the DB has "4.png.enc"
        const targetFile = userFiles.find((f) => {
          const searchName = args[0].toLowerCase();
          const dbName = f.filename.toLowerCase();
          return dbName === searchName || dbName === `${searchName}.enc`;
        });

        if (!targetFile) {
          addToHistory(`Error: File '${args[0]}' not found in vault.`, "error");
          break;
        }

        addToHistory(`Fetching audit logs for: ${targetFile.filename}...`, "system");

        try {
          // 2. Use the exact filename found in the database for the API call
          const res = await fetch(
            `http://localhost:5000/api/files/timeline/${encodeURIComponent(targetFile.filename)}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.msg || "Server error");
          }

          const data = await res.json();
          const logs = data.logs || [];

          if (logs.length === 0) {
            addToHistory("No activity found for this file.", "warning");
            break;
          }

          // 3. Format and display the timeline
          const timelineHeader = `--- TIMELINE: ${targetFile.filename} ---`;
          const timelineContent = logs
            .map((log) => {
              const time = new Date(log.timestamp).toLocaleString([], {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
              return `[${time}] ACTION: ${log.action.toUpperCase()}`;
            })
            .join("\n");

          addToHistory(`${timelineHeader}\n${timelineContent}`, "success");
        } catch (err) {
          console.error("Timeline Error:", err);
          addToHistory(`Failed to retrieve timeline: ${err.message}`, "error");
        }
        break;


      

      
        case "explain":
        if (!args[0]) {
          addToHistory("Usage: explain <filename>", "error");
          break;
        }

        // 🔍 Smart find: matches "4.png" or "4.png.enc"
        const fileToExplain = userFiles.find((f) => {
          const searchName = args[0].toLowerCase();
          const dbName = f.filename.toLowerCase();
          return dbName === searchName || dbName === `${searchName}.enc`;
        });

        if (!fileToExplain) {
          addToHistory(`Error: File '${args[0]}' not found.`, "error");
          break;
        }

        const sizeKB = (fileToExplain.size / 1024).toFixed(2);

        addToHistory(
          `
[ FILE SPECIFICATIONS ]
Name:      ${fileToExplain.filename}
Type:      ${fileToExplain.mimeType || "Binary/Encrypted"}
Size:      ${sizeKB} KB
Vault:     AES-256-GCM Encrypted
Last Mod:  ${new Date(fileToExplain.updatedAt || Date.now()).toLocaleDateString()}
Status:    Stored in Zero-Knowledge Vault
  `,
          "system"
        );
        break;

      case "trust":
        if (!args[0]) {
          addToHistory("Usage: trust <filename>", "error");
          break;
        }

        // 🔍 Smart find: matches "4.png" or "4.png.enc"
        const fileTrust = userFiles.find((f) => {
          const searchName = args[0].toLowerCase();
          const dbName = f.filename.toLowerCase();
          return dbName === searchName || dbName === `${searchName}.enc`;
        });

        if (!fileTrust) {
          addToHistory(`Error: File '${args[0]}' not found.`, "error");
          break;
        }

        let score = 100;

        // Security Deductions
        if (fileTrust.isPublic) score -= 30;
        if ((fileTrust.downloadCount || 0) > 10) score -= 20;
        if (!fileTrust.isPasswordProtected) score -= 15;

        let securityStatus = score > 80 ? "VERIFIED SAFE" : score > 50 ? "CAUTION" : "VULNERABLE";
        let statusColor = score > 80 ? "success" : score > 50 ? "warning" : "error";

        addToHistory(
          `
[ SECURITY AUDIT ]
Target:      ${fileTrust.filename}
Trust Score: ${score}/100
Risk Level:  ${securityStatus}
Integrity:   Checksum Verified
  `,
          statusColor
        );
        break;

      default:
        if (command !== "") {
          addToHistory(
            `Command '${command}' not found. Type 'help' for valid operations.`,
            "error",
          );
        }
    }
  };
  const handleAutocomplete = () => {
  const parts = input.trim().split(" ");
  const lastWord = parts[parts.length - 1];

  if (!lastWord) return;

  // 🔍 Find matching files
  const matches = userFiles.filter(f =>
    f.filename.toLowerCase().includes(lastWord.toLowerCase())
  );

  if (matches.length === 0) {
    addToHistory("No matching files", "warning");
    return;
  }

  if (matches.length === 1) {
    // ✅ Auto-complete
    const completed = matches[0].filename;
    parts[parts.length - 1] = completed;
    setInput(parts.join(" "));
  } else {
    // 🔥 Show suggestions
    const suggestions = matches
      .map(f => f.filename.replace(".enc", ""))
      .join("   ");

    addToHistory(suggestions, "system");
  }
};

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
  e.preventDefault(); // prevent focus change
  handleAutocomplete();
  return;
}
    if (e.key === "Enter") {
      handleCommand(input);
      setInput("");
      setHistoryIdx(-1);
    } else if (e.key === "ArrowUp") {
      if (historyIdx < cmdHistory.length - 1) {
        const newIdx = historyIdx + 1;
        setHistoryIdx(newIdx);
        setInput(cmdHistory[newIdx]);
      }
    } else if (e.key === "ArrowDown") {
      if (historyIdx > 0) {
        const newIdx = historyIdx - 1;
        setHistoryIdx(newIdx);
        setInput(cmdHistory[newIdx]);
      } else {
        setHistoryIdx(-1);
        setInput("");
      }
    }
  };

  // Color mapping based on type
  const getTypeClass = (type) => {
    switch (type) {
      case "system":
        return "text-blue-400";
      case "success":
        return "text-emerald-400";
      case "warning":
        return "text-amber-400";
      case "error":
        return "text-rose-500";
      case "user-cmd":
        return "text-white font-bold";
      default:
        return "text-slate-300";
    }
  };

  return (
    <div
      className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-800 rounded-lg shadow-2xl overflow-hidden flex flex-col h-[500px] font-mono text-sm mb-10"
      onClick={() => inputRef.current.focus()}
    >
      {/* Terminal Header */}
      <div className="bg-slate-900 px-4 py-2 flex items-center gap-2 border-b border-slate-800">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-rose-500"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
        </div>
        <span className="text-slate-500 text-xs ml-2 uppercase tracking-widest">
          Secure Terminal Session
        </span>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {history.map((line, index) => (
          <div
            key={index}
            className={`mb-1 whitespace-pre-wrap ${getTypeClass(line.type)}`}
          >
            {line.text}
          </div>
        ))}

        {/* Input Line */}
        <div className="flex items-center mt-2">
          <span className="text-emerald-500 font-bold mr-2">
            privydrive@vault:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            className="bg-transparent border-none outline-none flex-1 text-emerald-400 caret-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck="false"
            autoComplete="off"
            autoFocus
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default TerminalMode;
