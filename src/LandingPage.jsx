import React, { useState } from 'react';
import { Menu, X, ArrowLeft } from 'lucide-react';
import heroImg from './assets/background minion.jpg';

const LandingPage = ({ onStart }) => {
    // "home" | "about" | "contact"
    const [page, setPage] = useState("home");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navigateTo = (p) => {
        setPage(p);
        setIsMenuOpen(false);
    };

    // ── MOBILE MENU OVERLAY ─────────────────────────────────────────────
    const MobileMenu = () => (
        <div className={`fixed inset-0 z-50 bg-[#0c0c1a] transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col p-8`}>
            <div className="flex justify-end">
                <button onClick={toggleMenu} className="text-white"><X size={32} /></button>
            </div>
            <nav className="flex flex-col gap-8 mt-12 text-2xl font-black italic uppercase tracking-widest">
                <button onClick={() => navigateTo("home")} className="text-[#FF5C00] text-left">Home</button>
                <button onClick={() => navigateTo("about")} className="text-white text-left">About</button>
                <button onClick={() => navigateTo("contact")} className="text-white text-left">Contact</button>
            </nav>
        </div>
    );

    // ── HOME / LANDING ──────────────────────────────────────────────────
    if (page === "home") {
        return (
            <div className="relative w-full h-[100dvh] flex flex-col overflow-hidden bg-[#0c0c1a] font-['M_PLUS_1p'] font-bold">
                <MobileMenu />

                {/* ── TOP BAR ── */}
                <header className="relative z-30 bg-black flex items-center justify-between px-6 md:px-10 py-4">
                    <h1 className="text-[#FF5C00] text-xl md:text-5xl font-black italic tracking-tighter uppercase leading-none drop-shadow-lg">
                        Despicable-AI
                    </h1>
                    <div className="flex items-center gap-6">
                        <nav className="hidden md:flex items-center gap-10 text-[11px] uppercase tracking-[0.2em]">
                            <button onClick={() => setPage("about")} className="text-white hover:text-[#FF5C00] transition-colors">About</button>
                            <button onClick={() => setPage("contact")} className="text-white hover:text-[#FF5C00] transition-colors">Contact</button>
                        </nav>
                        <button onClick={toggleMenu} className="md:hidden text-white">
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
                            className="w-full h-full object-cover object-center scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c1a]/40 via-transparent to-[#0c0c1a]" />
                    </div>

                    {/* ── CTA SECTION ── */}
                    <div className="relative z-20 mt-auto flex flex-col items-center pb-10 md:pb-16 px-6 text-center">
                        <p className="text-white/80 text-[10px] md:text-[13px] uppercase tracking-[0.35em] mb-4 font-black">
                            Talk to a Minion
                        </p>
                        <button
                            onClick={onStart}
                            className="
                                relative w-full max-w-[280px] md:max-w-none md:w-auto px-10 md:px-14 py-4 md:py-4 rounded-full
                                bg-white/10 backdrop-blur-xl border border-white/20
                                text-white text-base md:text-lg font-black italic tracking-wider uppercase
                                hover:bg-white/20 active:scale-95 transition-all duration-300
                                group overflow-hidden
                            "
                        >
                            <span className="relative z-10">Start chat!</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#FF5C00]/40 to-purple-500/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── ABOUT PAGE ──────────────────────────────────────────────────────
    if (page === "about") {
        return (
            <div className="relative w-full min-h-screen flex flex-col bg-[#0c0c1a] font-['M_PLUS_1p'] font-bold">
                <div className="fixed inset-0 z-0">
                    <img
                        src="https://static0.moviewebimages.com/wordpress/wp-content/uploads/2024/07/despicable-me-4-mega-minions.jpg"
                        alt=""
                        className="w-full h-full object-cover object-center opacity-40"
                    />
                    <div className="absolute inset-0 bg-[#0c0c1a]/80" />
                </div>

                <header className="relative z-30 flex items-center justify-between px-6 py-5">
                    <button onClick={() => setPage("home")} className="flex items-center gap-2 text-white/70 hover:text-white text-[11px] uppercase tracking-widest">
                        <ArrowLeft size={16} /> Back
                    </button>
                    <span className="text-[#FFD700] text-[11px] uppercase tracking-widest">About</span>
                </header>

                <div className="relative z-10 flex-grow flex flex-col items-center px-6 md:px-16 pb-16 pt-4">
                    <h2 className="text-[#FFD700] text-5xl md:text-8xl font-black italic uppercase tracking-tighter text-center mb-8 drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                        Minions
                    </h2>

                    <div className="max-w-3xl w-full bg-black/40 p-6 md:p-0 rounded-2xl backdrop-blur-sm md:backdrop-blur-none">
                        <p className="text-white/90 text-[13px] md:text-[14px] leading-[1.8] text-left md:text-justify">
                            <span className="text-[#FFD700] font-black">Despicable-AI</span> is a specialized, character-centric conversational platform designed to provide an immersive role-playing experience by bringing the beloved yellow henchmen from the Despicable Me universe to life through advanced AI.
                            <br /><br />
                            Through a dynamic sidebar, users can select their preferred companion: <span className="text-[#FFD700]">Bob</span> (Sweet & Innocent), <span className="text-[#9B59B6]">Stuart</span> (Chill & Sarcastic), or <span className="text-[#4A90D9]">Kevin</span> (Brave & Heroic). The AI stays strictly in character, blending English with signature "Minion-ese" phrases and high-energy dialogue to make the user feel like they are actively participating in a grand mission or a "heroic racket."
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ── CONTACT PAGE ────────────────────────────────────────────────────
    if (page === "contact") {
        return (
            <div className="relative w-full min-h-screen flex flex-col bg-[#0c0c1a] font-['M_PLUS_1p'] font-bold">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://static0.moviewebimages.com/wordpress/wp-content/uploads/2024/07/despicable-me-4-mega-minions.jpg"
                        alt=""
                        className="w-full h-full object-cover object-center opacity-30"
                    />
                </div>

                <header className="relative z-30 flex items-center justify-between px-6 py-5">
                    <button onClick={() => setPage("home")} className="flex items-center gap-2 text-white/70 hover:text-white text-[11px] uppercase tracking-widest">
                        <ArrowLeft size={16} /> Back
                    </button>
                </header>

                <div className="relative z-10 flex-grow flex items-center justify-center px-6 pb-20">
                    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 w-full max-w-sm shadow-2xl">
                        <h2 className="text-[#FFD700] text-2xl md:text-3xl font-black italic uppercase tracking-tight mb-8">Contact</h2>
                        <div className="space-y-6">
                            <div>
                                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Email</p>
                                <p className="text-white font-bold text-sm md:text-base break-words">Guerrerolloyd44@gmail.com</p>
                            </div>
                            <div>
                                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Phone</p>
                                <p className="text-white font-bold text-sm md:text-base">09165427691</p>
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