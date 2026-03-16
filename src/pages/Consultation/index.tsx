import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store';
import { MASTER_AGENTS } from '../../types';
import './style.css';

const MASTER_INITIALS: Record<string, string> = {
  buffett: '巴',
  munger: '芒',
  duan: '段',
  li: '李',
};

const Consultation: React.FC = () => {
  const selectedMasters = useStore((s) => s.selectedMasters);
  const addMasters = useStore((s) => s.addMasters);
  const activeMasterId = useStore((s) => s.activeMasterId);
  const setActiveMaster = useStore((s) => s.setActiveMaster);
  const chatSessions = useStore((s) => s.chatSessions);
  const sendMessage = useStore((s) => s.sendMessage);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const showOnboarding = selectedMasters.length === 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatSessions, activeMasterId]);

  const handleAddMasters = () => {
    if (selectedIds.length === 0) return;
    addMasters(selectedIds);
  };

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text || !activeMasterId) return;
    sendMessage(activeMasterId, text);
    setInputValue('');
  };

  if (showOnboarding) {
    return (
      <div className="consult-onboarding">
        <h1>选择投资大师</h1>
        <p className="consult-desc">添加你感兴趣的投资大师，以他们的视角获取投资分析</p>

        <div className="master-grid">
          {MASTER_AGENTS.map((m) => (
            <div
              key={m.id}
              className={`master-card ${selectedIds.includes(m.id) ? 'selected' : ''}`}
              onClick={() => {
                setSelectedIds((prev) =>
                  prev.includes(m.id)
                    ? prev.filter((id) => id !== m.id)
                    : [...prev, m.id]
                );
              }}
            >
              <div className="master-avatar">{MASTER_INITIALS[m.id] || m.name[0]}</div>
              <div className="master-name">{m.name}</div>
              <div className="master-style">{m.style}</div>
              {selectedIds.includes(m.id) && <div className="master-check">✓</div>}
            </div>
          ))}
        </div>

        <button
          className="submit-btn"
          disabled={selectedIds.length === 0}
          onClick={handleAddMasters}
        >
          开始咨询（{selectedIds.length}）
        </button>
      </div>
    );
  }

  const activeMaster = selectedMasters.find((m) => m.id === activeMasterId);
  const messages = activeMasterId ? chatSessions[activeMasterId] || [] : [];

  return (
    <div className="consult-page">
      <div className="consult-header">
        <div className="master-tabs">
          {selectedMasters.map((m) => (
            <button
              key={m.id}
              className={`master-tab ${m.id === activeMasterId ? 'active' : ''}`}
              onClick={() => setActiveMaster(m.id)}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      <div className="chat-area">
        {messages.length === 0 && activeMaster && (
          <div className="chat-welcome">
            <div className="welcome-avatar">{MASTER_INITIALS[activeMaster.id] || activeMaster.name[0]}</div>
            <h3>你好，我是{activeMaster.name}</h3>
            <p>{activeMaster.description}</p>
            <p className="welcome-hint">试着问我一些关于投资和公司分析的问题吧</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`chat-bubble ${msg.role}`}>
            {msg.role === 'assistant' && (
              <div className="bubble-avatar">
                {MASTER_INITIALS[activeMasterId || ''] || ''}
              </div>
            )}
            <div className="bubble-content">
              {msg.content.split('\n').map((line, i) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                  return <strong key={i}>{line.slice(2, -2)}</strong>;
                }
                if (line.startsWith('- ')) {
                  return <div key={i} style={{ paddingLeft: 12 }}>• {line.slice(2)}</div>;
                }
                if (line.startsWith('⚠️')) {
                  return <div key={i} className="risk-warning">{line}</div>;
                }
                if (line.trim() === '') return <br key={i} />;
                return <div key={i}>{line}</div>;
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-bar">
        <input
          placeholder="输入你的问题..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          className="send-btn"
          disabled={!inputValue.trim()}
          onClick={handleSend}
        >
          发送
        </button>
      </div>
    </div>
  );
};

export default Consultation;
