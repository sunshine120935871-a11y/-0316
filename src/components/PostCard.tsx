import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Post } from '../types';
import { useStore } from '../store';
import dayjs from 'dayjs';

const TAG_COLORS: Record<string, string> = {
  '财报解读': 'var(--tag-financial)',
  '新产品跟踪': 'var(--tag-product)',
  '风险提示': 'var(--tag-risk)',
  '公司动态': 'var(--tag-company)',
  '行业观察': 'var(--tag-industry)',
};

interface Props {
  post: Post;
  highlightKeyword?: string;
}

function highlightText(text: string, keyword?: string) {
  if (!keyword) return text;
  const idx = text.toLowerCase().indexOf(keyword.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: '#fff3cd', padding: 0 }}>{text.slice(idx, idx + keyword.length)}</mark>
      {text.slice(idx + keyword.length)}
    </>
  );
}

const PostCard: React.FC<Props> = ({ post, highlightKeyword }) => {
  const navigate = useNavigate();
  const toggleBookmark = useStore((s) => s.toggleBookmark);

  const avatarLetter = post.companyName.charAt(0);

  return (
    <div
      onClick={() => navigate(`/post/${post.id}`)}
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        cursor: 'pointer',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: 14,
          flexShrink: 0,
        }}>
          {avatarLetter}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{post.companyName}</div>
          <div style={{ fontSize: 11, color: 'var(--text-hint)' }}>
            {dayjs(post.createdAt).format('YYYY-MM-DD HH:mm')}
          </div>
        </div>
        <span
          style={{
            fontSize: 11,
            padding: '2px 8px',
            borderRadius: 4,
            color: TAG_COLORS[post.tag] || 'var(--text-secondary)',
            background: `${TAG_COLORS[post.tag] || 'var(--text-secondary)'}15`,
            fontWeight: 500,
          }}
        >
          {post.tag}
        </span>
      </div>

      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, lineHeight: 1.4 }}>
        {highlightKeyword ? highlightText(post.title, highlightKeyword) : post.title}
      </h3>

      <p style={{
        fontSize: 13,
        color: 'var(--text-secondary)',
        lineHeight: 1.5,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {highlightKeyword ? highlightText(post.summary, highlightKeyword) : post.summary}
      </p>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark(post.id);
          }}
          style={{
            fontSize: 18,
            background: 'none',
            border: 'none',
            padding: '4px 8px',
          }}
        >
          {post.bookmarked ? '⭐' : '☆'}
        </button>
      </div>
    </div>
  );
};

export default PostCard;
