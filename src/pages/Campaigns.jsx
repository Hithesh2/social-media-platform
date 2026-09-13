import { useState, useEffect } from 'react';
import { FaBullhorn } from 'react-icons/fa';
import {
  FiPlus,
  FiCheckCircle,
  FiUsers,
  FiTrendingUp,
  FiCalendar,
  FiSearch,
  FiEye,
  FiTarget,
  FiAward,
  FiImage,
  FiShare2,
} from 'react-icons/fi';
import Sidebar from '../components/sidebar';
import Navbar from '../components/Navbar';
import { getCampaigns, saveCampaign, CAMPAIGN_COVER_PRESETS } from '../Services/campaignService';
import { useNavigate } from 'react-router-dom';

export default function Campaigns() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'active' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [objective, setObjective] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCoverUrl, setSelectedCoverUrl] = useState(CAMPAIGN_COVER_PRESETS[0].url);

  useEffect(() => {
    setCampaigns(getCampaigns());
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCamp = saveCampaign({
      name,
      objective,
      targetAudience,
      startDate,
      endDate,
      imageUrl: selectedCoverUrl,
      progress: 0,
      reachGoal: '50,000',
    });

    setCampaigns([newCamp, ...campaigns]);
    setName('');
    setObjective('');
    setTargetAudience('');
    setStartDate('');
    setEndDate('');
    setShowModal(false);
  };

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesTab =
      activeTab === 'all'
        ? true
        : c.status?.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch =
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.targetAudience?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.objective?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalReachNum = campaigns.reduce((acc, c) => {
    const num = parseInt((c.reach || '0').replace(/,/g, ''), 10);
    return acc + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <div className="app-shell">
      <Sidebar activeKey="campaigns" />

      <div className="app-main">
        <Navbar title="Strategic Social Campaigns" />

        <main className="app-content">

          {/* Hero Banner with Stats */}
          <div className="cmp-hero-card">
            <div className="cmp-hero-info">
              <div className="cmp-badge">
                <FaBullhorn size={12} />
                <span>Red Cross Humanitarian Campaigns</span>
              </div>
              <h2>Strategic Campaigns & Public Health Drives</h2>
              <p>Manage multi-channel public health awareness, blood donation drives, and flood response funds.</p>
            </div>

            <div className="cmp-hero-right">
              <div className="cmp-stats-group">
                <div className="cmp-stat-pill">
                  <FiTarget size={15} color="#C8102E" />
                  <div>
                    <strong>{campaigns.filter((c) => c.status === 'Active').length} Active</strong>
                    <span>Campaign Drives</span>
                  </div>
                </div>

                <div className="cmp-stat-pill">
                  <FiTrendingUp size={15} color="#059669" />
                  <div>
                    <strong>{(totalReachNum / 1000).toFixed(1)}k+</strong>
                    <span>Total Reach</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="cmp-create-btn"
                onClick={() => setShowModal(true)}
              >
                <FiPlus size={16} /> Launch Campaign
              </button>
            </div>
          </div>

          {/* Controls Bar: Search & Status Filter Tabs */}
          <div className="cmp-controls-bar">
            <div className="cmp-search-box">
              <FiSearch size={15} color="#6B7280" />
              <input
                type="text"
                placeholder="Search campaign title, objective or target group..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="cmp-filter-tabs">
              <button
                type="button"
                className={`cmp-tab-btn${activeTab === 'all' ? ' is-active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All Campaigns ({campaigns.length})
              </button>
              <button
                type="button"
                className={`cmp-tab-btn active-tab${activeTab === 'active' ? ' is-active' : ''}`}
                onClick={() => setActiveTab('active')}
              >
                Active ({campaigns.filter((c) => c.status === 'Active').length})
              </button>
              <button
                type="button"
                className={`cmp-tab-btn completed-tab${activeTab === 'completed' ? ' is-active' : ''}`}
                onClick={() => setActiveTab('completed')}
              >
                Completed ({campaigns.filter((c) => c.status === 'Completed').length})
              </button>
            </div>
          </div>

          {/* Image-Rich Campaign Cards Grid */}
          <div className="cmp-grid">
            {filteredCampaigns.map((c) => (
              <div key={c.id} className="rc-card cmp-card">

                {/* Visual Cover Photo Banner */}
                <div className="cmp-card-cover">
                  <img src={c.imageUrl || CAMPAIGN_COVER_PRESETS[0].url} alt={c.name} />
                  <div className="cmp-cover-overlay">
                    <span className={`badge-status ${c.status?.toLowerCase()}`}>{c.status}</span>
                    <span className="cmp-posts-badge">{c.postsCount || 0} Posts Live</span>
                  </div>
                </div>

                <div className="cmp-card-body">
                  <h3 className="cmp-card-title">{c.name}</h3>
                  <p className="cmp-card-obj">{c.objective || 'No objective specified.'}</p>

                  <div className="cmp-meta-box">
                    <div className="cmp-meta-item">
                      <FiUsers size={13} color="#2563EB" />
                      <span>{c.targetAudience}</span>
                    </div>
                    <div className="cmp-meta-item">
                      <FiCalendar size={13} color="#D97706" />
                      <span>{c.startDate} to {c.endDate || 'Ongoing'}</span>
                    </div>
                  </div>

                  {/* Reach Target Progress Bar */}
                  <div className="cmp-progress-section">
                    <div className="cmp-progress-labels">
                      <span>Reach Target Goal</span>
                      <strong>{c.reach || '0'} / {c.reachGoal || '50,000'}</strong>
                    </div>
                    <div className="cmp-progress-track">
                      <div
                        className="cmp-progress-bar"
                        style={{ width: `${Math.min(c.progress || 75, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="cmp-stats-grid">
                    <div className="cmp-stat-box">
                      <strong>{c.postsCount || 0}</strong>
                      <span>Posts</span>
                    </div>
                    <div className="cmp-stat-box">
                      <strong>{c.reach || '0'}</strong>
                      <span>Reach</span>
                    </div>
                    <div className="cmp-stat-box">
                      <strong>{c.engagement || '0%'}</strong>
                      <span>Engagement</span>
                    </div>
                  </div>

                  <div className="cmp-card-actions">
                    <button
                      type="button"
                      className="cmp-btn-secondary"
                      onClick={() => navigate('/posts')}
                    >
                      View Posts
                    </button>
                    <button
                      type="button"
                      className="cmp-btn-primary"
                      onClick={() => setSelectedCampaign(c)}
                    >
                      <FiEye size={13} /> Brief & Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Campaign Brief & Details Modal */}
          {selectedCampaign && (
            <div className="cmp-modal-overlay" onClick={() => setSelectedCampaign(null)}>
              <div className="cmp-modal-card" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="cmp-modal-close" onClick={() => setSelectedCampaign(null)}>✕</button>

                <div className="cmp-modal-cover">
                  <img src={selectedCampaign.imageUrl} alt={selectedCampaign.name} />
                  <span className={`badge-status ${selectedCampaign.status?.toLowerCase()}`}>{selectedCampaign.status}</span>
                </div>

                <div className="cmp-modal-body">
                  <div className="cmp-modal-header">
                    <span className="cmp-modal-tag"><FaBullhorn size={12} /> Red Cross Official Campaign Brief</span>
                    <h2>{selectedCampaign.name}</h2>
                    <p className="cmp-modal-obj">{selectedCampaign.objective}</p>
                  </div>

                  <div className="cmp-modal-details-grid">
                    <div className="cmd-box">
                      <span>Target Demographic</span>
                      <strong>{selectedCampaign.targetAudience}</strong>
                    </div>
                    <div className="cmd-box">
                      <span>Campaign Timeline</span>
                      <strong>{selectedCampaign.startDate} — {selectedCampaign.endDate || 'Ongoing'}</strong>
                    </div>
                    <div className="cmd-box">
                      <span>Estimated Audience Reach</span>
                      <strong style={{ color: '#059669' }}>{selectedCampaign.reach} People</strong>
                    </div>
                    <div className="cmd-box">
                      <span>Engagement Metric</span>
                      <strong style={{ color: '#2563EB' }}>{selectedCampaign.engagement} Rate</strong>
                    </div>
                  </div>

                  <div className="cmp-modal-footer">
                    <button type="button" className="cp-btn cp-btn--ghost" onClick={() => setSelectedCampaign(null)}>
                      Close Brief
                    </button>
                    <button type="button" className="cp-btn cp-btn--primary" onClick={() => { setSelectedCampaign(null); navigate('/create'); }}>
                      + Create Post for Campaign
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Launch New Campaign Modal */}
          {showModal && (
            <div className="cmp-modal-overlay" onClick={() => setShowModal(false)}>
              <div className="cmp-create-modal" onClick={(e) => e.stopPropagation()}>
                <div className="ccm-header">
                  <div>
                    <h3>Launch New Red Cross Campaign</h3>
                    <p>Set up campaign objective, target audience, and select official media cover</p>
                  </div>
                  <button type="button" className="ccm-close" onClick={() => setShowModal(false)}>✕</button>
                </div>

                <form onSubmit={handleCreate}>
                  <div className="modal-field">
                    <label>Campaign Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. World First Aid Day 2026"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="modal-field">
                    <label>Objective & Key Result</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Educate urban youth on emergency CPR guidelines..."
                      value={objective}
                      onChange={(e) => setObjective(e.target.value)}
                    />
                  </div>

                  <div className="modal-field">
                    <label>Target Audience</label>
                    <input
                      type="text"
                      placeholder="e.g. Youth (18-35) & Universities"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                    />
                  </div>

                  {/* Cover Photo Selector */}
                  <div className="modal-field">
                    <label><FiImage size={13} /> Select Campaign Cover Image</label>
                    <div className="ccm-cover-grid">
                      {CAMPAIGN_COVER_PRESETS.map((preset) => (
                        <div
                          key={preset.id}
                          className={`ccm-cover-card${selectedCoverUrl === preset.url ? ' is-selected' : ''}`}
                          onClick={() => setSelectedCoverUrl(preset.url)}
                        >
                          <img src={preset.url} alt={preset.title} />
                          <span>{preset.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="modal-row">
                    <div className="modal-field">
                      <label>Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="modal-field">
                      <label>End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button type="button" className="cp-btn cp-btn--ghost" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="cp-btn cp-btn--primary">
                      Launch Campaign
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>

      <style>{`
        .cmp-hero-card {
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

        .cmp-badge {
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

        .cmp-hero-info h2 {
          font-size: 24px;
          font-weight: 800;
          color: #FFFFFF;
          font-family: var(--font-heading);
          letter-spacing: -0.025em;
          margin-bottom: 4px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .cmp-hero-info p {
          font-size: 14px;
          color: #E2E8F0;
        }

        .cmp-hero-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .cmp-stats-group {
          display: flex;
          gap: 12px;
        }

        .cmp-stat-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          padding: 8px 14px;
          border-radius: 12px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.03);
        }

        .cmp-stat-pill strong {
          display: block;
          font-size: 15px;
          font-weight: 800;
          color: #1F2937;
          line-height: 1;
        }

        .cmp-stat-pill span {
          font-size: 11px;
          color: #6B7280;
          font-weight: 600;
        }

        .cmp-create-btn {
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

        .cmp-create-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(200, 16, 46, 0.4);
        }

        .cmp-controls-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 22px;
          gap: 16px;
        }

        .cmp-search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #FFFFFF;
          border: 1px solid #D1D5DB;
          border-radius: 12px;
          padding: 9px 14px;
          width: 380px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        .cmp-search-box input {
          border: none;
          outline: none;
          font-size: 13px;
          width: 100%;
          color: #1F2937;
        }

        .cmp-filter-tabs {
          display: flex;
          background: #FFFFFF;
          border: 1px solid #D1D5DB;
          border-radius: 12px;
          padding: 4px;
          gap: 4px;
        }

        .cmp-tab-btn {
          padding: 7px 14px;
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

        .cmp-tab-btn.is-active {
          background: #1F2937;
          color: #FFFFFF;
        }

        .cmp-tab-btn.active-tab.is-active {
          background: #ECFDF5;
          color: #059669;
        }

        .cmp-tab-btn.completed-tab.is-active {
          background: #F3F4F6;
          color: #374151;
        }

        /* Campaign Cards Grid */
        .cmp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 22px;
        }

        .cmp-card {
          padding: 0;
          overflow: hidden;
          border-radius: 18px;
          border: 1px solid #E5E7EB;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          transition: all 0.2s ease;
          box-shadow: 0 2px 10px rgba(0,0,0,0.03);
        }

        .cmp-card:hover {
          border-color: #C8102E;
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(200, 16, 46, 0.12);
        }

        .cmp-card-cover {
          position: relative;
          height: 170px;
          overflow: hidden;
        }

        .cmp-card-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .cmp-card:hover .cmp-card-cover img {
          transform: scale(1.05);
        }

        .cmp-cover-overlay {
          position: absolute;
          top: 12px;
          left: 12px;
          right: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cmp-posts-badge {
          font-size: 11px;
          font-weight: 800;
          color: #FFFFFF;
          background: rgba(15, 23, 42, 0.75);
          padding: 4px 10px;
          border-radius: 999px;
          backdrop-filter: blur(4px);
          font-family: var(--font-heading);
        }

        .cmp-card-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .cmp-card-title {
          font-size: 17px;
          font-weight: 800;
          color: #1F2937;
          font-family: var(--font-heading);
          margin-bottom: 6px;
        }

        .cmp-card-obj {
          font-size: 13px;
          color: #4B5563;
          line-height: 1.48;
          margin-bottom: 14px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .cmp-meta-box {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 10px 12px;
          background: #F9FAFB;
          border-radius: 10px;
          border: 1px solid #F3F4F6;
          margin-bottom: 14px;
        }

        .cmp-meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #374151;
        }

        /* Progress Bar */
        .cmp-progress-section {
          margin-bottom: 16px;
        }

        .cmp-progress-labels {
          display: flex;
          justify-content: space-between;
          font-size: 11.5px;
          font-weight: 700;
          color: #6B7280;
          margin-bottom: 6px;
        }

        .cmp-progress-labels strong {
          color: #059669;
        }

        .cmp-progress-track {
          height: 7px;
          background: #E5E7EB;
          border-radius: 999px;
          overflow: hidden;
        }

        .cmp-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #059669 0%, #10B981 100%);
          border-radius: 999px;
          transition: width 0.4s ease;
        }

        .cmp-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          text-align: center;
          padding-top: 12px;
          border-top: 1px solid #F3F4F6;
          margin-bottom: 16px;
        }

        .cmp-stat-box strong {
          display: block;
          font-size: 15px;
          font-weight: 800;
          color: #1F2937;
          font-family: var(--font-heading);
        }

        .cmp-stat-box span {
          font-size: 11px;
          color: #6B7280;
          font-weight: 600;
        }

        .cmp-card-actions {
          display: flex;
          gap: 10px;
          margin-top: auto;
        }

        .cmp-btn-secondary {
          flex: 1;
          border: 1px solid #D1D5DB;
          background: #FFFFFF;
          color: #374151;
          padding: 9px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 700;
          font-family: var(--font-heading);
          cursor: pointer;
        }

        .cmp-btn-secondary:hover { background: #F3F4F6; }

        .cmp-btn-primary {
          flex: 1.2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border: none;
          background: #1F2937;
          color: #FFFFFF;
          padding: 9px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 700;
          font-family: var(--font-heading);
          cursor: pointer;
        }

        .cmp-btn-primary:hover { background: #C8102E; }

        /* Modal Overlays */
        .cmp-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(6px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .cmp-modal-card {
          background: #FFFFFF;
          border-radius: 20px;
          max-width: 600px;
          width: 100%;
          overflow: hidden;
          position: relative;
          box-shadow: 0 20px 50px rgba(0,0,0,0.25);
        }

        .cmp-modal-close {
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
          cursor: pointer;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cmp-modal-cover {
          position: relative;
          height: 220px;
        }

        .cmp-modal-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cmp-modal-cover .badge-status {
          position: absolute;
          bottom: 14px;
          left: 14px;
        }

        .cmp-modal-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .cmp-modal-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          color: #C8102E;
          text-transform: uppercase;
          font-family: var(--font-heading);
          margin-bottom: 4px;
        }

        .cmp-modal-header h2 {
          font-size: 22px;
          font-weight: 800;
          color: #1F2937;
          font-family: var(--font-heading);
        }

        .cmp-modal-obj {
          font-size: 14px;
          color: #4B5563;
          margin-top: 4px;
          line-height: 1.5;
        }

        .cmp-modal-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: 14px;
          padding: 16px;
        }

        .cmd-box {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .cmd-box span {
          font-size: 11.5px;
          color: #6B7280;
          font-weight: 600;
        }

        .cmd-box strong {
          font-size: 13.5px;
          color: #1F2937;
          font-family: var(--font-heading);
        }

        .cmp-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 8px;
        }

        /* Create Modal Styling */
        .cmp-create-modal {
          background: #FFFFFF;
          border-radius: 20px;
          max-width: 540px;
          width: 100%;
          padding: 26px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.25);
        }

        .ccm-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 18px;
        }

        .ccm-header h3 {
          font-size: 19px;
          font-weight: 800;
          color: #1F2937;
          font-family: var(--font-heading);
        }

        .ccm-header p {
          font-size: 13px;
          color: #6B7280;
          margin-top: 2px;
        }

        .ccm-close {
          background: #F3F4F6;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 16px;
          cursor: pointer;
        }

        .ccm-cover-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 10px;
          max-height: 180px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .ccm-cover-card {
          border: 2px solid #E5E7EB;
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          background: #FFFFFF;
          text-align: left;
        }

        .ccm-cover-card.is-selected {
          border-color: #C8102E;
          box-shadow: 0 4px 10px rgba(200, 16, 46, 0.2);
        }

        .ccm-cover-card img {
          width: 100%;
          height: 70px;
          object-fit: cover;
        }

        .ccm-cover-card span {
          display: block;
          padding: 6px 8px;
          font-size: 11px;
          font-weight: 700;
          color: #374151;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .modal-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 14px;
        }

        .modal-field label {
          font-size: 12.5px;
          font-weight: 700;
          color: #374151;
          font-family: var(--font-heading);
        }

        .modal-field input, .modal-field textarea {
          border: 1px solid #D1D5DB;
          border-radius: 8px;
          padding: 9px 12px;
          font-size: 13.5px;
        }

        .modal-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 18px;
        }

        @media (max-width: 900px) {
          .cmp-hero-card { flex-direction: column; align-items: flex-start; gap: 14px; }
          .cmp-controls-bar { flex-direction: column; align-items: stretch; }
          .cmp-search-box { width: 100%; }
        }
      `}</style>
    </div>
  );
}

