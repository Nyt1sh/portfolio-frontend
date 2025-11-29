import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import toast from "react-hot-toast";

const AdminProjects = () => {
    const [projects, setProjects] = useState([]);
    const [editing, setEditing] = useState(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        tags: "",
        liveUrl: "",
        githubUrl: "",
        imageFile: null,
    });

    // Fetch projects
    const loadProjects = async () => {
        try {
            const res = await api.get("/api/admin/projects");
            setProjects(res.data);
        } catch (err) {
            console.error(err);
            toast.error("❌ Failed to load projects");
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm({
            ...form,
            [name]: files ? files[0] : value,
        });
    };

    // Drag reorder
    const handleDragEnd = async (result) => {
  if (!result.destination) return;

  const reordered = Array.from(projects);
  const [moved] = reordered.splice(result.source.index, 1);
  reordered.splice(result.destination.index, 0, moved);

  setProjects(reordered);

  try {
    const orderedIds = reordered.map((p) => p.id);

    await api.put("/api/admin/projects/reorder", orderedIds);

    toast.success("Order updated 🧩");
  } catch (err) {
    console.error(err);
    toast.error("Failed to save order ❌");
  }
};

    // Save new or update
    const handleSubmit = async () => {
        try {
            let projectId = editing ? editing.id : null;

            const payload = {
                title: form.title,
                description: form.description,
                tags: form.tags.split(",").map((t) => t.trim()),
                liveUrl: form.liveUrl,
                githubUrl: form.githubUrl,
            };

            const res = editing
                ? await api.put(`/api/admin/projects/${projectId}`, payload)
                : await api.post(`/api/admin/projects`, payload);

            const saved = res.data;
            projectId = saved.id;

            if (form.imageFile) {
                const fd = new FormData();
                fd.append("file", form.imageFile);

                await api.put(`/api/admin/projects/${projectId}/upload-image`, fd, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            toast.success(editing ? "Project updated 🎉" : "Project added 🚀");

            setForm({
                title: "",
                description: "",
                tags: "",
                liveUrl: "",
                githubUrl: "",
                imageFile: null,
            });
            setEditing(null);
            loadProjects();
        } catch (err) {
            console.error(err);
            toast.error("❌ Error saving project");
        }
    };

    // Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this project permanently?")) return;

        try {
            await api.delete(`/api/admin/projects/${id}`);
            toast.success("🗑️ Project deleted");
            loadProjects();
        } catch (err) {
            console.error(err);
            toast.error("❌ Delete failed");
        }
    };

    return (
        <div className="text-white">
            <h2 className="text-2xl font-bold mb-5">Manage Projects</h2>

            {/* FORM */}
            <div className="bg-gray-800 p-5 rounded-lg mb-6">
                <h3 className="text-xl mb-3">
                    {editing ? "Edit Project" : "Add New Project"}
                </h3>

                <input
                    type="text"
                    name="title"
                    placeholder="Project title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full p-2 mb-3 bg-gray-700 rounded"
                />

                <textarea
                    name="description"
                    placeholder="Project description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full p-2 mb-3 bg-gray-700 rounded"
                />

                <input
                    type="text"
                    name="tags"
                    placeholder="Tags (comma separated)"
                    value={form.tags}
                    onChange={handleChange}
                    className="w-full p-2 mb-3 bg-gray-700 rounded"
                />

                <input
                    type="text"
                    name="liveUrl"
                    placeholder="Live Website URL (optional)"
                    value={form.liveUrl}
                    onChange={handleChange}
                    className="w-full p-2 mb-3 bg-gray-700 rounded"
                />

                <input
                    type="text"
                    name="githubUrl"
                    placeholder="GitHub URL (optional)"
                    value={form.githubUrl}
                    onChange={handleChange}
                    className="w-full p-2 mb-3 bg-gray-700 rounded"
                />

                <input
                    type="file"
                    name="imageFile"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full p-2 mb-3 bg-gray-700 rounded"
                />

                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded"
                >
                    {editing ? "Update Project" : "Add Project"}
                </button>
            </div>

            {/* DRAGGABLE LIST */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="projects">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {projects.map((p, index) => (
                                <Draggable key={p.id} draggableId={String(p.id)} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="bg-gray-800 p-4 rounded-lg mb-4 flex justify-between cursor-grab"
                                        >
                                            <div>
                                                <h4 className="font-semibold text-lg">{p.title}</h4>
                                                <p className="text-gray-400">{p.description}</p>
                                                <p className="text-sm text-purple-300">
                                                    {(p.tags || []).join(", ")}
                                                </p>
                                            </div>

                                            {p.imageUrl && (
                                                <img
                                                    src={p.imageUrl}
                                                    alt=""
                                                    className="w-24 h-24 object-cover rounded ml-3"
                                                />
                                            )}

                                            <div className="flex flex-col gap-2 ml-4">
                                                <button
                                                    onClick={() => {
                                                        setEditing(p);
                                                        setForm({
                                                            title: p.title,
                                                            description: p.description,
                                                            tags: p.tags.join(", "),
                                                            liveUrl: p.liveUrl || "",
                                                            githubUrl: p.githubUrl || "",
                                                            imageFile: null,
                                                        });
                                                    }}
                                                    className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p.id)}
                                                    className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default AdminProjects;
