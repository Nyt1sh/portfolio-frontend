import React, { useState, useEffect, memo } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import {
  ExternalLink,
  Layers,
  Zap,
  Activity,
  BarChart,
  ShoppingBag,
  Database,
  Github
} from "lucide-react";


// --- Utility: Liquid Background Blob (performance-friendly) ---
const LiquidBlob = ({ className, delay = 0 }) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div
        className={`absolute rounded-full filter blur-2xl opacity-25 ${className}`}
      />
    );
  }

  return (
    <motion.div
      className={`absolute rounded-full filter blur-2xl opacity-25 ${className}`}
      animate={{
        scale: [1, 1.08, 0.96, 1],
        x: [0, 15, -10, 0],
        y: [0, -10, 8, 0],
      }}
      transition={{
        duration: 16,
        ease: "easeInOut",
        repeat: Infinity,
        delay,
      }}
    />
  );
};

// --- 3D Tilt Card (subtle & optimized) ---
const GlassCardBase = ({ project, index }) => {
  const shouldReduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e) => {
    if (shouldReduceMotion) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const rotateX = useSpring(
    useTransform(y, [-0.5, 0.5], [10, -10]),
    { stiffness: 120, damping: 18, mass: 0.4 }
  );
  const rotateY = useSpring(
    useTransform(x, [-0.5, 0.5], [-10, 10]),
    { stiffness: 120, damping: 18, mass: 0.4 }
  );

  const baseMotionProps = shouldReduceMotion
    ? {}
    : {
      style: { rotateX, rotateY, transformStyle: "preserve-3d" },
    };

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="relative group h-[380px] md:h-[400px] [perspective:1200px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        {...baseMotionProps}
        className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 
                   bg-gradient-to-br from-white/10 via-white/5 to-white/0 
                   shadow-[0_18px_45px_rgba(0,0,0,0.55)]
                   backdrop-blur-xl transition-[box-shadow,border-color,background] duration-400
                   hover:shadow-[0_22px_55px_rgba(139,92,246,0.4)]
                   hover:border-purple-400/40"
      >
        {/* Subtle inner glass highlight */}
        <div className="pointer-events-none absolute inset-[1px] rounded-[1rem] bg-gradient-to-b from-white/10 via-transparent to-purple-500/10 opacity-80" />

        {/* Top "liquid" gradient layer */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(244,244,255,0.24),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(147,51,234,0.28),transparent_50%)] opacity-70 mix-blend-screen pointer-events-none" />

        {/* Image Area */}
        <div className="relative h-[46%] overflow-hidden rounded-t-2xl">
          <motion.img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
            transition={{ duration: 0.5 }}
          />

          {/* Soft glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent mix-blend-soft-light" />

          {/* Floating Icon */}
          <div className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full 
                          bg-black/40 backdrop-blur-md border border-white/25
                          flex items-center justify-center text-purple-200 shadow-lg">
            {project.icon}
          </div>
        </div>

        {/* Content Area */}
        <div className="relative h-[54%] px-5 py-4 flex flex-col justify-between bg-gradient-to-b from-black/40 via-black/60 to-black/75">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-purple-400">
              {project.title}
            </h3>
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed line-clamp-3">
              {project.desc}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 mt-3">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 max-w-[70%]">
              {project.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] md:text-[11px] px-2 py-1 rounded-full
                             bg-white/8 border border-white/10
                             text-purple-100 whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Link button  */}
            <div className="flex gap-2">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  className="p-2 rounded-full bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 transition"
                >
                  <Github size={16} />
                </a>
              )}

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  className="p-2 rounded-full bg-green-600/20 hover:bg-green-600/40 border border-green-500/30 transition"
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>

          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// memo for performance
const GlassCard = memo(GlassCardBase);

// --- Main Section Component 
const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // icons pool for automatic assignment
  const iconComponents = [ShoppingBag, Activity, Layers, Database, BarChart, Zap];

  useEffect(() => {
    const loadProjects = async () => {
      try {
        // public endpoint – no auth token
        const res = await fetch("https://nyt1sh-portfolio.up.railway.app/api/content/projects");
        if (!res.ok) {
          throw new Error("Failed to load projects");
        }
        const data = await res.json();
        const mapped = data.map((p, index) => {
          const IconComp = iconComponents[index % iconComponents.length];
          return {
            title: p.title,
            description: p.description,
            tags: p.tags || [],
            image: p.imageUrl,
            githubUrl: p.githubUrl,
            liveUrl: p.liveUrl,
            icon: <IconComp size={20} />,
          };

        });
        setProjects(mapped);
      } catch (err) {
        console.error(err);
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []); // run once

  return (
    <section
      className="relative min-h-screen w-full bg-[#05050a] text-white overflow-hidden py-20 md:py-24 
                 px-4 md:px-10 selection:bg-purple-500/30"
    >
      {/* Ambient Liquid Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <LiquidBlob className="w-80 h-80 bg-purple-600/35 top-[-6rem] left-[-4rem]" delay={0} />
        <LiquidBlob className="w-[420px] h-[420px] bg-blue-500/30 bottom-[-8rem] right-[-4rem]" delay={5} />

        {/* Fine noise + subtle grid */}
        <div className="absolute inset-0 opacity-[0.16] mix-blend-soft-light bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:120px_120px]" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14 md:mb-20"
        >
          
          <h2 className="cursor-target text-4xl md:text-6xl font-bold tracking-tight mb-3">
            <span className=" bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 drop-shadow-[0_0_18px_rgba(168,85,247,0.55)]">
              Projects
            </span>
          </h2>
          
        </motion.div>

        {loading && (
          <p className="text-center text-gray-400">Loading projects...</p>
        )}

        {error && !loading && (
          <p className="text-center text-red-400 text-sm">{error}</p>
        )}

        {!loading && !error && projects.length === 0 && (
          <p className="text-center text-gray-500 text-sm">
            No projects added yet.
          </p>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {projects.map((project, index) => (
              <GlassCard key={project.title + index} project={project} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* Footer Gradient Fade */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#05050a] to-transparent pointer-events-none" />
    </section>
  );
};

export default ProjectsSection;
