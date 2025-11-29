import React, { useEffect, useState } from "react";
import api from "../api/axios";
import SkillsModal from "./SkillsModal";

const SkillsEditor = () => {
  const [skills, setSkills] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  // Load skills from backend
  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await api.get("/api/admin/skills");
      setSkills(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load skills");
    }
  };

  const openAddModal = () => {
    setSelectedSkill(null);
    setModalOpen(true);
  };

  const openEditModal = (skill) => {
    setSelectedSkill(skill);
    setModalOpen(true);
  };

  const deleteSkill = async (id) => {
    if (!window.confirm("Delete this skill?")) return;

    try {
      await api.delete(`/api/admin/skills/${id}`);
      fetchSkills();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="text-gray-200">
      <div className="flex justify-between mb-5">
        <h2 className="text-2xl font-semibold">Manage Skills</h2>
        <button
          onClick={openAddModal}
          className="bg-purple-600 px-4 py-2 rounded-md hover:bg-purple-700"
        >
          + Add Skill
        </button>
      </div>

      <div className="space-y-3">
        {skills.map((skill) => (
          <div key={skill.id} className="p-4 bg-gray-800 rounded-lg flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">{skill.title}</h3>
              <p className="text-gray-400">{skill.description}</p>
              <div className="flex gap-2 mt-2">
                {skill.chips.map((chip, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => openEditModal(skill)}
                className="px-3 py-1 text-yellow-400 hover:text-yellow-300"
              >
                Edit
              </button>
              <button
                onClick={() => deleteSkill(skill.id)}
                className="px-3 py-1 text-red-400 hover:text-red-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && 
        <SkillsModal 
          close={() => setModalOpen(false)} 
          skill={selectedSkill} 
          refresh={fetchSkills} 
        />
      }
    </div>
  );
};

export default SkillsEditor;
