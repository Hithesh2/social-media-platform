import { useState, useEffect } from 'react';
import {
  FiUsers,
  FiUserCheck,
  FiShield,
  FiEdit3,
  FiMail,
  FiPlus,
  FiSearch,
  FiCheckCircle,
  FiSend,
  FiMapPin,
  FiBriefcase,
  FiAward,
  FiTrendingUp,
  FiActivity,
  FiSliders,
  FiTrash2,
} from 'react-icons/fi';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import Sidebar from '../components/sidebar';
import Navbar from '../components/Navbar';
import { syncUserToFirestore } from '../Services/authService';
import { useAuth } from '../Context/AuthContext';
import { db } from '../Firebase/FirebaseConfig';

const ROLE_BADGES = {
  'Administrator': { icon: FiShield, color: '#DC2626', bg: '#FEF2F2', border: '#FCA5A5' },
  'Content Creator': { icon: FiEdit3, color: '#2563EB', bg: '#EFF6FF', border: '#93C5FD' },
  'Content Approver': { icon: FiUserCheck, color: '#9333EA', bg: '#F3E8FF', border: '#D8B4FE' },
};

const INITIAL_USERS = [
  {
    id: 'u1',
    name: 'Hithesh Maheepala',
    email: 'admin@redcross.org',
    role: 'Administrator',
    department: 'National Executive HQ',
    location: 'Colombo 07',
    status: 'Active',
    lastActive: 'Online Now',
    postsCount: 42,
    activity: 98,
    avatarGradient: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
    headerGradient: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
  },
  {
    id: 'u2',
    name: 'Seminda Fernando',
    email: 'creator@redcross.org',
    role: 'Content Creator',
    department: 'Disaster Emergency Comms',
    location: 'Gampaha Branch',
    status: 'Active',
    lastActive: '12m ago',
    postsCount: 31,
    activity: 94,
    avatarGradient: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
    headerGradient: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
  },
  {
    id: 'u3',
    name: 'Ramda Amaneth',
    email: 'approver@redcross.org',
    role: 'Content Approver',
    department: 'Media Relations & Governance',
    location: 'Colombo HQ',
    status: 'Active',
    lastActive: 'Online Now',
    postsCount: 48,
    activity: 99,
    avatarGradient: 'linear-gradient(135deg, #9333EA 0%, #6B21A8 100%)',
    headerGradient: 'linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)',
  },
  {
    id: 'u4',
    name: 'Savini Gunarathna',
    email: 'savini.g@redcross.org',
    role: 'Content Creator',
    department: 'Volunteer & Youth Operations',
    location: 'Kandy Branch',
    status: 'Active',
    lastActive: '25m ago',
    postsCount: 22,
    activity: 88,
    avatarGradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    headerGradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
  },
  {
    id: 'u5',
    name: 'Vinuki Pasangi',
    email: 'vinuki.p@redcross.org',
    role: 'Content Creator',
    department: 'Health & First Aid Outreach',
    location: 'Galle Branch',
    status: 'Active',
    lastActive: '1h ago',
    postsCount: 17,
    activity: 85,
    avatarGradient: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
    headerGradient: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
  },
];

export default function Users() {
  const { user: currentUser, switchRole } = useAuth();
  const [users, setUsers] = useState(INITIAL_USERS);
  const [activeRoleFilter, setActiveRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Content Creator');
  const [newDept, setNewDept] = useState('Community Humanitarian Unit');
  const [newLoc, setNewLoc] = useState('Colombo Branch');
  const [actionNotice, setActionNotice] = useState(null);

  useEffect(() => {
    async function loadFirestoreUsers() {
      if (db) {
        try {
          const querySnap = await getDocs(collection(db, 'users'));
          const fetchedMap = new Map();

          if (!querySnap.empty) {
            querySnap.forEach((docSnap) => {
              const data = docSnap.data();
              const emailKey = (data.email || '').toLowerCase().trim();

              if (emailKey && !fetchedMap.has(emailKey)) {
                fetchedMap.set(emailKey, {
                  id: docSnap.id,
                  name: data.name || (emailKey === 'admin@redcross.org' ? 'Hithesh Maheepala' : emailKey.split('@')[0]),
                  email: data.email || emailKey,
                  role: data.role || 'Content Creator',
                  department: data.department || 'Red Cross Operations',
                  location: data.location || 'Colombo HQ',
                  status: 'Active',
                  lastActive: 'Online Now',
                  postsCount: data.postsCount || 12,
                  activity: data.activity || 96,
                  avatarGradient: 'linear-gradient(135deg, #C8102E 0%, #991B1B 100%)',
                  headerGradient: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
                });
              }
            });
          }

          // Ensure the currently logged-in user is ALWAYS in the list
          if (currentUser && currentUser.email) {
            const currentEmailKey = currentUser.email.toLowerCase().trim();
            if (!fetchedMap.has(currentEmailKey)) {
              fetchedMap.set(currentEmailKey, {
                id: currentUser.uid || 'usr-current',
                name: currentUser.name || currentEmailKey.split('@')[0],
                email: currentUser.email,
                role: currentUser.role || 'Content Creator',
                department: currentUser.department || 'Red Cross Operations',
                location: currentUser.location || 'Colombo HQ',
                status: 'Active',
                lastActive: 'Online Now',
                postsCount: 15,
                activity: 98,
                avatarGradient: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
                headerGradient: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
              });
            }
          }

          const fetched = Array.from(fetchedMap.values());

          // Merge with initial fallback list without duplicate emails
          setUsers((prev) => {
            const existingEmails = new Set(fetched.map((f) => f.email.toLowerCase()));
            const filteredPrev = prev.filter((p) => !existingEmails.has(p.email.toLowerCase()));
            return [...fetched, ...filteredPrev];
          });
        } catch (err) {
          console.warn('Firestore load users notice:', err.message);
        }
      }
    }

    loadFirestoreUsers();
  }, [currentUser]);

  const handleRoleChange = (userId, role) => {
    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        const updated = { ...u, role };
        syncUserToFirestore({
          uid: u.id,
          email: u.email,
          name: u.name,
          role,
          department: u.department,
          location: u.location,
        });
        if (currentUser && (currentUser.name === u.name || currentUser.email === u.email)) {
          switchRole(role);
        }
        return updated;
      }
      return u;
    });

    setUsers(updatedUsers);
    setActionNotice('User role updated and synced to Firestore!');
    setTimeout(() => setActionNotice(null), 2500);
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to remove ${userName} from the team list?`)) {
      try {
        if (db && userId) {
          await deleteDoc(doc(db, 'users', userId));
        }
      } catch (err) {
        console.warn('Firestore delete notice:', err.message);
      }
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setActionNotice(`Removed ${userName} from team directory.`);
      setTimeout(() => setActionNotice(null), 2500);
    }
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const gradientsByRole = {
      'Administrator': { avatar: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)', header: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)' },
      'Content Creator': { avatar: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', header: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)' },
      'Content Approver': { avatar: 'linear-gradient(135deg, #9333EA 0%, #6B21A8 100%)', header: 'linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)' },
    };

    const conf = gradientsByRole[newRole] || gradientsByRole['Content Creator'];

    const newUser = {
      id: 'u-' + Date.now(),
      name: newName,
      email: newEmail,
      role: newRole,
      department: newDept,
      location: newLoc,
      status: 'Active',
      lastActive: 'Online Now',
      postsCount: 0,
      activity: 100,
      avatarGradient: conf.avatar,
      headerGradient: conf.header,
    };

    syncUserToFirestore({
      uid: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      department: newUser.department,
      location: newUser.location,
    });

    setUsers([newUser, ...users]);
    setNewName('');
    setNewEmail('');
    setShowAddModal(false);
    setActionNotice(`Added ${newName} to team and registered in Firestore!`);
    setTimeout(() => setActionNotice(null), 2500);
  };


  const filteredUsers = users
    .filter((u) => {
      const matchesRole =
        activeRoleFilter === 'all'
          ? true
          : u.role.toLowerCase() === activeRoleFilter.toLowerCase();
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.department && u.department.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesRole && matchesSearch;
    })
    .sort((a, b) => {
      const isACurrent = currentUser?.email && a.email?.toLowerCase() === currentUser.email.toLowerCase();
      const isBCurrent = currentUser?.email && b.email?.toLowerCase() === currentUser.email.toLowerCase();
      if (isACurrent) return -1;
      if (isBCurrent) return 1;
      return 0;
    });

  return (
    <div className="app-shell">
      <Sidebar activeKey="users" />

      <div className="app-main">
        <Navbar title="Platform User Management" />

        <main className="app-content">

          {/* Hero Header Banner */}
          <div className="usr-hero-card">
            <div className="usr-hero-info">
              <div className="usr-badge">
                <FiShield size={12} />
                <span>Red Cross Access & Permission Command</span>
              </div>
              <h2>Team Members & Role Administration</h2>
              <p>Manage administrative access, content creation rights, and approver workflow sign-off permissions across Sri Lanka Red Cross branches.</p>
            </div>

            <div className="usr-hero-right">
              <div className="usr-stats-pill">
                <FiUsers size={16} color="#C8102E" />
                <div>
                  <strong>{users.length} Total Members</strong>
                  <span>{users.filter((u) => u.status === 'Active').length} Active Officers</span>
                </div>
              </div>

              {currentUser?.role === 'Administrator' ? (
                <button
                  type="button"
                  className="usr-create-btn"
                  onClick={() => setShowAddModal(true)}
                >
                  <FiPlus size={16} /> Add Team Member
                </button>
              ) : (
                <div style={{ background: '#F1F5F9', border: '#CBD5E1', padding: '8px 14px', borderRadius: '12px', fontSize: '12.5px', fontWeight: '700', color: '#475569' }}>
                  Team Directory Mode (Read-Only)
                </div>
              )}
            </div>
          </div>

          {actionNotice && (
            <div className="usr-action-banner">
              <FiCheckCircle size={16} />
              <span>{actionNotice}</span>
            </div>
          )}

          {/* Controls Bar: Search & Role Filter Tabs */}
          <div className="usr-controls-bar">
            <div className="usr-search-box">
              <FiSearch size={15} color="#6B7280" />
              <input
                type="text"
                placeholder="Search officer by name, email, department or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="usr-filter-chips">
              <button
                type="button"
                className={`usr-chip${activeRoleFilter === 'all' ? ' is-active' : ''}`}
                onClick={() => setActiveRoleFilter('all')}
              >
                All Members ({users.length})
              </button>
              <button
                type="button"
                className={`usr-chip admin${activeRoleFilter === 'administrator' ? ' is-active' : ''}`}
                onClick={() => setActiveRoleFilter('administrator')}
              >
                Admins ({users.filter((u) => u.role === 'Administrator').length})
              </button>
              <button
                type="button"
                className={`usr-chip creator${activeRoleFilter === 'content creator' ? ' is-active' : ''}`}
                onClick={() => setActiveRoleFilter('content creator')}
              >
                Creators ({users.filter((u) => u.role === 'Content Creator').length})
              </button>
              <button
                type="button"
                className={`usr-chip approver${activeRoleFilter === 'content approver' ? ' is-active' : ''}`}
                onClick={() => setActiveRoleFilter('content approver')}
              >
                Approvers ({users.filter((u) => u.role === 'Content Approver').length})
              </button>
            </div>
          </div>

          {/* Enhanced Attractive Box Grid */}
          <div className="usr-grid">
            {filteredUsers.map((user) => {
              const badgeConf = ROLE_BADGES[user.role] || ROLE_BADGES['Administrator'];
              const RoleIcon = badgeConf.icon;
              const isCurrentSessionUser =
                currentUser?.email && user.email?.toLowerCase() === currentUser.email.toLowerCase();

              const initials = user.name
                ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                : 'RC';

              return (
                <div
                  key={user.id}
                  className="usr-card-box"
                  style={isCurrentSessionUser ? { border: '2px solid #C8102E', boxShadow: '0 8px 24px rgba(200, 16, 46, 0.15)' } : {}}
                >

                  {/* Top Header Card Banner */}
                  <div
                    className="usr-card-header-banner"
                    style={{ background: user.headerGradient || 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)' }}
                  >
                    <div className="usr-card-header-top">
                      <span
                        className="usr-role-badge-pill"
                        style={{
                          backgroundColor: '#FFFFFF',
                          color: badgeConf.color,
                          borderColor: badgeConf.border,
                        }}
                      >
                        <RoleIcon size={12} />
                        <span>{user.role}</span>
                      </span>

                      {isCurrentSessionUser ? (
                        <span className="usr-status-pill" style={{ background: '#DC2626', color: '#FFFFFF', borderColor: '#991B1B' }}>
                          <span className="usr-status-dot" style={{ background: '#FFFFFF', boxShadow: 'none' }} />
                          YOU (Active Session)
                        </span>
                      ) : (
                        <span className={`usr-status-pill ${user.status.toLowerCase()}`}>
                          <span className="usr-status-dot" />
                          {user.lastActive || user.status}
                        </span>
                      )}
                    </div>

                    {/* Floating Avatar Circle */}
                    <div
                      className="usr-avatar-wrapper"
                      style={{
                        background: user.avatarGradient || 'linear-gradient(135deg, #C8102E 0%, #A80F28 100%)',
                      }}
                    >
                      <span>{initials}</span>
                      <span className="usr-verified-icon" title="Verified Red Cross Officer">
                        <FiCheckCircle size={12} />
                      </span>
                    </div>
                  </div>

                  {/* Card Main Content Body */}
                  <div className="usr-card-content">
                    <div className="usr-name-row">
                      <h3 className="usr-name">{user.name}</h3>
                      {user.role === 'Administrator' && (
                        <span className="usr-admin-crown" title="Lead Administrator">
                          <FiAward size={15} color="#DC2626" />
                        </span>
                      )}
                    </div>

                    <a href={`mailto:${user.email}`} className="usr-email-link" title="Click to email officer">
                      <FiMail size={12} /> {user.email}
                    </a>

                    <div className="usr-info-tags">
                      <div className="usr-dept-tag">
                        <FiBriefcase size={11} color="#64748B" />
                        <span>{user.department || 'Red Cross Operations'}</span>
                      </div>

                      <div className="usr-loc-tag">
                        <FiMapPin size={11} color="#64748B" />
                        <span>{user.location || 'Sri Lanka Branch'}</span>
                      </div>
                    </div>

                    {/* KPI Box Inside Card */}
                    <div className="usr-metrics-card-box">
                      <div className="usr-m-box">
                        <span className="usr-m-val">{user.postsCount}</span>
                        <span className="usr-m-lbl">Posts Managed</span>
                      </div>
                      <div className="usr-m-divider" />
                      <div className="usr-m-box">
                        <span className="usr-m-val green">{user.activity}%</span>
                        <span className="usr-m-lbl">Activity Score</span>
                      </div>
                    </div>

                    {/* Activity Progress Bar */}
                    <div className="usr-activity-bar-wrap">
                      <div className="usr-act-label">
                        <span>Performance Score</span>
                        <strong>{user.activity}%</strong>
                      </div>
                      <div className="usr-act-track">
                        <div
                          className="usr-act-fill"
                          style={{
                            width: `${user.activity}%`,
                            background:
                              user.activity >= 90
                                ? 'linear-gradient(90deg, #059669, #10B981)'
                                : 'linear-gradient(90deg, #2563EB, #3B82F6)',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Role Assignment */}
                  <div className="usr-card-footer">
                    <div className="usr-role-reassign">
                      <label htmlFor={`role-${user.id}`}>Role:</label>
                      <select
                        id={`role-${user.id}`}
                        className="usr-role-select"
                        value={user.role}
                        disabled={currentUser?.role !== 'Administrator'}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      >
                        <option value="Administrator">Administrator</option>
                        <option value="Content Creator">Content Creator</option>
                        <option value="Content Approver">Content Approver</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <a href={`mailto:${user.email}`} className="usr-email-btn" title="Direct Email Officer">
                        <FiSend size={13} />
                      </a>
                      {currentUser?.role === 'Administrator' && (
                        <button
                          type="button"
                          className="usr-email-btn"
                          style={{ background: '#FEF2F2', color: '#DC2626', borderColor: '#FCA5A5' }}
                          title="Delete duplicate user document from Firestore"
                          onClick={() => handleDeleteUser(user.id, user.name)}
                        >
                          <FiTrash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Add Team Member Modal */}
          {showAddModal && (
            <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
              <div className="rc-card modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="ccm-header">
                  <div>
                    <h3>Add New Red Cross Officer</h3>
                    <p>Grant platform access and assign operational permissions</p>
                  </div>
                  <button type="button" className="ccm-close" onClick={() => setShowAddModal(false)}>✕</button>
                </div>

                <form onSubmit={handleAddUser}>
                  <div className="modal-field">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Savini Gunarathna"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </div>

                  <div className="modal-field">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. savini.g@redcross.org"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                  </div>

                  <div className="modal-field">
                    <label>Department / Unit</label>
                    <input
                      type="text"
                      placeholder="e.g. Community Humanitarian Unit"
                      value={newDept}
                      onChange={(e) => setNewDept(e.target.value)}
                    />
                  </div>

                  <div className="modal-field">
                    <label>Branch Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Colombo HQ"
                      value={newLoc}
                      onChange={(e) => setNewLoc(e.target.value)}
                    />
                  </div>

                  <div className="modal-field">
                    <label>Assigned Permission Role</label>
                    <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                      <option value="Content Creator">Content Creator</option>
                      <option value="Content Approver">Content Approver</option>
                      <option value="Administrator">Administrator</option>
                    </select>
                  </div>

                  <div className="modal-actions">
                    <button type="button" className="cp-btn cp-btn--ghost" onClick={() => setShowAddModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="cp-btn cp-btn--primary">
                      Add User Box
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>

      <style>{`
        .usr-hero-card {
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

        .usr-badge {
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

        .usr-hero-info h2 {
          font-size: 24px;
          font-weight: 800;
          color: #FFFFFF;
          font-family: var(--font-heading);
          letter-spacing: -0.025em;
          margin-bottom: 4px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .usr-hero-info p {
          font-size: 14px;
          color: #E2E8F0;
        }

        .usr-hero-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .usr-stats-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          padding: 8px 14px;
          border-radius: 12px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.03);
        }

        .usr-stats-pill strong {
          display: block;
          font-size: 14px;
          font-weight: 800;
          color: #1F2937;
          line-height: 1.1;
        }

        .usr-stats-pill span {
          font-size: 11px;
          color: #6B7280;
          font-weight: 600;
        }

        .usr-create-btn {
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

        .usr-create-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(200, 16, 46, 0.4);
        }

        .usr-action-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #ECFDF5;
          color: #059669;
          border: 1px solid #A7F3D0;
          padding: 12px 18px;
          border-radius: 12px;
          margin-bottom: 22px;
          font-size: 13.5px;
          font-weight: 700;
          font-family: var(--font-heading);
        }

        /* Controls Bar */
        .usr-controls-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          gap: 16px;
        }

        .usr-search-box {
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

        .usr-search-box input {
          border: none;
          outline: none;
          font-size: 13px;
          width: 100%;
          color: #1F2937;
        }

        .usr-filter-chips {
          display: flex;
          gap: 6px;
          background: #FFFFFF;
          border: 1px solid #D1D5DB;
          border-radius: 12px;
          padding: 4px;
        }

        .usr-chip {
          padding: 6px 14px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #4B5563;
          font-size: 12px;
          font-weight: 700;
          font-family: var(--font-heading);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .usr-chip.is-active {
          background: #1F2937;
          color: #FFFFFF;
        }

        /* User Card Boxes Grid */
        .usr-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .usr-card-box {
          border-radius: 20px;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
          transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .usr-card-box:hover {
          transform: translateY(-4px);
          border-color: #CBD5E1;
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.09);
        }

        /* Header Card Banner */
        .usr-card-header-banner {
          padding: 16px 18px 36px 18px;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .usr-card-header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .usr-role-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid;
          font-size: 11px;
          font-weight: 700;
          font-family: var(--font-heading);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .usr-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 10.5px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 999px;
          background: #FFFFFF;
          color: #059669;
          border: 1px solid #A7F3D0;
          font-family: var(--font-heading);
        }

        .usr-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 6px #10B981;
        }

        /* Floating Avatar */
        .usr-avatar-wrapper {
          position: absolute;
          bottom: -22px;
          left: 20px;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          color: #FFFFFF;
          font-size: 18px;
          font-weight: 800;
          font-family: var(--font-heading);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid #FFFFFF;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .usr-verified-icon {
          position: absolute;
          bottom: 0;
          right: -2px;
          background: #FFFFFF;
          color: #2563EB;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
        }

        /* Card Main Content */
        .usr-card-content {
          padding: 30px 20px 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .usr-name-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .usr-name {
          font-size: 17px;
          font-weight: 800;
          color: #0F172A;
          font-family: var(--font-heading);
          letter-spacing: -0.01em;
        }

        .usr-admin-crown {
          display: flex;
          align-items: center;
        }

        .usr-email-link {
          font-size: 12.5px;
          color: #64748B;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: color 0.12s ease;
        }

        .usr-email-link:hover {
          color: #C8102E;
        }

        .usr-info-tags {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-top: 4px;
        }

        .usr-dept-tag, .usr-loc-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #475569;
          font-weight: 500;
        }

        /* KPI Box */
        .usr-metrics-card-box {
          display: flex;
          align-items: center;
          background: #F8FAFC;
          border: 1px solid #F1F5F9;
          border-radius: 12px;
          padding: 10px 14px;
          margin-top: 10px;
        }

        .usr-m-box {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .usr-m-divider {
          width: 1px;
          height: 24px;
          background: #E2E8F0;
        }

        .usr-m-val {
          font-size: 16px;
          font-weight: 800;
          color: #0F172A;
          font-family: var(--font-heading);
        }

        .usr-m-val.green {
          color: #059669;
        }

        .usr-m-lbl {
          font-size: 11px;
          color: #64748B;
          font-weight: 600;
        }

        /* Activity Bar */
        .usr-activity-bar-wrap {
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .usr-act-label {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #64748B;
        }

        .usr-act-label strong {
          color: #0F172A;
        }

        .usr-act-track {
          width: 100%;
          height: 6px;
          border-radius: 999px;
          background: #E2E8F0;
          overflow: hidden;
        }

        .usr-act-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.3s ease;
        }

        /* Footer Role Selection */
        .usr-card-footer {
          padding: 12px 18px;
          background: #FAFBFD;
          border-top: 1px solid #F1F5F9;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .usr-role-reassign {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .usr-role-reassign label {
          font-size: 11.5px;
          font-weight: 700;
          color: #64748B;
          font-family: var(--font-heading);
        }

        .usr-role-select {
          flex: 1;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 700;
          color: #0F172A;
          background: #FFFFFF;
          cursor: pointer;
          font-family: var(--font-heading);
          transition: border-color 0.12s ease;
        }

        .usr-role-select:hover {
          border-color: #C8102E;
        }

        .usr-email-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #EFF6FF;
          color: #2563EB;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.12s ease;
        }

        .usr-email-btn:hover {
          background: #2563EB;
          color: #FFFFFF;
        }

        /* Modal */
        .modal-backdrop {
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

        .modal-box {
          max-width: 480px;
          width: 100%;
          padding: 24px;
          border-radius: 18px;
          background: #FFFFFF;
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

        .modal-field input, .modal-field select {
          border: 1px solid #D1D5DB;
          border-radius: 8px;
          padding: 9px 12px;
          font-size: 13.5px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 18px;
        }

        @media (max-width: 900px) {
          .usr-hero-card { flex-direction: column; align-items: flex-start; gap: 14px; }
          .usr-controls-bar { flex-direction: column; align-items: stretch; }
          .usr-search-box { width: 100%; }
        }
      `}</style>
    </div>
  );
}
