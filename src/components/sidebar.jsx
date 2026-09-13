import { useState } from 'react';
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
  FiMenu,
  FiX,
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = NAV_ITEMS;

  const handleLogout = async (e) => {
    e.preventDefault();
    setMobileOpen(false);
    await logout();
    navigate('/login');
  };

  const handleNavClick = (path) => {
    setMobileOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* Floating Mobile Toggle Button */}
      <button
        type="button"
        className="rc-mobile-fab-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        title="Open Red Cross Platform Menu"
      >
        {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        <span>Menu</span>
      </button>

      {/* Backdrop for Mobile Drawer */}
      {mobileOpen && (
        <div className="rc-sidebar-backdrop" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`rc-sidebar${mobileOpen ? ' is-mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="rc-sidebar__brand">
          <div className="rc-sidebar__brand-mark">
            <FaHeartbeat size={18} />
          </div>
          <div className="rc-sidebar__brand-text">
            <strong>Red Cross</strong>
            <span>Content Platform</span>
          </div>

          <button
            type="button"
            className="rc-sidebar-mobile-close"
            onClick={() => setMobileOpen(false)}
          >
            <FiX size={18} />
          </button>
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
                onClick={() => handleNavClick(path)}
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
      </aside>

      <style>{`
        .rc-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: var(--sidebar-width);
          height: 100vh;
          background: linear-gradient(180deg, #180306 0%, #140307 45%, #0F172A 100%);
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          z-index: 20;
          box-shadow: 4px 0 24px rgba(0, 0, 0, 0.25);
          font-family: var(--font-body);
        }

        .rc-sidebar__brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          height: var(--navbar-height);
          background: rgba(0, 0, 0, 0.2);
        }

        .rc-sidebar__brand-mark {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: linear-gradient(135deg, #EF4444 0%, #991B1B 100%);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(239, 68, 68, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .rc-sidebar__brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1.25;
        }

        .rc-sidebar__brand-text strong {
          font-size: 15.5px;
          font-weight: 800;
          color: #FFFFFF;
          font-family: var(--font-heading);
          letter-spacing: -0.01em;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .rc-sidebar__brand-text span {
          font-size: 11px;
          color: #FDA4AF;
          font-weight: 700;
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }

        .rc-sidebar__nav {
          flex: 1;
          overflow-y: auto;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .rc-sidebar__nav::-webkit-scrollbar {
          width: 4px;
        }
        .rc-sidebar__nav::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 999px;
        }

        .rc-sidebar__link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 9px 14px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 600;
          color: #CBD5E1;
          background: transparent;
          border: 1px solid transparent;
          text-align: left;
          width: 100%;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .rc-sidebar__icon-box {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .rc-sidebar__link-label {
          font-family: var(--font-heading);
          flex: 1;
        }

        .rc-sidebar__link:hover:not(.is-active) {
          background: rgba(255, 255, 255, 0.08);
          color: #FFFFFF;
          transform: translateX(4px);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .rc-sidebar__link:hover:not(.is-active) .rc-sidebar__icon-box {
          transform: scale(1.1);
        }

        .rc-sidebar__link.is-active {
          background: linear-gradient(135deg, #7F1D1D 0%, #C8102E 100%);
          color: #FFFFFF;
          box-shadow: 0 4px 16px rgba(200, 16, 46, 0.35);
          border: 1px solid rgba(254, 202, 202, 0.3);
        }

        .rc-sidebar__link.is-active .rc-sidebar__link-label {
          font-weight: 800;
        }

        /* Footer */
        .rc-sidebar__footer {
          padding: 14px 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.2);
        }

        .rc-sidebar__logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 9px 14px;
          border-radius: 10px;
          border: 1px solid rgba(239, 68, 68, 0.2);
          background: rgba(239, 68, 68, 0.08);
          color: #FCA5A5;
          font-size: 13px;
          font-weight: 700;
          font-family: var(--font-heading);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .rc-sidebar__logout-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: rgba(239, 68, 68, 0.15);
          color: #EF4444;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .rc-sidebar__logout-btn:hover {
          background: #DC2626;
          color: #FFFFFF;
          border-color: #DC2626;
          box-shadow: 0 4px 14px rgba(220, 38, 38, 0.35);
        }

        .rc-sidebar__logout-btn:hover .rc-sidebar__logout-icon {
          background: rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
        }

        /* Mobile Responsive Drawer & Toggle */
        .rc-mobile-fab-toggle {
          display: none;
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 999;
          background: linear-gradient(135deg, #C8102E 0%, #A80F28 100%);
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 999px;
          padding: 10px 18px;
          font-size: 13.5px;
          font-weight: 800;
          font-family: var(--font-heading);
          box-shadow: 0 6px 20px rgba(200, 16, 46, 0.4);
          cursor: pointer;
          align-items: center;
          gap: 8px;
          transition: transform 0.15s ease;
        }

        .rc-mobile-fab-toggle:active {
          transform: scale(0.95);
        }

        .rc-sidebar-backdrop {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(6px);
          z-index: 980;
          animation: fadeIn 0.18s ease-out;
        }

        .rc-sidebar-mobile-close {
          display: none;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #CBD5E1;
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
        }

        @media (max-width: 900px) {
          .rc-mobile-fab-toggle {
            display: flex;
          }

          .rc-sidebar-backdrop {
            display: block;
          }

          .rc-sidebar-mobile-close {
            display: block;
            margin-left: auto;
          }

          .rc-sidebar {
            display: flex !important;
            transform: translateX(-100%);
            transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 990;
            width: 280px;
            box-shadow: 8px 0 30px rgba(0, 0, 0, 0.35);
          }

          .rc-sidebar.is-mobile-open {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}