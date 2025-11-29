// src/components/SkillsSection.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios"; // 🔁 adjust path if needed

const SkillsSection = ({ sectionVariants, cardVariants, skills: skillsProp }) => {
  const [skills, setSkills] = useState(skillsProp || []);
  const [loading, setLoading] = useState(!skillsProp);
  const [error, setError] = useState(null);

  useEffect(() => {
    // if parent passed skills, don't fetch
    if (skillsProp) return;

    const fetchSkills = async () => {
      try {
        const res = await api.get("/api/content/skills");
        // backend: { id, title, description, chips: [] }
        const mapped = res.data.map((s) => ({
          title: s.title,
          desc: s.description,
          list: s.chips || [],
        }));
        setSkills(mapped);
      } catch (err) {
        console.error(err);
        setError("Failed to load skills.");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [skillsProp]);

  if (loading) {
    return (
      <section className="skills py-24 px-4 md:px-10" id="skills">
        <h2 className="cursor-target heading text-4xl md:text-5xl font-bold text-center mb-16">
          My <span className="text-purple-400">Skills</span>
        </h2>
        <p className="text-center text-gray-400">Loading skills...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="skills py-24 px-4 md:px-10" id="skills">
        <h2 className="cursor-target heading text-4xl md:text-5xl font-bold text-center mb-16">
          My <span className="text-purple-400">Skills</span>
        </h2>
        <p className="text-center text-red-400">{error}</p>
      </section>
    );
  }

  return (
    <motion.section
      className="skills py-24 px-4 md:px-10"
      id="skills"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      <h2 className="cursor-target heading text-4xl md:text-5xl font-bold text-center mb-16">
        My <span className="text-purple-400">Skills</span>
      </h2>

      <div className="skills-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            className="skills-box p-8 glass-morphism border-t-4 border-purple-500 transform hover:scale-[1.02] transition-transform duration-300"
            variants={cardVariants}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <h3 className="cursor-target text-2xl font-bold mb-3 text-purple-200">
              {skill.title}
            </h3>
            <p className="cursor-target text-gray-400 mb-4">{skill.desc}</p>

            <div className="skills-list flex flex-wrap gap-2">
              {skill.list.map((item, i) => (
                <span
                  key={i}
                  className="cursor-target px-3 py-1 bg-gray-700 text-purple-300 text-sm rounded-full shadow-md"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default SkillsSection;
