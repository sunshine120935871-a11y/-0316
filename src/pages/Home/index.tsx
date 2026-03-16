import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import PostCard from '../../components/PostCard';
import './style.css';

const SUGGESTED_COMPANIES = [
  '苹果', '特斯拉', '茅台', '腾讯', '阿里巴巴', '比亚迪',
  '宁德时代', '美团', '拼多多', '字节跳动',
];

const Home: React.FC = () => {
  const companies = useStore((s) => s.companies);
  const posts = useStore((s) => s.posts);
  const addCompanies = useStore((s) => s.addCompanies);
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [error, setError] = useState('');

  const showOnboarding = companies.length === 0;

  const handleAddCompany = () => {
    const name = inputValue.trim();
    if (!name) return;
    if (selectedCompanies.includes(name)) return;
    if (selectedCompanies.length >= 20) {
      setError('最多添加20家公司');
      return;
    }
    setSelectedCompanies([...selectedCompanies, name]);
    setInputValue('');
    setError('');
  };

  const handleRemoveCompany = (name: string) => {
    setSelectedCompanies(selectedCompanies.filter((c) => c !== name));
  };

  const handleSubmit = () => {
    if (selectedCompanies.length === 0) {
      setError('请至少添加1家公司');
      return;
    }
    addCompanies(selectedCompanies);
    setSelectedCompanies([]);
  };

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (showOnboarding) {
    return (
      <div className="onboarding-page">
        <h1 className="onboarding-title">添加自己感兴趣的公司</h1>
        <p className="onboarding-desc">系统将为您生成公司 Agent，持续跟踪公司动态</p>

        <div className="company-input-row">
          <input
            placeholder="输入公司名称"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCompany()}
          />
          <button className="add-btn" onClick={handleAddCompany}>添加</button>
        </div>

        {selectedCompanies.length > 0 && (
          <div className="selected-tags">
            {selectedCompanies.map((name) => (
              <span key={name} className="company-tag">
                {name}
                <button onClick={() => handleRemoveCompany(name)}>×</button>
              </span>
            ))}
          </div>
        )}

        <div className="suggestions">
          <p className="suggestions-label">热门推荐</p>
          <div className="suggestion-tags">
            {SUGGESTED_COMPANIES.map((name) => (
              <button
                key={name}
                className={`suggestion-tag ${selectedCompanies.includes(name) ? 'selected' : ''}`}
                onClick={() => {
                  if (selectedCompanies.includes(name)) {
                    handleRemoveCompany(name);
                  } else if (selectedCompanies.length < 20) {
                    setSelectedCompanies([...selectedCompanies, name]);
                  }
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="onboarding-error">{error}</p>}

        <button
          className="submit-btn"
          disabled={selectedCompanies.length === 0}
          onClick={handleSubmit}
        >
          保存并生成 Agent（{selectedCompanies.length}）
        </button>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="home-header">
        <h1 className="home-title">首页</h1>
        <button className="search-btn" onClick={() => navigate('/search')}>
          🔍
        </button>
      </div>

      <div className="feed-list">
        {sortedPosts.length === 0 ? (
          <div className="empty-feed">
            <p>内容生成中，请稍后查看</p>
          </div>
        ) : (
          sortedPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
};

export default Home;
