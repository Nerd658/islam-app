import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, AlertCircle, MessageSquare } from 'lucide-react';

export default function ChatInterface() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'As-salamu alaykum ! Je suis votre assistant virtuel spécialisé en sciences islamiques. Comment puis-je vous aider aujourd\'hui ?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        const newHistory = [...messages, { role: 'user', content: userMsg }];
        
        setMessages(newHistory);
        setInput('');
        setLoading(true);
        setError('');

        try {
            // We slice(1) to avoid sending the initial hardcoded bot greeting to the API
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
                history: newHistory.slice(1)
            });
            
            setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.error || "Erreur de connexion au serveur.";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto pt-8 px-4 h-[calc(100vh-100px)] flex flex-col mb-16">
            <h2 className="text-3xl font-bold text-center mb-6 text-white">Imam Virtuel</h2>
            
            <div className="flex-1 bg-[#0a0a0a] border border-[#333] rounded-2xl p-4 overflow-y-auto mb-4 custom-scrollbar">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col justify-center items-center text-gray-500 text-center">
                        <MessageSquare size={48} className="mb-4 opacity-20" />
                        <p>Posez vos questions sur l'Islam.</p>
                        <p className="text-sm mt-2">Les réponses sont basées sur le Coran et la Sunnah.</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div key={idx} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-white text-black rounded-tr-sm' : 'bg-[#111] border border-[#333] text-gray-200 rounded-tl-sm'}`}>
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        </div>
                    ))
                )}
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

            <form onSubmit={sendMessage} className="flex gap-2 pb-6">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Votre question..."
                    className="flex-1 bg-[#0a0a0a] border border-[#333] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-gray-500 transition-colors"
                    disabled={loading}
                />
                <button 
                    type="submit" 
                    disabled={loading || !input.trim()}
                    className="bg-white text-black p-3 rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-colors"
                >
                    <Send size={24} />
                </button>
            </form>
        </div>
    );
}
