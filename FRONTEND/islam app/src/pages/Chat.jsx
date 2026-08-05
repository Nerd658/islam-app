import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, AlertCircle, MessageSquare, Moon, PlusCircle } from 'lucide-react';

const MAX_CHARS = 500;
const STORAGE_KEY = 'imam_chat_history';

const defaultGreeting = {
    role: 'assistant',
    content: 'As-salamu alaykum ! Je suis votre assistant virtuel spécialisé en sciences islamiques. Comment puis-je vous aider aujourd\'hui ?',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

const SUGGESTED_QUESTIONS = [
    "Qu'est-ce que le Tawakkul ?",
    "Expliquez la Sourate Al-Fatiha",
    "Comment faire la prière Fajr ?",
    "Quelle est la différence entre Fard et Sunnah ?"
];

const parseMarkdown = (text) => {
    const escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    const html = escaped
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^(?:- |• )(.*)$/gm, '• $1');
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

export default function ChatInterface() {
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return [defaultGreeting];
            }
        }
        return [defaultGreeting];
    });
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        scrollToBottom();
    }, [messages, loading]);

    const sendSpecificMessage = async (text) => {
        if (!text.trim() || text.length > MAX_CHARS) return;

        const userMsg = {
            role: 'user',
            content: text.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        let newHistory = [...messages, userMsg];
        if (newHistory.length > 50) {
            newHistory = newHistory.slice(newHistory.length - 50);
        }
        
        setMessages(newHistory);
        setInput('');
        setLoading(true);
        setError('');

        try {
            const apiHistory = newHistory.slice(1).map(m => ({ role: m.role, content: m.content }));
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
                history: apiHistory
            });
            
            const botMsg = {
                role: 'assistant',
                content: res.data.reply,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            
            setMessages(prev => {
                let updated = [...prev, botMsg];
                if (updated.length > 50) updated = updated.slice(updated.length - 50);
                return updated;
            });
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.error || "Erreur de connexion au serveur.";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        await sendSpecificMessage(input);
    };

    const startNewConversation = () => {
        setMessages([defaultGreeting]);
        setInput('');
        setError('');
    };

    return (
        <div className="max-w-2xl mx-auto pt-8 px-4 h-[calc(100vh-100px)] flex flex-col mb-16">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">Imam Virtuel</h2>
                <button 
                    onClick={startNewConversation}
                    className="flex items-center gap-2 text-sm bg-[#111] hover:bg-[#222] text-gray-300 border border-[#333] px-3 py-2 rounded-lg transition-colors"
                >
                    <PlusCircle size={16} />
                    Nouvelle conversation
                </button>
            </div>
            
            <div className="flex-1 bg-[#0a0a0a] border border-[#333] rounded-2xl p-4 overflow-y-auto mb-4 custom-scrollbar flex flex-col">
                {messages.length === 1 && (
                    <div className="flex flex-wrap gap-2 justify-center mt-4 mb-8">
                        {SUGGESTED_QUESTIONS.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => sendSpecificMessage(q)}
                                className="bg-[#111] hover:bg-[#222] border border-[#333] text-gray-300 text-sm px-4 py-2 rounded-full transition-colors"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                )}
                {messages.map((msg, idx) => (
                    <div key={idx} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-full bg-emerald-900 border border-emerald-700 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                                <Moon size={16} className="text-emerald-400" />
                            </div>
                        )}
                        <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-white text-black rounded-tr-sm' : 'bg-[#111] border border-[#333] text-gray-200 rounded-tl-sm'}`}>
                            <div className="whitespace-pre-wrap leading-relaxed">{parseMarkdown(msg.content)}</div>
                            {msg.timestamp && (
                                <div className={`text-[10px] mt-2 text-right ${msg.role === 'user' ? 'text-gray-500' : 'text-gray-500'}`}>
                                    {msg.timestamp}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start mb-4">
                        <div className="bg-[#111] border border-[#333] text-gray-400 p-4 rounded-2xl rounded-tl-sm animate-pulse">
                            L'imam réfléchit...
                        </div>
                    </div>
                )}
                {error && (
                    <div className="flex items-center gap-2 text-red-400 bg-[#220000] border border-red-900 p-3 rounded-xl text-sm self-center my-2">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="flex flex-col gap-2 pb-6">
                <div className="flex gap-2 relative">
                    <input 
                        type="text" 
                        value={input}
                        maxLength={MAX_CHARS}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Votre question..."
                        className="flex-1 bg-[#0a0a0a] border border-[#333] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-gray-500 transition-colors pr-16"
                        disabled={loading}
                    />
                    <div className={`absolute right-[70px] top-1/2 -translate-y-1/2 text-xs ${input.length >= MAX_CHARS ? 'text-red-500' : 'text-gray-500'}`}>
                        {input.length}/{MAX_CHARS}
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading || !input.trim() || input.length > MAX_CHARS}
                        className="bg-white text-black p-3 rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-colors"
                    >
                        <Send size={24} />
                    </button>
                </div>
            </form>
        </div>
    );
}
