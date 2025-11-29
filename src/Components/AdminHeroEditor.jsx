
import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { FaSave, FaSyncAlt, FaUpload } from "react-icons/fa";
import { apiPut } from "../api/axios.js";

// const BACKEND_ORIGIN = "http://localhost:8080";
const BACKEND_ORIGIN = "https://nyt1sh-portfolio.up.railway.app";
const PUBLIC_BASE = `${BACKEND_ORIGIN}/api/content/hero`;
const ADMIN_DESC_PUT = "/api/admin/content/hero";
const ADMIN_IMAGE_UPLOAD = `${BACKEND_ORIGIN}/api/admin/content/hero/upload-image`;

const AdminHeroEditor = () => {
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [status, setStatus] = useState("idle"); 

  const fetchAll = useCallback(async () => {
    setStatus("loading");
    try {
      const d = await fetch(`${PUBLIC_BASE}/description`);
      setDescription(d.ok ? await d.text() : "Experienced developer...");

      const i = await fetch(`${PUBLIC_BASE}/image-url`);
      if (i.ok) {
        const txt = await i.text();
        setImageUrl(txt ? (txt.startsWith("http") ? txt : `${BACKEND_ORIGIN}${txt}`) : "");
      } else {
        setImageUrl("");
      }

      toast.success("Content loaded.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to load content, using fallback.");
    } finally {
      setStatus("idle");
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Description save
  const saveDescription = async (e) => {
    e?.preventDefault();
    setStatus("saving");
    try {
      await apiPut(ADMIN_DESC_PUT, { content: description });
      toast.success("Description updated!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to save description");
    } finally {
      setStatus("idle");
    }
  };

  // File selection + preview
  const onFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    setSelectedFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = () => setPreviewSrc(reader.result);
      reader.readAsDataURL(f);
    } else {
      setPreviewSrc(null);
    }
  };

  const uploadFile = async (e) => {
    e?.preventDefault();
    if (!selectedFile) {
      toast.error("Select an image first.");
      return;
    }

    setStatus("uploading");
    try {
      const form = new FormData();
      form.append("file", selectedFile);

      const token = localStorage.getItem("admin_token");
      const res = await fetch(ADMIN_IMAGE_UPLOAD, {
        method: "PUT",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: form,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Upload failed");
      }

      const saved = await res.text(); 
      const finalUrl = saved.startsWith("http") ? saved : `${BACKEND_ORIGIN}${saved}`;

      setImageUrl(finalUrl);
      setSelectedFile(null);
      setPreviewSrc(null);
      toast.success("Image uploaded and saved!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Upload failed");
    } finally {
      setStatus("idle");
    }
  };

  const isLoading = status === "loading";
  const isSaving = status === "saving";
  const isUploading = status === "uploading";

  return (
    <div className="bg-gray-800/80 p-6 rounded-2xl shadow-xl border border-white/10 space-y-6">
      <h3 className="text-2xl font-semibold text-purple-300">Edit Hero Content</h3>

      {/* Description */}
      <form onSubmit={saveDescription} className="space-y-3">
        <label className="block text-sm font-medium text-slate-200">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-xl bg-slate-900/60 border border-white/15 px-4 py-3 text-slate-100"
          disabled={isLoading || isUploading || isSaving}
        />
        <div className="flex justify-end gap-3">
          <button type="button" onClick={fetchAll} disabled={isLoading || isUploading || isSaving} className="px-4 py-2 rounded-full bg-slate-700 text-white disabled:opacity-50">
            <FaSyncAlt className={isLoading ? "animate-spin inline-block mr-2" : "inline-block mr-2"} />
            {isLoading ? "Loading..." : "Reload"}
          </button>
          <button type="submit" disabled={isLoading || isUploading || isSaving} className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white">
            <FaSave className="inline-block mr-2" />
            {isSaving ? "Saving..." : "Save Description"}
          </button>
        </div>
      </form>

      {/* Image upload */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-200">Profile Image</label>

        <div className="flex items-center gap-4">
          <div className="w-36 h-36 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
            {previewSrc ? (
              <img src={previewSrc} alt="preview" className="w-full h-full object-cover" />
            ) : imageUrl ? (
              <img src={imageUrl} alt="current" className="w-full h-full object-cover" />
            ) : (
              <div className="text-sm text-gray-300">No image</div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <input type="file" accept="image/*" onChange={onFileChange} disabled={isLoading || isUploading} />
            <div className="flex gap-2">
              <button onClick={uploadFile} disabled={!selectedFile || isUploading || isLoading} className="px-4 py-2 rounded-full bg-green-600 text-white disabled:opacity-50 flex items-center gap-2">
                <FaUpload />
                {isUploading ? "Uploading..." : "Upload & Save"}
              </button>

              <button type="button" onClick={() => { setSelectedFile(null); setPreviewSrc(null); }} disabled={isLoading || isUploading} className="px-4 py-2 rounded-full bg-slate-600 text-white">
                Cancel
              </button>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-400">Choose an image (jpg/png). Upload replaces the profile image used on the site.</div>
      </div>
    </div>
  );
};

export default AdminHeroEditor;
