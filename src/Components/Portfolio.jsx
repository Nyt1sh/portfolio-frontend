// src/Components/Portfolio.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { apiPost } from "../api/axios";
import toast from "react-hot-toast";

import TargetCursor from './ReactBits/TargetCursor';
import Noise from './ReactBits/Noise';
import '../CSS/Portfolio.css'
import SkillsSection from './SkillsSection.jsx'
import AboutSection from './AboutSection.jsx'
import { useNavigate } from "react-router-dom";
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
// import useImagePreloader from '../hooks/useImagePreloader'; // Uncomment if needed

import '../CSS/Portfolio.css';
// import devImage from '../Images/devImage.JPG';
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
    const navigate = useNavigate();
    const handleNameDoubleClick = () => navigate("/admin/login");

    const sectionVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } };
    const cardVariants = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } } };

    // --- DYNAMIC HERO CONTENT LOGIC START ---
    const UNIVERSAL_IMAGE_FALLBACK = "https://placehold.co/400x400/3730a3/ffffff/svg?text=Loading+Image";
    const [heroDescription, setHeroDescription] = useState("");
    const [heroImageUrl, setHeroImageUrl] = useState(UNIVERSAL_IMAGE_FALLBACK);
    const [isContentLoading, setIsContentLoading] = useState(true);

    // Base URL for content fetching
    const BASE_CONTENT_URL = "https://nyt1sh-portfolio.up.railway.app/api/content/hero";

    const fetchHeroContent = useCallback(async () => {
        try {
            // --- 1. Fetch Description ---
            let response = await fetch(`${BASE_CONTENT_URL}/description`);
            if (response.ok) {
                const text = await response.text();
                setHeroDescription(text);
            } else {
                // Fallback for failed description fetch
                setHeroDescription("Experienced developer building reliable, scalable software solutions. (Error loading description)");
            }

            // --- 2. Fetch Image URL ---
            response = await fetch(`${BASE_CONTENT_URL}/image-url`);
            if (response.ok) {
                const raw = (await response.text()).trim();
                const finalUrl = raw
                    ? (raw.startsWith("http") ? raw : `https://nyt1sh-portfolio.up.railway.app${raw}`)
                    : UNIVERSAL_IMAGE_FALLBACK;
                setHeroImageUrl(finalUrl);
            } else {
                setHeroImageUrl(UNIVERSAL_IMAGE_FALLBACK);
            }


        } catch (error) {
            console.error("Error fetching hero content:", error);
            setHeroDescription("Experienced developer building reliable, scalable software solutions. Bridging logic and creativity to engineer seamless systems.");
            setHeroImageUrl(UNIVERSAL_IMAGE_FALLBACK);
        } finally {
            setIsContentLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHeroContent();
    }, [fetchHeroContent]);

    const isLoading = false || isContentLoading;

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

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        if (!contactFormRef.current) return;

        const form = contactFormRef.current;

        const nameInput = form.querySelector('input[type="text"]');         
        const emailInput = form.querySelector('input[type="email"]');       
        const messageInput = form.querySelector('textarea');                

        const phoneInput = form.querySelector('input[type="tel"]');          
        const subjectInput = form.querySelector(
            'input[placeholder="Project discussion, feedback, etc."]'       
        );

        let isValid = true;
        const inputs = [
            { input: nameInput, required: true, validation: () => true },
            { input: emailInput, required: true, validation: validateEmail },
            { input: messageInput, required: true, validation: () => true },
        ];

        inputs.forEach(({ input, required, validation }) => {
            if (required && (!input.value.trim() || !validation(input.value))) {
                isValid = false;
                input.style.boxShadow = "0 0 15px red";
            } else {
                input.style.boxShadow = "0 0 15px var(--accent)";
            }
        });

        if (!isValid) {
            toast.error("Please fill the form correctly.");
            return;
        }

        const payload = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput?.value.trim() || "",
            subject: subjectInput?.value.trim() || "",
            message: messageInput.value.trim(),
        };

        try {
            await apiPost("/api/contact", payload); 
            toast.success("Message sent! I'll get back to you soon.");
            form.reset();
        } catch (err) {
            console.error(err);
            toast.error("Failed to send message. Please try again.");
        }
    };


    if (isLoading) return <SkeletonScreen />;

    
    return (
        <>
            <TargetCursor spinDuration={2} hideDefaultCursor={true} parallaxOn={true} />
            <GlobalCursor />

            <div className="mainBody bg-gray-900 text-white min-h-screen">
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

                    {/* Left textual column */}
                    <div className="home-content   w-full md:w-1/2 order-2 md:order-1 flex flex-col items-center md:items-start text-center md:text-left pt-8 md:pt-0">
                        <motion.h1
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-3 leading-tight"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.25 }}
                        >
                            Hi, I'm <span onDoubleClick={handleNameDoubleClick} className="devName  text-7xl cursor-target  text-purple-400">
                                Nitish Kumar</span>
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

                                {/* Versatile developer fluent in C, C++, Java, and web stacks. I architect clean codebases, optimize algorithms, and build responsive UIs—bridging logic and creativity to engineer seamless, scalable systems. */}
                                {heroDescription}
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

                    {/* Right: large circular profile */}
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
                                        {/* <image href={devImage} width="400" height="400" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Nitish Kumar" /> */}
                                        <image href={heroImageUrl} width="400" height="400" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Nitish Kumar" />
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

                <AboutSection sectionVariants={sectionVariants} cardVariants={cardVariants} WorkingOn={WorkingOn} />
                <hr className="border-gray-700 mx-auto w-4/5" />
                <SkillsSection sectionVariants={sectionVariants} cardVariants={cardVariants} />
                <hr className="border-gray-700 mx-auto w-4/5" />
                <ProjectsSection sectionVariants={sectionVariants} cardVariants={cardVariants} WorkingOn={WorkingOn} />
                <hr className="border-gray-700 mx-auto w-4/5" />
                <ContactSection
                    sectionVariants={sectionVariants}
                    cardVariants={cardVariants}
                />

            </div>
        </>
    );
};

export default Portfolio;