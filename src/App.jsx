import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, ThumbsUp, ThumbsDown, 
  RotateCcw, Copy, MoreVertical, SendHorizontal,
  User, Settings, Menu, X, Pin, Check, HelpCircle
} from 'lucide-react';

const DespicableAI = () => {
  // --- SIDEBAR & MODAL STATE ---
  const [identity, setIdentity] = useState("Aether-01");
  const [selectedTone, setSelectedTone] = useState("Aether-01");
  const [expertise, setExpertise] = useState("Generalist");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false); // To make the button work
  const [copySuccess, setCopySuccess] = useState(null);

  // --- CHAT STATE ---
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Bello! I'm ready. My digital coffee is hot and my gadgets are tuned. What's on your diabolical mind today?",
      liked: false,
      disliked: false,
      prompt: ""
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const tones = ["Aether-01", "Creative", "Professional", "Friendly", "Diabolical"];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // --- LOGIC FUNCTIONS ---
  const generateResponse = (userInput) => {
    const text = userInput.toLowerCase();
    if (text.includes("hi") || text.includes("hello")) return `Bello! ${identity} here. How can I assist your master plan today?`;
    if (text.includes("help")) return "I can help you code, study, or plan a heist. What do you need?";
    return `As a ${expertise}, I find your interest in "${userInput}" quite intriguing. Shall we proceed?`;
  };

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg = { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: generateResponse(currentInput),
        liked: false, disliked: false, prompt: currentInput 
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(id);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  return (
    <div className="flex flex-col h-screen w-full font-['M_PLUS_1p'] font-bold overflow-hidden bg-black text-[12px]">
      
      {/* 1. HEADER */}
      <header className="h-[70px] md:h-[100px] bg-black flex items-center justify-between px-6 md:px-10 z-50 shrink-0">
        <div className="flex items-center gap-5">
          <div className="w-8 h-8 md:w-12 md:h-12 border-[3px] md:border-[5px] border-white flex flex-wrap p-1 gap-0.5 items-center justify-center">
             <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white" /><div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white" />
             <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white" /><div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white" />
          </div>
          <h1 className="text-[#FF5C00] text-2xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
            Despicable-AI
          </h1>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white">
          {isSidebarOpen ? <X size={35} /> : <Menu size={35} />}
        </button>
      </header>

      <div className="flex flex-grow overflow-hidden relative">
        
        {/* 2. SIDEBAR */}
        <aside className={`
          fixed md:relative top-0 left-0 h-full w-[310px] bg-[#073a61] z-40 
          transition-transform duration-300 flex flex-col border-r border-white/5 shadow-2xl
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}>
          {/* Scrollable Content */}
          <div className="p-5 space-y-6 flex-grow overflow-y-auto scrollbar-hide">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3 text-[#5ba3c6] text-[10px] uppercase tracking-widest"><User size={14} /> AI PERSONA</div>
              <input type="text" value={identity} onChange={(e) => setIdentity(e.target.value)} className="w-full bg-[#052d4b] border border-[#0a4d7a] rounded-lg p-2.5 text-white outline-none text-[13px]"/>
            </div>

            <div className="space-y-3">
              <p className="text-[#3b6b8b] text-[9px] uppercase font-bold tracking-wider">COMMUNICATION TONE</p>
              <div className="grid grid-cols-2 gap-2">
                {tones.map((tone) => (
                  <button key={tone} onClick={() => setSelectedTone(tone)} className={`text-[10px] py-2 rounded-md transition-all uppercase text-left pl-2 ${selectedTone === tone ? "bg-[#054767] text-white" : "text-[#3b6b8b]"}`}>
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-[#3b6b8b] text-[10px] uppercase font-black tracking-widest">CHATS</p>
              <div className="bg-[#054767] border border-[#0a4d7a] rounded-[1.2rem] p-2 space-y-0.5">
                <div className="p-3 text-white font-bold text-[11px] bg-white/5 rounded-xl cursor-pointer">Current Session</div>
              </div>
            </div>
          </div>

          {/* 3. LOWER LEFT BUTTON (Exactly as requested) */}
          <div className="mt-auto border-t border-white/10">
            <button 
              onClick={() => setShowSettings(true)}
              className="w-full flex items-center gap-4 px-6 py-5 bg-[#053c61] hover:bg-[#0a4d7a] text-white transition-all group"
            >
              <div className="bg-white rounded-full p-1 group-hover:rotate-90 transition-transform duration-500">
                <Settings size={18} className="text-[#073a61]" fill="currentColor" />
              </div>
              <span className="font-black text-[13px] tracking-wider uppercase">
                Settings & Help
              </span>
            </button>
          </div>
        </aside>

        {/* 4. MAIN CONTENT */}
        <div className="relative flex-grow flex flex-col overflow-hidden">
          <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url('https://static3.go3.tv/scale/go3/webuploads/rest/upload/vod/8215748/images/23611008?dsth=1080&dstw=1920&srcmode=0&quality=65&type=1&srcx=1&srcy=1&srcw=1/1&srch=1/1')` }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#120a2e]/60 via-[#0a2e5c]/30 to-[#2e0a4e]/70" />
          </div>

          <main className="relative z-10 flex-grow flex flex-col items-center overflow-y-auto px-4 md:px-10 scrollbar-hide pt-10">
            <div className="max-w-2xl w-full space-y-8">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-center'}`}>
                  <div className={`p-6 md:p-8 rounded-[1.5rem] shadow-2xl backdrop-blur-2xl border border-white/10 transition-all ${msg.sender === 'ai' ? 'bg-[#0a2a4d]/50 text-white w-full' : 'bg-blue-600/40 text-white max-w-[85%] self-end'}`}>
                    <p className="text-[10px] mb-2 opacity-60 uppercase font-black tracking-widest">{msg.sender === 'ai' ? identity : 'You'}</p>
                    <div className="text-[13px] tracking-wide">{msg.text}</div>
                    {msg.sender === 'ai' && (
                      <div className="flex items-center gap-4 mt-6 opacity-40">
                        <ThumbsUp size={16} className="cursor-pointer hover:opacity-100" />
                        <ThumbsDown size={16} className="cursor-pointer hover:opacity-100" />
                        <RotateCcw size={16} className="cursor-pointer hover:opacity-100" />
                        <div onClick={() => handleCopy(msg.text, msg.id)} className="cursor-pointer hover:opacity-100">
                           {copySuccess === msg.id ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} className="h-20" />
            </div>
          </main>

          {/* INPUT BAR */}
          <footer className="relative z-20 w-full px-4 md:px-[10%] pb-6 md:pb-16">
            <div className="max-w-4xl mx-auto bg-[#0c4a7e]/90 border border-white/10 rounded-[1.5rem] p-5 md:p-7 shadow-2xl flex items-center gap-6">
              <button className="text-white/40"><Plus size={32} /></button>
              <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                className="flex-grow bg-transparent border-none text-white text-[18px] outline-none" 
                placeholder="Type your diabolical query..." 
              />
              <button onClick={handleSend} className="text-white"><SendHorizontal size={30} /></button>
            </div>
          </footer>
        </div>

        {/* 5. SETTINGS MODAL (Triggered by the button) */}
        {showSettings && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
            <div className="bg-[#073a61] border border-white/20 w-full max-w-md rounded-3xl p-8 text-white relative shadow-2xl">
              <button onClick={() => setShowSettings(false)} className="absolute top-6 right-6 opacity-50 hover:opacity-100"><X /></button>
              <h2 className="text-2xl font-black italic uppercase text-[#FF5C00] mb-6">Settings & Help</h2>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl flex items-center gap-4">
                  <HelpCircle className="text-blue-400" />
                  <div>
                    <p className="font-bold">Need Help?</p>
                    <p className="text-[10px] opacity-60 uppercase">Documentation & Minion Manual</p>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl flex items-center gap-4">
                  <Settings className="text-orange-400" />
                  <div>
                    <p className="font-bold">Advanced Config</p>
                    <p className="text-[10px] opacity-60 uppercase">Model & API Parameters</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowSettings(false)} className="w-full mt-8 bg-white text-[#073a61] py-3 rounded-xl font-black uppercase tracking-widest">Close</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DespicableAI;