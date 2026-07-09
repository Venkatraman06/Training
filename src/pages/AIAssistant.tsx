import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, FileText, Code, Settings, User } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, type: 'ai', content: 'Hello! I am your TrainOps AI Assistant. I can help you draft emails, generate training outlines, analyze feedback data, or answer questions about your operations. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newUserMsg: Message = { id: Date.now(), type: 'user', content: inputValue };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);
    
    // Mock AI response delay
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse: Message = { id: Date.now(), type: 'ai', content: 'I have analyzed your request. This is a mockup response from the TrainOps AI engine. In the future, this will connect to a real LLM backend to generate tailored content based on your CRM and Training data.' };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    { icon: FileText, text: 'Draft a syllabus for Advanced React' },
    { icon: Sparkles, text: 'Summarize July feedback surveys' },
    { icon: Code, text: 'Generate a Python coding assessment' },
  ];

  return (
    <div style={{ display: 'flex', gap: '1.5rem', height: '100%' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--color-white)', borderRadius: '12px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--color-khaki)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--color-camel)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={24} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '16px', color: 'var(--color-espresso)' }}>TrainOps AI</h2>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-muted)' }}>Powered by Advanced LLM</p>
          </div>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--color-bg)' }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', gap: '12px', flexDirection: msg.type === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: msg.type === 'ai' ? 'var(--color-espresso)' : 'var(--color-camel)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {msg.type === 'ai' ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div style={{ 
                maxWidth: '75%', 
                padding: '12px 16px', 
                borderRadius: '12px',
                borderTopLeftRadius: msg.type === 'ai' ? '2px' : '12px',
                borderTopRightRadius: msg.type === 'user' ? '2px' : '12px',
                background: msg.type === 'user' ? 'var(--color-camel)' : 'var(--color-white)',
                color: msg.type === 'user' ? 'white' : 'var(--color-espresso)',
                border: msg.type === 'ai' ? '1px solid var(--color-border)' : 'none',
                fontSize: '14px',
                lineHeight: 1.5,
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-espresso)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} />
              </div>
              <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'var(--color-white)', border: '1px solid var(--color-border)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                <div style={{ width: '6px', height: '6px', background: 'var(--color-text-muted)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }}></div>
                <div style={{ width: '6px', height: '6px', background: 'var(--color-text-muted)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.2s' }}></div>
                <div style={{ width: '6px', height: '6px', background: 'var(--color-text-muted)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: '1.5rem', background: 'var(--color-white)', borderTop: '1px solid var(--color-border)' }}>
          {messages.length === 1 && (
            <div style={{ display: 'flex', gap: '12px', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '8px' }}>
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => setInputValue(s.text)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '20px', color: 'var(--color-espresso)', fontSize: '13px', whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <s.icon size={14} color="var(--color-camel)" /> {s.text}
                </button>
              ))}
            </div>
          )}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <textarea 
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask TrainOps AI anything..."
              style={{ width: '100%', padding: '14px 48px 14px 16px', borderRadius: '12px', border: '1px solid var(--color-border)', resize: 'none', height: '52px', fontFamily: 'inherit', fontSize: '14px', outline: 'none', background: 'var(--color-bg)' }}
            />
            <button 
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              style={{ position: 'absolute', right: '8px', width: '36px', height: '36px', borderRadius: '8px', background: inputValue.trim() ? 'var(--color-camel)' : 'var(--color-border)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: inputValue.trim() ? 'pointer' : 'default', transition: 'all 0.2s' }}
            >
              <Send size={18} />
            </button>
          </div>
          <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '11px', color: 'var(--color-text-muted)' }}>AI can make mistakes. Verify important information.</div>
        </div>
      </div>
      
      <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '14px', color: 'var(--color-espresso)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Settings size={16} /> Preferences</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>AI Tone</label>
              <select style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}>
                <option>Professional</option>
                <option>Friendly</option>
                <option>Direct</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Data Context</label>
              <select style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}>
                <option>All Modules</option>
                <option>Only CRM & Sales</option>
                <option>Only Operations</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.25rem', flex: 1 }}>
          <h3 style={{ fontSize: '14px', color: 'var(--color-espresso)', marginBottom: '1rem' }}>Recent Chats</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', padding: '8px', background: 'var(--color-bg)', borderRadius: '6px', cursor: 'pointer' }}>React Syllabus Draft...</div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', padding: '8px', background: 'var(--color-bg)', borderRadius: '6px', cursor: 'pointer' }}>June Profit Analysis...</div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', padding: '8px', background: 'var(--color-bg)', borderRadius: '6px', cursor: 'pointer' }}>Email Template for MIT...</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
