import { useState } from 'react';
import {
  FiShield,
  FiUserCheck,
  FiEdit3,
  FiCheckCircle,
  FiUser,
  FiMapPin,
  FiBriefcase,
  FiPlus,
  FiArrowRight,
} from 'react-icons/fi';
import { ADMIN_TEAM_PROFILES } from '../Services/authService';

const ROLE_BADGES = {
  'Administrator': { icon: FiShield, color: '#DC2626', bg: '#FEF2F2', border: '#FCA5A5' },
  'Content Creator': { icon: FiEdit3, color: '#2563EB', bg: '#EFF6FF', border: '#93C5FD' },
  'Content Approver': { icon: FiUserCheck, color: '#9333EA', bg: '#F3E8FF', border: '#D8B4FE' },
};

export default function OfficerSelectorModal({
  isOpen,
  onClose,
  onSelectProfile,
  accountEmail = 'admin@redcross.org',
  currentOfficerName = '',
}) {
  const [selectedId, setSelectedId] = useState(
    ADMIN_TEAM_PROFILES.find((p) => p.name === currentOfficerName)?.id || 'off-1'
  );
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customRole, setCustomRole] = useState('Administrator');
  const [customDept, setCustomDept] = useState('Executive Comms Unit');
  const [customLoc, setCustomLoc] = useState('Colombo HQ');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (isCustomMode) {
      if (!customName.trim()) return;
      const customProfile = {
        name: customName.trim(),
        role: customRole,
        department: customDept || 'Sri Lanka Red Cross',
        location: customLoc || 'Colombo HQ',
        email: accountEmail,
        avatar: customName
          .trim()
          .split(' ')
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase(),
      };
      onSelectProfile(customProfile);
    } else {
      const profile = ADMIN_TEAM_PROFILES.find((p) => p.id === selectedId) || ADMIN_TEAM_PROFILES[0];
      onSelectProfile({ ...profile, email: accountEmail });
    }
  };

  return (
    <div className="osm-overlay" onClick={onClose}>
      <div className="osm-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Header Banner */}
        <div className="osm-header">
          <div className="osm-badge">
            <FiShield size={12} />
            <span>Red Cross Shared Admin Account</span>
          </div>
          <h2>Select Operating Officer Profile</h2>
          <p>
            You are logged in under shared account <strong>{accountEmail}</strong>. Please select your official Red Cross identity for this session.
          </p>
        </div>

        {/* Profile Grid */}
        {!isCustomMode ? (
          <div className="osm-body">
            <span className="osm-section-title">Registered Team Members & Roles</span>
            <div className="osm-grid">
              {ADMIN_TEAM_PROFILES.map((profile) => {
                const isSelected = selectedId === profile.id;
                const badgeConf = ROLE_BADGES[profile.role] || ROLE_BADGES['Administrator'];
                const RoleIcon = badgeConf.icon;

                return (
                  <button
                    type="button"
                    key={profile.id}
                    className={`osm-profile-card${isSelected ? ' is-selected' : ''}`}
                    onClick={() => setSelectedId(profile.id)}
                  >
                    <div className="osm-card-top">
                      <span
                        className="osm-role-pill"
                        style={{
                          backgroundColor: badgeConf.bg,
                          color: badgeConf.color,
                          borderColor: badgeConf.border,
                        }}
                      >
                        <RoleIcon size={11} />
                        {profile.role}
                      </span>
                      {isSelected && <FiCheckCircle size={18} className="osm-check" />}
                    </div>

                    <div className="osm-card-main">
                      <div
                        className="osm-avatar"
                        style={{
                          background: `linear-gradient(135deg, ${badgeConf.color} 0%, #0F172A 100%)`,
                        }}
                      >
                        {profile.avatar}
                      </div>
                      <div className="osm-card-text">
                        <strong>{profile.name}</strong>
                        <span className="osm-dept">
                          <FiBriefcase size={10} /> {profile.department}
                        </span>
                        <span className="osm-loc">
                          <FiMapPin size={10} /> {profile.location}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="osm-add-custom-btn"
              onClick={() => setIsCustomMode(true)}
            >
              <FiPlus size={15} /> Log in as a Different / New Red Cross Officer
            </button>
          </div>
        ) : (
          <div className="osm-body custom-form">
            <div className="osm-form-header">
              <h3>Enter Your Officer Details</h3>
              <button
                type="button"
                className="osm-link-btn"
                onClick={() => setIsCustomMode(false)}
              >
                ← Back to Team Profiles
              </button>
            </div>

            <div className="osm-field">
              <label>Full Officer Name *</label>
              <div className="osm-input-wrap">
                <FiUser size={15} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Mahesh Kularatne"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                />
              </div>
            </div>

            <div className="osm-field">
              <label>Assigned Permission Role</label>
              <select value={customRole} onChange={(e) => setCustomRole(e.target.value)}>
                <option value="Administrator">Administrator (Full Access)</option>
                <option value="Content Approver">Content Approver (Review & Sign-Off)</option>
                <option value="Content Creator">Content Creator (Drafting & Social Posts)</option>
              </select>
            </div>

            <div className="osm-field-row">
              <div className="osm-field">
                <label>Department / Operations Unit</label>
                <input
                  type="text"
                  placeholder="e.g. Disaster Relief Unit"
                  value={customDept}
                  onChange={(e) => setCustomDept(e.target.value)}
                />
              </div>
              <div className="osm-field">
                <label>Branch Location</label>
                <input
                  type="text"
                  placeholder="e.g. Colombo HQ"
                  value={customLoc}
                  onChange={(e) => setCustomLoc(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="osm-footer">
          <button type="button" className="osm-btn ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="osm-btn primary" onClick={handleConfirm}>
            Continue as Active Officer <FiArrowRight size={15} />
          </button>
        </div>

      </div>

      <style>{`
        .osm-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.72);
          backdrop-filter: blur(6px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: osmFadeIn 0.2s ease-out;
        }

        @keyframes osmFadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }

        .osm-card {
          background: #FFFFFF;
          border-radius: 20px;
          width: 100%;
          max-width: 660px;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
          border: 1px solid #E2E8F0;
          display: flex;
          flex-direction: column;
        }

        .osm-header {
          background: linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%);
          padding: 24px 28px 20px 28px;
          border-bottom: 1px solid #FCA5A5;
        }

        .osm-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          color: #DC2626;
          background: #FFFFFF;
          padding: 3px 10px;
          border-radius: 999px;
          border: 1px solid #FCA5A5;
          margin-bottom: 8px;
          font-family: var(--font-heading);
          text-transform: uppercase;
        }

        .osm-header h2 {
          font-size: 21px;
          font-weight: 800;
          color: #1F2937;
          font-family: var(--font-heading);
          margin-bottom: 4px;
        }

        .osm-header p {
          font-size: 13.5px;
          color: #4B5563;
        }

        .osm-body {
          padding: 24px 28px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-height: 420px;
          overflow-y: auto;
        }

        .osm-section-title {
          font-size: 12px;
          font-weight: 800;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-family: var(--font-heading);
        }

        .osm-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 14px;
        }

        .osm-profile-card {
          border: 2px solid #E2E8F0;
          border-radius: 14px;
          background: #FFFFFF;
          padding: 14px;
          cursor: pointer;
          text-align: left;
          transition: all 0.18s ease;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .osm-profile-card:hover {
          border-color: #CBD5E1;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
        }

        .osm-profile-card.is-selected {
          border-color: #DC2626;
          background: #FEF2F2;
          box-shadow: 0 6px 18px rgba(220, 38, 38, 0.12);
        }

        .osm-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .osm-role-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 8px;
          border-radius: 999px;
          border: 1px solid;
          font-size: 10.5px;
          font-weight: 700;
          font-family: var(--font-heading);
        }

        .osm-check {
          color: #DC2626;
        }

        .osm-card-main {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .osm-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          color: #FFFFFF;
          font-size: 15px;
          font-weight: 800;
          font-family: var(--font-heading);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .osm-card-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .osm-card-text strong {
          font-size: 14.5px;
          font-weight: 800;
          color: #0F172A;
          font-family: var(--font-heading);
        }

        .osm-dept, .osm-loc {
          font-size: 11.5px;
          color: #64748B;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .osm-add-custom-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1.5px dashed #CBD5E1;
          background: #F8FAFC;
          color: #475569;
          padding: 12px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          font-family: var(--font-heading);
          transition: all 0.15s ease;
          margin-top: 4px;
        }

        .osm-add-custom-btn:hover {
          border-color: #DC2626;
          color: #DC2626;
          background: #FEF2F2;
        }

        /* Custom Mode */
        .osm-form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .osm-form-header h3 {
          font-size: 16px;
          font-weight: 800;
          color: #0F172A;
          font-family: var(--font-heading);
        }

        .osm-link-btn {
          border: none;
          background: transparent;
          color: #2563EB;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
        }

        .osm-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 12px;
        }

        .osm-field label {
          font-size: 12.5px;
          font-weight: 700;
          color: #334155;
          font-family: var(--font-heading);
        }

        .osm-input-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid #CBD5E1;
          border-radius: 10px;
          padding: 0 12px;
          background: #FFFFFF;
        }

        .osm-input-wrap input, .osm-field input, .osm-field select {
          width: 100%;
          border: 1px solid #CBD5E1;
          border-radius: 10px;
          padding: 9px 12px;
          font-size: 13.5px;
          outline: none;
        }

        .osm-input-wrap input {
          border: none;
          padding: 9px 0;
        }

        .osm-field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .osm-footer {
          padding: 16px 28px;
          border-top: 1px solid #E2E8F0;
          background: #F8FAFC;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }

        .osm-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 800;
          font-family: var(--font-heading);
          cursor: pointer;
          border: none;
          transition: all 0.15s ease;
        }

        .osm-btn.ghost {
          background: transparent;
          color: #64748B;
        }

        .osm-btn.ghost:hover {
          color: #0F172A;
        }

        .osm-btn.primary {
          background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%);
          color: #FFFFFF;
          box-shadow: 0 4px 14px rgba(220, 38, 38, 0.25);
        }

        .osm-btn.primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(220, 38, 38, 0.35);
        }
      `}</style>
    </div>
  );
}
