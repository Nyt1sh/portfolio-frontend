import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../api/client";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const data = await apiPost("/api/auth/login", form);
      localStorage.setItem("admin_token", data.token);

      toast.success("Welcome back, Admin 🚀", {
        icon: "👑",
      });

      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.message || "Invalid credentials ❌");
    } finally {
      setStatus("idle");
    }
  };


    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md glass-morphism rounded-3xl border border-white/10 bg-white/10 backdrop-blur-2xl px-6 py-7 shadow-[0_18px_60px_rgba(15,23,42,0.9)]"
            >
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-purple-100">
                    Admin Login
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-200 mb-1">
                            Username
                        </label>
                        <input
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="admin"
                            className="w-full rounded-2xl bg-slate-900/60 border border-white/15 px-3 py-2.5 text-slate-100 text-sm outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-400 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-200 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full rounded-2xl bg-slate-900/60 border border-white/15 px-3 py-2.5 text-slate-100 text-sm outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-400 transition-all"
                        />
                    </div>
                </div>

                {status === "error" && (
                    <p className="text-xs text-red-400 mt-3">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={status === "loading"}
                    className="mt-6 w-full rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-blue-500 text-white text-sm font-semibold py-2.5 shadow-lg shadow-purple-500/40 hover:shadow-purple-500/60 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                    {status === "loading" ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;
