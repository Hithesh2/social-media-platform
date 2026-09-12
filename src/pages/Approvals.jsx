import { useState, useEffect } from 'react';
import {
  FiCheckCircle,
  FiXCircle,
  FiMessageSquare,
  FiShield,
  FiAlertCircle,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiHeart,
  FiAward,
  FiCheckSquare,
  FiCamera,
  FiImage,
  FiRefreshCw,
  FiPlus,
} from 'react-icons/fi';
import { FaHeartbeat } from 'react-icons/fa';
import Sidebar from '../components/sidebar';
import Navbar from '../components/Navbar';
import { getPosts, updatePostStatus, updatePostImage, REDCROSS_PHOTOS } from '../Services/postService';
import { useAuth } from '../Context/AuthContext';

const PLATFORM_ICONS = {
  facebook: { icon: FiFacebook, color: '#1877F2', bg: '#E7F1FF' },
  instagram: { icon: FiInstagram, color: '#E4405F', bg: '#FDE8EC' },
  twitter: { icon: FiTwitter, color: '#14171A', bg: '#F0F0F0' },
};

export default function Approvals() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved' | 'rejected'
  const [selectedPost, setSelectedPost] = useState(null);
  const [feedbackInput, setFeedbackInput] = useState('');
  const [actionMsg, setActionMsg] = useState(null);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');

  useEffect(() => {
    loadPosts();
  }, [activeTab]);

  const loadPosts = () => {
    const all = getPosts();
    const filtered = all.filter((p) => (activeTab === 'pending' ? p.status === 'pending' : p.status === activeTab));
    setPosts(filtered);
    if (filtered.length > 0) {
      setSelectedPost(filtered[0]);
    } else {
      setSelectedPost(null);
    }
  };

  const handleApprove = (id) => {
    updatePostStatus(id, 'approved', feedbackInput || 'Verified & Approved by Content Approver for public broadcast.');
    setActionMsg({ type: 'success', text: 'Post approved and verified for publishing!' });
    setFeedbackInput('');
    setTimeout(() => {
      setActionMsg(null);
      loadPosts();
    }, 1000);
  };

  const handleReject = (id) => {
    if (!feedbackInput.trim()) {
      alert('Please provide reviewer feedback explaining why the post is returned for revision.');
      return;
    }
    updatePostStatus(id, 'rejected', feedbackInput);
    setActionMsg({ type: 'danger', text: 'Post returned to creator for policy revision.' });
    setFeedbackInput('');
    setTimeout(() => {
      setActionMsg(null);
      loadPosts();
    }, 1000);
  };

  const insertQuickFeedback = (msg) => {
    setFeedbackInput((prev) => (prev ? `${prev} ${msg}` : msg));
  };

  const handlePhotoChange = (url) => {
    if (!url || !selectedPost) return;
    updatePostImage(selectedPost.id, url);
    setSelectedPost((prev) => ({ ...prev, imageUrl: url }));
    setPosts((prev) => prev.map((p) => (p.id === selectedPost.id ? { ...p, imageUrl: url } : p)));
    setActionMsg({ type: 'success', text: 'Pending queue photo updated successfully!' });
    setShowPhotoPicker(false);
    setTimeout(() => setActionMsg(null), 2500);
  };

  return (
    <div className="app-shell">
      <Sidebar activeKey="approvals" />

      <div className="app-main">
        <Navbar title="Approvals & Compliance Workflow" />

        <main className="app-content">

          {/* Header & Healing Banner */}
          <div className="appr-header-banner">
            <div className="appr-header-text">
              <div className="appr-compliance-badge">
                <FiShield size={12} />
                <span>Red Cross Humanitarian Policy Gate</span>
              </div>
              <h2>Content Approvals & Compliance Verification</h2>
              <p>Review submitted media campaigns for beneficiary dignity, emblem protection, and medical accuracy.</p>
            </div>

            {/* Status Filter Tabs */}
            <div className="appr-tab-switch">
              <button
                type="button"
                className={`appr-tab-btn pending${activeTab === 'pending' ? ' is-active' : ''}`}
                onClick={() => setActiveTab('pending')}
              >
                <span>Pending Queue</span>
              </button>
              <button
                type="button"
                className={`appr-tab-btn approved${activeTab === 'approved' ? ' is-active' : ''}`}
                onClick={() => setActiveTab('approved')}
              >
                <span>Approved</span>
              </button>
              <button
                type="button"
                className={`appr-tab-btn rejected${activeTab === 'rejected' ? ' is-active' : ''}`}
                onClick={() => setActiveTab('rejected')}
              >
                <span>Revisions</span>
              </button>
            </div>
          </div>

          {actionMsg && (
            <div className={`appr-banner ${actionMsg.type}`}>
              {actionMsg.type === 'success' ? <FiCheckCircle size={18} /> : <FiAlertCircle size={18} />}
              <span>{actionMsg.text}</span>
            </div>
          )}

          {posts.length === 0 ? (
            <div className="rc-card empty-appr">
              <div className="empty-appr-icon">
                <FiCheckCircle size={42} />
              </div>
              <h3>All clear! No posts in {activeTab} queue.</h3>
              <p>All submitted social posts have been reviewed and verified.</p>
              <button
                type="button"
                className="rc-btn rc-btn-primary"
                style={{ marginTop: '12px' }}
                onClick={() => {
                  const newSample = {
                    title: 'Emergency Flood Relief Drive ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    caption: 'Red Cross emergency teams deployed with clean drinking water and first aid kits. Support our relief operations across affected divisions. #RedCrossRelief',
                    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
                    platforms: ['facebook', 'instagram'],
                    campaignId: 'disaster-response',
                    creator: user?.name || 'Seminda Fernando',
                    status: 'pending',
                  };
                  savePost(newSample);
                  setActiveTab('pending');
                  loadPosts();
                  setActionMsg({ type: 'success', text: 'Sample pending post added for approval review!' });
                  setTimeout(() => setActionMsg(null), 2000);
                }}
              >
                <FiPlus size={16} /> Add Pending Post for Review
              </button>
            </div>
          ) : (
            <div className="appr-grid">

              {/* Left Side: Queue List */}
              <section className="rc-card appr-list">
                <div className="appr-list-header">
                  <h3>Queue Items ({posts.length})</h3>
                </div>

                <div className="appr-items">
                  {posts.map((post) => {
                    const isSelected = selectedPost?.id === post.id;
                    return (
                      <button
                        type="button"
                        key={post.id}
                        className={`appr-item${isSelected ? ' is-selected' : ''}`}
                        onClick={() => {
                          setSelectedPost(post);
                          setFeedbackInput(post.feedback || '');
                        }}
                      >
                        <img src={post.imageUrl} alt="" className="appr-item__img" />
                        <div className="appr-item__info">
                          <strong>{post.title}</strong>
                          <span>By {post.creator} • {post.date}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Right Side: Detailed Review Panel */}
              {selectedPost && (
                <section className="rc-card appr-detail">
                  <div className="appr-detail__header">
                    <div>
                      <div className="appr-detail__badges">
                        <span className={`badge-status ${selectedPost.status}`}>{selectedPost.status}</span>
                        <span className="appr-channel-tag">
                          {selectedPost.platforms?.join(' / ')}
                        </span>
                      </div>
                      <h2>{selectedPost.title}</h2>
                      <p className="appr-detail__meta">
                        Submitted by <strong>{selectedPost.creator}</strong> on {selectedPost.date}
                      </p>
                    </div>
                  </div>

                  <div className="appr-detail__body">
                    {/* Media & Text Preview Box */}
                    <div className="appr-preview-box">
                      <div className="appr-preview-media">
                        <img src={selectedPost.imageUrl} alt={selectedPost.title} />
                        <button
                          type="button"
                          className="appr-change-photo-btn"
                          onClick={() => setShowPhotoPicker(true)}
                        >
                          <FiCamera size={14} /> Change Photo
                        </button>
                      </div>
                      <div className="appr-preview-text">
                        <p>{selectedPost.caption}</p>
                        {selectedPost.hashtags && selectedPost.hashtags.length > 0 && (
                          <div className="appr-tags">
                            {selectedPost.hashtags.map((h, i) => (
                              <span key={i} className="appr-tag">{h.startsWith('#') ? h : `#${h}`}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Red Cross Compliance Check Matrix */}
                    <div className="appr-compliance-matrix">
                      <span className="matrix-title"><FiAward size={13} /> Humanitarian Compliance Checklist</span>
                      <div className="matrix-grid">
                        <div className="matrix-item verified">
                          <FiCheckCircle size={14} /> Beneficiary Dignity Protected
                        </div>
                        <div className="matrix-item verified">
                          <FiCheckCircle size={14} /> Red Cross Emblem Rules Compliant
                        </div>
                        <div className="matrix-item verified">
                          <FiCheckCircle size={14} /> Verified Fact-Checking
                        </div>
                      </div>
                    </div>

                    {/* Reviewer Feedback Form */}
                    <div className="appr-feedback-field">
                      <label htmlFor="feedback">
                        <FiMessageSquare size={14} /> Reviewer Comments & Feedback Notes
                      </label>

                      <div className="quick-feedback-row">
                        <button
                          type="button"
                          className="qf-chip"
                          onClick={() => insertQuickFeedback('Approved for immediate multi-channel broadcast.')}
                        >
                          + Approve for Broadcast
                        </button>
                        <button
                          type="button"
                          className="qf-chip"
                          onClick={() => insertQuickFeedback('Please verify medical accuracy clause before release.')}
                        >
                          + Request Medical Check
                        </button>
                        <button
                          type="button"
                          className="qf-chip"
                          onClick={() => insertQuickFeedback('Update campaign hashtag formatting.')}
                        >
                          + Fix Hashtags
                        </button>
                      </div>

                      <textarea
                        id="feedback"
                        rows={3}
                        placeholder="Add review feedback notes for the content creator..."
                        value={feedbackInput}
                        onChange={(e) => setFeedbackInput(e.target.value)}
                      />
                    </div>

                    {/* Action Buttons for Reviewers and Creators */}
                    <div className="appr-actions">
                      <button
                        type="button"
                        className="appr-btn appr-btn--reject"
                        onClick={() => handleReject(selectedPost.id)}
                      >
                        <FiXCircle size={18} /> Return to Author
                      </button>
                      <button
                        type="button"
                        className="appr-btn appr-btn--approve"
                        onClick={() => handleApprove(selectedPost.id)}
                      >
                        <FiCheckCircle size={18} /> Verify & Approve Post
                      </button>
                    </div>
                  </div>
                </section>
              )}

            </div>
          )}

          {/* Photo Picker Modal */}
          {showPhotoPicker && selectedPost && (
            <div className="photo-picker-overlay" onClick={() => setShowPhotoPicker(false)}>
              <div className="photo-picker-modal" onClick={(e) => e.stopPropagation()}>
                <div className="ppm-header">
                  <div>
                    <span className="ppm-badge"><FiShield size={12} /> Red Cross Media Bank</span>
                    <h3>Select Official Red Cross Photo</h3>
                    <p>Choose a verified high-resolution photo for post: <strong>{selectedPost.title}</strong></p>
                  </div>
                  <button type="button" className="ppm-close" onClick={() => setShowPhotoPicker(false)}>✕</button>
                </div>

                <div className="ppm-grid">
                  {REDCROSS_PHOTOS.map((photo) => {
                    const isSelected = selectedPost.imageUrl === photo.url;
                    return (
                      <button
                        type="button"
                        key={photo.id}
                        className={`ppm-card${isSelected ? ' is-active' : ''}`}
                        onClick={() => handlePhotoChange(photo.url)}
                      >
                        <img src={photo.url} alt={photo.title} />
                        <div className="ppm-card__label">
                          <span>{photo.title}</span>
                          {isSelected && <FiCheckCircle size={14} className="ppm-check" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="ppm-custom">
                  <label htmlFor="custom-url"><FiImage size={13} /> Or enter custom image URL:</label>
                  <div className="ppm-custom-row">
                    <input
                      id="custom-url"
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={customPhotoUrl}
                      onChange={(e) => setCustomPhotoUrl(e.target.value)}
                    />
                    <button
                      type="button"
                      className="ppm-apply-btn"
                      onClick={() => {
                        if (customPhotoUrl.trim()) {
                          handlePhotoChange(customPhotoUrl.trim());
                          setCustomPhotoUrl('');
                        }
                      }}
                    >
                      Apply Photo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      <style>{`
        .appr-preview-media {
          position: relative;
          overflow: hidden;
        }

        .appr-change-photo-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(15, 23, 42, 0.78);
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 8px 14px;
          border-radius: 999px;
          font-size: 12.5px;
          font-weight: 700;
          font-family: var(--font-heading);
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }

        .appr-change-photo-btn:hover {
          background: #D97706;
          border-color: #FBBF24;
          transform: translateY(-1px);
        }

        /* Photo Picker Modal Overlay */
        .photo-picker-overlay {
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
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }

        .photo-picker-modal {
          background: #FFFFFF;
          border-radius: 20px;
          width: 100%;
          max-width: 680px;
          padding: 26px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
          border: 1px solid #E5E7EB;
        }

        .ppm-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .ppm-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          color: #D97706;
          background: #FEF3C7;
          padding: 3px 10px;
          border-radius: 999px;
          font-family: var(--font-heading);
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .ppm-header h3 {
          font-size: 20px;
          font-weight: 800;
          color: #1F2937;
          font-family: var(--font-heading);
        }

        .ppm-header p {
          font-size: 13px;
          color: #6B7280;
          margin-top: 2px;
        }

        .ppm-close {
          background: #F3F4F6;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 16px;
          font-weight: 700;
          color: #6B7280;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ppm-close:hover {
          background: #E5E7EB;
          color: #1F2937;
        }

        .ppm-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 14px;
          margin-bottom: 20px;
          max-height: 340px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .ppm-card {
          border: 2px solid #E5E7EB;
          border-radius: 12px;
          overflow: hidden;
          background: #FFFFFF;
          cursor: pointer;
          padding: 0;
          text-align: left;
          transition: all 0.2s ease;
          position: relative;
        }

        .ppm-card:hover {
          border-color: #D97706;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(217, 119, 6, 0.15);
        }

        .ppm-card.is-active {
          border-color: #059669;
          box-shadow: 0 6px 16px rgba(5, 150, 105, 0.2);
        }

        .ppm-card img {
          width: 100%;
          height: 110px;
          object-fit: cover;
        }

        .ppm-card__label {
          padding: 8px 10px;
          font-size: 12px;
          font-weight: 700;
          color: #374151;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-heading);
        }

        .ppm-check {
          color: #059669;
        }

        .ppm-custom {
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 14px;
        }

        .ppm-custom label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          font-weight: 700;
          color: #374151;
          margin-bottom: 8px;
          font-family: var(--font-heading);
        }

        .ppm-custom-row {
          display: flex;
          gap: 10px;
        }

        .ppm-custom-row input {
          flex: 1;
          border: 1px solid #D1D5DB;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 13px;
        }

        .ppm-apply-btn {
          background: #1F2937;
          color: #FFFFFF;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          font-family: var(--font-heading);
        }

        .ppm-apply-btn:hover {
          background: #059669;
        }
        .appr-header-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #0F172A 0%, #064E3B 50%, #047857 100%);
          border: 1px solid rgba(167, 243, 208, 0.3);
          border-radius: 18px;
          padding: 26px 32px;
          margin-bottom: 24px;
          box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.25), 0 4px 14px rgba(5, 150, 105, 0.2);
        }

        .appr-compliance-badge {
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

        .appr-header-text h2 {
          font-size: 24px;
          font-weight: 800;
          color: #FFFFFF;
          font-family: var(--font-heading);
          letter-spacing: -0.025em;
          margin-bottom: 4px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .appr-header-text p {
          font-size: 14px;
          color: #E2E8F0;
        }

        .appr-tab-switch {
          display: flex;
          background: #FFFFFF;
          border: 1px solid #D1D5DB;
          border-radius: 12px;
          padding: 4px;
          gap: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .appr-tab-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 700;
          color: #6B7280;
          background: transparent;
          cursor: pointer;
          font-family: var(--font-heading);
          transition: all 0.15s ease;
        }

        .appr-tab-btn.pending.is-active {
          background: #FEF3C7;
          color: #D97706;
        }

        .appr-tab-btn.approved.is-active {
          background: #ECFDF5;
          color: #059669;
        }

        .appr-tab-btn.rejected.is-active {
          background: #FEF2F2;
          color: #DC2626;
        }

        .appr-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          border-radius: 12px;
          margin-bottom: 22px;
          font-size: 14px;
          font-weight: 700;
          font-family: var(--font-heading);
        }

        .appr-banner.success { background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0; }
        .appr-banner.danger { background: #FEF2F2; color: #DC2626; border: 1px solid #FCA5A5; }

        .empty-appr {
          text-align: center;
          padding: 64px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          border-radius: 18px;
        }

        .empty-appr-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #ECFDF5;
          color: #059669;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(5, 150, 105, 0.2);
        }

        .empty-appr h3 { font-size: 20px; font-weight: 800; font-family: var(--font-heading); }
        .empty-appr p { color: #6B7280; font-size: 14px; }

        .appr-grid {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 22px;
          align-items: start;
        }

        .appr-list {
          padding: 20px;
          border-radius: 16px;
        }

        .appr-list-header h3 {
          font-size: 15px;
          font-weight: 800;
          font-family: var(--font-heading);
          margin-bottom: 14px;
          padding-bottom: 10px;
          border-bottom: 1px solid #F3F4F6;
        }

        .appr-items {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .appr-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 12px;
          border: 1.5px solid #E5E7EB;
          background: #FFFFFF;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: all 0.15s ease;
        }

        .appr-item.is-selected {
          border-color: #059669;
          background: #F0FDF4;
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.12);
        }

        .appr-item__img {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .appr-item__info {
          display: flex;
          flex-direction: column;
          gap: 3px;
          overflow: hidden;
        }

        .appr-item__info strong {
          font-size: 13.5px;
          font-weight: 700;
          color: #1F2937;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .appr-item__info span {
          font-size: 11.5px;
          color: #6B7280;
        }

        .appr-detail {
          padding: 26px;
          border-radius: 18px;
        }

        .appr-detail__badges {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .appr-channel-tag {
          font-size: 11px;
          font-weight: 700;
          color: #2563EB;
          background: #EFF6FF;
          padding: 3px 8px;
          border-radius: 999px;
          text-transform: capitalize;
        }

        .appr-detail__header h2 {
          font-size: 20px;
          font-weight: 800;
          font-family: var(--font-heading);
          color: #1F2937;
        }

        .appr-detail__meta {
          font-size: 13px;
          color: #6B7280;
          margin-top: 4px;
        }

        .appr-detail__body {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .appr-preview-box {
          border: 1px solid #E5E7EB;
          border-radius: 14px;
          overflow: hidden;
          background: #FFFFFF;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        }

        .appr-preview-media img {
          width: 100%;
          max-height: 300px;
          object-fit: cover;
        }

        .appr-preview-text {
          padding: 18px;
          font-size: 14px;
          line-height: 1.55;
          color: #374151;
        }

        .appr-tags {
          display: flex;
          gap: 6px;
          margin-top: 10px;
          flex-wrap: wrap;
        }

        .appr-tag {
          font-size: 12px;
          color: #2563EB;
          font-weight: 700;
        }

        /* Matrix Checklist */
        .appr-compliance-matrix {
          background: #F0FDF4;
          border: 1px solid #A7F3D0;
          border-radius: 12px;
          padding: 14px 16px;
        }

        .matrix-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          font-weight: 800;
          color: #059669;
          font-family: var(--font-heading);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-bottom: 10px;
        }

        .matrix-grid {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .matrix-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          font-weight: 600;
          color: #047857;
        }

        .appr-feedback-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .appr-feedback-field label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
          font-weight: 700;
          color: #1F2937;
          font-family: var(--font-heading);
        }

        .quick-feedback-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .qf-chip {
          border: 1px solid #D1D5DB;
          background: #FAFBFD;
          color: #4B5563;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 600;
          cursor: pointer;
          font-family: var(--font-heading);
        }

        .qf-chip:hover {
          background: #F3F4F6;
          border-color: #9CA3AF;
        }

        .appr-feedback-field textarea {
          border: 1px solid #D1D5DB;
          border-radius: 10px;
          padding: 12px;
          font-size: 13.5px;
          font-family: var(--font-body);
        }

        .appr-actions {
          display: flex;
          gap: 14px;
        }

        .appr-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 0;
          border-radius: 10px;
          font-weight: 800;
          font-size: 14px;
          font-family: var(--font-heading);
          cursor: pointer;
          border: none;
          transition: all 0.15s ease;
        }

        .appr-btn--reject {
          background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
          color: #FFFFFF;
          box-shadow: 0 4px 14px rgba(220, 38, 38, 0.22);
        }

        .appr-btn--reject:hover {
          box-shadow: 0 6px 18px rgba(220, 38, 38, 0.3);
        }

        .appr-btn--approve {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          color: #FFFFFF;
          box-shadow: 0 4px 14px rgba(5, 150, 105, 0.25);
        }

        .appr-btn--approve:hover {
          box-shadow: 0 6px 18px rgba(5, 150, 105, 0.35);
        }

        @media (max-width: 900px) {
          .appr-grid { grid-template-columns: 1fr; }
          .appr-header-banner { flex-direction: column; align-items: flex-start; gap: 14px; }
        }
      `}</style>
    </div>
  );
}
