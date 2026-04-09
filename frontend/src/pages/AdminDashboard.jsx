import React, { useEffect, useState } from "react";
import { Users, HardDrive, ShieldAlert, LogOut } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStorageMB: 0, userStats: [], users: [] });

  useEffect(() => {
    // Fetch stats from your new admin API
    fetch("http://localhost:5000/api/admin/stats")
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-8">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold italic text-blue-500 tracking-tighter">Admin Command</h1>
          <p className="text-gray-500 text-sm">Global CypherVault Infrastructure Overview</p>
        </div>
        <button onClick={() => window.location.href = "/"} className="flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-xl border border-red-500/20">
          <LogOut size={18}/> Exit Admin
        </button>
      </header>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard icon={<Users />} title="Total Users" value={stats.totalUsers} color="blue" />
        <StatCard icon={<HardDrive />} title="Total Cloud Usage" value={`${stats.totalStorageMB} MB`} color="emerald" />
        <StatCard icon={<ShieldAlert />} title="System Status" value="Healthy" color="purple" />
      </div>

      {/* CHART SECTION */}
      <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px]">
        <h3 className="text-lg font-bold mb-6">User Growth Overview</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.userStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="_id" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: "#0a0c10", border: "1px solid #ffffff10" }} />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6, fill: "#3b82f6" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* USER TABLE */}
        <div className="mt-10 bg-white/[0.02] border border-white/5 p-8 rounded-[32px]">
        <h3 className="text-lg font-bold mb-6">Registered Users</h3>

        <div className="overflow-x-auto">
            <table className="w-full text-sm">
            <thead>
                <tr className="text-gray-400 border-b border-white/10">
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Plan</th>
                <th className="text-left p-3">Storage Used (MB)</th>
                <th className="text-left p-3">Joined</th>
                </tr>
            </thead>

            <tbody>
                {stats.users?.map((user, index) => (
                <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3 capitalize">{user.plan}</td>
                    <td className="p-3 text-blue-400">{user.storageMB} MB</td>
                    <td className="p-3 text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>

    {stats.users?.length === 0 && (
      <p className="text-center text-gray-500 mt-6 text-sm">
        No users found
      </p>
    )}
  </div>
</div>      
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl flex items-center gap-5">
    <div className={`p-4 rounded-2xl bg-${color}-500/10 text-${color}-500`}>{icon}</div>
    <div>
      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;