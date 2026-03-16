import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import PostCard from '../../components/PostCard';
import './style.css';

const Profile: React.FC = () => {
  const user = useStore((s) => s.user);
  const updateProfile = useStore((s) => s.updateProfile);
  const logout = useStore((s) => s.logout);
  const posts = useStore((s) => s.posts);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [showBookmarks, setShowBookmarks] = useState(false);

  const bookmarkedPosts = posts
    .filter((p) => p.bookmarked)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleSaveProfile = () => {
    updateProfile({ name: editName, bio: editBio });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const avatarLetter = user?.name?.charAt(0) || user?.phone?.slice(-2) || '?';

  if (showBookmarks) {
    return (
      <div className="profile-page">
        <div className="profile-header">
          <button className="back-btn" onClick={() => setShowBookmarks(false)}>← 返回</button>
          <h2>我的收藏</h2>
        </div>
        <div className="bookmarks-list">
          {bookmarkedPosts.length === 0 ? (
            <div className="empty-state">暂无收藏内容</div>
          ) : (
            bookmarkedPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">{avatarLetter}</div>

        {isEditing ? (
          <div className="edit-form">
            <div className="edit-group">
              <label>姓名</label>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="请输入姓名"
                maxLength={20}
              />
            </div>
            <div className="edit-group">
              <label>个签</label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="一句话介绍自己"
                maxLength={100}
                rows={2}
              />
            </div>
            <div className="edit-actions">
              <button className="save-btn" onClick={handleSaveProfile}>保存</button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>取消</button>
            </div>
          </div>
        ) : (
          <div className="profile-info">
            <h2 className="profile-name">{user?.name || '未设置姓名'}</h2>
            <p className="profile-bio">{user?.bio || '还没有个签'}</p>
            <p className="profile-phone">{user?.phone}</p>
            <button className="edit-btn" onClick={() => {
              setEditName(user?.name || '');
              setEditBio(user?.bio || '');
              setIsEditing(true);
            }}>
              编辑资料
            </button>
          </div>
        )}
      </div>

      <div className="profile-menu">
        <button className="menu-item" onClick={() => setShowBookmarks(true)}>
          <span>⭐ 我的收藏</span>
          <span className="menu-badge">{bookmarkedPosts.length}</span>
          <span className="menu-arrow">›</span>
        </button>
      </div>

      <div className="profile-menu">
        <button className="menu-item danger" onClick={handleLogout}>
          退出登录
        </button>
      </div>
    </div>
  );
};

export default Profile;
