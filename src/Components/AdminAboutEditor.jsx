

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js"; 

// const BACK = "http://localhost:8080";
const BACK = "https://nyt1sh-portfolio.up.railway.app";
const ADMIN_ABOUT_PUT = "/api/admin/content/about";
const ADMIN_ABOUT_IMAGE_UPLOAD_PATH = "/api/admin/content/about/upload-image";

const AdminAboutEditor = () => {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [data, setData] = useState({
        headline: "",
        subtitle: "",
        paragraph1: "",
        paragraph2: "",
        chips: [],
        cvUrl: "",
        imageUrl: ""
    });

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    // ---------------------------
    // Load About Content
    // ---------------------------
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const res = await fetch(`${BACK}/api/content/about`);
                if (res.ok) {
                    const json = await res.json();
                    setData({
                        headline: json.headline || "",
                        subtitle: json.subtitle || "",
                        paragraph1: json.paragraph1 || "",
                        paragraph2: json.paragraph2 || "",
                        chips: json.chips
                            ? json.chips.split(",").map(s => s.trim()).filter(Boolean)
                            : [],
                        cvUrl: json.cvUrl || "",
                        imageUrl: json.imageUrl || ""
                    });
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load About content");
            }
            setLoading(false);
        })();
    }, []);

    // ---------------------------
    // File selection
    // ---------------------------
    const onFile = (e) => {
        const f = e.target.files?.[0] || null;
        setFile(f);

        if (f) {
            const r = new FileReader();
            r.onload = () => setPreview(r.result);
            r.readAsDataURL(f);
        } else {
            setPreview(null);
        }
    };

    // ---------------------------
    // Upload Image (with progress)
    // ---------------------------
    const uploadImage = async () => {
        if (!file) return toast.error("Select an image first");

        setLoading(true);
        setProgress(0); // reset
        try {
            const form = new FormData();
            form.append("file", file);

            
            const res = await api.put(ADMIN_ABOUT_IMAGE_UPLOAD_PATH, form, {
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(pct);
                    }
                },
                timeout: 0 
            });

            const url = res.data;

            setData(d => ({ 
                ...d,
                imageUrl: url
            }));

            setFile(null);
            setPreview(null);
            setProgress(0);

            toast.success("Image uploaded");
        } catch (err) {
            console.error(err);
            toast.error("Upload failed: " + (err.response?.data || err.message));
            setProgress(0);
        } finally {
            setLoading(false);
        }
    };

    // ---------------------------
    // Save all text fields
    // ---------------------------
    const saveAll = async () => {
        setLoading(true);
        try {
            await api.put(ADMIN_ABOUT_PUT, {
                headline: data.headline,
                subtitle: data.subtitle,
                paragraph1: data.paragraph1,
                paragraph2: data.paragraph2,
                chips: data.chips, 
                cvUrl: data.cvUrl
            });

            toast.success("About content saved");
        } catch (err) {
            console.error(err);
            toast.error("Save failed: " + (err.response?.data || err.message));
        }
        setLoading(false);
    };

    // ---------------------------
    // Render JSX
    // ---------------------------
    return (
        <div className="p-6 bg-gray-800 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold text-purple-300">Edit About Section</h3>

            <input
                value={data.headline}
                onChange={e => setData({ ...data, headline: e.target.value })}
                placeholder="Headline"
                className="w-full p-2 rounded bg-slate-900/60 text-white"
            />

            <input
                value={data.subtitle}
                onChange={e => setData({ ...data, subtitle: e.target.value })}
                placeholder="Subtitle"
                className="w-full p-2 rounded bg-slate-900/60 text-white"
            />

            <textarea
                value={data.paragraph1}
                rows={3}
                onChange={e => setData({ ...data, paragraph1: e.target.value })}
                className="w-full p-2 rounded bg-slate-900/60 text-white"
                placeholder="Paragraph 1"
            />

            <textarea
                value={data.paragraph2}
                rows={3}
                onChange={e => setData({ ...data, paragraph2: e.target.value })}
                className="w-full p-2 rounded bg-slate-900/60 text-white"
                placeholder="Paragraph 2"
            />

            <input
                value={data.chips.join(",")}
                onChange={e =>
                    setData({
                        ...data,
                        chips: e.target.value.split(",").map(s => s.trim())
                    })
                }
                placeholder="Tags (comma separated)"
                className="w-full p-2 rounded bg-slate-900/60 text-white"
            />

            <input
                value={data.cvUrl}
                onChange={e => setData({ ...data, cvUrl: e.target.value })}
                placeholder="CV Download URL"
                className="w-full p-2 rounded bg-slate-900/60 text-white"
            />

            {/* Image Preview + Upload */}
            <div className="flex gap-3 items-center">
                <div className="w-28 h-28 rounded overflow-hidden bg-gray-700">
                    {preview ? (
                        <img src={preview} className="w-full h-full object-cover" alt="preview"/>
                    ) : data.imageUrl ? (
                        <img src={data.imageUrl} className="w-full h-full object-cover" alt="about"/>
                    ) : (
                        <div className="text-xs p-2 text-gray-300">No image</div>
                    )}
                </div>

                <div className="flex flex-col gap-2 w-full">
                    <input type="file" accept="image/*" onChange={onFile} />

                    <div className="flex gap-2 items-center">
                        <button
                            onClick={uploadImage}
                            disabled={!file || loading}
                            className="px-3 py-2 bg-green-600 text-white rounded disabled:opacity-50"
                        >
                            {loading && file ? `Uploading... ${progress}%` : "Upload Image"}
                        </button>

                        <button
                            onClick={() => { setFile(null); setPreview(null); setProgress(0); }}
                            className="px-3 py-2 bg-slate-600 text-white rounded"
                        >
                            Cancel
                        </button>
                    </div>

                    {/* Progress bar */}
                    {loading && file && (
                        <div className="w-full mt-2 bg-gray-700 rounded h-2 overflow-hidden">
                            <div style={{ width: `${progress}%` }} className="h-full bg-purple-500 transition-all" />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-2 justify-end">
                <button
                    onClick={saveAll}
                    disabled={loading}
                    className="px-4 py-2 bg-purple-600 text-white rounded"
                >
                    Save All
                </button>
            </div>
        </div>
    );
};

export default AdminAboutEditor;
