import { useState, useRef, useEffect } from 'react';
import { Send, ChevronLeft, MoreVertical, Bot, KeyRound, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import api from '../../api/axios';
import { getErrorMessage } from '../../utils/getErrorMessage';

const AI_SETTINGS_KEY = 'ai_settings';
const DEFAULT_SETTINGS = {
  provider: 'openrouter',
  model: 'openai/gpt-4o-mini',
  api_key: '',
  base_url: 'https://openrouter.ai/api/v1/chat/completions',
};

function parseStructuredAssistantResponse(content) {
  if (typeof content !== 'string') return null;

  try {
    const parsed = JSON.parse(content);
    if (!parsed || !Array.isArray(parsed.actions)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function describeFillValue(value) {
  if (value === 'mean' || value === 'median' || value === 'mode') return `using ${value}`;
  if (value === '') return 'with an empty string';
  return `with "${String(value)}"`;
}

function buildAssistantMessage(content) {
  const plan = parseStructuredAssistantResponse(content);
  if (!plan) {
    return { role: 'ai', content };
  }

  const steps = plan.actions.map((action, index) => {
    if (action.action === 'drop_duplicates') {
      return {
        title: `Step ${index + 1}: Remove duplicate rows`,
        detail: 'This will remove repeated records from the dataset.',
      };
    }

    if (action.action === 'fill_missing' && action.columns && typeof action.columns === 'object') {
      const entries = Object.entries(action.columns);
      return {
        title: `Step ${index + 1}: Fill missing values`,
        detail: `${entries.length} column rules suggested.`,
        items: entries.map(([column, value]) => `${column}: fill ${describeFillValue(value)}`),
      };
    }

    return {
      title: `Step ${index + 1}: ${action.action}`,
      detail: 'AI returned a structured cleaning action for this step.',
    };
  });

  return {
    role: 'ai',
    content: `I found a ${steps.length}-step cleaning plan for this dataset. Review the suggested actions below and tell me what you want to do next.`,
    plan: steps,
    raw: content,
  };
}

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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const [datasetId, setDatasetId] = useState('');
  const [aiSettings, setAiSettings] = useState(() => {
    const raw = localStorage.getItem(AI_SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    if (!settingsSaved) return;
    const timeoutId = window.setTimeout(() => setSettingsSaved(false), 1800);
    return () => window.clearTimeout(timeoutId);
  }, [settingsSaved]);

  const handleSettingsChange = (field, value) => {
    setAiSettings((prev) => ({ ...prev, [field]: value }));
  };

  const saveSettings = () => {
    localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(aiSettings));
    setSettingsSaved(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    if (!datasetId) {
        setMessages(prev => [...prev, { role: 'ai', content: 'Please provide a Dataset ID in the input field above first to query your data.' }]);
        return;
    }
    if (!aiSettings.model.trim()) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Please set a model in AI settings before sending a chat request.' }]);
      return;
    }
    if (!aiSettings.api_key.trim()) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Please add an API key in AI settings before sending a chat request.' }]);
      return;
    }

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await api.post('/ai/chat', {
        dataset_id: parseInt(datasetId),
        user_message: userMsg,
        ai_config: aiSettings,
      });
      setMessages(prev => [...prev, buildAssistantMessage(response.data.ai_response)]);
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
        <button
          className="text-[color:var(--muted)] hover:text-[color:var(--text)] transition-colors"
          type="button"
          onClick={() => setSettingsOpen((prev) => !prev)}
        >
          <MoreVertical className="w-6 h-6" />
        </button>
      </div>

      {settingsOpen && (
        <div className="border-b px-4 py-4 sm:px-6" style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
          <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--text)]">
            <KeyRound className="h-4 w-4 text-[color:var(--primary-2)]" />
            AI settings
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-xs text-[color:var(--muted)]">
              Provider
              <select
                value={aiSettings.provider}
                onChange={(e) => handleSettingsChange('provider', e.target.value)}
                className="dc-select mt-1 px-3 py-2"
              >
                <option value="openrouter">OpenRouter</option>
                <option value="gemini">Gemini</option>
              </select>
            </label>
            <label className="text-xs text-[color:var(--muted)]">
              Model
              <input
                type="text"
                value={aiSettings.model}
                onChange={(e) => handleSettingsChange('model', e.target.value)}
                placeholder={aiSettings.provider === 'openrouter' ? 'openai/gpt-4o-mini' : 'gemini-2.5-flash'}
                className="dc-input mt-1 px-3 py-2"
              />
            </label>
            <label className="text-xs text-[color:var(--muted)] md:col-span-2">
              API key
              <input
                type="password"
                value={aiSettings.api_key}
                onChange={(e) => handleSettingsChange('api_key', e.target.value)}
                placeholder={aiSettings.provider === 'openrouter' ? 'sk-or-v1-...' : 'AIza...'}
                className="dc-input mt-1 px-3 py-2"
              />
            </label>
            <label className="text-xs text-[color:var(--muted)] md:col-span-2">
              Base URL
              <input
                type="text"
                value={aiSettings.base_url}
                onChange={(e) => handleSettingsChange('base_url', e.target.value)}
                placeholder="https://openrouter.ai/api/v1/chat/completions"
                className="dc-input mt-1 px-3 py-2"
              />
            </label>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-xs leading-5 text-[color:var(--muted)]">
              Settings are stored in your browser and sent only with AI requests.
            </p>
            <button type="button" onClick={saveSettings} className="dc-btn-primary">
              <Save className="mr-2 h-4 w-4" />
              {settingsSaved ? 'Saved' : 'Save settings'}
            </button>
          </div>
        </div>
      )}

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

              {msg.role === 'ai' && Array.isArray(msg.plan) && msg.plan.length > 0 && (
                <div className="mt-4 space-y-3 pl-3">
                  {msg.plan.map((step) => (
                    <div
                      key={step.title}
                      className="rounded-2xl border p-3 text-sm"
                      style={{ borderColor: 'rgba(255,255,255,0.18)', backgroundColor: 'rgba(255,255,255,0.08)' }}
                    >
                      <div className="font-semibold text-white">{step.title}</div>
                      <div className="mt-1 text-white/80">{step.detail}</div>
                      {Array.isArray(step.items) && step.items.length > 0 && (
                        <div className="mt-2 space-y-1 text-white/75">
                          {step.items.map((item) => (
                            <div key={item}>• {item}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <details className="text-xs text-white/70">
                    <summary className="cursor-pointer select-none">Show raw plan</summary>
                    <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl border p-3" style={{ borderColor: 'rgba(255,255,255,0.14)', backgroundColor: 'rgba(0,0,0,0.18)' }}>
                      {msg.raw}
                    </pre>
                  </details>
                </div>
              )}
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
