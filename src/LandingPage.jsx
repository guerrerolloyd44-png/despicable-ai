import React, { useState } from 'react';
import { Menu, X, ArrowLeft } from 'lucide-react';
import heroImg from './assets/background minion.jpg';

const LandingPage = ({ onStart }) => {
    // "home" | "about" | "contact"
    const [page, setPage] = useState("home");

    // ── HOME / LANDING ──────────────────────────────────────────────────
    if (page === "home") {
        return (
            <div className="relative w-full h-screen flex flex-col overflow-hidden bg-[#0c0c1a] font-['M_PLUS_1p'] font-bold">

                {/* ── TOP BAR ── */}
                <header className="relative z-30 flex items-center justify-between px-6 md:px-10 py-4">
                    <h1 className="text-[#FF5C00] text-2xl md:text-5xl font-black italic tracking-tighter uppercase leading-none drop-shadow-lg">
                        Despicable -AI
                    </h1>
                    <div className="flex items-center gap-6">
                        <nav className="hidden md:flex items-center gap-6 text-[11px] uppercase tracking-[0.2em]">
                            <button onClick={() => setPage("about")} className="text-white/70 hover:text-white transition-colors">About</button>
                            <button onClick={() => setPage("contact")} className="text-white/70 hover:text-white transition-colors">Contact</button>
                        </nav>
                        {/* Mobile hamburger that opens about */}
                        <button onClick={() => setPage("about")} className="md:hidden text-white">
                            <Menu size={28} />
                        </button>
                    </div>
                </header>

                {/* ── HERO IMAGE ── */}
                <div className="relative flex-grow flex flex-col">
                    <div className="absolute inset-0 z-0">
                        <img
                            src={heroImg}
                            alt="Despicable AI Hero"
                            className="w-full h-full object-cover object-center"
                        />
                        {/* Bottom fade to dark */}
                        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c1a]/40 via-transparent to-[#0c0c1a]" />
                    </div>

                    {/* ── CTA SECTION (bottom) ── */}
                    <div className="relative z-20 mt-auto flex flex-col items-center pb-12 md:pb-16">
                        <p className="text-white/80 text-[11px] md:text-[13px] uppercase tracking-[0.35em] mb-4 font-black">
                            Talk to a Minion
                        </p>
                        <button
                            onClick={onStart}
                            className="
                relative px-10 md:px-14 py-3 md:py-4 rounded-full
                bg-white/10 backdrop-blur-xl border border-white/20
                text-white text-base md:text-lg font-black italic tracking-wider uppercase
                hover:bg-white/20 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,92,0,0.3)]
                active:scale-95 transition-all duration-300
                group
              "
                        >
                            <span className="relative z-10">Start chat!</span>
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF5C00]/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── ABOUT PAGE ──────────────────────────────────────────────────────
    if (page === "about") {
        return (
            <div className="relative w-full h-screen flex flex-col overflow-y-auto bg-[#0c0c1a] font-['M_PLUS_1p'] font-bold">

                {/* Background */}
                <div className="fixed inset-0 z-0">
                    <img
                        src={heroImg}
                        alt=""
                        className="w-full h-full object-cover object-center opacity-30"
                    />
                    <div className="absolute inset-0 bg-[#0c0c1a]/80" />
                </div>

                {/* ── TOP NAV ── */}
                <header className="relative z-30 flex items-center justify-between px-6 md:px-10 py-5">
                    <button onClick={() => setPage("home")} className="flex items-center gap-2 text-white/70 hover:text-white text-[11px] uppercase tracking-widest transition-colors">
                        <ArrowLeft size={16} /> Back
                    </button>
                    <span className="text-white/70 text-[11px] uppercase tracking-widest">About</span>
                </header>

                {/* ── CONTENT ── */}
                <div className="relative z-10 flex-grow flex flex-col items-center px-6 md:px-16 pb-16">
                    {/* Big title */}
                    <h2 className="text-[#FFD700] text-5xl md:text-8xl font-black italic uppercase tracking-tighter text-center mb-8 md:mb-12 drop-shadow-[0_0_40px_rgba(255,215,0,0.3)]"
                        style={{ textShadow: '0 0 60px rgba(255,215,0,0.2), 0 4px 0 #b8860b' }}>
                        Minions
                    </h2>

                    {/* Description block */}
                    <div className="max-w-3xl w-full">
                        <p className="text-white/90 text-[12px] md:text-[14px] leading-[1.8] md:leading-[2] tracking-wide text-justify">
                            <span className="text-[#FFD700] font-black">Despicable-AI</span> is a specialized, character-centric conversational platform designed to provide an immersive
                            role-playing experience by bringing the beloved yellow henchmen from the Despicable Me
                            universe to life through advanced AI. The interface is meticulously crafted for fans, featuring
                            a sleek, dark-themed UI and cinematic backgrounds that place the user directly into the world
                            of the Minions. Through a dynamic sidebar, users can select their preferred companion based on
                            distinct personality archetypes: they can choose <span className="text-[#FFD700]">Bob</span> for a 'Sweet & Innocent' interaction,{' '}
                            <span className="text-[#9B59B6]">Stuart</span> for a 'Chill & Sarcastic' vibe, or <span className="text-[#4A90D9]">Kevin</span> for a 'Brave & Heroic'
                            experience. When interacting with Kevin, the 'Leader' persona is fully realized through high-energy,
                            authoritative dialogue that seamlessly blends English with iconic Minion-ese phrases like "Bello"
                            and "Para tú!" To further enhance the immersion, the platform utilizes specific personality
                            tags—such as "Confident," "Loyal," and "Brave"—and an action-oriented input bar that encourages
                            users to "Report to Kevin, leader!" This attention to detail ensures that the chatbot goes beyond
                            simple text generation, functioning instead as a digital playground where users can brainstorm,
                            magnificent rockets, and embark on imaginary missions, perfectly capturing the chaotic energy and
                            endearing humor of the original films.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ── CONTACT PAGE ────────────────────────────────────────────────────
    if (page === "contact") {
        return (
            <div className="relative w-full h-screen flex flex-col overflow-hidden bg-[#0c0c1a] font-['M_PLUS_1p'] font-bold">

                {/* Background */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={heroImg}
                        alt=""
                        className="w-full h-full object-cover object-center opacity-40"
                    />
                    <div className="absolute inset-0 bg-[#0c0c1a]/70" />
                </div>

                {/* ── TOP NAV ── */}
                <header className="relative z-30 flex items-center justify-between px-6 md:px-10 py-5">
                    <button onClick={() => setPage("home")} className="flex items-center gap-2 text-white/70 hover:text-white text-[11px] uppercase tracking-widest transition-colors">
                        <ArrowLeft size={16} /> Back
                    </button>
                    <span className="text-white/70 text-[11px] uppercase tracking-widest">Contact</span>
                </header>

                {/* ── CONTACT CARD ── */}
                <div className="relative z-10 flex-grow flex items-center justify-center px-6">
                    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 md:p-12 max-w-md w-full shadow-2xl">
                        <h2 className="text-[#FFD700] text-2xl md:text-3xl font-black italic uppercase tracking-tight mb-8">
                            Contact
                        </h2>
                        <div className="space-y-5">
                            <div>
                                <p className="text-white/50 text-[9px] uppercase tracking-widest mb-1">Email</p>
                                <p className="text-white font-bold text-[14px] md:text-[16px] tracking-wide">
                                    Guerrerolloyd44@gmail.com
                                </p>
                            </div>
                            <div>
                                <p className="text-white/50 text-[9px] uppercase tracking-widest mb-1">Number</p>
                                <p className="text-white font-bold text-[14px] md:text-[16px] tracking-wide">
                                    09165427691
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default LandingPage;
