// src/components/AdminMessages.jsx
import React, { useEffect, useState, useMemo } from "react";
import api from "../api/axios";
import { FiMail, FiPhone, FiTrash2, FiCheckCircle } from "react-icons/fi";
import { format } from "date-fns";
import toast from "react-hot-toast";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedThreadEmail, setSelectedThreadEmail] = useState(null);
  const [settings, setSettings] = useState({ notificationsEnabled: false, notificationEmail: "" });
  const [savingSettings, setSavingSettings] = useState(false);

 
  const loadSettings = async () => {
    try {
      const res = await api.get("/api/admin/settings");
      setSettings(res.data || { notificationsEnabled: false, notificationEmail: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load admin settings");
    }
  };

  // load messages
  const loadMessages = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/messages");
      setMessages(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
    loadMessages();
  }, []);


  const threads = useMemo(() => {
    const map = new Map();
    for (const m of messages) {
      const key = m.email ? m.email.toLowerCase() : `anon-${m.id || Math.random()}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(m);
    }

    for (const arr of map.values()) {
      arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    const out = Array.from(map.entries()).map(([email, msgs]) => {
      const lastAt = msgs.reduce((acc, m) => {
        const dt = new Date(m.createdAt).getTime();
        return Math.max(acc, dt);
      }, 0);
      const unreadCount = msgs.filter((m) => !m.readFlag).length;
      const name = msgs.find((m) => m.name)?.name || msgs[0].name || email;
      return { email, messages: msgs, lastAt, unreadCount, name };
    });
    let filtered = out;
    if (filter === "unread") filtered = out.filter((t) => t.unreadCount > 0);
    if (filter === "read") filtered = out.filter((t) => t.unreadCount === 0);
    filtered.sort((a, b) => b.lastAt - a.lastAt);
    return filtered;
  }, [messages, filter]);

  useEffect(() => {
    if (!selectedThreadEmail && threads.length > 0) {
      setSelectedThreadEmail(threads[0].email);
    }
  }, [threads, selectedThreadEmail]);

  // Helpers
  const refreshMessages = () => loadMessages();

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/api/admin/messages/${id}/read`);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, readFlag: true } : m)));
      toast.success("Marked as read");
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark as read");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message permanently?")) return;
    try {
      await api.delete(`/api/admin/messages/${id}`);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast.success("Message deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete message");
    }
  };

  const handleToggleNotifications = async () => {
    try {
      setSavingSettings(true);
      const updated = {
        ...settings,
        notificationsEnabled: !settings.notificationsEnabled,
      };
      const res = await api.put("/api/admin/settings", updated);
      setSettings(res.data);
      toast.success(`Notifications ${res.data.notificationsEnabled ? "enabled" : "disabled"}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleUpdateNotificationEmail = async (newEmail) => {
    try {
      setSavingSettings(true);
      const updated = { ...settings, notificationEmail: newEmail };
      const res = await api.put("/api/admin/settings", updated);
      setSettings(res.data);
      toast.success("Notification email updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update email");
    } finally {
      setSavingSettings(false);
    }
  };

  const selectedThread = threads.find((t) => t.email === selectedThreadEmail);

  return (
    <div className="text-white grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
      {/* LEFT: Threads + settings */}
      <div className="bg-gray-800 p-4 rounded-lg border border-white/10 flex flex-col h-[70vh]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Messages</h2>
          <div className="text-xs text-gray-400">{messages.length} total</div>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-full text-xs ${filter === "all" ? "bg-purple-600" : "bg-gray-700"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 py-1 rounded-full text-xs ${filter === "unread" ? "bg-purple-600" : "bg-gray-700"}`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-3 py-1 rounded-full text-xs ${filter === "read" ? "bg-purple-600" : "bg-gray-700"}`}
          >
            Read
          </button>
        </div>

        {/* Notifications toggle */}
        <div className="mb-3 border-t border-white/6 pt-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs text-gray-300">Email Notifications</div>
              <div className="text-sm text-gray-200">{settings.notificationEmail || "Not set"}</div>
            </div>
            <div className="flex flex-col items-end">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!settings.notificationsEnabled}
                  onChange={handleToggleNotifications}
                  disabled={savingSettings}
                  className="mr-2 w-4 h-4"
                />
                <span className="text-xs">{settings.notificationsEnabled ? "On" : "Off"}</span>
              </label>
              <button
                onClick={() => {
                  const newEmail = window.prompt("Enter notification email", settings.notificationEmail || "");
                  if (newEmail !== null) handleUpdateNotificationEmail(newEmail.trim());
                }}
                className="mt-2 text-xs px-2 py-1 bg-gray-700 rounded"
              >
                Edit Email
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-auto mt-2">
          {loading && <div className="text-gray-400 text-sm">Loading threads...</div>}
          {!loading && threads.length === 0 && <div className="text-gray-500 text-sm">No messages yet.</div>}

          <div className="space-y-2">
            {threads.map((t) => (
              <button
                key={t.email}
                onClick={() => setSelectedThreadEmail(t.email)}
                className={`w-full text-left p-2 rounded-lg hover:bg-gray-700/50 flex items-center justify-between ${selectedThreadEmail === t.email ? "bg-gray-700/60" : "bg-transparent"}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col">
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-gray-400 truncate max-w-[180px]">{t.email}</div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="text-xs text-gray-400">{t.messages.length} msg</div>
                  {t.unreadCount > 0 ? (
                    <div className="mt-1 text-xs bg-green-500/90 text-black px-2 py-0.5 rounded-full">{t.unreadCount}</div>
                  ) : (
                    <div className="mt-1 text-xs text-gray-500">—</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-white/6">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <button onClick={refreshMessages} className="px-3 py-1 bg-gray-700 rounded">Refresh</button>
            <span>Last updated: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg border border-white/10 flex flex-col h-[70vh]">
        {!selectedThread && (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a conversation to view messages.
          </div>
        )}

        {selectedThread && (
          <>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xl font-semibold">{selectedThread.name}</div>
                <div className="text-xs text-gray-400">{selectedThread.email}</div>
              </div>

              <div className="text-right text-xs text-gray-400">
                {selectedThread.messages.length} messages
              </div>
            </div>

            <div className="overflow-auto mb-3 flex-1 space-y-3">
              {selectedThread.messages.map((m) => (
                <div key={m.id} className="bg-gray-900 p-3 rounded-lg border border-white/6">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-semibold">{m.name || "Anonymous"}</div>
                      <div className="text-xs text-gray-400">{format(new Date(m.createdAt), "dd MMM yyyy, HH:mm")}</div>
                      {!m.readFlag && <div className="ml-2 w-2.5 h-2.5 rounded-full bg-green-400" title="Unread" />}
                    </div>

                    <div className="flex gap-2">
                      {!m.readFlag && (
                        <button onClick={() => handleMarkRead(m.id)} className="px-2 py-1 bg-green-600/80 rounded text-xs flex items-center gap-1">
                          <FiCheckCircle /> Mark
                        </button>
                      )}
                      <button onClick={() => handleDelete(m.id)} className="px-2 py-1 bg-red-600/80 rounded text-xs flex items-center gap-1">
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </div>

                  <div className="text-sm text-gray-100 whitespace-pre-wrap">{m.message}</div>

                  <div className="mt-2 text-xs text-gray-400 flex gap-3">
                    {m.email && <div className="flex items-center gap-1"><FiMail />{m.email}</div>}
                    {m.phone && <div className="flex items-center gap-1"><FiPhone />{m.phone}</div>}
                    {m.subject && <div className="px-2 py-0.5 rounded-full bg-purple-600/30 text-purple-100">{m.subject}</div>}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-right">
              <button
                onClick={() => {
                  // mark all messages in this thread as read
                  const unread = selectedThread.messages.filter((m) => !m.readFlag);
                  unread.forEach((m) => handleMarkRead(m.id));
                }}
                className="px-3 py-1 bg-green-600 rounded text-sm mr-2"
              >
                Mark all read
              </button>
              <button onClick={refreshMessages} className="px-3 py-1 bg-gray-700 rounded text-sm">Refresh</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
