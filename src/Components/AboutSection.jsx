// src/components/AboutSection.jsx
// import React from "react";
import { motion } from "framer-motion";
import { FiCode, FiServer, FiLayers } from "react-icons/fi";
import React, { useState, useEffect } from "react";


// const AboutSection = ({ sectionVariants, cardVariants, WorkingOn }) => {
const AboutSection = ({ sectionVariants, cardVariants, WorkingOn }) => {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://nyt1sh-portfolio.up.railway.app/api/content/about");
        if (res.ok) {
          const json = await res.json();
          // normalize chips and imageUrl
          const chips = json.chips ? (typeof json.chips === "string" ? json.chips.split(",").map(s => s.trim()).filter(Boolean) : json.chips) : [];
          let imageUrl = json.imageUrl || "";
          if (imageUrl && !imageUrl.startsWith("http")) imageUrl = `https://nyt1sh-portfolio.up.railway.app${imageUrl}`;
          setAboutData({ ...json, chips, imageUrl });
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);
  return (
    <motion.section
      id="about"
      className="relative about py-14 sm:py-16 md:py-20 px-4 md:px-10 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      {/* Soft background (kept subtle for responsiveness) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black" />
      <div className="pointer-events-none absolute -top-24 -left-10 w-56 h-56 bg-purple-500/30 blur-3xl rounded-full" />
      <div className="pointer-events-none absolute bottom-[-5rem] right-0 w-64 h-64 bg-blue-500/30 blur-3xl rounded-full" />

      <div className="relative max-w-6xl mx-auto">
        <h2 className="cursor-target heading text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 md:mb-12">
          {aboutData?.headline ? (
            <>{aboutData.headline}</>
          ) : (
            <>About <span className="text-purple-400">Me</span></>
          )
          }
        </h2>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image side */}
          <motion.div
            variants={cardVariants}
            className="cursor-target about-img w-full"
          >
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 bg-white/5 backdrop-blur-2xl shadow-[0_14px_40px_rgba(15,23,42,0.85)]">
              <img
                src={aboutData?.imageUrl || WorkingOn}
                alt="Working on code"
                className="w-full h-full max-h-[300px] sm:max-h-[340px] md:max-h-[380px] object-cover"
              />

            </div>

            {/* Tiny badges under image – compact */}
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] sm:text-xs">
              <div className="flex items-center gap-1.5 rounded-2xl border border-purple-500/40 bg-purple-500/10 px-2.5 py-1.5">
                <FiCode className="text-purple-300 text-sm" />
                <span className="text-slate-100">Currently Working on</span>
              </div>
            </div>
          </motion.div>

          {/* Text side */}
          <motion.div
            variants={cardVariants}
            className="about-text w-full glass-morphism rounded-2xl sm:rounded-3xl border border-white/10 bg-white/10 backdrop-blur-3xl px-5 py-6 sm:px-6 sm:py-7 md:px-7 md:py-8 shadow-[0_14px_40px_rgba(15,23,42,0.85)] text-center md:text-left"
          >
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-purple-300/80 mb-2">
              Full-Stack Developer
            </p>

            <h3 className="cursor-target text-xl sm:text-2xl md:text-3xl font-semibold mb-3 text-purple-100">
              {aboutData?.subtitle || "Turning ideas into reliable, production-ready software."}
            </h3>


            <p className="cursor-target text-sm sm:text-[15px] text-gray-300 mb-3 leading-relaxed">
  { aboutData?.paragraph1 || "I&apos;m a backend-focused full-stack developer who enjoys designing and building systems that are clean, predictable, and easy to maintain. From APIs and databases to modern UIs, I like owning features end-to-end." }
</p>


            <p className="cursor-target text-sm sm:text-[15px] text-gray-300 mb-4 leading-relaxed">
  { aboutData?.paragraph2 || (
    <>I work with stacks like <span className="text-purple-300">C# / ASP.NET Core, Java, Node &amp; Express, React, Tailwind</span> and relational / NoSQL databases, focusing on structure, performance, and developer-friendly code.</>
  ) }
</p>

            {/* Short highlight chips */}
            <div className="mb-5 flex flex-wrap gap-2 justify-center md:justify-start">
              {(aboutData?.chips?.length ? aboutData.chips : [
                "Backend-heavy full-stack",
                "API & DB design",
                "Clean, readable code",
                "Performance & reliability"
              ]).map((item, idx) => (
                <span key={idx} className="cursor-target px-3 py-1 rounded-full bg-slate-900/60 border border-white/10 text-[11px] sm:text-xs text-slate-100">{item}</span>
              ))}

            </div>

            {/* CTA row */}
            <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
              <a
                href={aboutData?.cvUrl || "#"}
                target={aboutData?.cvUrl ? "_blank" : "_self"}
                rel="noreferrer"
                className="cursor-target inline-flex items-center justify-center px-5 sm:px-6 py-2.5 rounded-full text-sm sm:text-[15px] font-semibold bg-gradient-to-r from-purple-500 via-fuchsia-500 to-blue-500 text-white shadow-lg shadow-purple-500/40 hover:shadow-purple-500/60 transition-all duration-300"
              >
                Download CV
              </a>

              <span className="text-xs sm:text-sm text-slate-300/90">
                Open to collaboration, freelance and backend-focused roles.
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutSection;