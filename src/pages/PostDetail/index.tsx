import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import dayjs from 'dayjs';
import './style.css';

const TAG_COLORS: Record<string, string> = {
  '财报解读': 'var(--tag-financial)',
  '新产品跟踪': 'var(--tag-product)',
  '风险提示': 'var(--tag-risk)',
  '公司动态': 'var(--tag-company)',
  '行业观察': 'var(--tag-industry)',
};

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const posts = useStore((s) => s.posts);
  const toggleBookmark = useStore((s) => s.toggleBookmark);

  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="post-detail">
        <div className="detail-header">
          <button className="back-btn" onClick={() => navigate(-1)}>← 返回</button>
        </div>
        <div className="not-found">帖子不存在</div>
      </div>
    );
  }

  const avatarLetter = post.companyName.charAt(0);

  return (
    <div className="post-detail">
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← 返回</button>
        <button
          className="bookmark-btn"
          onClick={() => toggleBookmark(post.id)}
        >
          {post.bookmarked ? '⭐ 已收藏' : '☆ 收藏'}
        </button>
      </div>

      <div className="detail-meta">
        <div className="detail-avatar">{avatarLetter}</div>
        <div>
          <div className="detail-company">{post.companyName}</div>
          <div className="detail-time">{dayjs(post.createdAt).format('YYYY-MM-DD HH:mm')}</div>
        </div>
        <span
          className="detail-tag"
          style={{
            color: TAG_COLORS[post.tag] || 'var(--text-secondary)',
            background: `${TAG_COLORS[post.tag] || 'var(--text-secondary)'}15`,
          }}
        >
          {post.tag}
        </span>
      </div>

      <h1 className="detail-title">{post.title}</h1>

      <div className="detail-content">
        {post.content.split('\n').map((line, i) => {
          if (line.startsWith('## ')) {
            return <h2 key={i}>{line.slice(3)}</h2>;
          }
          if (line.startsWith('### ')) {
            return <h3 key={i}>{line.slice(4)}</h3>;
          }
          if (line.startsWith('- **')) {
            const match = line.match(/- \*\*(.+?)\*\*：(.+)/);
            if (match) {
              return <p key={i}><strong>{match[1]}</strong>：{match[2]}</p>;
            }
          }
          if (line.startsWith('- ')) {
            return <li key={i}>{line.slice(2)}</li>;
          }
          if (line.startsWith('*') && line.endsWith('*')) {
            return <p key={i} style={{ fontStyle: 'italic', color: 'var(--text-hint)', marginTop: 16 }}>{line.slice(1, -1)}</p>;
          }
          if (line.trim() === '') return <br key={i} />;
          return <p key={i}>{line}</p>;
        })}
      </div>
    </div>
  );
};

export default PostDetail;
