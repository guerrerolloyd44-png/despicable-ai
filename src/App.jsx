import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, ThumbsUp, ThumbsDown,
  RotateCcw, Copy, MoreVertical, SendHorizontal,
  User, Settings, Menu, X, Pin, Check, HelpCircle, AlertTriangle,
  Music, Heart, Shield, Trash2, MessageSquare
} from 'lucide-react';
import { getMinionChat, getMinionPersona, sendMessage } from './gemini.js';

// ── Minion Config ────────────────────────────────────────────────────────
const MINIONS = {
  bob: {
    icon: "🧸",
    lucideIcon: Heart,
    color: "from-[#FFD700] to-[#FFA500]",
    accent: "#FFD700",
    bgActive: "bg-[#FFD700]/20 border-[#FFD700]/60",
    bgHover: "hover:bg-[#FFD700]/10",
    label: "Sweet & Innocent",
    traits: ["Innocent", "Eager", "Emotional", "Lovable"],
  },
  kevin: {
    icon: "💪",
    lucideIcon: Shield,
    color: "from-[#4A90D9] to-[#2C5AA0]",
    accent: "#4A90D9",
    bgActive: "bg-[#4A90D9]/20 border-[#4A90D9]/60",
    bgHover: "hover:bg-[#4A90D9]/10",
    label: "Brave & Heroic",
    traits: ["Leader", "Brave", "Confident", "Loyal"],
  },
  stuart: {
    icon: "🎸",
    lucideIcon: Music,
    color: "from-[#9B59B6] to-[#6C3483]",
    accent: "#9B59B6",
    bgActive: "bg-[#9B59B6]/20 border-[#9B59B6]/60",
    bgHover: "hover:bg-[#9B59B6]/10",
    label: "Chill & Sarcastic",
    traits: ["Lazy", "Musical", "Sarcastic", "Cool"],
  },
};

const DespicableAI = () => {
  // --- SIDEBAR & MODAL STATE ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [copySuccess, setCopySuccess] = useState(null);

  // --- MINION SELECTION ---
  const [selectedMinion, setSelectedMinion] = useState("bob");

  // --- CHAT HISTORY ---
  const [chatHistory, setChatHistory] = useState([]);
  const [activeChatId, setActiveChatId] = useState(() => Date.now());

  // --- CHAT STATE ---
  const persona = getMinionPersona(selectedMinion);
  const minionUI = MINIONS[selectedMinion];

  const makeGreeting = (minionKey) => {
    const p = getMinionPersona(minionKey || selectedMinion);
    return {
      id: Date.now(),
      sender: 'ai',
      text: p.greeting,
      liked: false,
      disliked: false,
      prompt: ""
    };
  };

  const [messages, setMessages] = useState([makeGreeting("bob")]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // --- GEMINI CHAT SESSION ---
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current = getMinionChat(selectedMinion);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Helper: get a title preview from messages (first user message or fallback)
  const getChatTitle = (msgs) => {
    const firstUser = msgs.find(m => m.sender === 'user');
    if (firstUser) {
      return firstUser.text.length > 30 ? firstUser.text.slice(0, 30) + '…' : firstUser.text;
    }
    return 'New Chat';
  };

  // Save current chat to history (only if it has user messages)
  const saveCurrentChat = () => {
    const hasUserMsg = messages.some(m => m.sender === 'user');
    if (!hasUserMsg) return;
    setChatHistory(prev => {
      const exists = prev.find(c => c.id === activeChatId);
      if (exists) {
        return prev.map(c => c.id === activeChatId
          ? { ...c, messages, title: getChatTitle(messages), minion: selectedMinion }
          : c
        );
      }
      return [
        { id: activeChatId, messages, title: getChatTitle(messages), minion: selectedMinion, createdAt: Date.now() },
        ...prev
      ];
    });
  };

  // Auto-save current chat whenever messages change (if there are user messages)
  useEffect(() => {
    const hasUserMsg = messages.some(m => m.sender === 'user');
    if (hasUserMsg) {
      setChatHistory(prev => {
        const exists = prev.find(c => c.id === activeChatId);
        if (exists) {
          return prev.map(c => c.id === activeChatId
            ? { ...c, messages, title: getChatTitle(messages), minion: selectedMinion }
            : c
          );
        }
        return [
          { id: activeChatId, messages, title: getChatTitle(messages), minion: selectedMinion, createdAt: Date.now() },
          ...prev
        ];
      });
    }
  }, [messages]);

  // Load a chat from history
  const handleLoadChat = (chatItem) => {
    if (chatItem.id === activeChatId) return;
    saveCurrentChat();
    setActiveChatId(chatItem.id);
    setSelectedMinion(chatItem.minion);
    setMessages(chatItem.messages);
    chatRef.current = getMinionChat(chatItem.minion);
  };

  // Delete a chat from history
  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation();
    setChatHistory(prev => prev.filter(c => c.id !== chatId));
    // If deleting the active chat, start a fresh one
    if (chatId === activeChatId) {
      const newId = Date.now();
      setActiveChatId(newId);
      chatRef.current = getMinionChat(selectedMinion);
      setMessages([makeGreeting()]);
    }
  };

  // --- MINION SWITCH ---
  const handleSelectMinion = (minionKey) => {
    if (minionKey === selectedMinion) return;
    saveCurrentChat();
    setSelectedMinion(minionKey);
    const newId = Date.now();
    setActiveChatId(newId);
    chatRef.current = getMinionChat(minionKey);
    setMessages([makeGreeting(minionKey)]);
  };

  // --- LOGIC FUNCTIONS ---
  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      const responseText = await sendMessage(chatRef.current, currentInput);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: responseText,
        liked: false, disliked: false, prompt: currentInput
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Gemini API error:", error);
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: `Uh oh… something went wrong with the communication device. Even ${persona.name} couldn't fix this one. Try again!`,
        liked: false, disliked: false, prompt: currentInput,
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRegenerate = async (prompt, originalMsgId) => {
    if (isTyping || !prompt) return;
    setIsTyping(true);

    try {
      const responseText = await sendMessage(chatRef.current, prompt);
      setMessages(prev => prev.map(msg =>
        msg.id === originalMsgId
          ? { ...msg, text: responseText, liked: false, disliked: false }
          : msg
      ));
    } catch (error) {
      console.error("Gemini API error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(id);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const handleNewChat = () => {
    saveCurrentChat();
    const newId = Date.now();
    setActiveChatId(newId);
    chatRef.current = getMinionChat(selectedMinion);
    setMessages([makeGreeting()]);
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

            {/* Active Character Badge */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[#5ba3c6] text-[10px] uppercase tracking-widest">
                <User size={14} /> ACTIVE MINION
              </div>
              <div className="bg-[#052d4b] border border-[#0a4d7a] rounded-xl p-4 flex items-center gap-4 transition-all duration-300">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${minionUI.color} flex items-center justify-center text-lg shrink-0`}>
                  {minionUI.icon}
                </div>
                <div>
                  <p className="text-white font-black text-[13px]">{persona.name}</p>
                  <p className="text-[#5ba3c6] text-[9px] uppercase tracking-wider">{persona.title}</p>
                </div>
              </div>
            </div>

            {/* ── CHOOSE YOUR MINION ── */}
            <div className="space-y-3">
              <p className="text-[#3b6b8b] text-[9px] uppercase font-bold tracking-wider">CHOOSE YOUR MINION</p>
              <div className="space-y-2">
                {Object.entries(MINIONS).map(([key, minion]) => {
                  const isActive = key === selectedMinion;
                  const minionPersona = getMinionPersona(key);
                  const Icon = minion.lucideIcon;
                  return (
                    <button
                      key={key}
                      onClick={() => handleSelectMinion(key)}
                      className={`w-full p-3 rounded-xl border text-left transition-all duration-300 group
                        ${isActive
                          ? `${minion.bgActive} border-opacity-100 shadow-lg`
                          : `bg-[#052d4b] border-[#0a4d7a] ${minion.bgHover}`
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${minion.color} flex items-center justify-center text-white shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                          <span className="text-base">{minion.icon}</span>
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-white font-black text-[12px]">{minionPersona.name}</p>
                          <p className="text-[#5ba3c6] text-[8px] uppercase tracking-wider truncate">{minion.label}</p>
                        </div>
                        {isActive && (
                          <div className="w-2 h-2 rounded-full animate-pulse shrink-0" style={{ backgroundColor: minion.accent }} />
                        )}
                      </div>
                      {/* Trait chips shown when active */}
                      {isActive && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5 pl-12">
                          {minion.traits.map(t => (
                            <span key={t} className="text-[8px] py-1 px-2 rounded-md bg-white/10 text-white/70 uppercase">{t}</span>
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <p className="text-[#3b6b8b] text-[10px] uppercase font-black tracking-widest">CHATS</p>
                <span className="text-[#3b6b8b] text-[9px]">{chatHistory.length > 0 ? chatHistory.length : ''}</span>
              </div>
              <div className="bg-[#054767] border border-[#0a4d7a] rounded-[1.2rem] p-2 space-y-1 max-h-[200px] overflow-y-auto scrollbar-hide">
                {/* Active / Current Session */}
                <div className="p-3 text-white font-bold text-[11px] bg-white/10 rounded-xl flex items-center gap-2.5 border border-white/10">
                  <MessageSquare size={13} className="text-[#5ba3c6] shrink-0" />
                  <span className="truncate flex-grow">{getChatTitle(messages)}</span>
                  <span className="text-[8px] text-[#5ba3c6] uppercase shrink-0">Active</span>
                </div>

                {/* History items */}
                {chatHistory
                  .filter(c => c.id !== activeChatId)
                  .map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => handleLoadChat(chat)}
                      className="p-3 text-white/70 text-[11px] rounded-xl cursor-pointer hover:bg-white/5 flex items-center gap-2.5 group transition-all"
                    >
                      <MessageSquare size={13} className="text-[#3b6b8b] shrink-0" />
                      <div className="flex-grow min-w-0">
                        <p className="truncate font-bold text-[11px]">{chat.title}</p>
                        <p className="text-[8px] text-[#3b6b8b] uppercase">{MINIONS[chat.minion]?.icon} {chat.minion}</p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteChat(e, chat.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-400/60 hover:text-red-400 transition-all shrink-0 p-1 rounded-lg hover:bg-red-400/10"
                        title="Delete chat"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}

                {chatHistory.filter(c => c.id !== activeChatId).length === 0 && (
                  <p className="text-[9px] text-[#3b6b8b] text-center py-2 opacity-60">No past chats yet</p>
                )}
              </div>
              <button
                onClick={handleNewChat}
                className="w-full flex items-center justify-center gap-2 mt-2 py-2.5 rounded-xl border border-dashed border-[#0a4d7a] text-[#5ba3c6] text-[10px] uppercase tracking-wider hover:bg-[#054767] transition-all"
              >
                <Plus size={14} /> New Chat
              </button>
            </div>
          </div>

          {/* 3. LOWER LEFT BUTTON */}
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
          <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url('https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExczEyZWFoNXJwZW9oMG52bTlzcDZlcHMyYnljOHc0c2g2eGducWlrZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wduVogRyuLaGbHMjzI/giphy.gif')` }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#120a2e]/60 via-[#0a2e5c]/30 to-[#2e0a4e]/70" />
          </div>

          <main className="relative z-10 flex-grow flex flex-col items-center overflow-y-auto px-4 md:px-10 scrollbar-hide pt-10">
            <div className="max-w-2xl w-full space-y-8">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-center'}`}>
                  <div className={`p-6 md:p-8 rounded-[1.5rem] shadow-2xl backdrop-blur-2xl border transition-all ${msg.isError
                    ? 'bg-red-900/30 border-red-500/30 text-white w-full'
                    : msg.sender === 'ai'
                      ? 'bg-[#0a2a4d]/50 text-white w-full border-white/10'
                      : 'bg-blue-600/40 text-white max-w-[85%] self-end border-white/10'
                    }`}>
                    <p className="text-[10px] mb-2 opacity-60 uppercase font-black tracking-widest">
                      {msg.sender === 'ai'
                        ? (msg.isError ? `⚠ ${persona.name.toUpperCase()} (ERROR)` : `${minionUI.icon} ${persona.name.toUpperCase()}`)
                        : 'You'}
                    </p>
                    <div className="text-[13px] tracking-wide whitespace-pre-wrap">{msg.text}</div>
                    {msg.sender === 'ai' && (
                      <div className="flex items-center gap-4 mt-6 opacity-40">
                        <ThumbsUp
                          size={16}
                          className={`cursor-pointer hover:opacity-100 ${msg.liked ? 'text-green-400 opacity-100' : ''}`}
                          onClick={() => setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, liked: !m.liked, disliked: false } : m))}
                        />
                        <ThumbsDown
                          size={16}
                          className={`cursor-pointer hover:opacity-100 ${msg.disliked ? 'text-red-400 opacity-100' : ''}`}
                          onClick={() => setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, disliked: !m.disliked, liked: false } : m))}
                        />
                        <RotateCcw
                          size={16}
                          className="cursor-pointer hover:opacity-100"
                          onClick={() => handleRegenerate(msg.prompt, msg.id)}
                        />
                        <div onClick={() => handleCopy(msg.text, msg.id)} className="cursor-pointer hover:opacity-100">
                          {copySuccess === msg.id ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex flex-col items-center">
                  <div className="p-6 md:p-8 rounded-[1.5rem] shadow-2xl backdrop-blur-2xl border border-white/10 bg-[#0a2a4d]/50 text-white w-full max-w-2xl">
                    <p className="text-[10px] mb-2 opacity-60 uppercase font-black tracking-widest">{minionUI.icon} {persona.name.toUpperCase()}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: minionUI.accent, animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: minionUI.accent, animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: minionUI.accent, animationDelay: '300ms' }} />
                      </div>
                      <span className="text-[11px] opacity-40 ml-2 uppercase tracking-wider">
                        {selectedMinion === 'bob' ? 'Thinking really hard...' : selectedMinion === 'kevin' ? 'Deploying plan...' : 'Meh... typing...'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

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
                placeholder={
                  selectedMinion === 'bob' ? "Ask Bob anything! 🧸"
                    : selectedMinion === 'kevin' ? "Report to Kevin, leader! 💪"
                      : "Say something cool to Stuart... 🎸"
                }
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                className={`text-white ${isTyping ? 'opacity-30 cursor-not-allowed' : ''}`}
                disabled={isTyping}
              >
                <SendHorizontal size={30} />
              </button>
            </div>
          </footer>
        </div>

        {/* 5. SETTINGS MODAL */}
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
                    <p className="font-bold">Powered by Gemini</p>
                    <p className="text-[10px] opacity-60 uppercase">Model: gemini-2.5-flash</p>
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