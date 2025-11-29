import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaProjectDiagram, FaUserShield, FaCog, FaSignOutAlt, FaRocket } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import AdminHeroEditor from "./AdminHeroEditor";
import AdminAboutEditor from "./AdminAboutEditor";
import SkillsEditor from "./SkillsEditor";
import { FaListAlt } from "react-icons/fa";
import AdminLogs from "./AdminLogs";
import AdminProjects from "./AdminProjects";
import AdminMessages from "./AdminMessages";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("/admin/dashboard");


  // 🔐 Simple auth check (temporary)
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) navigate("/admin/login");
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  const navItems = [
    { name: "Hero Content", path: "/admin/dashboard", icon: FaRocket },
    { name: "Projects", path: "/admin/projects", icon: FaProjectDiagram },
    { name: "Skills", path: "/admin/skills", icon: FaUserShield },
    { name: "Settings", path: "/admin/settings", icon: FaCog },
    { name: "About", path: "/admin/about", icon: FaUserShield }, // or choose an icon
    { name: "Logs", path: "/admin/logs", icon: FaListAlt },
    { name: "Messages", path: "/admin/messages", icon: FaListAlt },


  ];

  // Placeholder for rendering the current view based on URL (using Hero Content Editor as default)
  const renderContent = () => {
    switch (active) {
      case "/admin/dashboard":
        return <AdminHeroEditor />;
      case "/admin/projects":
        return <AdminProjects />;
      case "/admin/skills":
        return <SkillsEditor />
      case "/admin/settings":
        return <h2 className="text-xl text-yellow-400">Settings (Coming Soon)</h2>;
      case "/admin/about":
        return <AdminAboutEditor />;
      case "/admin/logs":
        return <AdminLogs />
      case "/admin/messages":
        return <AdminMessages />;

      default:
        return <AdminHeroEditor />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-800/50 backdrop-blur-xl border-r border-white/10 p-5 flex flex-col">
        <h2 className="text-2xl font-bold mb-8 text-purple-400">
          Admin Panel
        </h2>

        <nav className="flex flex-col gap-3 text-lg">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActive(item.path)}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors text-sm w-full text-left ${active === item.path
                ? "bg-purple-600/30 text-purple-300 font-semibold"
                : "hover:bg-gray-700/50 text-gray-300"
                }`}
            >
              <item.icon /> {item.name}
            </button>

          ))}
        </nav>

        <button onClick={logout} className="mt-auto flex items-center gap-3 text-sm text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-900/20 transition-colors">
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 overflow-auto">
        <h1 className="text-3xl font-bold mb-8">Content Management</h1>
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;