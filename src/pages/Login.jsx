import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiMail,
  FiLock,
  FiAlertCircle,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiGlobe,
  FiShield,
  FiUser,
  FiBriefcase,
  FiMapPin,
  FiUserCheck,
} from 'react-icons/fi';
import { FaHeartbeat } from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [regName, setRegName] = useState('');
  const [regRole, setRegRole] = useState('Content Creator');
  const [regDepartment, setRegDepartment] = useState('Community Operations Unit');
  const [regLocation, setRegLocation] = useState('Colombo HQ');
  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, loginWithGoogleAccount, registerUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessNotice('');

    if (isRegisterMode) {
      if (!regName.trim()) {
        setError('Please enter your full officer name.');
        return;
      }
    }

    if (!email.trim() || !password.trim()) {
      setError('Please enter both your email address and password.');
      return;
    }

    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.trim().length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      if (isRegisterMode) {
        await registerUser({
          name: regName.trim(),
          email: email.trim(),
          password: password.trim(),
          role: regRole,
          department: regDepartment,
          location: regLocation,
        });
        setSuccessNotice(`Account registered successfully for ${regName}! Redirecting...`);
      } else {
        await login(email.trim(), password.trim());
        setSuccessNotice('Account authenticated successfully! Redirecting...');
      }
      setTimeout(() => navigate('/dashboard'), 900);
    } catch (err) {
      console.error('Firebase Auth error details:', err);
      setError(`Auth Notice: ${err.message || 'Authentication failed'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await loginWithGoogleAccount();
      setSuccessNotice('Google Authentication successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err) {
      setError(err.message || 'Google Sign-In failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="rc-login-page">
      <div className="rc-login-container">
        
        {/* Left Hero Brand Panel */}
        <div className="rc-login-hero">
          <div className="rc-login-hero__brand">
            <div className="rc-login-hero__logo">
              <FaHeartbeat size={28} />
            </div>
            <div>
              <h2>Red Cross Society</h2>
              <span>Social Content Platform</span>
            </div>
          </div>

          <div className="rc-login-hero__headline">
            <h1>Humanitarian Communication & Campaign Management</h1>
            <p>Unified publishing, real-time approval workflow, and public compliance for global Red Cross operations.</p>
          </div>

          <div className="rc-login-hero__features">
            <div className="rc-hero-feature">
              <FiCheckCircle size={18} />
              <div>
                <strong>Multi-Channel Broadcast</strong>
                <span>Instant dispatch to Facebook, Instagram, and X (Twitter)</span>
              </div>
            </div>
            <div className="rc-hero-feature">
              <FiCheckCircle size={18} />
              <div>
                <strong>Strict Emblem Compliance</strong>
                <span>Integrated approval queue for beneficiary dignity & media privacy</span>
              </div>
            </div>
            <div className="rc-hero-feature">
              <FiCheckCircle size={18} />
              <div>
                <strong>Live Performance Insights</strong>
                <span>Track reach, volunteer recruitment, and donation drive impact</span>
              </div>
            </div>
          </div>

          <div className="rc-login-hero__footer">
            <FiGlobe size={14} />
            <span>Sri Lanka Red Cross Society • Academic Module CCS4360</span>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="rc-login-card-wrapper">
          <div className="rc-login-card">
            
            <div className="rc-login-card__header">
              <h2>{isRegisterMode ? 'Register New Account' : 'Sign In to Platform'}</h2>
              <p>{isRegisterMode ? 'Create your official Red Cross officer account with complete details' : 'Choose your preferred login method to continue'}</p>
            </div>

            {/* Auth Mode Toggle Tabs */}
            <div className="rc-auth-mode-tabs">
              <button
                type="button"
                className={`rc-auth-tab${!isRegisterMode ? ' is-active' : ''}`}
                onClick={() => setIsRegisterMode(false)}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`rc-auth-tab${isRegisterMode ? ' is-active' : ''}`}
                onClick={() => setIsRegisterMode(true)}
              >
                Register New User
              </button>
            </div>

            {/* Google Sign-In Button */}
            <button
              type="button"
              className="rc-google-btn"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
            >
              <svg className="rc-google-icon" width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{googleLoading ? 'Connecting to Google...' : 'Sign in with Google Account'}</span>
            </button>

            <div className="rc-login-divider">
              <span>{isRegisterMode ? 'Or fill account registration details' : 'Or sign in with Red Cross Email'}</span>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              
              {/* Additional Registration Fields */}
              {isRegisterMode && (
                <>
                  <div className="rc-form-group">
                    <label htmlFor="reg-name">Full Officer Name *</label>
                    <div className="rc-input-box">
                      <FiUser size={16} />
                      <input
                        id="reg-name"
                        type="text"
                        name="name"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Dr. Mahesh Kularatne"
                      />
                    </div>
                  </div>

                  <div className="rc-form-group">
                    <label htmlFor="reg-role">Assigned Permission Role *</label>
                    <div className="rc-input-box">
                      <FiShield size={16} />
                      <select
                        id="reg-role"
                        className="rc-select-input"
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value)}
                      >
                        <option value="Content Creator">Content Creator (Drafting & Social Posts)</option>
                        <option value="Content Approver">Content Approver (Review & Sign-Off)</option>
                      </select>
                    </div>
                    <span style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                      * Administrator access is restricted to executive leadership (Hithesh, Seminda, Ramda).
                    </span>
                  </div>

                  <div className="rc-form-row">
                    <div className="rc-form-group">
                      <label htmlFor="reg-dept">Department / Unit</label>
                      <div className="rc-input-box">
                        <FiBriefcase size={15} />
                        <input
                          id="reg-dept"
                          type="text"
                          value={regDepartment}
                          onChange={(e) => setRegDepartment(e.target.value)}
                          placeholder="e.g. Youth Operations"
                        />
                      </div>
                    </div>

                    <div className="rc-form-group">
                      <label htmlFor="reg-loc">Branch Location</label>
                      <div className="rc-input-box">
                        <FiMapPin size={15} />
                        <input
                          id="reg-loc"
                          type="text"
                          value={regLocation}
                          onChange={(e) => setRegLocation(e.target.value)}
                          placeholder="e.g. Colombo HQ"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="rc-form-group">
                <label htmlFor="login-email">Email Address *</label>
                <div className="rc-input-box">
                  <FiMail size={16} />
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@redcross.org"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="rc-form-group">
                <div className="rc-label-row">
                  <label htmlFor="login-password">Password *</label>
                </div>
                <div className="rc-input-box">
                  <FiLock size={16} />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="rc-pass-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              {successNotice && (
                <div className="rc-login-alert success" role="status">
                  <FiCheckCircle size={16} />
                  <span>{successNotice}</span>
                </div>
              )}

              {error && (
                <div className="rc-login-alert" role="alert">
                  <FiAlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" className="rc-submit-btn" disabled={submitting}>
                {submitting ? 'Processing...' : (isRegisterMode ? 'Register Officer Account' : 'Sign In')}
              </button>
            </form>

            <div className="rc-login-card__footer">
              <FiShield size={12} />
              <span>Protected by Firebase Auth & OAuth 2.0 Security</span>
            </div>

          </div>
        </div>

      </div>

      <style>{`
        .rc-select-input {
          width: 100%;
          border: none;
          outline: none;
          padding: 11px 0;
          font-size: 13.5px;
          color: #1F2937;
          background: transparent;
          font-family: var(--font-body);
        }

        .rc-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .rc-login-alert.success {
          background: #ECFDF5;
          border-color: #A7F3D0;
          color: #059669;
        }

        .rc-login-page {
          min-height: 100vh;
          width: 100%;
          background: linear-gradient(135deg, #FAFBFD 0%, #F3F4F6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 28px 20px;
          font-family: var(--font-body);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .rc-login-container {
          width: 100%;
          max-width: 1060px;
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          background: #FFFFFF;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05);
          border: 1px solid #E5E7EB;
          overflow: hidden;
        }

        /* Left Hero */
        .rc-login-hero {
          background: linear-gradient(145deg, #C8102E 0%, #9B0B22 100%);
          color: #FFFFFF;
          padding: 44px 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }

        .rc-login-hero::after {
          content: '';
          position: absolute;
          right: -50px;
          bottom: -50px;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          pointer-events: none;
        }

        .rc-login-hero__brand {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .rc-login-hero__logo {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: #FFFFFF;
          color: #C8102E;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .rc-login-hero__brand h2 {
          font-size: 20px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0;
          line-height: 1.1;
        }

        .rc-login-hero__brand span {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
        }

        .rc-login-hero__headline {
          margin: 36px 0;
        }

        .rc-login-hero__headline h1 {
          font-size: 26px;
          font-weight: 700;
          line-height: 1.3;
          color: #FFFFFF;
          margin-bottom: 12px;
        }

        .rc-login-hero__headline p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.55;
        }

        .rc-login-hero__features {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 30px;
        }

        .rc-hero-feature {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .rc-hero-feature svg {
          color: #FCA5A5;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .rc-hero-feature div {
          display: flex;
          flex-direction: column;
        }

        .rc-hero-feature strong {
          font-size: 14px;
          font-weight: 600;
          color: #FFFFFF;
        }

        .rc-hero-feature span {
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.75);
        }

        .rc-login-hero__footer {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          padding-top: 16px;
        }

        /* Right Form Card */
        .rc-login-card-wrapper {
          padding: 44px 38px;
          display: flex;
          align-items: center;
          background: #FFFFFF;
        }

        .rc-login-card {
          width: 100%;
        }

        .rc-login-card__header {
          margin-bottom: 24px;
        }

        .rc-login-card__header h2 {
          font-size: 22px;
          font-weight: 700;
          color: #1F2937;
          margin-bottom: 4px;
        }

        .rc-login-card__header p {
          font-size: 13.5px;
          color: #6B7280;
        }

        .rc-auth-mode-tabs {
          display: flex;
          background: #F1F5F9;
          padding: 4px;
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .rc-auth-tab {
          flex: 1;
          padding: 7px 12px;
          border-radius: 7px;
          border: none;
          background: transparent;
          font-size: 12.5px;
          font-weight: 700;
          color: #64748B;
          cursor: pointer;
          font-family: var(--font-heading);
          transition: all 0.12s ease;
        }

        .rc-auth-tab.is-active {
          background: #FFFFFF;
          color: #0F172A;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        /* Google Button */
        .rc-google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 12px 18px;
          border: 1.5px solid #CBD5E1;
          border-radius: 12px;
          background: #FFFFFF;
          color: #0F172A;
          font-size: 14.5px;
          font-weight: 800;
          font-family: var(--font-heading);
          letter-spacing: -0.01em;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.06);
        }

        .rc-google-btn span {
          font-weight: 800;
          color: #0F172A;
        }

        .rc-google-btn:hover {
          background: #F8FAFC;
          border-color: #94A3B8;
          color: #000000;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
          transform: translateY(-1px);
        }

        .rc-google-icon {
          flex-shrink: 0;
        }

        /* Divider */
        .rc-login-divider {
          text-align: center;
          position: relative;
          margin: 22px 0;
        }

        .rc-login-divider::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          width: 100%;
          height: 1px;
          background: #E5E7EB;
        }

        .rc-login-divider span {
          position: relative;
          background: #FFFFFF;
          padding: 0 12px;
          font-size: 12px;
          color: #9CA3AF;
          font-weight: 500;
        }

        /* Form Fields */
        .rc-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }

        .rc-form-group label {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
        }

        .rc-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .rc-input-box {
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #D1D5DB;
          border-radius: 10px;
          padding: 0 14px;
          background: #FFFFFF;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .rc-input-box:focus-within {
          border-color: #C8102E;
          box-shadow: 0 0 0 3px rgba(200, 16, 46, 0.1);
        }

        .rc-input-box svg {
          color: #9CA3AF;
          flex-shrink: 0;
        }

        .rc-input-box input {
          border: none;
          outline: none;
          padding: 11px 0;
          font-size: 14px;
          width: 100%;
          color: #1F2937;
          background: transparent;
        }

        .rc-pass-toggle {
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          color: #9CA3AF;
        }

        .rc-pass-toggle:hover {
          color: #4B5563;
        }

        .rc-login-alert {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          background: #FEF2F2;
          border: 1px solid #FCA5A5;
          color: #DC2626;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 13px;
          margin-bottom: 16px;
        }

        .rc-submit-btn {
          width: 100%;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #C8102E 0%, #A80F28 100%);
          color: #FFFFFF;
          font-size: 14.5px;
          font-weight: 600;
          padding: 12px 0;
          cursor: pointer;
          transition: opacity 0.15s ease, transform 0.1s ease;
          box-shadow: 0 4px 12px rgba(200, 16, 46, 0.25);
        }

        .rc-submit-btn:hover:not(:disabled) {
          opacity: 0.95;
          transform: translateY(-1px);
        }

        .rc-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .rc-login-card__footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 24px;
          font-size: 11.5px;
          color: #9CA3AF;
        }

        /* Google Modal Styles */
        .g-modal-box {
          max-width: 480px;
          width: 90%;
        }

        .g-account-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: all 0.15s ease;
        }

        .g-account-item:hover {
          border-color: #94A3B8;
          background: #F8FAFC;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .g-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          color: #FFFFFF;
          font-weight: 800;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .g-acc-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .g-acc-info strong {
          font-size: 13.5px;
          font-weight: 700;
          color: #0F172A;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .g-acc-info span {
          font-size: 11.5px;
          color: #64748B;
        }

        .g-role-tag {
          font-size: 10px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 999px;
          text-transform: uppercase;
        }

        .g-role-tag.admin {
          background: #FEF2F2;
          color: #DC2626;
          border: 1px solid #FCA5A5;
        }

        .g-role-tag.creator {
          background: #EFF6FF;
          color: #2563EB;
          border: 1px solid #93C5FD;
        }

        .g-role-tag.approver {
          background: #F3E8FF;
          color: #9333EA;
          border: 1px solid #D8B4FE;
        }

        @media (max-width: 900px) {
          .rc-login-container {
            grid-template-columns: 1fr;
          }
          .rc-login-hero {
            display: none;
          }
          .rc-login-card-wrapper {
            padding: 32px 24px;
          }
        }
      `}</style>
    </div>
  );
}