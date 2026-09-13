import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiTrash2,
  FiGrid,
  FiList,
  FiEye,
  FiCalendar,
  FiUser,
  FiX,
  FiShare2,
  FiFileText,
} from 'react-icons/fi';
import Sidebar from '../components/sidebar';
import Navbar from '../components/Navbar';
import { getPosts, deletePost } from '../Services/postService';

const PLATFORM_CONFIG = {
  facebook: { label: 'Facebook', icon: FiFacebook, color: '#1877F2', bg: '#E7F1FF' },
  instagram: { label: 'Instagram', icon: FiInstagram, color: '#E4405F', bg: '#FDE8EC' },
  twitter: { label: 'X (Twitter)', icon: FiTwitter, color: '#14171A', bg: '#F0F0F0' },
};

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [previewPost, setPreviewPost] = useState(null);
  const [previewPlatform, setPreviewPlatform] = useState('facebook'); // 'facebook' | 'instagram' | 'twitter'
  const navigate = useNavigate();

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this social post?')) {
      const updated = deletePost(id);
      setPosts(updated);
      if (previewPost?.id === id) setPreviewPost(null);
    }
  };

  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.caption.toLowerCase().includes(search.toLowerCase()) ||
      p.creator.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesPlatform =
      platformFilter === 'all' || (p.platforms && p.platforms.includes(platformFilter));
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  return (
    <div className="app-shell">
      <Sidebar activeKey="posts" />

      <div className="app-main">
        <Navbar title="All Social Posts" />

        <main className="app-content">
          {/* Hero Topic Header */}
          <div className="posts-hero-card">
            <div className="posts-hero-info">
              <div className="posts-badge">
                <FiFileText size={12} />
                <span>Multi-Platform Content Feed</span>
              </div>
              <h2>Social Content Directory ({filteredPosts.length})</h2>
              <p>Explore, search, preview, and manage Red Cross social media campaigns across channels.</p>
            </div>
            <button
              type="button"
              className="posts-create-btn"
              onClick={() => navigate('/create-post')}
            >
              <FiPlus size={16} /> Create New Post
            </button>
          </div>

          {/* Filter Bar */}
          <div className="rc-card posts-filter-bar">
            <div className="posts-search">
              <FiSearch size={16} />
              <input
                type="text"
                placeholder="Search by title, caption, author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="posts-filters">
              <div className="posts-filter">
                <FiFilter size={14} />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending Approval</option>
                  <option value="approved">Approved</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="posts-filter">
                <select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)}>
                  <option value="all">All Platforms</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">X (Twitter)</option>
                </select>
              </div>

              {/* View Switcher */}
              <div className="view-toggle-box">
                <button
                  type="button"
                  className={`view-toggle-btn${viewMode === 'grid' ? ' is-active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Large Card View"
                >
                  <FiGrid size={15} /> Card View
                </button>
                <button
                  type="button"
                  className={`view-toggle-btn${viewMode === 'table' ? ' is-active' : ''}`}
                  onClick={() => setViewMode('table')}
                  title="Compact Table View"
                >
                  <FiList size={15} /> Table View
                </button>
              </div>
            </div>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' ? (
            filteredPosts.length === 0 ? (
              <div className="rc-card empty-posts">
                <p>No social posts found matching your current filter criteria.</p>
              </div>
            ) : (
              <div className="posts-grid">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="rc-card post-card">

                    {/* Card Media Header */}
                    <div className="post-card__media">
                      <img src={post.imageUrl} alt={post.title} />
                      <div className="post-card__badges">
                        <span className={`badge-status ${post.status}`}>{post.status}</span>
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="post-card__body">
                      {/* Platform Tags */}
                      <div className="post-card__platforms">
                        {post.platforms?.map((plat) => {
                          const conf = PLATFORM_CONFIG[plat] || PLATFORM_CONFIG.facebook;
                          const Icon = conf.icon;
                          return (
                            <span
                              key={plat}
                              className="post-platform-chip"
                              style={{ backgroundColor: conf.bg, color: conf.color }}
                            >
                              <Icon size={12} />
                              <span>{conf.label}</span>
                            </span>
                          );
                        })}
                      </div>

                      <h3 className="post-card__title">{post.title}</h3>
                      <p className="post-card__caption">{post.caption}</p>

                      {/* Hashtags */}
                      {post.hashtags && post.hashtags.length > 0 && (
                        <div className="post-card__hashtags">
                          {post.hashtags.map((tag, i) => (
                            <span key={i} className="post-hashtag">
                              {tag.startsWith('#') ? tag : `#${tag}`}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="post-card__footer">
                      <div className="post-card__author">
                        <FiUser size={14} style={{ color: '#047857' }} />
                        <div>
                          <strong>{post.creator}</strong>
                          <span>{post.date}</span>
                        </div>
                      </div>

                      <div className="post-card__actions">
                        <button
                          type="button"
                          className="card-action-btn"
                          title="Preview Full Post"
                          onClick={() => setPreviewPost(post)}
                        >
                          <FiEye size={14} /> Preview
                        </button>
                        <button
                          type="button"
                          className="card-action-btn danger"
                          title="Delete Post"
                          onClick={() => handleDelete(post.id)}
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )
          ) : (
            /* Table View */
            <div className="rc-card posts-table-card">
              <div className="rc-table-wrap">
                <table className="rc-table">
                  <thead>
                    <tr>
                      <th>Post Details</th>
                      <th>Platforms</th>
                      <th>Creator</th>
                      <th>Status</th>
                      <th>Date / Schedule</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPosts.map((post) => (
                      <tr key={post.id}>
                        <td>
                          <div className="post-cell-meta">
                            <img src={post.imageUrl} alt="" className="post-cell-thumb" />
                            <div>
                              <strong className="post-cell-title">{post.title}</strong>
                              <p className="post-cell-caption">{post.caption.slice(0, 75)}...</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="post-platforms">
                            {post.platforms?.map((plat) => {
                              const conf = PLATFORM_CONFIG[plat] || PLATFORM_CONFIG.facebook;
                              const Icon = conf.icon;
                              return (
                                <span key={plat} className="platform-tag" style={{ color: conf.color, background: conf.bg }}>
                                  <Icon size={12} />
                                </span>
                              );
                            })}
                          </div>
                        </td>
                        <td style={{ fontWeight: 600 }}>{post.creator}</td>
                        <td>
                          <span className={`badge-status ${post.status}`}>{post.status}</span>
                        </td>
                        <td style={{ fontSize: '12.5px', color: 'var(--rc-text-secondary)' }}>
                          {post.schedule ? new Date(post.schedule).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }) : post.date}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="post-actions">
                            <button
                              type="button"
                              className="post-action-btn"
                              title="Preview"
                              onClick={() => setPreviewPost(post)}
                            >
                              <FiEye size={14} />
                            </button>
                            <button
                              type="button"
                              className="post-action-btn danger"
                              title="Delete Post"
                              onClick={() => handleDelete(post.id)}
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Interactive Multi-Platform Live Preview Modal */}
          {previewPost && (
            <div className="modal-backdrop" onClick={() => setPreviewPost(null)}>
              <div className="rc-card preview-modal" onClick={(e) => e.stopPropagation()}>
                <div className="preview-modal__header">
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', color: '#0F172A' }}>Social Media Live Channel Preview</h3>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>Interactive multi-platform feed simulation with emblem compliance check</p>
                  </div>
                  <button type="button" className="close-btn" onClick={() => setPreviewPost(null)}>
                    <FiX size={18} />
                  </button>
                </div>

                {/* Platform Selector Tabs */}
                <div className="pm-platform-selector">
                  <button
                    type="button"
                    className={`pm-plat-tab${previewPlatform === 'facebook' ? ' is-active fb' : ''}`}
                    onClick={() => setPreviewPlatform('facebook')}
                  >
                    <FiFacebook size={14} /> Facebook Feed
                  </button>

                  <button
                    type="button"
                    className={`pm-plat-tab${previewPlatform === 'instagram' ? ' is-active ig' : ''}`}
                    onClick={() => setPreviewPlatform('instagram')}
                  >
                    <FiInstagram size={14} /> Instagram Grid
                  </button>

                  <button
                    type="button"
                    className={`pm-plat-tab${previewPlatform === 'twitter' ? ' is-active tw' : ''}`}
                    onClick={() => setPreviewPlatform('twitter')}
                  >
                    <FiTwitter size={14} /> X (Twitter) Feed
                  </button>
                </div>

                <div className="preview-modal__body">
                  {/* Red Cross Emblem Compliance Telemetry Bar */}
                  <div className="pm-emblem-audit-bar">
                    <span className="pm-emblem-badge">
                      <span className="pm-emblem-dot" /> 🟢 Emblem Dignity Audit: 100% Compliant
                    </span>
                    <span style={{ fontSize: '11.5px', color: '#059669', fontWeight: 600 }}>
                      Verified Beneficiary Media Privacy & Geneva Emblem Clearance
                    </span>
                  </div>

                  {/* Multi-Platform Feed Mockup Card */}
                  <div className={`preview-card-shell plat-${previewPlatform}`}>
                    <div className="preview-card-shell__top">
                      <div className="author-avatar">{previewPost.creator ? previewPost.creator[0] : 'R'}</div>
                      <div>
                        <strong>Sri Lanka Red Cross Society {previewPlatform === 'twitter' && <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 500 }}>@RedCrossLK</span>}</strong>
                        <span>By {previewPost.creator} • {previewPost.date}</span>
                      </div>
                      <span className={`badge-status ${previewPost.status}`} style={{ marginLeft: 'auto' }}>
                        {previewPost.status}
                      </span>
                    </div>

                    <img src={previewPost.imageUrl} alt="" className="preview-card-shell__img" />

                    <div className="preview-card-shell__content">
                      <h2>{previewPost.title}</h2>
                      <p>{previewPost.caption}</p>
                      {previewPost.hashtags && previewPost.hashtags.length > 0 && (
                        <p className="preview-card-shell__tags">
                          {previewPost.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}
                        </p>
                      )}
                    </div>

                    {/* Social Interaction Buttons Mockup */}
                    <div className="pm-social-actions-bar">
                      {previewPlatform === 'facebook' && (
                        <div className="pm-fb-actions">
                          <span>👍 Like</span>
                          <span>💬 Comment</span>
                          <span>↪ Share</span>
                        </div>
                      )}
                      {previewPlatform === 'instagram' && (
                        <div className="pm-ig-actions">
                          <span>❤️ 1,480 Likes</span>
                          <span>💬 84 Comments</span>
                          <span>🔖 Saved</span>
                        </div>
                      )}
                      {previewPlatform === 'twitter' && (
                        <div className="pm-tw-actions">
                          <span>💬 42</span>
                          <span>🔁 128 Reposts</span>
                          <span>❤️ 512 Likes</span>
                          <span>📊 12.4k Views</span>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        /* Hero Topic Header - Matching Dashboard Box Colors */
        .posts-hero-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 40%, #500B15 100%);
          border: 1px solid rgba(254, 202, 202, 0.25);
          border-radius: 18px;
          padding: 26px 32px;
          margin-bottom: 24px;
          box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.25), 0 4px 16px rgba(80, 11, 21, 0.25);
        }

        .posts-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 800;
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          padding: 4px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          margin-bottom: 10px;
          font-family: var(--font-heading);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .posts-hero-info h2 {
          font-size: 24px;
          font-weight: 800;
          color: #FFFFFF;
          font-family: var(--font-heading);
          letter-spacing: -0.025em;
          margin-bottom: 4px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .posts-hero-info p {
          font-size: 14px;
          color: #E2E8F0;
          font-weight: 500;
        }

        .posts-create-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #059669 0%, #10B981 100%);
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 11px 22px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 800;
          font-family: var(--font-heading);
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .posts-create-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(16, 185, 129, 0.45);
        }

        /* Filter Bar */
        .posts-filter-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 14px 18px;
          margin-bottom: 22px;
          flex-wrap: wrap;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
        }

        .posts-search {
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #D1D5DB;
          border-radius: 10px;
          padding: 8px 14px;
          width: 320px;
          background: var(--rc-white);
        }

        .posts-search svg { color: var(--rc-text-secondary); }

        .posts-search input {
          border: none;
          outline: none;
          font-size: 13.5px;
          width: 100%;
          font-family: var(--font-body);
        }

        .posts-filters {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .posts-filter {
          display: flex;
          align-items: center;
          gap: 6px;
          border: 1px solid #D1D5DB;
          border-radius: 10px;
          padding: 0 12px;
          background: var(--rc-white);
        }

        .posts-filter select {
          border: none;
          outline: none;
          padding: 8px 0;
          font-size: 13px;
          color: var(--rc-text);
          background: transparent;
          cursor: pointer;
          font-family: var(--font-heading);
          font-weight: 600;
        }

        .view-toggle-box {
          display: flex;
          background: #F3F4F6;
          padding: 3px;
          border-radius: 10px;
          gap: 2px;
        }

        .view-toggle-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border: none;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 600;
          color: #6B7280;
          background: transparent;
          cursor: pointer;
          font-family: var(--font-heading);
          transition: all 0.12s ease;
        }

        .view-toggle-btn.is-active {
          background: #FFFFFF;
          color: #1F2937;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        /* Large Post Grid Cards */
        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 22px;
        }

        /* Large Post Grid Cards - Soft Healing Light Green Fade */
        .post-card {
          display: flex;
          flex-direction: column;
          border-radius: 18px;
          overflow: hidden;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
          background: linear-gradient(135deg, rgba(236, 253, 245, 0.9) 0%, rgba(240, 253, 244, 0.95) 100%);
          border: 1.5px solid #A7F3D0;
          box-shadow: 0 4px 16px rgba(16, 185, 129, 0.08);
        }

        .post-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 30px rgba(16, 185, 129, 0.18);
          border-color: #6EE7B7;
        }

        .post-card__media {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: #E6F4EA;
        }

        .post-card__media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .post-card:hover .post-card__media img {
          transform: scale(1.05);
        }

        .post-card__badges {
          position: absolute;
          top: 12px;
          right: 12px;
        }

        .post-card__body {
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .post-card__platforms {
          display: flex;
          gap: 8px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }

        .post-platform-chip {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11.5px;
          font-weight: 700;
          font-family: var(--font-heading);
        }

        .post-card__title {
          font-size: 16.5px;
          font-weight: 800;
          color: #064E3B;
          margin-bottom: 8px;
          line-height: 1.3;
          font-family: var(--font-heading);
        }

        .post-card__caption {
          font-size: 13.5px;
          color: #166534;
          line-height: 1.5;
          margin-bottom: 14px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .post-card__hashtags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-top: auto;
        }

        .post-hashtag {
          font-size: 11.5px;
          font-weight: 700;
          color: #047857;
          background: #D1FAE5;
          border: 1px solid #A7F3D0;
          padding: 3px 8px;
          border-radius: 6px;
          font-family: var(--font-heading);
        }

        .post-card__footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          border-top: 1px solid #D1FAE5;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(4px);
        }

        .post-card__author {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .author-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          color: #FFFFFF;
          font-size: 12px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(5, 150, 105, 0.3);
        }

        .post-card__author div {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        .post-card__author strong {
          font-size: 12.5px;
          color: #064E3B;
          font-weight: 800;
        }

        .post-card__author span {
          font-size: 11px;
          color: #047857;
        }

        .post-card__actions {
          display: flex;
          gap: 6px;
        }

        .card-action-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid #A7F3D0;
          background: #FFFFFF;
          color: #065F46;
          font-size: 12px;
          font-weight: 700;
          font-family: var(--font-heading);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .card-action-btn:hover {
          background: #ECFDF5;
          border-color: #10B981;
          color: #047857;
          transform: translateY(-1px);
        }

        .card-action-btn.danger:hover {
          background: #FEF2F2;
          border-color: #FCA5A5;
          color: #DC2626;
        }

        /* Empty State */
        .empty-posts {
          text-align: center;
          padding: 48px;
          color: #047857;
          font-size: 14px;
          background: #ECFDF5;
          border: 1.5px dashed #A7F3D0;
          border-radius: 16px;
        }

        /* Table View */
        .posts-table-card { padding: 0; overflow: hidden; }

        .post-cell-meta { display: flex; align-items: center; gap: 12px; }
        .post-cell-thumb { width: 48px; height: 48px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
        .post-cell-title { display: block; font-size: 14px; color: var(--rc-text); font-weight: 700; }
        .post-cell-caption { font-size: 12px; color: var(--rc-text-secondary); margin: 2px 0 0; }

        .post-platforms { display: flex; gap: 6px; }
        .platform-tag { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }

        .post-actions { display: flex; justify-content: flex-end; gap: 6px; }
        .post-action-btn {
          width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--rc-border);
          background: var(--rc-white); color: var(--rc-text-secondary); display: flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .post-action-btn.danger:hover { background: var(--rc-danger-bg); color: var(--rc-danger); border-color: var(--rc-danger); }

        /* Preview Modal */
        .modal-backdrop {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; z-index: 100;
          padding: 20px;
        }

        .preview-modal {
          width: 100%; max-width: 520px; padding: 24px; border-radius: 18px;
        }

        .preview-modal__header {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;
        }

        .preview-modal__header h3 { font-size: 18px; font-weight: 800; }

        .close-btn { border: none; background: #F3F4F6; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; }

        /* Multi-Platform Live Preview Styles */
        .pm-platform-selector {
          display: flex;
          gap: 8px;
          background: #F1F5F9;
          padding: 4px;
          border-radius: 10px;
          margin-bottom: 16px;
        }

        .pm-plat-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 7px 10px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #64748B;
          font-size: 12px;
          font-weight: 700;
          font-family: var(--font-heading);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .pm-plat-tab.is-active {
          background: #FFFFFF;
          color: #0F172A;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
        }

        .pm-plat-tab.is-active.fb { color: #1877F2; }
        .pm-plat-tab.is-active.ig { color: #E4405F; }
        .pm-plat-tab.is-active.tw { color: #0F172A; }

        .pm-emblem-audit-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ECFDF5;
          border: 1px solid #A7F3D0;
          padding: 8px 12px;
          border-radius: 10px;
          margin-bottom: 14px;
        }

        .pm-emblem-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 800;
          color: #059669;
          font-family: var(--font-heading);
        }

        .pm-emblem-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 6px #10B981;
        }

        .pm-social-actions-bar {
          padding: 12px 16px;
          background: #F8FAFC;
          border-top: 1px solid #E2E8F0;
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          font-family: var(--font-heading);
        }

        .pm-fb-actions, .pm-ig-actions, .pm-tw-actions {
          display: flex;
          justify-content: space-around;
          align-items: center;
        }

        .pm-fb-actions span, .pm-ig-actions span, .pm-tw-actions span {
          cursor: pointer;
          transition: color 0.12s ease;
        }

        .pm-fb-actions span:hover, .pm-ig-actions span:hover, .pm-tw-actions span:hover {
          color: #1877F2;
        }
      `}</style>
    </div>
  );
}
