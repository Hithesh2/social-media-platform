import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiFileText,
  FiEdit2,
  FiClock,
  FiCalendar,
  FiCheckCircle,
  FiPlus,
  FiArrowRight,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiActivity,
  FiEye,
  FiShare2,
  FiFilter,
  FiUserCheck,
  FiX,
  FiSend,
} from 'react-icons/fi';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import Sidebar from '../components/sidebar';
import Navbar from '../components/Navbar';
import StatCard from '../components/statCard';
import { getPosts } from '../Services/postService';
import { useAuth } from '../Context/AuthContext';

const PLATFORM_ICONS = {
  facebook: { icon: FiFacebook, color: '#1877F2', bg: '#E7F1FF' },
  instagram: { icon: FiInstagram, color: '#E4405F', bg: '#FDE8EC' },
  twitter: { icon: FiTwitter, color: '#14171A', bg: '#F0F0F0' },
};

const ENGAGEMENT_DATA = [
  { week: 'Wk 1', reach: 3200, engagement: 480 },
  { week: 'Wk 2', reach: 4100, engagement: 610 },
  { week: 'Wk 3', reach: 3800, engagement: 590 },
  { week: 'Wk 4', reach: 5200, engagement: 780 },
  { week: 'Wk 5', reach: 4700, engagement: 705 },
  { week: 'Wk 6', reach: 6100, engagement: 910 },
];

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [previewPost, setPreviewPost] = useState(null);
  const [toastNotice, setToastNotice] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const livePosts = getPosts();
    setPosts(livePosts);
  }, []);

  // Compute live statistics from posts database
  const stats = [
    { key: 'total', label: 'Total Posts', value: posts.length, icon: FiFileText, tone: 'primary' },
    { key: 'draft', label: 'Drafts', value: posts.filter((p) => p.status === 'draft').length, icon: FiEdit2, tone: 'draft' },
    { key: 'pending', label: 'Pending Review', value: posts.filter((p) => p.status === 'pending').length, icon: FiClock, tone: 'pending' },
    { key: 'scheduled', label: 'Scheduled', value: posts.filter((p) => p.status === 'scheduled' || p.status === 'approved').length, icon: FiCalendar, tone: 'scheduled' },
    { key: 'published', label: 'Published', value: posts.filter((p) => p.status === 'published').length, icon: FiCheckCircle, tone: 'published' },
  ];

  const filteredRecentPosts = posts.filter((p) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return p.status === 'pending';
    if (activeFilter === 'scheduled') return p.status === 'scheduled' || p.status === 'approved';
    if (activeFilter === 'published') return p.status === 'published';
    if (activeFilter === 'draft') return p.status === 'draft';
    return true;
  });

  const recentPosts = filteredRecentPosts.slice(0, 6);

  const upcomingPosts = posts
    .filter((p) => p.status === 'scheduled' || p.status === 'approved')
    .slice(0, 4);

  const handleShareClick = (e, post) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${post.title}: ${post.caption}`);
    }
    setToastNotice(`Copied caption for "${post.title.slice(0, 20)}..." to clipboard!`);
    setTimeout(() => setToastNotice(null), 2500);
  };

  return (
    <div className="app-shell">
      <Sidebar activeKey="dashboard" />

      <div className="app-main">
        <Navbar title="Dashboard Overview" />

        <main className="app-content">

          {/* Toast Notification Banner */}
          {toastNotice && (
            <div className="db-toast-banner">
              <FiCheckCircle size={15} />
              <span>{toastNotice}</span>
            </div>
          )}

          {/* Welcome & Quick Action Header */}
          <div className="db-welcome-banner">
            <div className="db-xray-overlay" aria-hidden="true">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="db-xray-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                    <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#C8102E" strokeWidth="0.5" strokeOpacity="0.07" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#db-xray-grid)" />
              </svg>
            </div>

            <div className="db-welcome-text">
              <div className="db-live-tag">
                <FiActivity size={12} />
                <span>Live Campaign Telemetry</span>
              </div>
              <h2>Welcome back, {user?.name || 'Hithesh Maheepala'}!</h2>
              <p>Real-time campaign telemetry, multi-channel dispatch, and content compliance overview.</p>
            </div>

            <div className="db-quick-actions">
              <button
                type="button"
                className="db-action-btn db-action-btn--secondary"
                onClick={() => navigate('/posts')}
              >
                <FiFileText size={15} /> All Posts ({posts.length})
              </button>
              <button
                type="button"
                className="db-action-btn db-action-btn--primary"
                onClick={() => navigate('/create-post')}
              >
                <FiPlus size={16} /> Create New Post
              </button>
            </div>
          </div>

          {/* Live Stat Cards Grid */}
          <section className="rc-stat-grid" aria-label="Post summary">
            {stats.map((s) => (
              <StatCard key={s.key} label={s.label} value={s.value} icon={s.icon} tone={s.tone} />
            ))}
          </section>

          {/* Analytics Chart */}
          <section className="rc-card rc-panel db-xray-panel" aria-label="Engagement overview">
            <div className="rc-panel__header">
              <h2>Audience Reach & Engagement Overview</h2>
              <span className="rc-panel__subtitle">Track impression trajectory across Red Cross Facebook & Instagram</span>
            </div>
            <div className="rc-chart-wrap">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={ENGAGEMENT_DATA} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: '1px solid #C8102E', fontSize: 12.5, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
                    labelStyle={{ fontWeight: 800, color: '#1F2937' }}
                  />
                  <Line type="monotone" dataKey="reach" name="Reach" stroke="#C8102E" strokeWidth={3} dot={{ r: 5, fill: '#C8102E' }} />
                  <Line type="monotone" dataKey="engagement" name="Engagement" stroke="#2563EB" strokeWidth={3} dot={{ r: 5, fill: '#2563EB' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* High-Efficiency Recent Posts & Upcoming Schedule Grid */}
          <div className="rc-two-col">

            {/* Recent Posts Section with In-Place Status Filter Tabs & Action Column */}
            <section className="rc-card rc-panel db-xray-panel db-recent-posts-panel" aria-label="Recent posts">

              <div className="rc-panel__header-row">
                <div>
                  <h2>Recent Social Broadcasts</h2>
                  <span className="rc-panel__subtitle">Latest posts created & submitted for approval</span>
                </div>
                <button
                  type="button"
                  className="db-link-btn"
                  onClick={() => navigate('/posts')}
                >
                  View All Posts ({posts.length}) <FiArrowRight size={13} />
                </button>
              </div>

              {/* In-Place Filter Tabs Bar */}
              <div className="db-recent-filters">
                <button
                  type="button"
                  className={`db-rf-tab${activeFilter === 'all' ? ' is-active' : ''}`}
                  onClick={() => setActiveFilter('all')}
                >
                  All ({posts.length})
                </button>
                <button
                  type="button"
                  className={`db-rf-tab pending${activeFilter === 'pending' ? ' is-active' : ''}`}
                  onClick={() => setActiveFilter('pending')}
                >
                  Pending ({posts.filter(p => p.status === 'pending').length})
                </button>
                <button
                  type="button"
                  className={`db-rf-tab scheduled${activeFilter === 'scheduled' ? ' is-active' : ''}`}
                  onClick={() => setActiveFilter('scheduled')}
                >
                  Scheduled ({posts.filter(p => p.status === 'scheduled' || p.status === 'approved').length})
                </button>
                <button
                  type="button"
                  className={`db-rf-tab published${activeFilter === 'published' ? ' is-active' : ''}`}
                  onClick={() => setActiveFilter('published')}
                >
                  Published ({posts.filter(p => p.status === 'published').length})
                </button>
                <button
                  type="button"
                  className={`db-rf-tab draft${activeFilter === 'draft' ? ' is-active' : ''}`}
                  onClick={() => setActiveFilter('draft')}
                >
                  Drafts ({posts.filter(p => p.status === 'draft').length})
                </button>
              </div>

              {/* High-Efficiency Posts Table */}
              <div className="rc-table-wrap">
                <table className="rc-table db-posts-table">
                  <thead>
                    <tr>
                      <th>Media & Post Details</th>
                      <th>Channels</th>
                      <th>Creator</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPosts.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#64748B' }}>
                          No posts match the <strong>{activeFilter}</strong> filter.{' '}
                          <button
                            type="button"
                            style={{ color: '#C8102E', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}
                            onClick={() => setActiveFilter('all')}
                          >
                            Show all posts
                          </button>
                        </td>
                      </tr>
                    ) : (
                      recentPosts.map((p) => {
                        const creatorInitials = p.creator
                          ? p.creator.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                          : 'RC';

                        return (
                          <tr key={p.id} className="db-post-row" onClick={() => setPreviewPost(p)}>
                            <td>
                              <div className="db-post-cell">
                                <div className="db-post-thumb-wrap">
                                  <img src={p.imageUrl} alt="" className="db-post-thumb" />
                                  <span className="db-thumb-hover-overlay">
                                    <FiEye size={14} color="#FFFFFF" />
                                  </span>
                                </div>
                                <div className="db-post-cell__text">
                                  <strong className="rc-table__title">{p.title}</strong>
                                  <span>{p.caption ? p.caption.slice(0, 50) + '...' : ''}</span>
                                </div>
                              </div>
                            </td>

                            <td>
                              <div className="db-platforms">
                                {p.platforms?.map((plat) => {
                                  const conf = PLATFORM_ICONS[plat];
                                  if (!conf) return null;
                                  const Icon = conf.icon;
                                  return (
                                    <span key={plat} className="db-platform-tag" style={{ background: conf.bg, color: conf.color }} title={plat}>
                                      <Icon size={12} />
                                    </span>
                                  );
                                })}
                              </div>
                            </td>

                            <td>
                              <div className="db-creator-pill" title={p.creator}>
                                <span className="db-creator-avatar">{creatorInitials}</span>
                                <span>{p.creator ? p.creator.split(' ')[0] : 'Officer'}</span>
                              </div>
                            </td>

                            <td>
                              <span className={`badge-status ${p.status}`}>
                                <span className="status-dot" />
                                {p.status}
                              </span>
                            </td>

                            <td>
                              <div className="db-row-actions" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  className="db-row-action-btn"
                                  title="Quick Preview"
                                  onClick={() => setPreviewPost(p)}
                                >
                                  <FiEye size={14} />
                                </button>
                                <button
                                  type="button"
                                  className="db-row-action-btn"
                                  title="Copy Caption"
                                  onClick={(e) => handleShareClick(e, p)}
                                >
                                  <FiShare2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Upcoming Schedule Card */}
            <section className="rc-card rc-panel db-xray-panel" aria-label="Upcoming schedule">
              <div className="rc-panel__header-row">
                <div>
                  <h2>Upcoming Schedule</h2>
                  <span className="rc-panel__subtitle">Approved posts queued for publishing</span>
                </div>
                <button
                  type="button"
                  className="db-link-btn"
                  onClick={() => navigate('/schedule')}
                >
                  Calendar <FiArrowRight size={13} />
                </button>
              </div>

              {upcomingPosts.length === 0 ? (
                <p style={{ color: '#6B7280', fontSize: '13px', padding: '16px 0' }}>
                  No upcoming scheduled posts.
                </p>
              ) : (
                <ul className="rc-schedule-list">
                  {upcomingPosts.map((item) => (
                    <li key={item.id} className="rc-schedule-item" onClick={() => setPreviewPost(item)}>
                      <div className="rc-schedule-item__dot" aria-hidden="true" />
                      <div className="rc-schedule-item__body">
                        <strong>{item.title}</strong>
                        <span>
                          {item.platforms?.join(', ')} • {item.schedule ? new Date(item.schedule).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }) : item.date}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

          </div>

          {/* Quick Post Inspection Modal */}
          {previewPost && (
            <div className="modal-backdrop" onClick={() => setPreviewPost(null)}>
              <div className="rc-card db-modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="db-modal-header">
                  <div>
                    <span className={`badge-status ${previewPost.status}`}>{previewPost.status}</span>
                    <h3>{previewPost.title}</h3>
                  </div>
                  <button type="button" className="ccm-close" onClick={() => setPreviewPost(null)}>
                    <FiX size={16} />
                  </button>
                </div>

                <div className="db-modal-body">
                  <div className="db-modal-img-box">
                    <img src={previewPost.imageUrl} alt={previewPost.title} />
                  </div>

                  <div className="db-modal-details">
                    <div className="db-modal-meta-row">
                      <div className="db-modal-meta">
                        <span>Author</span>
                        <strong>{previewPost.creator}</strong>
                      </div>
                      <div className="db-modal-meta">
                        <span>Date Scheduled</span>
                        <strong>{previewPost.schedule ? new Date(previewPost.schedule).toLocaleString('en-GB') : previewPost.date}</strong>
                      </div>
                    </div>

                    <div className="db-modal-caption">
                      <label>Post Caption</label>
                      <p>{previewPost.caption}</p>
                    </div>

                    <div className="db-modal-platforms">
                      <label>Target Channels</label>
                      <div className="db-platforms">
                        {previewPost.platforms?.map((plat) => {
                          const conf = PLATFORM_ICONS[plat];
                          if (!conf) return null;
                          const Icon = conf.icon;
                          return (
                            <span key={plat} className="db-platform-tag-lg" style={{ background: conf.bg, color: conf.color }}>
                              <Icon size={14} /> <span>{plat}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="db-modal-footer">
                  <button type="button" className="cp-btn cp-btn--ghost" onClick={() => setPreviewPost(null)}>
                    Close
                  </button>
                  <button
                    type="button"
                    className="cp-btn cp-btn--primary"
                    onClick={() => {
                      setPreviewPost(null);
                      navigate('/posts');
                    }}
                  >
                    Manage in Posts View
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      <style>{`
        .db-toast-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #ECFDF5;
          color: #059669;
          border: 1px solid #A7F3D0;
          padding: 10px 16px;
          border-radius: 12px;
          margin-bottom: 18px;
          font-size: 13px;
          font-weight: 700;
          font-family: var(--font-heading);
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .db-welcome-banner {
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 45%, #991B1B 100%);
          border: 1px solid rgba(254, 202, 202, 0.25);
          border-radius: 18px;
          padding: 26px 32px;
          margin-bottom: 24px;
          box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.25), 0 4px 14px rgba(200, 16, 46, 0.2);
          overflow: hidden;
        }

        .db-xray-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.6;
        }

        .db-welcome-text {
          position: relative;
          z-index: 1;
        }

        .db-live-tag {
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
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .db-welcome-text h2 {
          font-size: 24px;
          font-weight: 800;
          color: #FFFFFF;
          margin-bottom: 4px;
          font-family: var(--font-heading);
          letter-spacing: -0.025em;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .db-welcome-text p {
          font-size: 14px;
          color: #E2E8F0;
        }

        .db-quick-actions {
          position: relative;
          z-index: 1;
          display: flex;
          gap: 12px;
        }

        .db-action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 700;
          font-family: var(--font-heading);
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .db-action-btn--secondary {
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(255, 255, 255, 0.5);
          color: #0F172A;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .db-action-btn--secondary:hover {
          background: #FFFFFF;
          color: #C8102E;
          transform: translateY(-1px);
        }

        .db-action-btn--primary {
          background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
          color: #FFFFFF;
          box-shadow: 0 4px 14px rgba(239, 68, 68, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .db-action-btn--primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5);
        }

        .rc-stat-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .db-xray-panel {
          border-radius: 16px;
          border: 1.5px solid #E5E7EB;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .db-xray-panel:hover {
          border-color: #D1D5DB;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        }

        .rc-panel {
          padding: 22px 24px 24px;
          margin-bottom: 24px;
        }

        .rc-panel__header {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-bottom: 16px;
        }

        .rc-panel__header h2,
        .rc-panel__header-row h2 {
          font-size: 17px;
          font-weight: 800;
          font-family: var(--font-heading);
        }

        .rc-panel__header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .rc-panel__subtitle {
          font-size: 13px;
          color: var(--rc-text-secondary);
        }

        .db-link-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          border: none;
          background: none;
          color: #C8102E;
          font-size: 13px;
          font-weight: 700;
          font-family: var(--font-heading);
          cursor: pointer;
        }

        .db-link-btn:hover {
          text-decoration: underline;
        }

        /* Recent Posts In-Place Filter Tabs */
        .db-recent-filters {
          display: flex;
          gap: 6px;
          margin-bottom: 14px;
          background: #F8FAFC;
          padding: 4px;
          border-radius: 10px;
          border: 1px solid #F1F5F9;
        }

        .db-rf-tab {
          padding: 5px 12px;
          border-radius: 6px;
          border: none;
          background: transparent;
          font-size: 11.5px;
          font-weight: 700;
          color: #64748B;
          cursor: pointer;
          font-family: var(--font-heading);
          transition: all 0.12s ease;
        }

        .db-rf-tab.is-active {
          background: #FFFFFF;
          color: #0F172A;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
        }

        /* Posts Table & Row Hover */
        .db-posts-table th {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          color: #64748B;
          letter-spacing: 0.5px;
        }

        .db-post-row {
          cursor: pointer;
          transition: background-color 0.15s ease, transform 0.15s ease;
        }

        .db-post-row:hover {
          background-color: #FAFBFD !important;
        }

        .db-post-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .db-post-thumb-wrap {
          position: relative;
          width: 44px;
          height: 44px;
          border-radius: 10px;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
        }

        .db-post-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.2s ease;
        }

        .db-post-row:hover .db-post-thumb {
          transform: scale(1.08);
        }

        .db-thumb-hover-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.15s ease;
        }

        .db-post-row:hover .db-thumb-hover-overlay {
          opacity: 1;
        }

        .db-post-cell__text {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .db-post-cell__text strong {
          font-size: 13.5px;
          font-weight: 700;
          color: #0F172A;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .db-post-cell__text span {
          font-size: 11.5px;
          color: #64748B;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .db-platforms {
          display: flex;
          gap: 4px;
        }

        .db-platform-tag {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .db-creator-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: #334155;
          font-family: var(--font-heading);
        }

        .db-creator-avatar {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, #C8102E 0%, #A80F28 100%);
          color: #FFFFFF;
          font-size: 9.5px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          display: inline-block;
          margin-right: 4px;
        }

        .db-row-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 4px;
        }

        .db-row-action-btn {
          width: 30px;
          height: 30px;
          border-radius: 7px;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          color: #64748B;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.12s ease;
        }

        .db-row-action-btn:hover {
          background: #C8102E;
          color: #FFFFFF;
          border-color: #C8102E;
        }

        /* Upcoming Schedule */
        .rc-schedule-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .rc-schedule-item {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          padding: 10px 12px;
          border-radius: 10px;
          background: #FAFBFD;
          border: 1px solid #E2E8F0;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .rc-schedule-item:hover {
          border-color: #C8102E;
          background: #FFFFFF;
          transform: translateX(2px);
        }

        .rc-schedule-item__dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #C8102E;
          margin-top: 5px;
          flex-shrink: 0;
        }

        .rc-schedule-item__body {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .rc-schedule-item__body strong {
          font-size: 13px;
          font-weight: 700;
          color: #0F172A;
        }

        .rc-schedule-item__body span {
          font-size: 11.5px;
          color: #64748B;
        }

        /* Post Inspection Modal */
        .db-modal-box {
          max-width: 600px;
          width: 100%;
          padding: 24px;
          border-radius: 20px;
          background: #FFFFFF;
        }

        .db-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 18px;
        }

        .db-modal-header h3 {
          font-size: 18px;
          font-weight: 800;
          color: #0F172A;
          font-family: var(--font-heading);
          margin-top: 6px;
        }

        .db-modal-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .db-modal-img-box {
          width: 100%;
          height: 220px;
          border-radius: 12px;
          overflow: hidden;
        }

        .db-modal-img-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .db-modal-meta-row {
          display: flex;
          gap: 20px;
          padding: 10px 14px;
          background: #F8FAFC;
          border: 1px solid #F1F5F9;
          border-radius: 10px;
        }

        .db-modal-meta {
          display: flex;
          flex-direction: column;
        }

        .db-modal-meta span {
          font-size: 11px;
          color: #64748B;
        }

        .db-modal-meta strong {
          font-size: 13px;
          color: #0F172A;
        }

        .db-modal-caption label, .db-modal-platforms label {
          display: block;
          font-size: 11.5px;
          font-weight: 700;
          color: #64748B;
          font-family: var(--font-heading);
          margin-bottom: 4px;
        }

        .db-modal-caption p {
          font-size: 13px;
          color: #334155;
          line-height: 1.5;
          background: #FAFBFD;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #E2E8F0;
        }

        .db-platform-tag-lg {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          font-family: var(--font-heading);
        }

        .db-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
          padding-top: 14px;
          border-top: 1px solid #F1F5F9;
        }

        @media (max-width: 1180px) {
          .rc-stat-grid { grid-template-columns: repeat(3, 1fr); }
          .rc-two-col { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .db-welcome-banner { flex-direction: column; align-items: flex-start; gap: 16px; }
          .db-quick-actions { width: 100%; }
          .db-action-btn { flex: 1; justify-content: center; }
        }
      `}</style>
    </div>
  );
}