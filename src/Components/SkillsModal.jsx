import React, { useState } from "react";
import api from "../api/axios";

const SkillsModal = ({ close, skill, refresh }) => {
  const [title, setTitle] = useState(skill?.title || "");
  const [description, setDescription] = useState(skill?.description || "");
  const [chips, setChips] = useState(skill?.chips?.join(", ") || ""); // comma input

  const saveSkill = async () => {
    const data = {
      title,
      description,
      chips: chips.split(",").map(c => c.trim()).filter(Boolean),
    };

    try {
      if (skill) {
        await api.put(`/api/admin/skills/${skill.id}`, data);
      } else {
        await api.post(`/api/admin/skills`, data);
      }

      refresh();
      close();
    } catch (err) {
      console.error(err);
      alert("Failed to save skill");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-gray-200">
        <h2 className="text-xl mb-4">{skill ? "Edit Skill" : "Add Skill"}</h2>

        <div className="space-y-3">
          <input
            className="w-full p-2 bg-gray-700 rounded"
            placeholder="Skill Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full p-2 bg-gray-700 rounded"
            placeholder="Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            className="w-full p-2 bg-gray-700 rounded"
            placeholder="Chips (comma separated)"
            value={chips}
            onChange={(e) => setChips(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button onClick={close} className="px-4 py-2 text-gray-400 hover:text-gray-300">
            Cancel
          </button>
          <button onClick={saveSkill} className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillsModal;
