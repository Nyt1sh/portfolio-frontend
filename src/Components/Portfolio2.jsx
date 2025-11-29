// src/Components/Portfolio.jsx
import React, { useEffect, useState, useRef } from 'react';
import TargetCursor from './ReactBits/TargetCursor';
import Noise from './ReactBits/Noise';
import '../CSS/Portfolio.css'
import SkillsSection from './SkillsSection.jsx'
import AboutSection from './AboutSection.jsx'
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useMotionValue,
    AnimatePresence,
} from 'framer-motion';
import { BsGithub, BsLinkedin } from 'react-icons/bs';
import { IoMdMail } from 'react-icons/io';
import { HashLink } from 'react-router-hash-link';
import SkeletonScreen from './Skeloton';
import useImagePreloader from '../hooks/useImagePreloader';

import '../CSS/Portfolio.css';
import devImage from '../Images/devImage.JPG';
import WorkingOn from '../Images/image.png';
import ContactSection from './ContactSection';
import ProjectsSection from './ProjectSection';

const GlobalCursor = () => {
    const mx = useMotionValue(-100);
    const my = useMotionValue(-100);
    const sx = useSpring(mx, { stiffness: 220, damping: 26 });
    const sy = useSpring(my, { stiffness: 220, damping: 26 });

    useEffect(() => {
        const handleMove = (e) => {
            mx.set(e.clientX);
            my.set(e.clientY);
        };
        const handleTouch = () => {
            mx.set(-100);
            my.set(-100);
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchstart', handleTouch, { passive: true });
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchstart', handleTouch);
        };
    }, [mx, my]);

    return (
        <motion.div
            style={{ translateX: sx, translateY: sy }}
            className="pointer-events-none fixed top-0 left-0 z-9999 mix-blend-screen"
            aria-hidden
        >
            <div className="hidden md:block">
                <div
                    style={{
                        width: 140,
                        height: 140,
                        transform: 'translate(-50%, -50%)',
                        borderRadius: '9999px',
                        background:
                            'radial-gradient(circle at 30% 30%, rgba(167,139,250,0.16), rgba(124,58,237,0.06), transparent 60%)',
                        filter: 'blur(28px)',
                    }}
                />
            </div>

            <div className="md:hidden">
                <div
                    style={{
                        width: 36,
                        height: 36,
                        transform: 'translate(-50%, -50%)',
                        borderRadius: '9999px',
                        background: 'radial-gradient(circle, rgba(167,139,250,0.28), rgba(124,58,237,0.12))',
                        filter: 'blur(8px)',
                    }}
                />
            </div>
        </motion.div>
    );
};

const Portfolio = () => {
    const imagesToPreload = [devImage, WorkingOn];
    const isLoading = useImagePreloader(imagesToPreload, { timeout: 9000, minDuration: 1000 });

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const headerRef = useRef(null);
    const contactFormRef = useRef(null);

    const roles = [
        'Full Stack Developer',
        'Backend Engineer',
        'Frontend Specialist',
        'Software Developer',
        'Problem Solver',
        'Software Architect',
    ];
    const [currentRole, setCurrentRole] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentRole((p) => (p + 1) % roles.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // scroll / parallax
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
    const yTransform = useTransform(scrollYProgress, [0, 1], [0, -18]);
    const y = useSpring(yTransform, { stiffness: 60, damping: 18 });
    const rotateTransform = useTransform(scrollYProgress, [0, 1], [0, 4]);
    const rotate = useSpring(rotateTransform, { stiffness: 60, damping: 18 });

    const [isSticky, setIsSticky] = useState(false);
    useEffect(() => {
        const handleScroll = () => setIsSticky(window.scrollY > 100);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // contact form
    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };
    const handleContactSubmit = (e) => {
        e.preventDefault();
        if (contactFormRef.current) {
            const nameInput = contactFormRef.current.querySelector('input[type="text"]');
            const emailInput = contactFormRef.current.querySelector('input[type="email"]');
            const messageInput = contactFormRef.current.querySelector('textarea');

            let isValid = true;
            const inputs = [
                { input: nameInput, required: true, validation: () => true },
                { input: emailInput, required: true, validation: validateEmail },
                { input: messageInput, required: true, validation: () => true },
            ];

            inputs.forEach(({ input, required, validation }) => {
                if (required && (!input.value.trim() || !validation(input.value))) {
                    isValid = false;
                    input.style.boxShadow = '0 0 15px red';
                } else {
                    input.style.boxShadow = '0 0 15px var(--accent)';
                }
            });

            if (isValid) {
                alert('Thank you for your message! I will get back to you soon.');
                contactFormRef.current.reset();
            }
        }
    };

    const sectionVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } };
    const cardVariants = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } } };

    if (isLoading) return <SkeletonScreen />;

    return (
        <>
            <TargetCursor
                spinDuration={2}
                hideDefaultCursor={true}
                parallaxOn={true}
            />

            <GlobalCursor />
            <div className="mainBody bg-gray-900 text-white min-h-screen">
                {/* progress */}
                <motion.div className="fixed top-0 left-0 right-0 h-1 bg-purple-500 z-50 origin-[0%]" style={{ scaleX }} />

                {/* header */}
                <motion.header
                    ref={headerRef}
                    className={`flex justify-between items-center px-4 py-3 fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isSticky ? 'glass-morphism shadow-2xl backdrop-blur-md' : 'bg-transparent'
                        }`}
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                >
                    <HashLink smooth to="#home" className="cursor-target logo text-3xl font-bold text-white hover:text-purple-400 transition-colors">
                        nyt1sh<span className="text-purple-400">.</span>dev
                    </HashLink>

                    <div id="menu-icon" onClick={() => setIsMobileMenuOpen((s) => !s)} className=" text-4xl cursor-pointer md:hidden">
                        ≡
                    </div>

                    <nav
                        className={`md:flex ${isMobileMenuOpen ? 'active' : 'hidden'}   md:flex-row flex-col absolute md:relative top-full left-0 right-0 md:bg-transparent bg-gray-800 p-4 md:p-0 transition-all duration-300 ${isMobileMenuOpen ? 'glass-morphism' : ''
                            }`}
                    >
                        {['Home', 'About', 'Skills', 'Projects', 'Contact'].map((item) => {
                            const id = item === 'Contact' ? 'ContactSection' : item.toLowerCase();
                            return (
                                <HashLink
                                    key={id}
                                    smooth
                                    to={`#${id}`}
                                    className={`cursor-target text-xl font-medium mx-4 py-2 md:py-0 border-b md:border-b-0 border-gray-700 md:hover:text-purple-400 transition-colors ${item === 'Home' ? 'text-purple-400' : 'text-gray-300'
                                        }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item}
                                </HashLink>
                            );
                        })}
                    </nav>
                </motion.header>

                {/* HERO / HOME */}
                <motion.section
                    id="home"
                    className="home pt-20 pb-16  px-4 md:px-10 flex flex-col-reverse md:flex-row items-center md:items-end justify-between min-h-screen relative overflow-x-hidden"
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
                >
                    <div className="particle-container absolute inset-0 z-10 opacity-50" />

                    {/* Left textual column (on desktop left, on mobile below image) */}
                    <div className="home-content   w-full md:w-1/2 order-2 md:order-1 flex flex-col items-center md:items-start text-center md:text-left pt-8 md:pt-0">
                        <motion.h1
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-3 leading-tight"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.25 }}
                        >
                            Hi, I'm <span className="devName  text-7xl cursor-target  text-purple-400">Nitish Kumar</span>
                        </motion.h1>

                        <motion.div
                            className="mb-4 h-12 cursor-target  overflow-visible"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.45 }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.h3
                                    key={roles[currentRole]}
                                    className="text-2xl sm:text-3xl md:text-4xl text-gray-300 font-semibold whitespace-nowrap"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {roles[currentRole]}
                                </motion.h3>
                            </AnimatePresence>
                        </motion.div>

                        <span style={{ position: 'relative', overflow: 'hidden' }} className='h-full w-full'
                        >
                            <motion.p className="cursor-target  h-full  text-base sm:text-lg  text-gray-200 " initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.65 }}>
                                <Noise
                                    patternSize={50}
                                    patternScaleX={1}
                                    patternScaleY={1}
                                    patternRefreshInterval={2}
                                    patternAlpha={15}
                                />

                                Versatile developer fluent in C, C++, Java, and web stacks. I architect clean codebases, optimize algorithms, and build responsive UIs—bridging logic and creativity to engineer seamless, scalable systems.
                            </motion.p>
                        </span>

                        <motion.div className="social-links flex space-x-6 mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.85 }}>
                            <a href="https://github.com/Nyt1sh" target="_blank" rel="noreferrer" className="cursor-target text-3xl sm:text-4xl text-white hover:text-purple-400 transition-colors">
                                <BsGithub />
                            </a>
                            <a href="https://www.linkedin.com/in/Nyt1sh/" target="_blank" rel="noreferrer" className="cursor-target text-3xl sm:text-4xl text-white hover:text-purple-400 transition-colors">
                                <BsLinkedin />
                            </a>
                            <a href="mailto:nyt1sh.dev@gmail.com" className="cursor-target text-3xl sm:text-4xl text-white hover:text-purple-400 transition-colors">
                                <IoMdMail />
                            </a>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.05 }}>
                            <HashLink smooth to="#ContactSection" className="btn inline-block bg-purple-600 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-purple-700 transition-all duration-300">
                                Let's Connect
                            </HashLink>
                        </motion.div>
                    </div>

                    {/* Right: large circular profile (on desktop right, on mobile above text) */}
                    <motion.div
                        className="w-full mt-80 md:mt-[-200px] md:ml-20 md:scale-90  md:w-1/2 flex items-center justify-center md:justify-end order-1 md:order-2"
                        style={{ y, rotate }}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 60, damping: 16, delay: 0.7 }}
                    >
                        <div
                            className="relative group cursor-none md:cursor-auto"
                            onMouseMove={(e) => {
                                const g = document.getElementById('cursor-glow');
                                if (g) {
                                    g.style.left = `${e.clientX}px`;
                                    g.style.top = `${e.clientY}px`;
                                    g.style.opacity = '1';
                                }
                            }}
                            onMouseLeave={() => {
                                const g = document.getElementById('cursor-glow');
                                if (g) g.style.opacity = '0';
                            }}
                            aria-hidden={false}
                        >
                            <div
                                id="cursor-glow"
                                className="pointer-events-none fixed top-0 left-0 w-28 h-28 rounded-full bg-purple-500/20 blur-3xl opacity-0 transition-opacity duration-200"
                                style={{ transform: 'translate(-50%,-50%)' }}
                            />

                            <div
                                className="relative rounded-full overflow-hidden"
                                style={{
                                    width: 'min(60vw, 520px)',
                                    height: 'min(60vw, 520px)',
                                    maxWidth: '620px',
                                    maxHeight: '620px',
                                    minWidth: '140px',
                                    minHeight: '140px',
                                    marginTop: 0,
                                }}
                            >
                                <motion.div
                                    className="absolute inset-0 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    initial={{ scale: 0.96 }}
                                    whileHover={{ scale: 1.12 }}
                                    transition={{ duration: 0.38, ease: 'easeOut' }}
                                    style={{
                                        background: 'conic-gradient(from 0deg, #a78bfa, #7c3aed, #fb7185, #a78bfa)',
                                        filter: 'blur(14px)',
                                        zIndex: 5,
                                    }}
                                    aria-hidden
                                />

                                <svg viewBox="0 0 400 400" className="relative z-10 w-full h-auto block">
                                    <defs>
                                        <clipPath id="heroCircle">
                                            <circle cx="200" cy="200" r="180" />
                                        </clipPath>
                                        <linearGradient id="heroStrokeGrad" x1="0" x2="1">
                                            <stop offset="0%" stopColor="#a78bfa" />
                                            <stop offset="50%" stopColor="#7c3aed" />
                                            <stop offset="100%" stopColor="#fb7185" />
                                        </linearGradient>
                                    </defs>

                                    <g clipPath="url(#heroCircle)" >
                                        <image href={devImage} width="400" height="400" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Nitish Kumar" />
                                    </g>

                                    <motion.circle
                                        cx="200"
                                        cy="200"
                                        r="186"
                                        fill="none"
                                        stroke="url(#heroStrokeGrad)"
                                        strokeWidth="6"
                                        strokeLinecap="round"
                                        initial={{ strokeDashoffset: 1400 }}
                                        animate={{ strokeDashoffset: 0 }}
                                        transition={{ duration: 1.4, ease: 'easeOut' }}
                                        className="drop-shadow-[0_0_30px_rgba(139,92,246,0.35)]"
                                    />
                                </svg>

                                <div className="absolute inset-[6%] rounded-full pointer-events-none" style={{ boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.12)', zIndex: 15 }} />
                                <div className="absolute inset-0 rounded-full pointer-events-none" style={{ background: 'linear-gradient(120deg, rgba(255,255,255,0.06), rgba(255,255,255,0))', mixBlendMode: 'overlay', zIndex: 16 }} />
                            </div>
                        </div>
                    </motion.div>
                </motion.section >

                {/* ABOUT SECTION (added and responsive) */}
                {/* < motion.section className="about py-16 md:py-24 px-4 md:px-10" id="about" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }
                } variants={sectionVariants} >
                    <h2 className="cursor-target heading text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10">
                        About <span className="text-purple-400">Me</span>
                    </h2>

                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <motion.div className="cursor-target about-img w-full rounded-xl overflow-hidden shadow-xl" variants={cardVariants}>
                            <img src={WorkingOn} alt="Working on code" className="w-full h-auto object-cover" />
                        </motion.div>

                        <motion.div className="about-text w-full" variants={cardVariants}>
                            <h3 className="cursor-target text-2xl md:text-3xl font-semibold mb-4 text-purple-300">Passionate Full-Stack Developer</h3>
                            <p className="cursor-target text-gray-400 mb-4">

                                I'm a self-driven developer with a strong foundation in software engineering and a deep passion for building purposeful digital solutions.
                                I approach every project with curiosity, precision, and a hunger to turn ideas into real, working systems.
                            </p>
                            <p className="cursor-target text-gray-400 mb-6">
                                Always evolving, I believe in writing clean, efficient code that balances logic with design. My journey is powered by continuous learning, creative thinking,
                                and a commitment to delivering seamless user experiences across platforms.
                            </p>

                            <div className="flex flex-wrap gap-3">
                                <a href="#" className="cursor-target btn inline-block border border-purple-600 text-purple-400 px-6 py-2 rounded-full text-sm font-semibold hover:bg-purple-600 hover:text-white transition-all duration-300">Download CV</a>
                            </div>
                        </motion.div>
                    </div>
                </motion.section > */}

                <AboutSection

                    sectionVariants={sectionVariants} cardVariants={cardVariants}

                    WorkingOn={WorkingOn} />

                <hr className="border-gray-700 mx-auto w-4/5" />

                {/* SKILLS */}
                {/* <motion.section className="skills py-24 px-4 md:px-10" id="skills" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={sectionVariants}>
                    <h2 className="cursor-target heading text-4xl md:text-5xl font-bold text-center mb-16">
                        My <span className="text-purple-400">Skills</span>
                    </h2>

                    <div className="skills-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                       
                        {[
                            { title: 'Back-End', desc: 'Expertise in server-side development with focus on scalable and maintainable solutions.', list: ['C# ASP.NET Core', 'Java', 'PHP', 'node & express.js', '.NET Framework'] },
                            { title: 'Front-End', desc: 'Creating modern and responsive user interfaces with the latest technologies.', list: ['HTML/CSS', 'React', 'Framer Motion', 'Bootstrap & Tailwind', 'JavaScript', 'TypeScript'] },
                            { title: 'Software Architecture', desc: 'Designing robust systems with best practices and patterns.', list: ['MVC', 'Clean Code Principles', 'Monolothic & Modular Designs'] },
                            { title: 'Programming & Scripting', desc: 'Writing logic that breathes life into machines, solving problems with the elegance of code and the power of algorithms.', list: ['C / C++', 'js', 'Java', 'C#', 'DSA'] },
                            { title: 'Databases', desc: 'Working with various database systems for efficient data storage and retrieval.', list: ['SQL Server', 'MySQL', 'MongoDB', 'Oracle'] },
                            { title: 'Tools & Utilities', desc: 'Effective team collaboration and project management skills.', list: ['Git & GitHub', 'Jira', 'Kali Linux & Ethical Basics', 'Termux'] },
                        ].map((skill, index) => (
                            <motion.div key={index} className="skills-box p-8 glass-morphism border-t-4 border-purple-500 transform hover:scale-[1.02] transition-transform duration-300" variants={cardVariants} transition={{ duration: 0.6, delay: index * 0.1 }}>
                                <h3 className="cursor-target text-2xl font-bold mb-3 text-purple-200">{skill.title}</h3>
                                <p className="cursor-target text-gray-400 mb-4">{skill.desc}</p>
                                <div className="skills-list flex flex-wrap gap-2">
                                    {skill.list.map((item, i) => (
                                        <span key={i} className="cursor-target px-3 py-1 bg-gray-700 text-purple-300 text-sm rounded-full shadow-md">{item}</span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section> */}

                <SkillsSection

                    sectionVariants={sectionVariants}

                    cardVariants={cardVariants}

                />


                <hr className="border-gray-700 mx-auto w-4/5" />

                {/* PROJECTS */}
                {/* <motion.section className="projects py-24 px-4 md:px-10" id="projects" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={sectionVariants}>
                    <h2 className="cursor-target heading text-4xl md:text-5xl font-bold text-center mb-16">
                        Recent <span className="text-purple-400">Projects</span>
                    </h2>

                    <div className="projects-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: 'E-Commerce Platform', desc: 'Full-stack e-commerce solution with C# and React, implementing microservices architecture.' },
                            { title: 'CRM System', desc: 'Customer relationship management system built with ASP.NET Core and Angular.' },
                            { title: 'Task Management App', desc: 'Collaborative task management platform using CQRS pattern and Vue.js.' },
                            { title: 'Inventory System', desc: 'Real-time inventory tracking system with ASP.NET Core and SignalR.' },
                            { title: 'Analytics Dashboard', desc: 'Interactive analytics dashboard with C# backend and React/D3.js frontend.' },
                            { title: 'Health Monitoring System', desc: 'IoT-based health monitoring solution with microservices architecture.' },
                        ].map((project, index) => (
                            <motion.div key={index} className="cursor-target projects-box relative overflow-hidden rounded-lg shadow-xl cursor-pointer glass-morphism group" variants={cardVariants} transition={{ duration: 0.6, delay: index * 0.1 }} whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(168, 85, 247, 0.5)' }}>
                                <img src={WorkingOn} alt={`Project ${index + 1}`} className="w-full h-48 object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="projects-layer absolute inset-0 bg-gray-900 bg-opacity-90 flex flex-col justify-center items-center p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                    <h4 className="text-2xl font-bold mb-3 text-purple-400">{project.title}</h4>
                                    <p className="text-gray-300 text-center mb-4">{project.desc}</p>
                                    <a href="#" className="text-3xl text-purple-400 hover:text-white transition-colors"><span>→</span></a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section> */}

                <ProjectsSection

                    sectionVariants={sectionVariants} cardVariants={cardVariants} WorkingOn={WorkingOn}

                />

                <hr className="border-gray-700 mx-auto w-4/5" />

                {/* CONTACT */}
                {/* <motion.section className="contact py-24 px-4 md:px-10" id="ContactSection" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={sectionVariants}>
                    <h2 className="cursor-target heading text-4xl md:text-5xl font-bold text-center mb-16">
                        Contact <span className="text-purple-400">Me</span>
                    </h2>

                    <form onSubmit={handleContactSubmit} ref={contactFormRef} className="max-w-3xl mx-auto space-y-6 p-8 glass-morphism">
                        <motion.div className="input-box flex flex-col md:flex-col gap-6" variants={cardVariants}>
                            <input type="text" placeholder="Full Name" className="w-full p-4 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300" />
                            <input type="email" placeholder="Email Address" className="w-full  p-4 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300" />
                        </motion.div>

                        <motion.div className="input-box flex flex-col md:flex-col gap-6" variants={cardVariants}>
                            <input type="tel" placeholder="Phone Number" className="w-full  p-4 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300" />
                            <input type="text" placeholder="Subject" className="w-full  p-4 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300" />
                        </motion.div>

                        <motion.textarea cols="30" rows="10" placeholder="Your Message" className="w-full p-4 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300" variants={cardVariants} />

                        <motion.input type="submit" value="Send Message" className="cursor-target btn w-full bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-purple-700 transition-all duration-300 cursor-pointer transform hover:scale-[1.01]" whileHover={{ scale: 1.01, boxShadow: '0 0 25px rgba(168, 85, 247, 0.8)' }} whileTap={{ scale: 0.98 }} />
                    </form>
                </motion.section> */}

                <ContactSection
                    sectionVariants={sectionVariants} cardVariants={cardVariants}
                    handleContactSubmit={handleContactSubmit} contactFormRef={contactFormRef}

                />
            </div >
        </>
    );
};

export default Portfolio;
