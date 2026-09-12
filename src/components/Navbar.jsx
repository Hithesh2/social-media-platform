import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBell,
  FiChevronDown,
  FiShield,
  FiEdit3,
  FiUserCheck,
  FiUsers,
  FiLogOut,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
} from 'react-icons/fi';
import { useAuth } from '../Context/AuthContext';

const ROLE_BADGE_STYLES = {
  'Administrator': { color: '#DC2626', bg: '#FEF2F2', border: '#FCA5A5', icon: FiShield },
  'Content Creator': { color: '#2563EB', bg: '#EFF6FF', border: '#93C5FD', icon: FiEdit3 },
  'Content Approver': { color: '#9333EA', bg: '#F3E8FF', border: '#D8B4FE', icon: FiUserCheck },
};

const SAMPLE_NOTIFICATIONS = [
  {
    id: 1,
    title: 'New Post Submitted for Approval',
    desc: 'Disaster Relief Drive campaign submitted by Seminda Fernando',
    time: '10m ago',
    type: 'approval',
    icon: FiAlertCircle,
    color: '#D97706',
    bg: '#FEF3C7',
  },
  {
    id: 2,
    title: 'Emblem Compliance Verified',
    desc: 'Red Cross emblem compliance check passed for Flood Relief post',
    time: '1h ago',
    type: 'compliance',
    icon: FiCheckCircle,
    color: '#059669',
    bg: '#ECFDF5',
  },
  {
    id: 3,
    title: 'Post Sign-off Requested',
    desc: 'Medical Accuracy review requested by Ramda Amaneth',
    time: '2h ago',
    type: 'review',
    icon: FiClock,
    color: '#2563EB',
    bg: '#EFF6FF',
  },
];

export default function Navbar({ title = 'Dashboard', notificationCount = 3 }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentUser = user || { name: 'Hithesh Maheepala', role: 'Administrator' };
  const initials = currentUser.avatar || (currentUser.name
    ? currentUser.name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
    : 'RC');

  const roleStyle = ROLE_BADGE_STYLES[currentUser.role] || ROLE_BADGE_STYLES['Administrator'];
  const RoleIcon = roleStyle.icon;

  const handleNavigateToUsers = () => {
    setDropdownOpen(false);
    navigate('/users');
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <header className="rc-navbar">
      <h1 className="rc-navbar__title">{title}</h1>

      <div className="rc-navbar__actions">

        {/* Notification Alerts Box Dropdown */}
        <div className="rc-navbar__notif-wrap" ref={notifRef}>
          <button
            type="button"
            className="rc-navbar__icon-btn"
            onClick={() => setNotifOpen(!notifOpen)}
            aria-label={`${notificationCount} notifications`}
            title="Click to view recent system alerts & approval notifications"
          >
            <FiBell size={17} />
            {notificationCount > 0 && <span className="rc-navbar__badge">{notificationCount}</span>}
          </button>

          {notifOpen && (
            <div className="rc-navbar__notif-box">
              <div className="rc-notif-header">
                <strong>Platform Alerts & Notifications</strong>
                <span>{SAMPLE_NOTIFICATIONS.length} New Alerts</span>
              </div>
              <div className="rc-notif-list">
                {SAMPLE_NOTIFICATIONS.map((n) => {
                  const NIcon = n.icon;
                  return (
                    <div key={n.id} className="rc-notif-item">
                      <div className="rc-notif-icon-box" style={{ background: n.bg, color: n.color }}>
                        <NIcon size={14} />
                      </div>
                      <div className="rc-notif-text">
                        <strong>{n.title}</strong>
                        <p>{n.desc}</p>
                        <span>{n.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="rc-notif-footer">
                <button
                  type="button"
                  onClick={() => {
                    setNotifOpen(false);
                    navigate('/approvals');
                  }}
                >
                  View Approvals Queue →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Box */}
        <div className="rc-navbar__user-wrap" ref={dropdownRef}>
          <button
            type="button"
            className="rc-navbar__user"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            title="Click to view user menu and manage team members"
          >
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.name}
                className="rc-navbar__avatar-img"
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <span className="rc-navbar__avatar" aria-hidden="true">{initials}</span>
            )}
            <div className="rc-navbar__user-text">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <strong>{currentUser.name}</strong>
                {(currentUser.authProvider === 'google' || currentUser.email?.includes('google') || currentUser.email?.includes('gmail')) && (
                  <span title="Authenticated via Google Workspace" style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                  </span>
                )}
              </div>
              <span
                className="rc-role-tag"
                style={{
                  backgroundColor: roleStyle.bg,
                  color: roleStyle.color,
                  borderColor: roleStyle.border,
                }}
              >
                <RoleIcon size={10} />
                {currentUser.role}
              </span>
            </div>
            <FiChevronDown size={14} color="#6B7280" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
          </button>

          {dropdownOpen && (
            <div className="rc-navbar__dropdown">
              <div className="rc-drop-header">
                <strong>{currentUser.name}</strong>
                <span>{currentUser.email || 'admin@redcross.org'}</span>
              </div>

              <div className="rc-drop-divider" />

              <button
                type="button"
                className="rc-drop-item primary-action"
                onClick={handleNavigateToUsers}
              >
                <div className="rc-drop-icon-box">
                  <FiUsers size={15} />
                </div>
                <div className="rc-drop-text">
                  <strong>Watch & Manage Users</strong>
                  <span>View all team members & roles</span>
                </div>
              </button>

              <div className="rc-drop-divider" />

              <button
                type="button"
                className="rc-drop-item logout-action"
                onClick={handleLogout}
              >
                <div className="rc-drop-icon-box logout">
                  <FiLogOut size={15} />
                </div>
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>


      <style>{`
        .rc-navbar {
          height: var(--navbar-height);
          background: var(--rc-white);
          border-bottom: 1px solid var(--rc-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .rc-navbar__title {
          font-size: 18px;
          font-weight: 800;
          font-family: var(--font-heading);
        }

        .rc-navbar__actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .rc-navbar__notif-wrap {
          position: relative;
        }

        .rc-navbar__notif-box {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 340px;
          background: #FFFFFF;
          border-radius: 16px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.14);
          border: 1px solid #E5E7EB;
          overflow: hidden;
          z-index: 100;
          animation: notifSlide 0.18s ease-out;
        }

        @keyframes notifSlide {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .rc-notif-header {
          padding: 14px 16px;
          background: #F8FAFC;
          border-bottom: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .rc-notif-header strong {
          font-size: 13px;
          font-weight: 800;
          color: #0F172A;
          font-family: var(--font-heading);
        }

        .rc-notif-header span {
          font-size: 11px;
          font-weight: 700;
          color: #DC2626;
          background: #FEF2F2;
          padding: 2px 8px;
          border-radius: 999px;
          border: 1px solid #FCA5A5;
        }

        .rc-notif-list {
          display: flex;
          flex-direction: column;
          max-height: 280px;
          overflow-y: auto;
        }

        .rc-notif-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid #F1F5F9;
          transition: background 0.12s ease;
        }

        .rc-notif-item:hover {
          background: #F8FAFC;
        }

        .rc-notif-icon-box {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .rc-notif-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .rc-notif-text strong {
          font-size: 12.5px;
          font-weight: 700;
          color: #1E293B;
          font-family: var(--font-heading);
        }

        .rc-notif-text p {
          font-size: 12px;
          color: #64748B;
          line-height: 1.35;
          margin: 0;
        }

        .rc-notif-text span {
          font-size: 10.5px;
          color: #94A3B8;
          font-weight: 600;
        }

        .rc-notif-footer {
          padding: 10px 16px;
          background: #F8FAFC;
          border-top: 1px solid #E2E8F0;
          text-align: center;
        }

        .rc-notif-footer button {
          border: none;
          background: transparent;
          color: #2563EB;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          font-family: var(--font-heading);
        }

        .rc-navbar__icon-btn {
          position: relative;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid var(--rc-border);
          background: var(--rc-white);
          color: var(--rc-text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.12s ease;
        }

        .rc-navbar__icon-btn:hover {
          background: var(--rc-bg);
        }

        .rc-navbar__badge {
          position: absolute;
          top: -4px;
          right: -4px;
          min-width: 16px;
          height: 16px;
          padding: 0 4px;
          border-radius: 999px;
          background: var(--rc-primary);
          color: var(--rc-white);
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--rc-white);
        }

        .rc-navbar__user-wrap {
          position: relative;
        }

        .rc-navbar__user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 10px 4px 5px;
          border-radius: 10px;
          border: 1px solid #E5E7EB;
          background: #FFFFFF;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .rc-navbar__user:hover {
          border-color: #CBD5E1;
          background: #FAFBFD;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .rc-navbar__avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #C8102E 0%, #A80F28 100%);
          color: var(--rc-white);
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(200, 16, 46, 0.2);
        }

        .rc-navbar__user-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
          line-height: 1.1;
        }

        .rc-navbar__user-text strong {
          font-size: 13px;
          font-weight: 700;
          color: var(--rc-text);
          font-family: var(--font-heading);
        }

        .rc-role-tag {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 999px;
          border: 1px solid;
          font-family: var(--font-heading);
        }

        /* Dropdown Menu */
        .rc-navbar__dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 240px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
          padding: 8px;
          z-index: 50;
          animation: dropFadeIn 0.15s ease-out;
        }

        @keyframes dropFadeIn {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .rc-drop-header {
          padding: 8px 10px;
          display: flex;
          flex-direction: column;
        }

        .rc-drop-header strong {
          font-size: 13.5px;
          font-weight: 700;
          color: #0F172A;
          font-family: var(--font-heading);
        }

        .rc-drop-header span {
          font-size: 11.5px;
          color: #64748B;
        }

        .rc-drop-divider {
          height: 1px;
          background: #F1F5F9;
          margin: 4px 0;
        }

        .rc-drop-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 8px;
          border: none;
          background: transparent;
          cursor: pointer;
          text-align: left;
          transition: background 0.12s ease;
        }

        .rc-drop-item:hover {
          background: #F8FAFC;
        }

        .rc-drop-item.primary-action:hover {
          background: #EFF6FF;
        }

        .rc-drop-icon-box {
          width: 30px;
          height: 30px;
          border-radius: 7px;
          background: #EFF6FF;
          color: #2563EB;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .rc-drop-icon-box.logout {
          background: #FEF2F2;
          color: #DC2626;
        }

        .rc-drop-text {
          display: flex;
          flex-direction: column;
        }

        .rc-drop-text strong {
          font-size: 12.5px;
          font-weight: 700;
          color: #1E293B;
        }

        .rc-drop-text span {
          font-size: 10.5px;
          color: #64748B;
        }

        .rc-drop-item.logout-action {
          color: #DC2626;
          font-size: 13px;
          font-weight: 600;
        }

        @media (max-width: 560px) {
          .rc-navbar__user-text {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}