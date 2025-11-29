import React, { useRef, useState } from "react";
import { apiPost } from "../api/axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiUser,
  FiMessageCircle,
} from "react-icons/fi";
import { FaGithub, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import emailjs from "@emailjs/browser";



const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;


const OTP_STORAGE_KEY = "portfolio_contact_otp";

const ContactSection = ({ sectionVariants, cardVariants }) => {
  const formRef = useRef(null);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const nameInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    const phoneInput = form.querySelector('input[type="tel"]');
    const subjectInput = form.querySelector(
      'input[placeholder="Project discussion, feedback, etc."]'
    );
    const messageInput = form.querySelector("textarea");

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

    // --- FRONTEND OTP FLOW STARTS HERE ---
    try {
      setIsSendingOtp(true);

      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();


      const otpData = {
        otp: generatedOtp,
        email: payload.email,
        payload, 
        expiresAt: Date.now() + 10 * 60 * 1000, 
      };
      localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otpData));


      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      const timeString = expiresAt.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: payload.email,          
          passcode: generatedOtp,           
          time: timeString,                 
          name: payload.name || "there",    
        },
        EMAILJS_PUBLIC_KEY
      );

      setPendingPayload(payload);
      setShowOtpModal(true);
      toast.success(
        "OTP sent to your email. Please check your inbox (or spam) and enter the code."
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to send OTP email. Please try again.");
      localStorage.removeItem(OTP_STORAGE_KEY);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!pendingPayload) {
      toast.error("Something went wrong. Please submit the form again.");
      return;
    }
    if (!otp.trim()) {
      toast.error("Enter the OTP.");
      return;
    }

    setIsVerifying(true);
    try {
      const raw = localStorage.getItem(OTP_STORAGE_KEY);
      if (!raw) {
        toast.error("No OTP session found. Please request a new OTP.");
        return;
      }

      let stored;
      try {
        stored = JSON.parse(raw);
      } catch {
        toast.error("Invalid OTP session. Please try again.");
        localStorage.removeItem(OTP_STORAGE_KEY);
        return;
      }

      // Basic checks
      if (stored.email !== pendingPayload.email) {
        toast.error("Email mismatch. Please request OTP again.");
        return;
      }

      if (Date.now() > stored.expiresAt) {
        toast.error("OTP expired. Please request a new one.");
        localStorage.removeItem(OTP_STORAGE_KEY);
        return;
      }

      if (stored.otp !== otp.trim()) {
        toast.error("Invalid OTP. Please check and try again.");
        return;
      }

      // ✅ OTP OK → send message to backend
      await apiPost("/api/contact", stored.payload);

      toast.success("Message sent successfully! I'll get back to you soon.");
      formRef.current?.reset();
      setPendingPayload(null);
      setOtp("");
      setShowOtpModal(false);
      localStorage.removeItem(OTP_STORAGE_KEY);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while sending your message.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <motion.section
      id="ContactSection"
      className="relative contact py-24 px-4 md:px-10 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      {/* Background gradient + blobs for liquid look */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black" />
      <div className="pointer-events-none absolute -top-32 -left-10 w-72 h-72 bg-purple-500/40 blur-3xl rounded-full" />
      <div className="pointer-events-none absolute -bottom-40 right-0 w-80 h-80 bg-fuchsia-500/40 blur-3xl rounded-full" />

      <div className="relative max-w-6xl mx-auto">
        <h2 className="cursor-target heading text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-14">
          Contact <span className="text-purple-400">Me</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-10 items-stretch">
          {/* LEFT: Info / social card */}
          <motion.div
            variants={cardVariants}
            className="relative glass-morphism rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 md:p-9 shadow-[0_18px_60px_rgba(15,23,42,0.7)] flex flex-col justify-between"
          >
            <div>
              <p className="cursor-target text-sm uppercase tracking-[0.2em] text-purple-300/80 mb-3">
                Let&apos;s connect
              </p>
              <h3 className="cursor-target text-2xl md:text-3xl font-semibold text-white mb-4">
                I&apos;m always open to new ideas, projects and collaborations.
              </h3>
              <p className="cursor-target text-sm md:text-base text-slate-300/90 mb-8">
                Whether you have a question, a project in mind, or just want to
                say hi, drop a message and I&apos;ll get back to you as soon as
                I can.
              </p>

              <div className="space-y-4 mb-8">
                <div className="cursor-target flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-400/40">
                    <FiMail className="text-purple-200 text-lg" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400">
                      Email
                    </p>
                    <p className="text-sm md:text-base text-slate-100">
                      nyt1sh.dev@gmail.com
                    </p>
                  </div>
                </div>

                <div className="cursor-target flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-400/40">
                    <FiPhone className="text-purple-200 text-lg" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400">
                      Phone
                    </p>
                    <p className="text-sm md:text-base text-slate-100">
                      +91-8228969487
                    </p>
                  </div>
                </div>

                <div className="cursor-target flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-400/40">
                    <FiMapPin className="text-purple-200 text-lg" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400">
                      Location
                    </p>
                    <p className="text-sm md:text-base text-slate-100">
                      Giridih, Jharkhand, India (IST)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social icons */}
            <div className="border-t border-white/10 pt-6 mt-2 flex items-center justify-between gap-4 flex-wrap">
              <p className="text-xs text-slate-400">
                Or reach out via social platforms
              </p>
              <div className="flex gap-3">
                <a
                  href="https://github.com/Nyt1sh"
                  className="cursor-target h-9 w-9 rounded-full border border-white/20 bg-white/5 flex items-center justify-center hover:bg-purple-500/70 hover:border-purple-300 transition-all duration-300"
                >
                  <FaGithub className="text-slate-100 text-lg" />
                </a>
                <a
                  href="https://www.linkedin.com/in/nyt1sh/"
                  className="cursor-target  h-9 w-9 rounded-full border border-white/20 bg-white/5 flex items-center justify-center hover:bg-purple-500/70 hover:border-purple-300 transition-all duration-300"
                >
                  <FaLinkedinIn className="text-slate-100 text-lg" />
                </a>
                <a
                  href="https://www.instagram.com/enable.c0ding/"
                  className="cursor-target h-9 w-9 rounded-full border border-white/20 bg-white/5 flex items-center justify-center hover:bg-purple-500/70 hover:border-purple-300 transition-all duration-300"
                >
                  <FaInstagram className="text-slate-100 text-lg" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Glass form */}
          <motion.form
            onSubmit={handleSubmit}
            ref={formRef}
            variants={cardVariants}
            className="glass-morphism relative max-w-xl lg:max-w-none w-full mx-auto rounded-3xl border border-white/10 bg-white/10 backdrop-blur-3xl px-6 py-7 md:px-8 md:py-9 shadow-[0_18px_60px_rgba(15,23,42,0.7)] space-y-5"
          >
            {/* Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                  <FiUser className="text-purple-300" />
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300/80 text-sm" />
                  <input
                    type="text"
                    placeholder="Radhe Mohan"
                    className="cursor-target w-full rounded-2xl bg-white/5 border border-white/15 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 outline-none text-sm md:text-base text-slate-50 placeholder:text-slate-400 px-9 py-2.5 md:py-3 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                  <FiMail className="text-purple-300" />
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300/80 text-sm" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full cursor-target  rounded-2xl bg-white/5 border border-white/15 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 outline-none text-sm md:text-base text-slate-50 placeholder:text-slate-400 px-9 py-2.5 md:py-3 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Phone + Subject */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                  <FiPhone className="text-purple-300" />
                  Phone Number
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300/80 text-sm" />
                  <input
                    type="tel"
                    placeholder="+91-XXXXX-XXXXX"
                    className="w-full cursor-target rounded-2xl bg-white/5 border border-white/15 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 outline-none text-sm md:text-base text-slate-50 placeholder:text-slate-400 px-9 py-2.5 md:py-3 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                  <FiMessageCircle className="text-purple-300" />
                  Subject
                </label>
                <div className="relative">
                  <FiMessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300/80 text-sm" />
                  <input
                    type="text"
                    placeholder="Project discussion, feedback, etc."
                    className="w-full cursor-target rounded-2xl bg-white/5 border border-white/15 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 outline-none text-sm md:text-base text-slate-50 placeholder:text-slate-400 px-9 py-2.5 md:py-3 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                <FiMessageCircle className="text-purple-300" />
                Your Message
              </label>
              <div className="relative">
                <FiMessageCircle className="absolute left-3 top-3 text-purple-300/80 text-sm" />
                <textarea
                  rows="4"
                  placeholder="Tell me a bit about what you’re looking for..."
                  className="w-full cursor-target rounded-2xl bg-white/5 border border-white/15 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 outline-none text-sm md:text-base text-slate-50 placeholder:text-slate-400 px-9 py-3 md:py-3.5 transition-all duration-200 resize-none"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isSendingOtp}
              whileHover={{ scale: isSendingOtp ? 1 : 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-blue-500 text-white text-sm md:text-base font-semibold py-3 md:py-3.5 px-6 shadow-lg shadow-purple-500/40 hover:shadow-purple-500/60 transition-all duration-300 cursor-pointer disabled:opacity-60"
            >
              <FiSend className="text-lg" />
              {isSendingOtp ? "Sending OTP…" : "Send Message"}
            </motion.button>
          </motion.form>
        </div>
      </div>

      {showOtpModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-purple-500/40 rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-semibold mb-2 text-white">
              Verify your email
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              We&apos;ve sent a 6-digit code to{" "}
              <span className="font-mono text-purple-300">
                {pendingPayload?.email}
              </span>
              . Enter it below to verify and send your message.
            </p>

            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full text-center tracking-[0.6em] text-lg font-semibold bg-gray-800 border border-purple-500/40 rounded-xl px-3 py-2 mb-4 outline-none"
              placeholder="••••••"
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowOtpModal(false);
                  setPendingPayload(null);
                  setOtp("");
                }}
                className="px-3 py-1.5 text-sm rounded-lg bg-gray-700 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isVerifying}
                onClick={handleVerifyOtp}
                className="px-4 py-1.5 text-sm rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-60"
              >
                {isVerifying ? "Verifying..." : "Verify & Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default ContactSection;
