import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiEdit3,
  FiFileText,
  FiCheckSquare,
  FiCalendar,
  FiBarChart2,
  FiCompass,
  FiShield,
  FiUsers,
  FiLogOut,
  FiUserCheck,
} from 'react-icons/fi';
import { FaBullhorn, FaHeartbeat } from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: FiHome, path: '/dashboard', color: '#DC2626', bg: '#FEF2F2' },
  { key: 'create-post', label: 'Create Post', icon: FiEdit3, path: '/create-post', color: '#9333EA', bg: '#F3E8FF' },
  { key: 'posts', label: 'All Posts', icon: FiFileText, path: '/posts', color: '#2563EB', bg: '#EFF6FF' },
  { key: 'approvals', label: 'Approvals', icon: FiCheckSquare, path: '/approvals', color: '#059669', bg: '#ECFDF5' },
  { key: 'schedule', label: 'Schedule', icon: FiCalendar, path: '/schedule', color: '#D97706', bg: '#FEF3C7' },
  { key: 'campaigns', label: 'Campaigns', icon: FaBullhorn, path: '/campaigns', color: '#DB2777', bg: '#FCE7F3' },
  { key: 'analytics', label: 'Analytics', icon: FiBarChart2, path: '/analytics', color: '#0284C7', bg: '#E0F2FE' },
  { key: 'strategy', label: 'Strategy', icon: FiCompass, path: '/strategy', color: '#0D9488', bg: '#CCFBF1' },
  { key: 'privacy', label: 'Privacy & Policy', icon: FiShield, path: '/privacy', color: '#4F46E5', bg: '#E0E7FF' },
  { key: 'users', label: 'User Management', icon: FiUsers, path: '/users', adminOnly: true, color: '#EA580C', bg: '#FFEDD5' },
];

export default function Sidebar({ activeKey }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const items = NAV_ITEMS;

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    navigate('/login');
  };

  return (
    <aside className="rc-sidebar">
      {/* Brand Header */}
      <div className="rc-sidebar__brand">
        <div className="rc-sidebar__brand-mark">
          <FaHeartbeat size={18} />
        </div>
        <div className="rc-sidebar__brand-text">
          <strong>Red Cross</strong>
          <span>Content Platform</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="rc-sidebar__nav" aria-label="Primary">
        {items.map(({ key, label, icon: Icon, path, color, bg }) => {
          const isActive = activeKey ? key === activeKey : location.pathname === path;
          return (
            <button
              type="button"
              key={key}
              className={`rc-sidebar__link${isActive ? ' is-active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => navigate(path)}
            >
              <span
                className="rc-sidebar__icon-box"
                style={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.22)' : bg,
                  color: isActive ? '#FFFFFF' : color,
                }}
              >
                <Icon size={15} />
              </span>
              <span className="rc-sidebar__link-label">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Footer */}
      <div className="rc-sidebar__footer">
        <button type="button" onClick={handleLogout} className="rc-sidebar__logout-btn">
          <span className="rc-sidebar__logout-icon">
            <FiLogOut size={15} />
          </span>
          <span>Logout</span>
        </button>
      </div>

      <style>{`
        .rc-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: var(--sidebar-width);
          height: 100vh;
          background: #FFFFFF;
          border-right: 1px solid #E5E7EB;
          display: flex;
          flex-direction: column;
          z-index: 20;
          box-shadow: 2px 0 12px rgba(0, 0, 0, 0.03);
          font-family: var(--font-body);
        }

        .rc-sidebar__brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid #F3F4F6;
          height: var(--navbar-height);
        }

        .rc-sidebar__brand-mark {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #C8102E 0%, #A80F28 100%);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(200, 16, 46, 0.25);
        }

        .rc-sidebar__brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1.25;
        }

        .rc-sidebar__brand-text strong {
          font-size: 15px;
          font-weight: 800;
          color: #1F2937;
          font-family: var(--font-heading);
          letter-spacing: -0.01em;
        }

        .rc-sidebar__brand-text span {
          font-size: 11.5px;
          color: #6B7280;
          font-weight: 500;
        }

        .rc-sidebar__nav {
          flex: 1;
          overflow-y: auto;
          padding: 14px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .rc-sidebar__link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 600;
          color: #4B5563;
          background: transparent;
          border: none;
          text-align: left;
          width: 100%;
          cursor: pointer;
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .rc-sidebar__icon-box {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }

        .rc-sidebar__link-label {
          font-family: var(--font-heading);
        }

        .rc-sidebar__link:hover:not(.is-active) {
          background: #F9FAFB;
          color: #111827;
          transform: translateX(3px);
        }

        .rc-sidebar__link:hover:not(.is-active) .rc-sidebar__icon-box {
          transform: scale(1.08);
        }

        .rc-sidebar__link.is-active {
          background: linear-gradient(135deg, #C8102E 0%, #A80F28 100%);
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(200, 16, 46, 0.22);
        }

        .rc-sidebar__link.is-active .rc-sidebar__link-label {
          font-weight: 700;
        }

        /* Eye Catching Role Card */
        .rc-sidebar__role-card {
          margin: 8px 12px;
          padding: 12px;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          background: #FAFBFD;
        }

        .rc-role-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .rc-role-card__title {
          font-size: 11px;
          font-weight: 800;
          color: #9CA3AF;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-family: var(--font-heading);
        }

        .rc-role-pills {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
        }

        .rc-role-pill-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 7px 4px;
          border-radius: 8px;
          border: 1px solid;
          font-size: 11.5px;
          font-weight: 700;
          font-family: var(--font-heading);
          cursor: pointer;
          transition: all 0.12s ease;
        }

        .rc-role-pill-btn:hover {
          transform: translateY(-1px);
        }

        .rc-role-pill-btn.is-selected {
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
        }

        /* Footer */
        .rc-sidebar__footer {
          padding: 12px 14px;
          border-top: 1px solid #F3F4F6;
        }

        .rc-sidebar__logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid transparent;
          background: transparent;
          color: #6B7280;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .rc-sidebar__logout-icon {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: #F3F4F6;
          color: #6B7280;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .rc-sidebar__logout-btn:hover {
          background: #FEF2F2;
          color: #DC2626;
        }

        .rc-sidebar__logout-btn:hover .rc-sidebar__logout-icon {
          background: #DC2626;
          color: #FFFFFF;
        }

        @media (max-width: 900px) {
          .rc-sidebar {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
}