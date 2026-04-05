import { useState, useRef, useEffect } from 'react';
import { Send, ChevronLeft, MoreVertical, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import api from '../../api/axios';
import { getErrorMessage } from '../../utils/getErrorMessage';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: 'Hello! How can I help you clean your dataset today? You can ask me to remove duplicates, fill missing values, or ask questions about the data.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const [datasetId, setDatasetId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    if (!datasetId) {
        setMessages(prev => [...prev, { role: 'ai', content: 'Please provide a Dataset ID in the input field above first to query your data.' }]);
        return;
    }

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await api.post('/ai/chat', { dataset_id: parseInt(datasetId), user_message: userMsg });
      setMessages(prev => [...prev, { role: 'ai', content: response.data.ai_response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: getErrorMessage(err) }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden rounded-[1.75rem] shadow-2xl"
      style={{ border: '1px solid var(--border)', backgroundColor: 'rgba(8, 18, 34, 0.68)' }}
    >
      <div className="z-10 flex items-center justify-between gap-3 border-b px-4 py-4 sm:px-6" style={{ borderColor: 'var(--border)' }}>
        <Link to="/" className="text-[color:var(--muted)] hover:text-[color:var(--text)] transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col items-center">
             <span className="text-[color:var(--text)] font-semibold text-base sm:text-lg tracking-tight">AI Assistant</span>
             <input
                type="number"
                placeholder="Dataset ID"
                value={datasetId}
                onChange={(e) => setDatasetId(e.target.value)}
                className="w-24 border-b bg-transparent text-center text-xs focus:outline-none transition-colors"
                style={{ borderColor: 'rgba(255,255,255,0.18)', color: 'var(--muted)' }}
             />
        </div>
        <button className="text-[color:var(--muted)] hover:text-[color:var(--text)] transition-colors" type="button">
          <MoreVertical className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={clsx(
              'flex w-full',
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={clsx(
                'relative max-w-[92%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed sm:max-w-[85%]',
                msg.role === 'user'
                  ? 'text-[color:var(--text)] rounded-tr-sm'
                  : 'text-white rounded-tl-sm'
              )}
              style={
                msg.role === 'user'
                  ? { backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }
                  : { background: 'linear-gradient(135deg, var(--primary), var(--primary-2))' }
              }
            >
              {/* Avatar for AI */}
              {msg.role === 'ai' && (
                <div className="absolute -top-3 -left-3 rounded-full p-1 border" style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(10,10,16,0.65)' }}>
                    <div className="rounded-full p-1" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-2))' }}>
                        <Bot className="w-4 h-4 text-white" />
                    </div>
                </div>
              )}
              
              {/* Header inside bubble */}
              <div className="flex items-center space-x-2 mb-1.5 opacity-85 text-xs font-semibold">
                 <span>{msg.role === 'user' ? 'You' : 'Assistant'}</span>
              </div>
              
              <div className={clsx("whitespace-pre-wrap", msg.role === 'ai' && "pl-3")}>
                  {msg.content}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex w-full justify-start">
            <div className="text-white rounded-2xl p-4 rounded-tl-sm relative ml-3" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-2))' }}>
               <div className="flex space-x-1.5 items-center h-4 px-2">
                 <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                 <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                 <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce"></div>
               </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 sm:p-5 relative">
        <form
          onSubmit={handleSubmit}
          className="flex items-center space-x-2 rounded-[1.25rem] px-2 py-2"
          style={{ border: '1px solid var(--border)', backgroundColor: 'rgba(255,255,255,0.05)' }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 bg-transparent border-none focus:outline-none px-4 text-sm"
            style={{ color: 'var(--text)' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2.5 rounded-full transition-colors flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-2))' }}
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
