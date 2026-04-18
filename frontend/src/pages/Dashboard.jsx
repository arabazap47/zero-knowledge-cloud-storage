import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Folder,
  FileText,
  Search,
  Plus,
  Shield,
  Star,
  Share2,
  Download,
  Trash2,
  LogOut,
  MoreVertical,
  Bell,
  User,
  Key,
  Menu,
  X,
  Check,
  Edit2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import VaultLoader from "../components/VaultLoader";
import CypherVaultUpload from "./CypherVaultUpload"; // ✅ Import your new Modal
import { decryptFile, generateKey  } from "../utils/encryption";
import { deriveKey, decryptFileChunks } from "../utils/cryptoEngine";


const Dashboard = () => {
  const [isClosing, setIsClosing] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); // ✅ State for Upload Modal
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState({
    name: "Agent",
    email: "agent@cyphervault.com",
    plan: "Starter",
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [files, setFiles] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeTab, setActiveTab] = useState("My Files");
  
  const [storage, setStorage] = useState({ used: 45, total: 100 });
  const [search, setSearch] = useState("");
  
  const searchVariants = {
    closed: { width: "40px", background: "rgba(255, 255, 255, 0)" },
    open: { width: "100%", background: "rgba(255, 255, 255, 0.05)" },
  };
  const SECRET_KEY = "my-super-secret-key";
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setNewName(parsed.name);
    }
  }, []);
  useEffect(() => {
  const closeMenu = () => setActiveMenu(null);
  if (activeMenu) {
    window.addEventListener("click", closeMenu);
  }
  return () => window.removeEventListener("click", closeMenu);
}, [activeMenu]);

  const fetchFiles = async () => {
  try {
    const endpoint =
      activeTab === "Trash"
        ? "http://localhost:5000/api/files/trash"
        : "http://localhost:5000/api/files";

    const res = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    setFiles(data.files || []);

      setStorage({
        used: data.used ? Math.round(data.used / (1024 * 1024)) : 0,
        total: data.limit ? Math.round(data.limit / (1024 * 1024)) : 50,
      });
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [activeTab]);

  const handleUpdateName = async () => {
    const updatedUser = { ...user, name: newName };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setIsEditingName(false);
  };

  const handleLogout = () => {
    setIsClosing(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsClosing(false);
      navigate("/");
    }, 2000);
  };

const handleDownload = async (file) => {
  try {
    const password = sessionStorage.getItem("vaultKey");
    const user = JSON.parse(localStorage.getItem("user"));

    const key = await deriveKey(password, user._id);

    const res = await fetch("http://localhost:5000/api/files/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ path: file.filePath }),
    });

    const data = await res.json();

    const encryptedRes = await fetch(data.url);
    const encryptedText = await encryptedRes.text();

    // 🔓 decrypt chunks
    const decryptedBlob = await decryptFileChunks(encryptedText, key);

    const url = URL.createObjectURL(decryptedBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = file.filename.replace(".enc", "");
    link.click();

    URL.revokeObjectURL(url);
    } catch (err) {
    console.error("Download failed:", err);
  }
};

  //delete function
  const handleDelete = async (file) => {
    // const path = file.fileUrl.split(".com/")[1];
    const path = file.filePath;

    await fetch("http://localhost:5000/api/files/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        fileId: file._id,
        path,
      }),
    });

    fetchFiles(); // refresh
  };

  // file favorite button

  const toggleFavorite = async (fileId) => {
    //change UI first, then call API
    setFiles((prev) =>
      prev.map((f) =>
        f._id === fileId ? { ...f, isFavorite: !f.isFavorite } : f,
      ),
    );

    try {
      const res = await fetch("http://localhost:5000/api/files/favorite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ fileId }),
      });
      if (!res.ok) throw new Error("Sync failed");
    } catch (err) {
      // Rollback if API fails
      fetchFiles();
      console.error("Favorite sync failed", err);
    }
  };

  // 3. FILTER LOGIC
  const filteredFiles = files.filter((file) => {
  // ❌ Hide deleted files from My Files
  if (activeTab === "My Files" && file.isDeleted) return false;

  // ⭐ Favorites tab
  if (activeTab === "Favorites" && (!file.isFavorite || file.isDeleted)) return false;

  // 🗑️ Trash tab
  if (activeTab === "Trash" && !file.isDeleted) return false;

  // 🔍 Search filter
  return file.filename.toLowerCase().includes(search.toLowerCase());
});

// 🔄 Restore
const handleRestore = async (file) => {
  await fetch("http://localhost:5000/api/files/restore", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ fileId: file._id }),
  });

  fetchFiles();
};

// ❌ Permanent delete
const handlePermanentDelete = async (file) => {
  await fetch("http://localhost:5000/api/files/delete-permanent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ fileId: file._id }),
  });

  fetchFiles();
};

  const menuItems = [
    { name: "My Files", icon: <Folder size={20} />, active: true },
    { name: "Favorites", icon: <Star size={20} /> },
    { name: "Shared", icon: <Share2 size={20} /> },
    { name: "Trash", icon: <Trash2 size={20} /> },
  ];

  const favoriteFiles = files.filter((file) => file.isFavorite);

  return (
    <div className="flex h-screen bg-[#05070a] text-white font-sans overflow-hidden">
      {/* --- MODALS & OVERLAYS --- */}
      <AnimatePresence>
        {isClosing && <VaultLoader mode="locking" />}
      </AnimatePresence>

      <CypherVaultUpload
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        storage={storage}
        onUploadSuccess={fetchFiles}
      />

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* --- SIDEBAR --- */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#0a0c10] border-r border-white/5 p-6 transform transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <Shield size={22} />
            </div>
            <span className="text-xl font-bold tracking-tight italic">
              CypherVault
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500"
          >
            <X />
          </button>
        </div>

        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {setActiveTab(item.name);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.name
                  ? "bg-blue-600/10 border border-blue-500/30 text-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.1)]"
                  : "text-gray-500 hover:bg-white/5 hover:text-gray-300"
              }`}
            >
              {item.icon} <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 mb-6">
          <h4 className="text-sm font-semibold mb-3">Vault Capacity</h4>
          <div className="h-1.5 w-full bg-white/10 rounded-full mb-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(storage.used / storage.total) * 100}%` }}
              transition={{ type: "spring", bounce: 0, duration: 1 }}
              className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-500 mb-4 font-mono">
            <span>
              {storage.used}MB / {storage.total}MB
            </span>
          </div>
          <button className="w-full py-2 border border-white/10 rounded-lg text-xs font-bold hover:bg-white/5 transition-all">
            Upgrade
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-all"
        >
          <LogOut size={18} />{" "}
          <span className="text-sm font-bold">Logout Session</span>
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-4 lg:px-10 bg-[#05070a]/80 backdrop-blur-xl z-10 relative">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-white"
            >
              <Menu size={24} />
            </button>
            <div className="relative hidden lg:block w-96">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search Files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-12 pr-4 outline-none focus:border-blue-500/50 text-sm"
              />
            </div>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 lg:hidden w-full max-w-[180px] sm:max-w-[300px] flex justify-center">
            <motion.div
              variants={searchVariants}
              animate={isSearchOpen ? "open" : "closed"}
              className="relative flex items-center rounded-full border border-white/10 px-3 py-1.5"
            >
              <Search
                size={18}
                className="text-gray-400 cursor-pointer shrink-0"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              />
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.input
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    autoFocus
                    placeholder="Search..."
                    className="bg-transparent outline-none text-xs ml-2 w-full"
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <button className="relative text-gray-500 hover:text-white p-2 hidden sm:block">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,1)]"></span>
            </button>

            <button
              onClick={() => setProfileOpen(true)}
              className="flex items-center gap-3 pl-4 border-l border-white/10 hover:opacity-80 transition-opacity"
            >
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold truncate max-w-[100px]">
                  {user.name}
                </p>
                <p className="text-[10px] text-blue-500 uppercase tracking-widest font-black">
                  {user.plan}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 border-2 border-white/20 flex items-center justify-center">
                <User size={20} />
              </div>
            </button>
          </div>
        </header>

        <div className="p-6 lg:p-10 overflow-y-auto flex-1 custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center sm:text-left"
          >
            <h2 className="text-2xl lg:text-3xl font-bold italic tracking-tight uppercase">
              Welcome, {user.name.split(" ")[0]}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Status:{" "}
              <span className="text-blue-500">
                Your vault is encrypted and secure
              </span>
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {["Project Titan", "Financials 2026", "Reports", "Signatures"].map(
              (folder, i) => (
                <motion.div
                  key={folder}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/[0.05] hover:border-blue-500/30 transition-all cursor-pointer group"
                >
                  <Folder
                    className="text-gray-600 group-hover:text-blue-500"
                    size={20}
                  />
                  <span className="text-sm font-medium">{folder}</span>
                </motion.div>
              ),
            )}
          </div>

          <div className="flex flex-col gap-6 pb-24">
  {/* 🏷️ DYNAMIC HEADING: Shows up when you're in the Favorites tab */}
  <AnimatePresence mode="wait">
    {activeTab === "Favorites" && filteredFiles.length > 0 && (
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex items-center gap-3 px-2"
      >
        <div className="h-8 w-1 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
        <h2 className="text-xl font-bold tracking-widest uppercase italic text-white/90">
          Secure Favorites
        </h2>
      </motion.div>
    )}
  </AnimatePresence>

  {/* 🗂️ FILES GRID */}
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
    <AnimatePresence mode="popLayout">
      {filteredFiles.length === 0 ? (
        <motion.div
          key="empty-state"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[32px] bg-white/[0.01]"
        >
          <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-gray-600" size={24} />
          </div>
          <p className="text-gray-500 font-medium">No items found in {activeTab}</p>
          <p className="text-gray-700 text-xs mt-1">Your encrypted vault is empty here.</p>
        </motion.div>
      ) : (
        filteredFiles.map((file) => (
          <FileCard
            key={file._id}
            file={file}
            name={file.filename}
            date={file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString("en-IN") : "N/A"}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            handleDownload={handleDownload}
            handleDelete={handleDelete}
            toggleFavorite={toggleFavorite}
            handleRestore={handleRestore}
            handlePermanentDelete={handlePermanentDelete}
            isFavorite={file.isFavorite}
          />
        ))
      )}
    </AnimatePresence>
  </div>
</div>
        </div>
      </main>

      {/* --- PROFILE DRAWER --- */}
      <AnimatePresence>
        {isProfileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProfileOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-[#0a0c10] border-l border-white/10 z-[70] p-8"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-lg font-bold tracking-widest text-gray-500 uppercase">
                  Account Settings
                </h3>
                <button
                  onClick={() => setProfileOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full"
                >
                  <X />
                </button>
              </div>

              <div className="flex flex-col items-center text-center mb-10">
                <div className="w-24 h-24 rounded-3xl bg-blue-600 mb-6 flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.3)] border border-white/20">
                  <User size={40} />
                </div>
                {isEditingName ? (
                  <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-blue-500/30">
                    <input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="bg-transparent outline-none text-lg text-center w-full"
                    />
                    <button
                      onClick={handleUpdateName}
                      className="p-1 bg-green-500 rounded-md text-black"
                    >
                      <Check size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-gray-500 hover:text-blue-500 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                )}
                <p className="text-gray-500 text-sm mt-1">{user.email}</p>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600/20 to-indigo-900/10 border border-white/10">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-tighter">
                  Account Status
                </span>
                <p className="text-xl font-bold mt-1">{user.plan} Plan</p>
                <div className="mt-6 flex flex-col gap-3">
                  <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 transition-all">
                    Upgrade to Enterprise
                  </button>
                  <button className="w-full py-3 border border-white/10 hover:bg-white/5 rounded-xl text-sm text-gray-400">
                    View Billing History
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- UPLOAD BUTTON: Linked to Modal --- */}
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(37,99,235,0.5)" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsUploadModalOpen(true)} // ✅ Opens the Modal
        className="fixed bottom-8 right-6 lg:bottom-10 lg:right-10 z-50 
                   bg-gradient-to-tr from-blue-600 to-blue-400 
                   text-white px-6 py-4 rounded-[22px] shadow-2xl
                   flex items-center gap-3"
      >
        <Plus size={24} className="bg-white/20 rounded-lg p-1" />
        <span className="font-bold tracking-tight hidden sm:block">
          UPLOAD SECURELY
        </span>
      </motion.button>
    </div>
  );
};

// ... FileCard component remains the same
const FileCard = ({ file, name, date, activeMenu, setActiveMenu, handleDownload, handleDelete, toggleFavorite, icon = "file", handleRestore, handlePermanentDelete }) => {
  const isOpen = activeMenu === file?._id;

  // Helper to run action and close menu instantly
  const runAction = (actionFn) => {
    actionFn();
    setActiveMenu(null);
  };

  return (
    <motion.div
      layout
      className={`group relative p-4 lg:p-6 rounded-[24px] border transition-all duration-300 ${
        isOpen ? "bg-blue-600/10 border-blue-500/40 shadow-xl" : "bg-white/[0.02] border-white/5"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Info Section */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className={`p-3 rounded-2xl transition-colors duration-300 ${isOpen ? "bg-blue-600 text-white scale-110" : "bg-white/5 text-gray-500"}`}>
            {icon === "key" ? <Key size={20} /> : <FileText size={20} />}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-sm truncate text-white/90">{name}</h4>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">{date}</p>
          </div>
        </div>

        {/* Menu Trigger */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(isOpen ? null : file._id);
            }}
            className={`p-2.5 rounded-xl z-[110] relative transition-all ${
              isOpen ? "bg-white text-black scale-110 shadow-lg" : "text-gray-500 hover:text-white"
            }`}
          >
            {isOpen ? <X size={18} /> : <MoreVertical size={18} />}
          </button>

          {/* 🚀 MICRO CONTEXT MENU (Mobile & Desktop Unified) */}
          <AnimatePresence>
            {isOpen && (
              <>
                {/* Transparent Scrim to close on outside tap */}
                <div 
                  className="fixed inset-0 z-[100]" 
                  onClick={(e) => { e.stopPropagation(); setActiveMenu(null); }} 
                />
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 10, y: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 10, y: -10 }}
                  className="absolute right-0 mt-3 w-48 bg-[#0d0f14]/90 border border-white/10 rounded-[20px] shadow-2xl z-[105] overflow-hidden backdrop-blur-2xl origin-top-right"
                >
                  <div className="p-1.5 flex flex-col gap-1">
                    <CompactMenuItem 
                      icon={<Star size={16} className={file.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"} />} 
                      label={file.isFavorite ? "Unfavorite" : "Favorite"} 
                      onClick={() => runAction(() => toggleFavorite(file._id))} 
                    />
                    <CompactMenuItem 
                      icon={<Download size={16} className="text-blue-400" />} 
                      label="Download" 
                      onClick={() => runAction(() => handleDownload(file))} 
                    />
                    <div className="h-px bg-white/5 mx-2 my-1" />
                    {file.isDeleted ? (
  <>
    <CompactMenuItem 
      icon={<Check size={16} className="text-green-400" />} 
      label="Restore" 
      onClick={() => runAction(() => handleRestore(file))} 
    />

    <CompactMenuItem 
      icon={<Trash2 size={16} className="text-red-500" />} 
      label="Delete Forever" 
      variant="danger"
      onClick={() => runAction(() => handlePermanentDelete(file))} 
    />
  </>
) : (
  <CompactMenuItem 
    icon={<Trash2 size={16} className="text-red-500" />} 
    label="Delete" 
    variant="danger"
    onClick={() => runAction(() => handleDelete(file))} 
  />
)}
</div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

/* Micro Menu Item Component */
const CompactMenuItem = ({ icon, label, onClick, variant = "default" }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all active:scale-95 ${
      variant === "danger" ? "hover:bg-red-500/10 text-red-400" : "hover:bg-white/5 text-white/80"
    }`}
  >
    <span className="p-1.5 bg-white/5 rounded-lg">{icon}</span>
    <span className="text-xs font-bold tracking-tight">{label}</span>
  </button>
);

export default Dashboard;
