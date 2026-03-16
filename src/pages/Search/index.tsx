import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import PostCard from '../../components/PostCard';
import './style.css';

const Search: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState<'relevance' | 'latest'>('relevance');
  const navigate = useNavigate();
  const posts = useStore((s) => s.posts);
  const searchHistory = useStore((s) => s.searchHistory);
  const addSearchHistory = useStore((s) => s.addSearchHistory);
  const clearSearchHistory = useStore((s) => s.clearSearchHistory);

  const trimmed = keyword.trim();

  const results = useMemo(() => {
    if (!trimmed) return [];
    const kw = trimmed.toLowerCase();

    const scored = posts
      .filter((p) => {
        const searchable = `${p.title} ${p.summary} ${p.content} ${p.companyName} ${p.tag}`.toLowerCase();
        return searchable.includes(kw);
      })
      .map((p) => {
        let score = 0;
        if (p.title.toLowerCase().includes(kw)) score += 10;
        if (p.companyName.toLowerCase().includes(kw)) score += 8;
        if (p.tag.toLowerCase().includes(kw)) score += 5;
        if (p.summary.toLowerCase().includes(kw)) score += 3;
        if (p.content.toLowerCase().includes(kw)) score += 1;
        return { post: p, score };
      });

    if (sortBy === 'latest') {
      scored.sort((a, b) => new Date(b.post.createdAt).getTime() - new Date(a.post.createdAt).getTime());
    } else {
      scored.sort((a, b) => b.score - a.score);
    }

    return scored.map((s) => s.post);
  }, [trimmed, posts, sortBy]);

  const handleSearch = () => {
    if (trimmed) {
      addSearchHistory(trimmed);
    }
  };

  const showHistory = !trimmed && searchHistory.length > 0;
  const showResults = !!trimmed;

  return (
    <div className="search-page">
      <div className="search-header">
        <button className="search-back" onClick={() => navigate(-1)}>←</button>
        <div className="search-input-wrap">
          <input
            autoFocus
            placeholder="搜索帖子、公司..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button className="search-action" onClick={handleSearch}>搜索</button>
      </div>

      {showHistory && (
        <div className="search-history">
          <div className="history-header">
            <span>历史搜索</span>
            <button onClick={clearSearchHistory}>清空</button>
          </div>
          <div className="history-tags">
            {searchHistory.map((h) => (
              <button key={h} className="history-tag" onClick={() => { setKeyword(h); addSearchHistory(h); }}>
                {h}
              </button>
            ))}
          </div>
        </div>
      )}

      {showResults && (
        <div className="search-results">
          <div className="results-header">
            <span>{results.length} 条结果</span>
            <div className="sort-toggle">
              <button
                className={sortBy === 'relevance' ? 'active' : ''}
                onClick={() => setSortBy('relevance')}
              >
                相关性
              </button>
              <button
                className={sortBy === 'latest' ? 'active' : ''}
                onClick={() => setSortBy('latest')}
              >
                最新发布
              </button>
            </div>
          </div>
          {results.length === 0 ? (
            <div className="no-results">暂无相关内容，试试其他关键词</div>
          ) : (
            <div className="results-list">
              {results.map((post) => (
                <PostCard key={post.id} post={post} highlightKeyword={trimmed} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
