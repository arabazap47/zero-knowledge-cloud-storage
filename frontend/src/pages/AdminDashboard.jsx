
import React, { useEffect, useState } from "react";
import { 
  Users, HardDrive, LogOut, Search, Activity, 
  TrendingUp, ShieldAlert, Mail, BarChart3, ChevronRight 
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
  storageBreakdown: [],
  storageActivity: [],
  userActivity: [],
  users: [],
  topUsers: [],
  revenue: {}
});
  const [activeTab, setActiveTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const filteredUsers = stats.users?.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) || 
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const disableUser = async (id) => {
    if(!confirm("Are you sure you want to change this user's access?")) return;
    try {
      const res = await fetch("http://localhost:5000/api/admin/user/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id }),
      });
      const data = await res.json();
      alert(data.msg);
      fetchStats();
    } catch (err) {
      alert("Action failed");
    }
  };

  const upgradeUser = async (id) => {
    const plan = prompt("Enter plan name (Starter, Pro, Business):", "Pro");
    if (!plan || !["Starter", "Pro", "Business"].includes(plan)) {
      alert("Invalid plan selected.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/user/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id, plan: plan }),
      });
      const data = await res.json();
      alert(data.msg);
      fetchStats();
    } catch (err) {
      alert("Upgrade failed");
    }
  };

  const sendBroadcast = async () => {
    await fetch("http://localhost:5000/api/admin/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: "CypherVault Notice", message }),
    });
    alert("Broadcast sent successfully!");
    setMessage("");
  };

  if (loading) return (
    <div className="h-screen bg-[#02040a] flex items-center justify-center">
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 1 }}
        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
      />
    </div>
  );

  return (
    <div className="flex bg-[#02040a] text-slate-200 min-h-screen font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#0b0e14] border-r border-white/5 flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-blue-600 p-2 rounded-lg">
              <ShieldAlert size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              CypherVault
            </h2>
          </div>

          <nav className="space-y-2">
            {[
              { id: "dashboard", icon: <Activity size={18}/>, label: "Overview" },
              { id: "users", icon: <Users size={18}/>, label: "User Management" },
              { id: "analytics", icon: <BarChart3 size={18}/>, label: "Analytics" },
              { id: "emails", icon: <Mail size={18}/>, label: "Broadcast" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id 
                  ? "bg-blue-600/10 text-blue-500 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]" 
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-8 border-t border-white/5">
          <button 
            onClick={() => window.location.href = "/"}
            className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors w-full"
          >
            <LogOut size={18} />
            <span className="font-medium">Exit Console</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Admin Control</h1>
            <p className="text-gray-500 mt-1">Real-time system monitoring & management</p>
          </div>
          <div className="bg-white/5 px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 text-sm text-gray-400">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            System Online: v2.4.0
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              key="dashboard"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <StatCard title="Total Network Users" value={stats.totalUsers} icon={<Users className="text-blue-500" />} trend="+12%" />
                <StatCard title="Cloud Storage" value={`${stats.totalStorageMB} MB`} icon={<HardDrive className="text-emerald-500" />} trend="Active" />
                <StatCard title="Projected Revenue" value={`₹${stats.revenue?.total || 0}`} icon={<TrendingUp className="text-amber-500" />} trend="Monthly" />
                <StatCard title="Pro Licenses" value={stats.revenue?.proUsers || 0} icon={<ShieldAlert className="text-purple-500" />} trend="Verified" />
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-10">
                <div className="md:col-span-2 bg-[#0b0e14] border border-white/5 p-8 rounded-3xl shadow-xl">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Activity size={20} className="text-blue-500" /> Storage Activity Growth
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={stats.storageActivity}>
                      <defs>
                        <linearGradient id="colorSize" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="date" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0b0e14', borderColor: '#ffffff10', borderRadius: '12px' }} />
                      <Area type="monotone" dataKey="sizeMB" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSize)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-[#0b0e14] border border-white/5 p-8 rounded-3xl flex flex-col">
                  <h3 className="text-lg font-semibold mb-6">File Distribution</h3>
                  <div className="flex-1 flex items-center justify-center">
                    <PieChart width={220} height={220}>
                      <Pie
                        data={Array.isArray(stats.storageBreakdown) ? stats.storageBreakdown : []}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={8}
                        dataKey="value"
                      >
                        {COLORS.map((c, i) => <Cell key={i} fill={c} cornerRadius={10} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "users" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="relative max-w-md mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder="Filter by name or email..."
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#0b0e14] border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-blue-500/50 text-white shadow-inner"
                />
              </div>

              <div className="bg-[#0b0e14] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/[0.02] text-gray-400 text-xs uppercase tracking-wider">
                      <th className="p-5 font-semibold">User Details</th>
                      <th className="p-5 font-semibold">Subscription</th>
                      <th className="p-5 font-semibold">Usage</th>
                      <th className="p-5 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers?.map((user) => (
                      <tr key={user._id} className="group hover:bg-white/[0.01] transition-colors">
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-sm font-bold text-gray-400">{user.name[0]}</div>
                            <div>
                              <div className="font-medium text-slate-200">{user.name}</div>
                              <div className="text-xs text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${user.isDisabled ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-400"}`}>
                            {user.isDisabled ? "Restricted" : user.plan}
                          </span>
                        </td>
                        <td className="p-5 text-xs text-gray-500">{user.storageMB} MB</td>
                        <td className="p-5 text-right">
                          <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => upgradeUser(user._id)} className="px-4 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all">Upgrade</button>
                            <button onClick={() => disableUser(user._id)} className="px-4 py-1.5 rounded-lg bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500 hover:text-white transition-all">
                              {user.isDisabled ? "Enable" : "Restrict"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "analytics" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
              <div className="bg-[#0b0e14] border border-white/5 p-8 rounded-3xl shadow-xl">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2"><TrendingUp size={20} className="text-blue-500" /> Storage Activity Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={stats.storageActivity}>
                    <defs>
                      <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="date" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0b0e14', borderColor: '#ffffff10', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="sizeMB" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTrend)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-[#0b0e14] border border-white/5 p-8 rounded-3xl flex flex-col items-center">
                  <h3 className="text-lg font-semibold mb-6 self-start">Plan Distribution</h3>
                  <PieChart width={300} height={300}>
                    <Pie
                      data={Array.isArray(stats.userActivity) ? stats.userActivity : []}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={8}
                    >
                      {stats.userActivity?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </div>

                <div className="bg-[#0b0e14] border border-white/5 p-8 rounded-3xl">
                  <h3 className="text-lg font-semibold mb-6">Top Consumers</h3>
                  <div className="space-y-4">
                    {stats.topUsers?.map((u, i) => (
                      <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0">
                        <span className="font-medium">{u.name}</span>
                        <span className="text-blue-400 font-mono font-bold">{u.storageMB} MB</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "emails" && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
              <div className="bg-[#0b0e14] border border-white/5 p-10 rounded-[2.5rem] shadow-3xl">
                <div className="bg-blue-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <Mail className="text-blue-500" size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Global Broadcast</h3>
                <div className="space-y-4 mt-8">
                  <textarea
                    rows={6}
                    className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500/50 resize-none transition-all"
                    placeholder="Type your official announcement here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button onClick={sendBroadcast} disabled={!message} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all active:scale-95">Dispatch Broadcast</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend }) => (
  <div className="bg-[#0b0e14] border border-white/5 p-6 rounded-[2rem] hover:border-white/20 transition-all group relative overflow-hidden">
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">{trend}</span>
      </div>
      <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-extrabold mt-1 text-white tracking-tight">{value}</p>
    </div>
    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-600/5 blur-3xl rounded-full group-hover:bg-blue-600/10 transition-all"></div>
  </div>
);

export default AdminDashboard;