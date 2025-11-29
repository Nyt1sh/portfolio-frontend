// App.jsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Portfolio from './Components/Portfolio';
import AdminLogin from './Components/AdminLogin';
import { Toaster } from 'react-hot-toast';
import AdminDashboard from './Components/AdminDashboard';
import AdminHeroEditor from './Components/AdminHeroEditor';
import AdminAboutEditor from './Components/AdminAboutEditor';
import SkillsEditor from './Components/SkillsEditor';
import AdminLogs from './Components/AdminLogs.jsx'
import AdminProjects from './Components/AdminProjects.jsx';
import AdminMessages from './Components/AdminMessages.jsx';

const App = () => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "rgba(20,20,30,0.8)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
            color: "#fff",
            borderRadius: "14px",
          },
        }}
      />
      <Routes>
       <Route path="/" element={<Portfolio />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        {/* Admin Dashboard Routes - We'll use the Dashboard route to show the Hero Editor by default */}
        <Route path="/admin/dashboard" element={<AdminDashboard content={<AdminHeroEditor />} />} />
        <Route path="/admin/projects" element={<AdminProjects/>} />
        <Route path="/admin/skills" element={<AdminDashboard content={<SkillsEditor/>}/>} />
        <Route path="/admin/settings" element={<AdminDashboard content={<h2 className="text-xl text-yellow-400">Settings (Coming Soon)</h2>} />} />
        <Route path="/admin/about" element={<AdminAboutEditor />} />
        <Route path='/admin/logs' element ={<AdminLogs />}/>
        <Route path="/admin/messages" element={<AdminDashboard content={<AdminMessages />} />} />


      </Routes>
    </>
  );
};

export default App;
