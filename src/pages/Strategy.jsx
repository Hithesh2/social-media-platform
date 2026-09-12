import { useState } from 'react';
import {
  FiCompass,
  FiCheckCircle,
  FiBookOpen,
  FiShield,
  FiSend,
  FiTag,
  FiAlertTriangle,
  FiHeart,
  FiCopy,
  FiCheck,
  FiPhoneCall,
  FiDownload,
  FiCamera,
  FiLock,
  FiAward,
} from 'react-icons/fi';
import { FaHeartbeat } from 'react-icons/fa';
import Sidebar from '../components/sidebar';
import Navbar from '../components/Navbar';

const FUNDAMENTAL_PRINCIPLES = [
  { name: 'Humanity', desc: 'Prevent and alleviate human suffering wherever found.', icon: FiHeart, color: '#C8102E' },
  { name: 'Impartiality', desc: 'Make no discrimination as to nationality, race, or belief.', icon: FiShield, color: '#2563EB' },
  { name: 'Neutrality', desc: 'Maintain public trust by taking no sides in hostilities.', icon: FiCompass, color: '#D97706' },
  { name: 'Independence', desc: 'Maintain autonomy in humanitarian operations.', icon: FiLock, color: '#059669' },
  { name: 'Voluntary Service', desc: 'Not prompted in any manner by desire for gain.', icon: FaHeartbeat, color: '#9333EA' },
  { name: 'Unity & Universality', desc: 'One Red Cross society per nation, equal status worldwide.', icon: FiAward, color: '#0284C7' },
];

const HASHTAG_GROUPS = [
  { category: 'Core Brand', tags: ['#RedCross', '#HumanitarianAid', '#RedCrossLK', '#EverywhereForEveryone'] },
  { category: 'Health & First Aid', tags: ['#FirstAidLK', '#BloodDonation', '#EmergencyCare', '#CPRReady'] },
  { category: 'Disaster & Relief', tags: ['#FloodReliefLK', '#DisasterResponse', '#RedCrossVolunteers'] },
];

export default function Strategy() {
  const [activeTab, setActiveTab] = useState('principles'); // 'principles' | 'tone' | 'hashtags' | 'cadence'
  const [copiedTag, setCopiedTag] = useState(null);
  const [showDownloadToast, setShowDownloadToast] = useState(false);

  const handleCopyTag = (tag) => {
    navigator.clipboard?.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  return (
    <div className="app-shell">
      <Sidebar activeKey="strategy" />

      <div className="app-main">
        <Navbar title="Social Strategy & Communication Policy" />

        <main className="app-content">
          
          {/* Hero Header Banner */}
          <div className="st-hero-card">
            <div className="st-hero-info">
              <div className="st-badge">
                <FiShield size={12} />
                <span>Official Red Cross Communication Standard</span>
              </div>
              <h2>Humanitarian Editorial Policy & Digital Strategy</h2>
              <p>Operational principles, beneficiary dignity guidelines, and verified channel publishing standards.</p>
            </div>

            <div className="st-hero-right">
              <button
                type="button"
                className="st-download-btn"
                onClick={() => {
                  setShowDownloadToast(true);
                  setTimeout(() => setShowDownloadToast(false), 3000);
                }}
              >
                <FiDownload size={15} /> Download Policy Guide (PDF)
              </button>
            </div>
          </div>

          {showDownloadToast && (
            <div className="st-toast">
              <FiCheckCircle size={16} /> Official Red Cross Strategy Manual downloaded!
            </div>
          )}

          {/* Strategy Navigation Tabs */}
          <div className="st-tabs-bar">
            <button
              type="button"
              className={`st-tab-btn${activeTab === 'principles' ? ' is-active' : ''}`}
              onClick={() => setActiveTab('principles')}
            >
              <FiShield size={14} /> Fundamental Principles
            </button>
            <button
              type="button"
              className={`st-tab-btn${activeTab === 'tone' ? ' is-active' : ''}`}
              onClick={() => setActiveTab('tone')}
            >
              <FiCamera size={14} /> Beneficiary Dignity & Tone
            </button>
            <button
              type="button"
              className={`st-tab-btn${activeTab === 'hashtags' ? ' is-active' : ''}`}
              onClick={() => setActiveTab('hashtags')}
            >
              <FiTag size={14} /> Official Hashtags
            </button>
            <button
              type="button"
              className={`st-tab-btn${activeTab === 'cadence' ? ' is-active' : ''}`}
              onClick={() => setActiveTab('cadence')}
            >
              <FiBookOpen size={14} /> Channel Cadence
            </button>
          </div>

          {/* TAB 1: FUNDAMENTAL PRINCIPLES */}
          {activeTab === 'principles' && (
            <div className="st-tab-content">
              <div className="st-section-title">
                <h3>7 Fundamental Red Cross Principles in Digital Media</h3>
                <p>Mandatory policy guidelines governing all published social posts and public statements</p>
              </div>

              <div className="st-principles-grid">
                {FUNDAMENTAL_PRINCIPLES.map((fp) => {
                  const Icon = fp.icon;
                  return (
                    <div key={fp.name} className="rc-card st-principle-card">
                      <div className="st-p-icon" style={{ background: `${fp.color}15`, color: fp.color }}>
                        <Icon size={20} />
                      </div>
                      <h4>{fp.name}</h4>
                      <p>{fp.desc}</p>
                      <span className="st-p-check">
                        <FiCheckCircle size={12} color="#059669" /> Policy Compliant
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: BENEFICIARY DIGNITY & TONE */}
          {activeTab === 'tone' && (
            <div className="st-tab-content">
              <div className="st-section-title">
                <h3>Beneficiary Dignity & Photography Standards</h3>
                <p>Ethical guidelines for capturing and sharing emergency photos of vulnerable populations</p>
              </div>

              <div className="st-dos-donts-grid">
                <div className="rc-card st-do-card">
                  <div className="st-dd-header do">
                    <FiCheckCircle size={18} />
                    <h4>DO'S — Best Practices</h4>
                  </div>
                  <ul>
                    <li><FiCheckCircle size={14} color="#059669" /> Obtain informed verbal or written consent prior to taking photographs.</li>
                    <li><FiCheckCircle size={14} color="#059669" /> Portray beneficiaries with strength, resilience, and inherent human dignity.</li>
                    <li><FiCheckCircle size={14} color="#059669" /> Verify medical accuracy with certified Red Cross health officers.</li>
                    <li><FiCheckCircle size={14} color="#059669" /> Always include emergency hotline numbers on public safety graphics.</li>
                  </ul>
                </div>

                <div className="rc-card st-dont-card">
                  <div className="st-dd-header dont">
                    <FiAlertTriangle size={18} />
                    <h4>DON'TS — Strictly Prohibited</h4>
                  </div>
                  <ul>
                    <li><FiAlertTriangle size={14} color="#DC2626" /> Never post graphic images of trauma victims without face anonymization.</li>
                    <li><FiAlertTriangle size={14} color="#DC2626" /> Avoid sensationalized or victim-blaming post captions.</li>
                    <li><FiAlertTriangle size={14} color="#DC2626" /> Do not alter the official Red Cross emblem logo colors or proportions.</li>
                    <li><FiAlertTriangle size={14} color="#DC2626" /> Never take political sides during active conflict or election periods.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HASHTAGS & SEO MATRIX */}
          {activeTab === 'hashtags' && (
            <div className="st-tab-content">
              <div className="st-section-title">
                <h3>Official Hashtag Library & One-Click Copy</h3>
                <p>Click any hashtag below to copy to clipboard for social media caption creation</p>
              </div>

              <div className="st-hashtags-grid">
                {HASHTAG_GROUPS.map((group) => (
                  <div key={group.category} className="rc-card st-hashtag-card">
                    <div className="st-ht-header">
                      <FiTag size={15} color="#C8102E" />
                      <h4>{group.category}</h4>
                    </div>

                    <div className="st-ht-tags">
                      {group.tags.map((tag) => (
                        <button
                          type="button"
                          key={tag}
                          className={`st-tag-chip${copiedTag === tag ? ' is-copied' : ''}`}
                          onClick={() => handleCopyTag(tag)}
                        >
                          <span>{tag}</span>
                          {copiedTag === tag ? <FiCheck size={13} color="#059669" /> : <FiCopy size={12} color="#6B7280" />}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PUBLISHING CADENCE & EMERGENCY ESCALATION */}
          {activeTab === 'cadence' && (
            <div className="st-tab-content">
              <div className="st-section-title">
                <h3>Channel Publishing Timetable & Emergency Hotline Protocol</h3>
                <p>Optimal broadcast times and emergency escalation contact duty matrix</p>
              </div>

              <div className="st-cadence-grid">
                <div className="rc-card st-channel-card">
                  <div className="st-ch-header">
                    <h4>Channel Frequencies</h4>
                  </div>
                  <div className="st-ch-row">
                    <strong>Facebook Page</strong>
                    <span>1 - 2 Posts Daily (09:00 AM & 06:30 PM)</span>
                  </div>
                  <div className="st-ch-row">
                    <strong>Instagram Reels & Feed</strong>
                    <span>1 Post + 3 Stories Daily</span>
                  </div>
                  <div className="st-ch-row">
                    <strong>X / Twitter Alert Feed</strong>
                    <span>2 - 4 Updates during active emergencies</span>
                  </div>
                </div>

                <div className="rc-card st-escalation-card">
                  <div className="st-esc-header">
                    <FiPhoneCall size={18} />
                    <h4>Emergency Crisis Sign-off Protocol</h4>
                  </div>
                  <p>
                    For urgent disaster responses (floods, landslides, epidemics), obtain immediate sign-off from designated officers:
                  </p>
                  <div className="st-contacts-list">
                    <div className="st-contact-item">
                      <strong>Hithesh Maheepala</strong>
                      <span>Administrator • Emergency Media Command</span>
                    </div>
                    <div className="st-contact-item">
                      <strong>Ramda Amaneth</strong>
                      <span>Lead Content Approver • Compliance Division</span>
                    </div>
                    <div className="st-contact-item">
                      <strong>Seminda Fernando</strong>
                      <span>Senior Content Creator • Broadcast Lead</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      <style>{`
        .st-hero-card {
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

        .st-badge {
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

        .st-hero-info h2 {
          font-size: 24px;
          font-weight: 800;
          color: #FFFFFF;
          font-family: var(--font-heading);
          letter-spacing: -0.025em;
          margin-bottom: 4px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .st-hero-info p {
          font-size: 14px;
          color: #E2E8F0;
        }

        .st-download-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 700;
          font-family: var(--font-heading);
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(239, 68, 68, 0.4);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .st-download-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5);
        }

        .st-toast {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #ECFDF5;
          color: #059669;
          border: 1px solid #A7F3D0;
          padding: 12px 18px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-size: 13.5px;
          font-weight: 700;
          font-family: var(--font-heading);
        }

        /* Strategy Navigation Tabs */
        .st-tabs-bar {
          display: flex;
          background: #FFFFFF;
          border: 1px solid #D1D5DB;
          border-radius: 14px;
          padding: 5px;
          gap: 6px;
          margin-bottom: 24px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.02);
        }

        .st-tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 16px;
          border: none;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          color: #6B7280;
          background: transparent;
          cursor: pointer;
          font-family: var(--font-heading);
          transition: all 0.15s ease;
        }

        .st-tab-btn.is-active {
          background: #1F2937;
          color: #FFFFFF;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .st-section-title {
          margin-bottom: 20px;
        }

        .st-section-title h3 {
          font-size: 19px;
          font-weight: 800;
          color: #1F2937;
          font-family: var(--font-heading);
        }

        .st-section-title p {
          font-size: 13.5px;
          color: #6B7280;
          margin-top: 2px;
        }

        /* 7 Principles Grid */
        .st-principles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .st-principle-card {
          padding: 22px;
          border-radius: 18px;
          border: 1px solid #E5E7EB;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: all 0.2s ease;
        }

        .st-principle-card:hover {
          border-color: #C8102E;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(200, 16, 46, 0.12);
        }

        .st-p-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .st-principle-card h4 {
          font-size: 16px;
          font-weight: 800;
          color: #1F2937;
          font-family: var(--font-heading);
        }

        .st-principle-card p {
          font-size: 13px;
          color: #4B5563;
          line-height: 1.48;
        }

        .st-p-check {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          font-weight: 700;
          color: #059669;
          margin-top: auto;
          font-family: var(--font-heading);
        }

        /* Do's & Don'ts */
        .st-dos-donts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
        }

        .st-do-card, .st-dont-card {
          padding: 24px;
          border-radius: 18px;
        }

        .st-dd-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
          padding-bottom: 12px;
          border-bottom: 1px solid #F3F4F6;
        }

        .st-dd-header h4 {
          font-size: 16px;
          font-weight: 800;
          font-family: var(--font-heading);
        }

        .st-dd-header.do { color: #059669; }
        .st-dd-header.dont { color: #DC2626; }

        .st-do-card ul, .st-dont-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .st-do-card ul li, .st-dont-card ul li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13.5px;
          color: #374151;
          line-height: 1.45;
        }

        /* Hashtags Grid */
        .st-hashtags-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .st-hashtag-card {
          padding: 22px;
          border-radius: 18px;
        }

        .st-ht-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .st-ht-header h4 {
          font-size: 16px;
          font-weight: 800;
          color: #1F2937;
          font-family: var(--font-heading);
        }

        .st-ht-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .st-tag-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #EFF6FF;
          color: #2563EB;
          border: 1px solid #BFDBFE;
          padding: 8px 12px;
          border-radius: 10px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          font-family: var(--font-heading);
          transition: all 0.15s ease;
        }

        .st-tag-chip:hover {
          background: #DBEAFE;
          transform: translateY(-1px);
        }

        .st-tag-chip.is-copied {
          background: #ECFDF5;
          color: #059669;
          border-color: #A7F3D0;
        }

        /* Cadence & Escalation */
        .st-cadence-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
        }

        .st-channel-card, .st-escalation-card {
          padding: 24px;
          border-radius: 18px;
        }

        .st-ch-header h4, .st-esc-header h4 {
          font-size: 17px;
          font-weight: 800;
          color: #1F2937;
          font-family: var(--font-heading);
          margin-bottom: 14px;
        }

        .st-esc-header {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #C8102E;
        }

        .st-ch-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 14px;
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: 10px;
          margin-bottom: 10px;
          font-size: 13px;
        }

        .st-ch-row strong {
          font-weight: 700;
          color: #1F2937;
          font-family: var(--font-heading);
        }

        .st-ch-row span {
          color: #4B5563;
          font-size: 12.5px;
        }

        .st-escalation-card p {
          font-size: 13.5px;
          color: #4B5563;
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .st-contacts-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .st-contact-item {
          padding: 10px 14px;
          background: #FEF2F2;
          border: 1px solid #FCA5A5;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .st-contact-item strong {
          font-size: 13.5px;
          color: #C8102E;
          font-family: var(--font-heading);
        }

        .st-contact-item span {
          font-size: 12px;
          color: #4B5563;
        }

        @media (max-width: 900px) {
          .st-hero-card { flex-direction: column; align-items: flex-start; gap: 14px; }
          .st-tabs-bar { flex-direction: column; }
          .st-dos-donts-grid { grid-template-columns: 1fr; }
          .st-cadence-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

