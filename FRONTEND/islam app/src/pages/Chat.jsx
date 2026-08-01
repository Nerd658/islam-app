import React, { useState } from 'react';
import axios from 'axios';
import { Send, Bot, User, AlertCircle } from 'lucide-react';

export default function ChatInterface() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'As-salamu alaykum ! Je suis votre assistant virtuel spécialisé en sciences islamiques. Comment puis-je vous aider aujourd\'hui ?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setLoading(true);
        setError('');

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
                message: userMsg
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
        <div className="flex flex-col h-[80vh] max-w-2xl mx-auto px-4 pt-4 pb-20">
            <div className="flex items-center justify-center gap-3 mb-6">
                <Bot size={32} className="text-emerald-400" />
                <h2 className="text-3xl font-bold">Imam Virtuel</h2>
            </div>

            <div className="flex-grow bg-slate-800/50 backdrop-blur-md rounded-3xl border border-slate-700 p-4 overflow-y-auto mb-4 custom-scrollbar flex flex-col gap-4 shadow-inner">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                            {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-slate-700 text-gray-100 rounded-tl-sm'}`}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </div>
                ))}
                
                {loading && (
                    <div className="flex gap-3 self-start max-w-[85%]">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-700">
                            <Bot size={16} />
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-700 text-gray-100 rounded-tl-sm flex items-center gap-2">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                        </div>
                    </div>
                )}
                
                {error && (
                    <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-xl text-sm self-center my-2">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}
            </div>

            <form onSubmit={sendMessage} className="relative flex items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                    placeholder="Posez votre question (ex: Comment faire les ablutions ?)"
                    className="w-full bg-slate-800 text-white border-2 border-slate-700 rounded-full py-4 pl-6 pr-16 focus:outline-none focus:border-emerald-500 transition disabled:opacity-50"
                />
                <button 
                    type="submit" 
                    disabled={loading || !input.trim()}
                    className="absolute right-2 top-2 bottom-2 bg-emerald-500 hover:bg-emerald-400 text-white p-3 rounded-full flex items-center justify-center disabled:opacity-50 transition"
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
}
