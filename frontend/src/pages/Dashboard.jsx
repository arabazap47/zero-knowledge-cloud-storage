import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Folder, FileText, Search, Plus, Shield, Star, Share2, 
  Trash2, LogOut, MoreVertical, Bell, User, Key, Menu, X, Check, Edit2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import VaultLoader from "../components/VaultLoader";
import CypherVaultUpload from "./CypherVaultUpload"; // ✅ Import your new Modal

const Dashboard = () => {
  const [isClosing, setIsClosing] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); // ✅ State for Upload Modal
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState({ name: "Agent", email: "agent@cyphervault.com", plan: "Starter" });
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [files, setFiles] = useState([]);

  const [storage, setStorage] = useState({ used: 45, total: 100 }); 

  const searchVariants = {
    closed: { width: "40px", background: "rgba(255, 255, 255, 0)" },
    open: { width: "100%", background: "rgba(255, 255, 255, 0.05)" }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setNewName(parsed.name);
    }
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/files", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await res.json();

      console.log("API response:", data); // debug

      // ✅ FIXED
      setFiles(data.files || []);

      setStorage({
        used: data.used ? Math.round(data.used / (1024 * 1024)) : 0,
        total: data.limit ? Math.round(data.limit / (1024 * 1024)) : 50
      });

    } catch (err) {
      console.error("Fetch failed", err);
    }
  };


  useEffect(() => {
  fetchFiles();
}, []);

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

  const menuItems = [
    { name: "My Files", icon: <Folder size={20} />, active: true },
    { name: "Favorites", icon: <Star size={20} /> },
    { name: "Shared", icon: <Share2 size={20} /> },
    { name: "Trash", icon: <Trash2 size={20} /> },
  ];

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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#0a0c10] border-r border-white/5 p-6 transform transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <Shield size={22} />
            </div>
            <span className="text-xl font-bold tracking-tight italic">CypherVault</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500"><X /></button>
        </div>

        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => (
            <button key={item.name} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${item.active ? "bg-blue-600/10 border border-blue-500/30 text-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.1)]" : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}`}>
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
            <span>{storage.used}MB / {storage.total}MB</span>
          </div>
          <button className="w-full py-2 border border-white/10 rounded-lg text-xs font-bold hover:bg-white/5 transition-all">Upgrade</button>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-all">
          <LogOut size={18} /> <span className="text-sm font-bold">Logout Session</span>
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-4 lg:px-10 bg-[#05070a]/80 backdrop-blur-xl z-10 relative">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-400 hover:text-white">
              <Menu size={24} />
            </button>
            <div className="relative hidden lg:block w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input type="text" placeholder="Search Files..." className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-12 pr-4 outline-none focus:border-blue-500/50 text-sm" />
            </div>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 lg:hidden w-full max-w-[180px] sm:max-w-[300px] flex justify-center">
            <motion.div variants={searchVariants} animate={isSearchOpen ? "open" : "closed"} className="relative flex items-center rounded-full border border-white/10 px-3 py-1.5">
              <Search size={18} className="text-gray-400 cursor-pointer shrink-0" onClick={() => setIsSearchOpen(!isSearchOpen)} />
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.input initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} autoFocus placeholder="Search..." className="bg-transparent outline-none text-xs ml-2 w-full" />
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <button className="relative text-gray-500 hover:text-white p-2 hidden sm:block">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,1)]"></span>
            </button>
            
            <button onClick={() => setProfileOpen(true)} className="flex items-center gap-3 pl-4 border-l border-white/10 hover:opacity-80 transition-opacity">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold truncate max-w-[100px]">{user.name}</p>
                <p className="text-[10px] text-blue-500 uppercase tracking-widest font-black">{user.plan}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 border-2 border-white/20 flex items-center justify-center">
                <User size={20} />
              </div>
            </button>
          </div>
        </header>

        <div className="p-6 lg:p-10 overflow-y-auto flex-1 custom-scrollbar">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center sm:text-left">
            <h2 className="text-2xl lg:text-3xl font-bold italic tracking-tight uppercase">Welcome, {user.name.split(' ')[0]}</h2>
            <p className="text-gray-500 text-sm mt-1">Status: <span className="text-blue-500">Your vault is encrypted and secure</span></p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {['Project Titan', 'Financials 2026', 'Reports', 'Signatures'].map((folder, i) => (
              <motion.div key={folder} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/[0.05] hover:border-blue-500/30 transition-all cursor-pointer group">
                <Folder className="text-gray-600 group-hover:text-blue-500" size={20} />
                <span className="text-sm font-medium">{folder}</span>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 pb-24">
          {(files || []).length === 0 ? (
            <p className="text-gray-500 text-sm">No files uploaded yet</p>
          ) : (
            files.map((file) => (
              <FileCard
                key={file._id}
                name={file.filename}
                date={new Date(file.createdAt).toLocaleDateString()}
              />
            ))
          )}
        </div>        
        </div>
      </main>

      {/* --- PROFILE DRAWER --- */}
      <AnimatePresence>
        {isProfileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setProfileOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-[#0a0c10] border-l border-white/10 z-[70] p-8">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-lg font-bold tracking-widest text-gray-500 uppercase">Account Settings</h3>
                <button onClick={() => setProfileOpen(false)} className="p-2 hover:bg-white/5 rounded-full"><X /></button>
              </div>

              <div className="flex flex-col items-center text-center mb-10">
                <div className="w-24 h-24 rounded-3xl bg-blue-600 mb-6 flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.3)] border border-white/20">
                  <User size={40} />
                </div>
                {isEditingName ? (
                  <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-blue-500/30">
                    <input value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-transparent outline-none text-lg text-center w-full" />
                    <button onClick={handleUpdateName} className="p-1 bg-green-500 rounded-md text-black"><Check size={18}/></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <button onClick={() => setIsEditingName(true)} className="text-gray-500 hover:text-blue-500 transition-colors"><Edit2 size={16}/></button>
                  </div>
                )}
                <p className="text-gray-500 text-sm mt-1">{user.email}</p>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600/20 to-indigo-900/10 border border-white/10">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-tighter">Account Status</span>
                <p className="text-xl font-bold mt-1">{user.plan} Plan</p>
                <div className="mt-6 flex flex-col gap-3">
                  <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 transition-all">Upgrade to Enterprise</button>
                  <button className="w-full py-3 border border-white/10 hover:bg-white/5 rounded-xl text-sm text-gray-400">View Billing History</button>
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
        <span className="font-bold tracking-tight hidden sm:block">UPLOAD SECURELY</span>
      </motion.button>
    </div>
  );
};

// ... FileCard component remains the same
const FileCard = ({ name, date, active = false, icon = "file" }) => (
  <motion.div 
    whileHover={{ y: -4, backgroundColor: "rgba(255,255,255,0.05)" }} 
    className={`p-4 lg:p-6 rounded-[24px] border flex items-center justify-between transition-all cursor-pointer ${active ? "bg-blue-600/10 border-blue-500/40 shadow-[0_10px_20px_rgba(37,99,235,0.05)]" : "bg-white/[0.02] border-white/5"}`}
  >
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-2xl ${active ? "bg-blue-600/20 text-blue-400" : "bg-white/5 text-gray-500"}`}>
        {icon === "key" ? <Key size={20} /> : <FileText size={20} />}
      </div>
      <div className="min-w-0">
        <h4 className="font-bold text-sm truncate max-w-[120px] sm:max-w-none">{name}</h4>
        <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{date}</p>
      </div>
    </div>
    <button className="text-gray-600 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors">
      <MoreVertical size={18} />
    </button>
  </motion.div>
);

export default Dashboard;