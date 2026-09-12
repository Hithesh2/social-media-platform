import { useState, useEffect } from 'react';
import {
  FiCalendar,
  FiClock,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiFilter,
  FiCheckCircle,
  FiEye,
  FiZap,
  FiShare2,
} from 'react-icons/fi';
import Sidebar from '../components/sidebar';
import Navbar from '../components/Navbar';
import { getPosts } from '../Services/postService';
import { useNavigate } from 'react-router-dom';

const PLATFORM_ICONS = {
  facebook: { icon: FiFacebook, color: '#1877F2', bg: '#E7F1FF' },
  instagram: { icon: FiInstagram, color: '#E4405F', bg: '#FDE8EC' },
  twitter: { icon: FiTwitter, color: '#14171A', bg: '#F0F0F0' },
};

export default function Schedule() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentMonth, setCurrentMonth] = useState('September 2026');

  useEffect(() => {
    const all = getPosts();
    setPosts(all);
  }, []);

  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const filteredPosts = posts.filter((p) => {
    if (selectedPlatform === 'all') return true;
    return p.platforms?.includes(selectedPlatform);
  });

  const getDayPosts = (dayNum) => {
    return filteredPosts.filter((p) => {
      if (p.schedule) {
        const d = new Date(p.schedule);
        if (!isNaN(d.getTime())) return d.getDate() === dayNum;
      }
      // Demo fallback distribution for visual calendar richness
      if (p.id === 'post-1') return dayNum === 10;
      if (p.id === 'post-2') return dayNum === 11;
      if (p.id === 'post-3') return dayNum === 12;
      if (p.id === 'post-4') return dayNum === 13;
      if (p.id === 'post-5') return dayNum === 18;
      return false;
    });
  };

  return (
    <div className="app-shell">
      <Sidebar activeKey="schedule" />

      <div className="app-main">
        <Navbar title="Publishing Schedule & Visual Calendar" />

        <main className="app-content">
          
          {/* Hero Banner with Stats & Actions */}
          <div className="sch-hero-card">
            <div className="sch-hero-info">
              <div className="sch-badge">
                <FiCalendar size={12} />
                <span>Red Cross Broadcast Control</span>
              </div>
              <h2>Multi-Channel Publishing Calendar</h2>
              <p>Visual schedule timetable for automated Red Cross public health and disaster response broadcasts.</p>
            </div>

            <div className="sch-hero-right">
              <div className="sch-stats-row">
                <div className="sch-stat-pill">
                  <FiZap size={14} color="#C8102E" />
                  <div>
                    <strong>{posts.length}</strong>
                    <span>Total Posts</span>
                  </div>
                </div>
                <div className="sch-stat-pill">
                  <FiClock size={14} color="#059669" />
                  <div>
                    <strong>{posts.filter(p => p.status === 'scheduled' || p.status === 'approved').length}</strong>
                    <span>Scheduled</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="sch-create-btn"
                onClick={() => navigate('/create')}
              >
                <FiPlus size={16} /> Schedule New Post
              </button>
            </div>
          </div>

          {/* Calendar Control Bar */}
          <div className="sch-controls-bar">
            <div className="sch-month-switch">
              <button type="button" className="sch-nav-btn"><FiChevronLeft size={16} /></button>
              <strong>{currentMonth}</strong>
              <button type="button" className="sch-nav-btn"><FiChevronRight size={16} /></button>
            </div>

            <div className="sch-filter-chips">
              <span className="sch-filter-label"><FiFilter size={12} /> Filter Channel:</span>
              <button
                type="button"
                className={`sch-chip${selectedPlatform === 'all' ? ' is-active' : ''}`}
                onClick={() => setSelectedPlatform('all')}
              >
                All Channels
              </button>
              <button
                type="button"
                className={`sch-chip fb${selectedPlatform === 'facebook' ? ' is-active' : ''}`}
                onClick={() => setSelectedPlatform('facebook')}
              >
                <FiFacebook size={12} /> Facebook
              </button>
              <button
                type="button"
                className={`sch-chip ig${selectedPlatform === 'instagram' ? ' is-active' : ''}`}
                onClick={() => setSelectedPlatform('instagram')}
              >
                <FiInstagram size={12} /> Instagram
              </button>
              <button
                type="button"
                className={`sch-chip tw${selectedPlatform === 'twitter' ? ' is-active' : ''}`}
                onClick={() => setSelectedPlatform('twitter')}
              >
                <FiTwitter size={12} /> X / Twitter
              </button>
            </div>
          </div>

          {/* Calendar Grid Container */}
          <div className="rc-card sch-calendar-card">
            <div className="sch-days-header">
              {DAYS.map((d) => (
                <div key={d} className="sch-day-title">{d}</div>
              ))}
            </div>

            <div className="sch-grid">
              {Array.from({ length: 35 }, (_, i) => {
                const dayNum = i - 1; // 1-30 days range
                const isCurrentMonth = dayNum >= 1 && dayNum <= 30;
                const isToday = dayNum === 12;
                const dayPosts = isCurrentMonth ? getDayPosts(dayNum) : [];

                return (
                  <div
                    key={i}
                    className={`sch-day-cell${!isCurrentMonth ? ' is-outside' : ''}${isToday ? ' is-today' : ''}`}
                  >
                    <div className="sch-day-top">
                      <span className={`sch-day-num${isToday ? ' today-badge' : ''}`}>
                        {isCurrentMonth ? dayNum : (dayNum < 1 ? 31 + dayNum : dayNum - 30)}
                      </span>
                      {dayPosts.length > 0 && (
                        <span className="sch-post-count">{dayPosts.length} post{dayPosts.length > 1 ? 's' : ''}</span>
                      )}
                    </div>

                    <div className="sch-day-posts">
                      {dayPosts.map((post) => (
                        <div
                          key={post.id}
                          className={`sch-visual-card ${post.status}`}
                          onClick={() => setSelectedPost(post)}
                        >
                          <div className="sch-card-thumb">
                            <img src={post.imageUrl} alt={post.title} />
                            <div className="sch-card-platforms">
                              {post.platforms?.map((plat) => {
                                const PlatIcon = PLATFORM_ICONS[plat]?.icon || FiShare2;
                                return <PlatIcon key={plat} size={10} color="#FFFFFF" />;
                              })}
                            </div>
                          </div>
                          <div className="sch-card-body">
                            <strong>{post.title}</strong>
                            <span className="sch-card-time">
                              <FiClock size={10} /> {post.schedule ? new Date(post.schedule).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:00 AM'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Image-Rich Upcoming Broadcasts Feed */}
          <div className="rc-card sch-feed-card">
            <div className="sch-feed-header">
              <div>
                <h3>Upcoming Scheduled Broadcast Feed</h3>
                <p>High-priority humanitarian posts queued for automated release</p>
              </div>
              <span className="sch-feed-badge"><FiCheckCircle size={13} /> Auto-Queue Active</span>
            </div>

            <div className="sch-feed-grid">
              {posts.map((post) => (
                <div key={post.id} className="sch-feed-item" onClick={() => setSelectedPost(post)}>
                  <div className="sch-feed-media">
                    <img src={post.imageUrl} alt={post.title} />
                    <span className={`badge-status ${post.status}`}>{post.status}</span>
                  </div>

                  <div className="sch-feed-content">
                    <div className="sch-feed-meta">
                      <span className="sch-feed-time">
                        <FiClock size={12} /> {post.schedule ? new Date(post.schedule).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '13 Sep 2026, 09:00 AM'}
                      </span>
                      <div className="sch-feed-channels">
                        {post.platforms?.map((p) => {
                          const conf = PLATFORM_ICONS[p];
                          if (!conf) return null;
                          const Icon = conf.icon;
                          return (
                            <span key={p} className="sch-channel-icon" style={{ background: conf.bg, color: conf.color }}>
                              <Icon size={12} />
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <h4>{post.title}</h4>
                    <p>{post.caption}</p>

                    <div className="sch-feed-footer">
                      <span className="sch-author-tag">Creator: {post.creator || 'Red Cross Officer'}</span>
                      <button type="button" className="sch-view-btn">
                        <FiEye size={13} /> View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Post Preview Modal */}
          {selectedPost && (
            <div className="sch-modal-overlay" onClick={() => setSelectedPost(null)}>
              <div className="sch-modal-content" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="sch-modal-close" onClick={() => setSelectedPost(null)}>✕</button>
                
                <div className="sch-modal-media">
                  <img src={selectedPost.imageUrl} alt={selectedPost.title} />
                  <span className={`badge-status ${selectedPost.status}`}>{selectedPost.status}</span>
                </div>

                <div className="sch-modal-body">
                  <div className="sch-modal-meta">
                    <span className="sch-modal-time">
                      <FiClock size={14} /> Scheduled: {selectedPost.schedule ? new Date(selectedPost.schedule).toLocaleString() : '13 Sep 2026, 09:00 AM'}
                    </span>
                    <div className="sch-modal-platforms">
                      {selectedPost.platforms?.map((plat) => {
                        const conf = PLATFORM_ICONS[plat];
                        if (!conf) return null;
                        const Icon = conf.icon;
                        return (
                          <span key={plat} className="sch-modal-plat-tag" style={{ background: conf.bg, color: conf.color }}>
                            <Icon size={12} /> {plat}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <h3>{selectedPost.title}</h3>
                  <p className="sch-modal-caption">{selectedPost.caption}</p>

                  <div className="sch-modal-footer">
                    <span>Submitted by <strong>{selectedPost.creator}</strong></span>
                    <button type="button" className="rc-btn-primary" onClick={() => setSelectedPost(null)}>
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      <style>{`
        .sch-hero-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 45%, #991B1B 100%);
          border: 1px solid rgba(254, 202, 202, 0.25);
          border-radius: 18px;
          padding: 26px 32px;
          margin-bottom: 24px;
          box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.25), 0 4px 14px rgba(200, 16, 46, 0.2);
        }

        .sch-badge {
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

        .sch-hero-info h2 {
          font-size: 24px;
          font-weight: 800;
          color: #FFFFFF;
          font-family: var(--font-heading);
          letter-spacing: -0.025em;
          margin-bottom: 4px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .sch-hero-info p {
          font-size: 14px;
          color: #E2E8F0;
        }

        .sch-hero-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .sch-stats-row {
          display: flex;
          gap: 12px;
        }

        .sch-stat-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          padding: 8px 14px;
          border-radius: 12px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.03);
        }

        .sch-stat-pill strong {
          display: block;
          font-size: 16px;
          font-weight: 800;
          color: #1F2937;
          line-height: 1;
        }

        .sch-stat-pill span {
          font-size: 11px;
          color: #6B7280;
          font-weight: 600;
        }

        .sch-create-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #C8102E 0%, #9B0B22 100%);
          color: #FFFFFF;
          border: none;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 800;
          font-family: var(--font-heading);
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(200, 16, 46, 0.3);
          transition: all 0.15s ease;
        }

        .sch-create-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(200, 16, 46, 0.4);
        }

        .sch-controls-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 14px;
          padding: 12px 18px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }

        .sch-month-switch {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sch-month-switch strong {
          font-size: 15px;
          font-weight: 800;
          color: #1F2937;
          font-family: var(--font-heading);
        }

        .sch-nav-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid #D1D5DB;
          background: #FFFFFF;
          color: #374151;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .sch-nav-btn:hover {
          background: #F3F4F6;
        }

        .sch-filter-chips {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sch-filter-label {
          font-size: 12.5px;
          font-weight: 700;
          color: #6B7280;
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-heading);
          margin-right: 4px;
        }

        .sch-chip {
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid #D1D5DB;
          background: #FFFFFF;
          color: #4B5563;
          font-size: 12px;
          font-weight: 700;
          font-family: var(--font-heading);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.15s ease;
        }

        .sch-chip:hover {
          background: #F9FAFB;
        }

        .sch-chip.is-active {
          background: #1F2937;
          color: #FFFFFF;
          border-color: #1F2937;
        }

        .sch-chip.fb.is-active { background: #1877F2; border-color: #1877F2; }
        .sch-chip.ig.is-active { background: #E4405F; border-color: #E4405F; }
        .sch-chip.tw.is-active { background: #14171A; border-color: #14171A; }

        .sch-calendar-card {
          padding: 0;
          overflow: hidden;
          margin-bottom: 24px;
          border-radius: 16px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        }

        .sch-days-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          background: #FAFBFD;
          border-bottom: 1px solid #E2E8F0;
        }

        .sch-day-title {
          padding: 8px 4px;
          text-align: center;
          font-weight: 800;
          font-size: 11px;
          color: #475569;
          font-family: var(--font-heading);
          border-right: 1px solid #F1F5F9;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .sch-day-title:last-child { border-right: none; }

        .sch-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
        }

        .sch-day-cell {
          min-height: 78px;
          padding: 5px 6px;
          border-right: 1px solid #F1F5F9;
          border-bottom: 1px solid #F1F5F9;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: background-color 0.12s ease;
        }

        .sch-day-cell:hover:not(.is-outside) {
          background: #FAFBFD;
        }

        .sch-day-cell:nth-child(7n) { border-right: none; }

        .sch-day-cell.is-outside {
          background: #F8FAFC;
          opacity: 0.45;
        }

        .sch-day-cell.is-today {
          background: #FFFDF5;
          border-color: #FDE68A;
        }

        .sch-day-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2px;
        }

        .sch-day-num {
          font-size: 11.5px;
          font-weight: 800;
          color: #334155;
          font-family: var(--font-heading);
        }

        .sch-day-num.today-badge {
          background: #C8102E;
          color: #FFFFFF;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10.5px;
          box-shadow: 0 2px 6px rgba(200, 16, 46, 0.35);
        }

        .sch-post-count {
          font-size: 9.5px;
          font-weight: 700;
          color: #059669;
          background: #ECFDF5;
          padding: 1px 5px;
          border-radius: 999px;
          border: 1px solid #A7F3D0;
        }

        .sch-day-posts {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .sch-visual-card {
          display: flex;
          align-items: center;
          gap: 5px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 6px;
          padding: 3px 4px;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }

        .sch-visual-card:hover {
          border-color: #C8102E;
          transform: translateY(-1px);
          box-shadow: 0 3px 8px rgba(200, 16, 46, 0.18);
        }

        .sch-card-thumb {
          position: relative;
          width: 28px;
          height: 28px;
          border-radius: 4px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .sch-card-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .sch-card-platforms {
          position: absolute;
          bottom: 1px;
          right: 1px;
          display: flex;
          gap: 1px;
          background: rgba(0, 0, 0, 0.7);
          padding: 1px 2px;
          border-radius: 3px;
        }

        .sch-card-body {
          display: flex;
          flex-direction: column;
          gap: 1px;
          overflow: hidden;
        }

        .sch-card-body strong {
          font-size: 10px;
          font-weight: 700;
          color: #0F172A;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-family: var(--font-heading);
          line-height: 1.1;
        }

        .sch-card-time {
          font-size: 9px;
          color: #64748B;
          display: flex;
          align-items: center;
          gap: 2px;
          font-weight: 600;
        }

        /* Feed Section */
        .sch-feed-card {
          padding: 24px;
          border-radius: 18px;
        }

        .sch-feed-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid #F3F4F6;
        }

        .sch-feed-header h3 {
          font-size: 18px;
          font-weight: 800;
          font-family: var(--font-heading);
          color: #1F2937;
        }

        .sch-feed-header p {
          font-size: 13px;
          color: #6B7280;
          margin-top: 2px;
        }

        .sch-feed-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: #059669;
          background: #ECFDF5;
          padding: 5px 12px;
          border-radius: 999px;
          border: 1px solid #A7F3D0;
          font-family: var(--font-heading);
        }

        .sch-feed-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 18px;
        }

        .sch-feed-item {
          display: flex;
          flex-direction: column;
          border: 1px solid #E5E7EB;
          border-radius: 14px;
          overflow: hidden;
          background: #FFFFFF;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        }

        .sch-feed-item:hover {
          border-color: #C8102E;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(200, 16, 46, 0.12);
        }

        .sch-feed-media {
          position: relative;
          height: 160px;
          overflow: hidden;
        }

        .sch-feed-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .sch-feed-item:hover .sch-feed-media img {
          transform: scale(1.04);
        }

        .sch-feed-media .badge-status {
          position: absolute;
          top: 10px;
          right: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .sch-feed-content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sch-feed-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sch-feed-time {
          font-size: 11.5px;
          font-weight: 700;
          color: #D97706;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .sch-feed-channels {
          display: flex;
          gap: 4px;
        }

        .sch-channel-icon {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sch-feed-content h4 {
          font-size: 15px;
          font-weight: 800;
          color: #1F2937;
          font-family: var(--font-heading);
          line-height: 1.3;
        }

        .sch-feed-content p {
          font-size: 13px;
          color: #4B5563;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.45;
        }

        .sch-feed-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 6px;
          padding-top: 10px;
          border-top: 1px solid #F3F4F6;
        }

        .sch-author-tag {
          font-size: 11.5px;
          color: #6B7280;
          font-weight: 600;
        }

        .sch-view-btn {
          border: none;
          background: #F3F4F6;
          color: #374151;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 700;
          font-family: var(--font-heading);
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        }

        .sch-feed-item:hover .sch-view-btn {
          background: #C8102E;
          color: #FFFFFF;
        }

        /* Modal Overlay */
        .sch-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(6px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .sch-modal-content {
          background: #FFFFFF;
          border-radius: 20px;
          max-width: 580px;
          width: 100%;
          overflow: hidden;
          position: relative;
          box-shadow: 0 20px 50px rgba(0,0,0,0.25);
        }

        .sch-modal-close {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.6);
          color: #FFFFFF;
          border: none;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sch-modal-media {
          position: relative;
          height: 240px;
        }

        .sch-modal-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .sch-modal-media .badge-status {
          position: absolute;
          bottom: 14px;
          left: 14px;
        }

        .sch-modal-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sch-modal-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sch-modal-time {
          font-size: 12.5px;
          font-weight: 700;
          color: #D97706;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .sch-modal-platforms {
          display: flex;
          gap: 6px;
        }

        .sch-modal-plat-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          text-transform: capitalize;
        }

        .sch-modal-body h3 {
          font-size: 20px;
          font-weight: 800;
          color: #1F2937;
          font-family: var(--font-heading);
        }

        .sch-modal-caption {
          font-size: 14px;
          color: #4B5563;
          line-height: 1.55;
        }

        .sch-modal-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          padding-top: 14px;
          border-top: 1px solid #F3F4F6;
          font-size: 13px;
          color: #6B7280;
        }

        @media (max-width: 900px) {
          .sch-hero-card { flex-direction: column; align-items: flex-start; gap: 14px; }
          .sch-grid { grid-template-columns: repeat(2, 1fr); }
          .sch-controls-bar { flex-direction: column; gap: 12px; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
}

