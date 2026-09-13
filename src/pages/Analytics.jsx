import { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  FiTrendingUp,
  FiEye,
  FiThumbsUp,
  FiShare2,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiDownload,
  FiAward,
  FiZap,
  FiCalendar,
  FiArrowUpRight,
  FiCheckCircle,
  FiUsers,
  FiActivity,
} from 'react-icons/fi';
import Sidebar from '../components/sidebar';
import Navbar from '../components/Navbar';
import { getPosts } from '../Services/postService';

const MONTHLY_PERFORMANCE = [
  { month: 'Apr', fb: 12000, ig: 18000, tw: 8400, total: 38400 },
  { month: 'May', fb: 14500, ig: 21000, tw: 9200, total: 44700 },
  { month: 'Jun', fb: 22000, ig: 31000, tw: 15400, total: 68400 },
  { month: 'Jul', fb: 19000, ig: 26000, tw: 12100, total: 57100 },
  { month: 'Aug', fb: 25000, ig: 38000, tw: 18900, total: 81900 },
  { month: 'Sep', fb: 28500, ig: 42000, tw: 21400, total: 91900 },
];

const PLATFORM_SHARE = [
  { name: 'Instagram', value: 46, color: '#E4405F', followers: '84.5k' },
  { name: 'Facebook', value: 36, color: '#1877F2', followers: '66.2k' },
  { name: 'X (Twitter)', value: 18, color: '#10B981', followers: '33.5k' },
];

const CAMPAIGN_ANALYTICS = [
  { name: 'World Blood Donor Day', reach: '45.2k', engagement: '8.4%', goal: 90, color: '#C8102E' },
  { name: 'Monsoon Flood Relief', reach: '92.4k', engagement: '11.8%', goal: 92, color: '#059669' },
  { name: 'Dengue Prevention Check', reach: '28.1k', engagement: '6.2%', goal: 70, color: '#2563EB' },
];

export default function Analytics() {
  const [timeframe, setTimeframe] = useState('6m');
  const [showExportModal, setShowExportModal] = useState(false);
  const posts = getPosts();

  const topPosts = posts.slice(0, 3);

  return (
    <div className="app-shell">
      <Sidebar activeKey="analytics" />

      <div className="app-main">
        <Navbar title="Humanitarian Impact & Channel Analytics" />

        <main className="app-content">

          {/* Hero Header & Export Action */}
          <div className="an-hero-card">
            <div className="an-hero-info">
              <div className="an-badge">
                <FiActivity size={12} />
                <span>Live Broadcast Telemetry</span>
              </div>
              <h2>Humanitarian Outreach & Social Performance</h2>
              <p>Real-time analytics for Red Cross emergency alert reach, public engagement, and donor drive metrics.</p>
            </div>

            <div className="an-hero-right">
              <div className="an-time-switch">
                <button
                  type="button"
                  className={`an-time-btn${timeframe === '30d' ? ' is-active' : ''}`}
                  onClick={() => setTimeframe('30d')}
                >
                  30 Days
                </button>
                <button
                  type="button"
                  className={`an-time-btn${timeframe === '6m' ? ' is-active' : ''}`}
                  onClick={() => setTimeframe('6m')}
                >
                  6 Months
                </button>
                <button
                  type="button"
                  className={`an-time-btn${timeframe === '1y' ? ' is-active' : ''}`}
                  onClick={() => setTimeframe('1y')}
                >
                  1 Year
                </button>
              </div>

              <button
                type="button"
                className="an-export-btn"
                onClick={() => setShowExportModal(true)}
              >
                <FiDownload size={15} /> Export Report
              </button>
            </div>
          </div>

          {/* KPI Metrics Cards Grid */}
          <div className="an-kpi-grid">

            <div className="rc-card an-kpi-card red-gradient">
              <div className="an-kpi-top">
                <div className="an-kpi-icon red">
                  <FiEye size={20} />
                </div>
                <span className="an-trend-badge up">
                  <FiArrowUpRight size={13} /> +18.4%
                </span>
              </div>
              <div className="an-kpi-bottom">
                <span>Total Channel Impressions</span>
                <strong>342,800</strong>
                <p>+52.1k impressions vs last period</p>
              </div>
            </div>

            <div className="rc-card an-kpi-card green-gradient">
              <div className="an-kpi-top">
                <div className="an-kpi-icon green">
                  <FiThumbsUp size={20} />
                </div>
                <span className="an-trend-badge up">
                  <FiArrowUpRight size={13} /> +12.7%
                </span>
              </div>
              <div className="an-kpi-bottom">
                <span>Engagements & Reactions</span>
                <strong>48,920</strong>
                <p>Avg 8.6% engagement index score</p>
              </div>
            </div>

            <div className="rc-card an-kpi-card blue-gradient">
              <div className="an-kpi-top">
                <div className="an-kpi-icon blue">
                  <FiShare2 size={20} />
                </div>
                <span className="an-trend-badge up">
                  <FiArrowUpRight size={13} /> +24.1%
                </span>
              </div>
              <div className="an-kpi-bottom">
                <span>Relief Shares & Amplifications</span>
                <strong>9,840</strong>
                <p>Emergency alert broadcasts reshared</p>
              </div>
            </div>

            <div className="rc-card an-kpi-card purple-gradient">
              <div className="an-kpi-top">
                <div className="an-kpi-icon purple">
                  <FiUsers size={20} />
                </div>
                <span className="an-trend-badge up">
                  <FiArrowUpRight size={13} /> +15.3%
                </span>
              </div>
              <div className="an-kpi-bottom">
                <span>Donor & Volunteer Clicks</span>
                <strong>14,250</strong>
                <p>Direct conversions on redcross.lk</p>
              </div>
            </div>

          </div>

          {/* Charts Section: Area Trend & Donut Audience Share */}
          <div className="an-charts-grid">

            {/* Area Curve Reach Chart */}
            <div className="rc-card an-chart-card">
              <div className="an-chart-header">
                <div>
                  <h3>Multi-Channel Reach Trends over Time</h3>
                  <p>Monthly audience growth across Instagram, Facebook, and X (Twitter)</p>
                </div>
                <div className="an-chart-legend-inline">
                  <span className="leg-dot ig">Instagram</span>
                  <span className="leg-dot fb">Facebook</span>
                  <span className="leg-dot tw">X (Twitter)</span>
                </div>
              </div>

              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                  <AreaChart data={MONTHLY_PERFORMANCE} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E4405F" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#E4405F" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorFb" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1877F2" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#1877F2" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorTw" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', fontSize: 12.5 }} />
                    <Area type="monotone" dataKey="ig" name="Instagram" stroke="#E4405F" strokeWidth={3} fillOpacity={1} fill="url(#colorIg)" />
                    <Area type="monotone" dataKey="fb" name="Facebook" stroke="#1877F2" strokeWidth={3} fillOpacity={1} fill="url(#colorFb)" />
                    <Area type="monotone" dataKey="tw" name="X / Twitter" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorTw)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Audience Share Donut Chart */}
            <div className="rc-card an-chart-card">
              <div className="an-chart-header">
                <div>
                  <h3>Audience Distribution</h3>
                  <p>Follower engagement share by social platform</p>
                </div>
              </div>

              <div className="an-donut-wrapper">
                <div style={{ width: '100%', height: 210 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={PLATFORM_SHARE}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={6}
                        dataKey="value"
                      >
                        {PLATFORM_SHARE.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="an-donut-center">
                  <strong>184.2k</strong>
                  <span>Followers</span>
                </div>
              </div>

              <div className="an-platform-list">
                {PLATFORM_SHARE.map((item) => (
                  <div key={item.name} className="an-platform-row">
                    <div className="an-platform-info">
                      <span className="dot-circle" style={{ background: item.color }} />
                      <strong>{item.name}</strong>
                    </div>
                    <div className="an-platform-stats">
                      <span>{item.followers}</span>
                      <strong>{item.value}%</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Lower Grid: Top Performing Visual Posts & Campaign Progress Breakdown */}
          <div className="an-lower-grid">

            {/* Top Visual Posts */}
            <div className="rc-card an-top-posts-card">
              <div className="an-card-header">
                <div>
                  <h3>Most Impactful Humanitarian Posts</h3>
                  <p>Highest reaching media broadcasts from recent campaigns</p>
                </div>
                <span className="an-top-badge"><FiAward size={13} /> Top Viral Media</span>
              </div>

              <div className="an-posts-list">
                {topPosts.map((p, i) => (
                  <div key={p.id} className="an-post-row">
                    <span className="an-rank-num">#0{i + 1}</span>
                    <img src={p.imageUrl} alt={p.title} className="an-post-img" />
                    <div className="an-post-details">
                      <strong>{p.title}</strong>
                      <span>By {p.creator || 'Seminda Fernando'} • {p.date || '10 Sep 2026'}</span>
                    </div>
                    <div className="an-post-metrics">
                      <div>
                        <strong>{i === 0 ? '45.2k' : i === 1 ? '28.1k' : '19.5k'}</strong>
                        <span>Views</span>
                      </div>
                      <div>
                        <strong style={{ color: '#059669' }}>{i === 0 ? '8.4%' : i === 1 ? '6.2%' : '4.9%'}</strong>
                        <span>Eng. Index</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign Reach Goal Achievements */}
            <div className="rc-card an-campaign-goals-card">
              <div className="an-card-header">
                <div>
                  <h3>Campaign Target Achievements</h3>
                  <p>Progress against humanitarian public reach goals</p>
                </div>
              </div>

              <div className="an-goals-list">
                {CAMPAIGN_ANALYTICS.map((camp) => (
                  <div key={camp.name} className="an-goal-item">
                    <div className="an-goal-top">
                      <strong>{camp.name}</strong>
                      <span className="an-goal-pct" style={{ color: camp.color }}>{camp.goal}% Completed</span>
                    </div>
                    <div className="an-goal-track">
                      <div
                        className="an-goal-bar"
                        style={{ width: `${camp.goal}%`, background: camp.color }}
                      />
                    </div>
                    <div className="an-goal-footer">
                      <span>Reach: <strong>{camp.reach}</strong></span>
                      <span>Avg Engagement: <strong>{camp.engagement}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Export Report Confirmation Modal */}
          {showExportModal && (
            <div className="an-modal-overlay" onClick={() => setShowExportModal(false)}>
              <div className="an-modal-card" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="an-modal-close" onClick={() => setShowExportModal(false)}>✕</button>

                <div className="an-modal-icon">
                  <FiCheckCircle size={38} />
                </div>
                <h3>Executive Telemetry Report Generated</h3>
                <p>
                  Comprehensive analytics PDF summary for <strong>September 2026</strong> has been compiled. Includes Red Cross campaign reach, donor clicks, and channel engagement metrics.
                </p>

                <div className="an-modal-actions">
                  <button type="button" className="cp-btn cp-btn--primary" onClick={() => setShowExportModal(false)}>
                    Download PDF Summary
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      <style>{`
        .an-hero-card {
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

        .an-badge {
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

        .an-hero-info h2 {
          font-size: 24px;
          font-weight: 800;
          color: #FFFFFF;
          font-family: var(--font-heading);
          letter-spacing: -0.025em;
          margin-bottom: 4px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .an-hero-info p {
          font-size: 14px;
          color: #E2E8F0;
        }

        .an-hero-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .an-time-switch {
          display: flex;
          background: #FFFFFF;
          border: 1px solid #D1D5DB;
          border-radius: 10px;
          padding: 3px;
          gap: 3px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }

        .an-time-btn {
          padding: 6px 14px;
          border: none;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 700;
          color: #6B7280;
          background: transparent;
          cursor: pointer;
          font-family: var(--font-heading);
          transition: all 0.15s ease;
        }

        .an-time-btn.is-active {
          background: #1F2937;
          color: #FFFFFF;
        }

        .an-export-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #C8102E 0%, #9B0B22 100%);
          color: #FFFFFF;
          border: none;
          padding: 11px 18px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 800;
          font-family: var(--font-heading);
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(200, 16, 46, 0.3);
          transition: all 0.15s ease;
        }

        .an-export-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(200, 16, 46, 0.4);
        }

        /* KPI Cards Grid */
        .an-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 24px;
        }

        .an-kpi-card {
          padding: 20px;
          border-radius: 18px;
          border: 1px solid #E5E7EB;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        }

        .an-kpi-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.06);
        }

        .an-kpi-card.red-gradient { border-top: 4px solid #C8102E; }
        .an-kpi-card.green-gradient { border-top: 4px solid #059669; }
        .an-kpi-card.blue-gradient { border-top: 4px solid #2563EB; }
        .an-kpi-card.purple-gradient { border-top: 4px solid #9333EA; }

        .an-kpi-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .an-kpi-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .an-kpi-icon.red { background: #FEF2F2; color: #C8102E; }
        .an-kpi-icon.green { background: #ECFDF5; color: #059669; }
        .an-kpi-icon.blue { background: #EFF6FF; color: #2563EB; }
        .an-kpi-icon.purple { background: #F3E8FF; color: #9333EA; }

        .an-trend-badge {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          font-size: 11.5px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 999px;
          font-family: var(--font-heading);
        }

        .an-trend-badge.up { background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0; }

        .an-kpi-bottom span {
          font-size: 12.5px;
          color: #6B7280;
          font-weight: 600;
          display: block;
          margin-bottom: 2px;
        }

        .an-kpi-bottom strong {
          font-size: 24px;
          font-weight: 800;
          color: #1F2937;
          font-family: var(--font-heading);
          display: block;
        }

        .an-kpi-bottom p {
          font-size: 11.5px;
          color: #9CA3AF;
          margin-top: 4px;
        }

        /* Charts Grid */
        .an-charts-grid {
          display: grid;
          grid-template-columns: 2.2fr 1fr;
          gap: 22px;
          margin-bottom: 24px;
        }

        .an-chart-card {
          padding: 24px;
          border-radius: 18px;
        }

        .an-chart-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .an-chart-header h3 {
          font-size: 18px;
          font-weight: 800;
          color: #1F2937;
          font-family: var(--font-heading);
        }

        .an-chart-header p {
          font-size: 13px;
          color: #6B7280;
          margin-top: 2px;
        }

        .an-chart-legend-inline {
          display: flex;
          gap: 12px;
          font-size: 11.5px;
          font-weight: 700;
        }

        .leg-dot {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .leg-dot::before {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .leg-dot.ig::before { background: #E4405F; }
        .leg-dot.fb::before { background: #1877F2; }
        .leg-dot.tw::before { background: #10B981; }

        /* Donut Wrapper */
        .an-donut-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .an-donut-center {
          position: absolute;
          text-align: center;
          pointer-events: none;
        }

        .an-donut-center strong {
          display: block;
          font-size: 20px;
          font-weight: 800;
          color: #1F2937;
          font-family: var(--font-heading);
          line-height: 1;
        }

        .an-donut-center span {
          font-size: 11px;
          color: #6B7280;
          font-weight: 600;
        }

        .an-platform-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px solid #F3F4F6;
        }

        .an-platform-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12.5px;
        }

        .an-platform-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dot-circle {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .an-platform-info strong {
          color: #374151;
          font-family: var(--font-heading);
        }

        .an-platform-stats {
          display: flex;
          gap: 12px;
        }

        .an-platform-stats span {
          color: #9CA3AF;
        }

        .an-platform-stats strong {
          color: #1F2937;
          font-family: var(--font-heading);
        }

        /* Lower Grid */
        .an-lower-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 22px;
        }

        .an-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
          padding-bottom: 12px;
          border-bottom: 1px solid #F3F4F6;
        }

        .an-card-header h3 {
          font-size: 17px;
          font-weight: 800;
          color: #1F2937;
          font-family: var(--font-heading);
        }

        .an-card-header p {
          font-size: 12.5px;
          color: #6B7280;
          margin-top: 2px;
        }

        .an-top-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          font-weight: 800;
          color: #D97706;
          background: #FEF3C7;
          padding: 4px 10px;
          border-radius: 999px;
          font-family: var(--font-heading);
        }

        .an-top-posts-card { padding: 24px; border-radius: 18px; }
        .an-campaign-goals-card { padding: 24px; border-radius: 18px; }

        .an-posts-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .an-post-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px 14px;
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
        }

        .an-rank-num {
          font-size: 13px;
          font-weight: 800;
          color: #C8102E;
          font-family: var(--font-heading);
        }

        .an-post-img {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          object-fit: cover;
        }

        .an-post-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow: hidden;
        }

        .an-post-details strong {
          font-size: 13.5px;
          font-weight: 700;
          color: #1F2937;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .an-post-details span {
          font-size: 11.5px;
          color: #6B7280;
        }

        .an-post-metrics {
          display: flex;
          gap: 14px;
          text-align: right;
        }

        .an-post-metrics strong {
          display: block;
          font-size: 13.5px;
          font-weight: 800;
          font-family: var(--font-heading);
        }

        .an-post-metrics span {
          font-size: 10.5px;
          color: #6B7280;
        }

        /* Goal Items */
        .an-goals-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .an-goal-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .an-goal-top {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          font-weight: 700;
        }

        .an-goal-pct {
          font-family: var(--font-heading);
        }

        .an-goal-track {
          height: 8px;
          background: #E5E7EB;
          border-radius: 999px;
          overflow: hidden;
        }

        .an-goal-bar {
          height: 100%;
          border-radius: 999px;
        }

        .an-goal-footer {
          display: flex;
          justify-content: space-between;
          font-size: 11.5px;
          color: #6B7280;
        }

        /* Modal Overlay */
        .an-modal-overlay {
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

        .an-modal-card {
          background: #FFFFFF;
          border-radius: 20px;
          max-width: 460px;
          width: 100%;
          padding: 28px;
          text-align: center;
          position: relative;
          box-shadow: 0 20px 50px rgba(0,0,0,0.25);
        }

        .an-modal-close {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #F3F4F6;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 16px;
          cursor: pointer;
        }

        .an-modal-icon {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: #ECFDF5;
          color: #059669;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
          box-shadow: 0 4px 14px rgba(5, 150, 105, 0.2);
        }

        .an-modal-card h3 {
          font-size: 20px;
          font-weight: 800;
          color: #1F2937;
          font-family: var(--font-heading);
          margin-bottom: 8px;
        }

        .an-modal-card p {
          font-size: 13.5px;
          color: #4B5563;
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .an-modal-actions {
          display: flex;
          justify-content: center;
        }

        @media (max-width: 1024px) {
          .an-hero-card { flex-direction: column; align-items: flex-start; gap: 14px; }
          .an-kpi-grid { grid-template-columns: repeat(2, 1fr); }
          .an-charts-grid { grid-template-columns: 1fr; }
          .an-lower-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

