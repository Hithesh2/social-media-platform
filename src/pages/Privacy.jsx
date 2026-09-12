import { useState } from 'react';
import {
  FiShield,
  FiLock,
  FiAlertTriangle,
  FiCheckSquare,
  FiFileText,
  FiDownload,
  FiCheckCircle,
  FiEye,
  FiUserCheck,
  FiAward,
  FiHeart,
} from 'react-icons/fi';
import Sidebar from '../components/sidebar';
import Navbar from '../components/Navbar';

export default function Privacy() {
  const [checkedRules, setCheckedRules] = useState({
    r1: true,
    r2: true,
    r3: true,
    r4: true,
  });

  const [showConsentToast, setShowConsentToast] = useState(false);

  const toggleRule = (key) => {
    setCheckedRules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="app-shell dark-maroon-shell">
      <Sidebar activeKey="privacy" />

      <div className="app-main">
        <Navbar title="Privacy, Compliance & Geneva Conventions" />

        <main className="app-content pr-maroon-bg">
          
          {/* Hero Maroon Header Banner */}
          <div className="pr-hero-banner">
            <div className="pr-hero-info">
              <div className="pr-badge">
                <FiShield size={12} />
                <span>Geneva Conventions & International Humanitarian Law</span>
              </div>
              <h2>Privacy, Beneficiary Consent & Emblem Protection</h2>
              <p>Legal standards, beneficiary dignity protection, and mandatory emblem usage laws.</p>
            </div>

            <div className="pr-hero-actions">
              <button
                type="button"
                className="pr-download-btn"
                onClick={() => {
                  setShowConsentToast(true);
                  setTimeout(() => setShowConsentToast(false), 3000);
                }}
              >
                <FiDownload size={15} /> Download Consent Form (PDF)
              </button>
            </div>
          </div>

          {showConsentToast && (
            <div className="pr-toast">
              <FiCheckCircle size={16} /> Official Red Cross Beneficiary Media Consent Form downloaded!
            </div>
          )}

          {/* Eye-Safe Dark Maroon Cards Grid */}
          <div className="pr-grid">
            
            {/* Card 1: Beneficiary Consent */}
            <div className="pr-card maroon-card">
              <div className="pr-card-header">
                <div className="pr-icon-wrap gold">
                  <FiUserCheck size={20} />
                </div>
                <div>
                  <h3>1. Beneficiary Consent & Human Dignity</h3>
                  <span>Mandatory photographic & media capture protocols</span>
                </div>
              </div>

              <p className="pr-text">
                Photographs or video footage of individuals receiving disaster assistance, medical trauma aid, or blood donation must have explicit, documented verbal or written consent.
              </p>

              <div className="pr-rule-box">
                <div className="pr-rule-title">
                  <FiAlertTriangle size={15} color="#F59E0B" />
                  <strong>Strict Consent Rule</strong>
                </div>
                <p>
                  Never publish identifiable images of vulnerable minors, distressed patients, or disaster victims without signed parental or guardian media release authorization.
                </p>
              </div>
            </div>

            {/* Card 2: Red Cross Emblem Protection */}
            <div className="pr-card maroon-card">
              <div className="pr-card-header">
                <div className="pr-icon-wrap red">
                  <FiAward size={20} />
                </div>
                <div>
                  <h3>2. Protection of the Red Cross Emblem</h3>
                  <span>Geneva Conventions (1949) Legal Restrictions</span>
                </div>
              </div>

              <p className="pr-text">
                The Red Cross emblem is a protected humanitarian symbol recognized under international law. Misuse or unauthorized commercial pairing undermines neutral protection in war zones.
              </p>

              <div className="pr-rule-box red-border">
                <div className="pr-rule-title">
                  <FiShield size={15} color="#F43F5E" />
                  <strong>Emblem Integrity Rule</strong>
                </div>
                <p>
                  Do not alter emblem proportions, change the red color hex, or pair the Red Cross emblem with commercial sponsorship logos, political banners, or weapon imagery.
                </p>
              </div>
            </div>

            {/* Card 3: Data Protection */}
            <div className="pr-card maroon-card">
              <div className="pr-card-header">
                <div className="pr-icon-wrap green">
                  <FiLock size={20} />
                </div>
                <div>
                  <h3>3. Patient Data & Medical Confidentiality</h3>
                  <span>GDPR & Health Data Privacy Standards</span>
                </div>
              </div>

              <p className="pr-text">
                Personal health data, blood test records, national identity numbers, and private medical notes must remain completely confidential and encrypted.
              </p>

              <div className="pr-rule-box green-border">
                <div className="pr-rule-title">
                  <FiCheckCircle size={15} color="#10B981" />
                  <strong>Anonymization Standard</strong>
                </div>
                <p>
                  All public case studies and donor thank-you stories must blur medical wristbands, patient charts, and national ID cards before social broadcast.
                </p>
              </div>
            </div>

            {/* Card 4: Interactive Compliance Checklist */}
            <div className="pr-card maroon-card">
              <div className="pr-card-header">
                <div className="pr-icon-wrap purple">
                  <FiCheckSquare size={20} />
                </div>
                <div>
                  <h3>4. Pre-Publish Compliance Verification Checklist</h3>
                  <span>Reviewer sign-off verification matrix</span>
                </div>
              </div>

              <div className="pr-checklist">
                <label
                  className={`pr-check-row${checkedRules.r1 ? ' is-checked' : ''}`}
                  onClick={() => toggleRule('r1')}
                >
                  <input type="checkbox" checked={checkedRules.r1} onChange={() => {}} />
                  <div>
                    <strong>Signed Beneficiary Consent Form On File</strong>
                    <span>Verified verbal or written consent for all featured individuals</span>
                  </div>
                </label>

                <label
                  className={`pr-check-row${checkedRules.r2 ? ' is-checked' : ''}`}
                  onClick={() => toggleRule('r2')}
                >
                  <input type="checkbox" checked={checkedRules.r2} onChange={() => {}} />
                  <div>
                    <strong>Red Cross Emblem Official Proportions Verified</strong>
                    <span>No distortion or unauthorized commercial co-branding</span>
                  </div>
                </label>

                <label
                  className={`pr-check-row${checkedRules.r3 ? ' is-checked' : ''}`}
                  onClick={() => toggleRule('r3')}
                >
                  <input type="checkbox" checked={checkedRules.r3} onChange={() => {}} />
                  <div>
                    <strong>Medical Fact-Checking Approval</strong>
                    <span>Emergency medical guidance reviewed by certified first aid officer</span>
                  </div>
                </label>

                <label
                  className={`pr-check-row${checkedRules.r4 ? ' is-checked' : ''}`}
                  onClick={() => toggleRule('r4')}
                >
                  <input type="checkbox" checked={checkedRules.r4} onChange={() => {}} />
                  <div>
                    <strong>No Political or Non-Neutral Commentary</strong>
                    <span>Content remains strictly impartial, non-partisan, and humanitarian</span>
                  </div>
                </label>
              </div>
            </div>

          </div>

        </main>
      </div>

      <style>{`
        /* Eye-Safe Soft Faded Dark Wine / Charcoal-Maroon Theme */
        .pr-maroon-bg {
          background: #151012 !important;
          min-height: calc(100vh - var(--navbar-height));
          color: #F1F5F9;
        }

        .pr-hero-banner {
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

        .pr-badge {
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

        .pr-hero-info h2 {
          font-size: 24px;
          font-weight: 800;
          color: #FFFFFF;
          font-family: var(--font-heading);
          letter-spacing: -0.025em;
          margin-bottom: 4px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .pr-hero-info p {
          font-size: 14px;
          color: #E2E8F0;
        }

        .pr-hero-info p {
          font-size: 13.5px;
          color: #CBD5E1;
        }

        .pr-download-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #6B2128 0%, #4A161C 100%);
          color: #F8FAFC;
          border: 1px solid #852C36;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          font-family: var(--font-heading);
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
          transition: all 0.15s ease;
        }

        .pr-download-btn:hover {
          background: #852C36;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
        }

        .pr-toast {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #142921;
          color: #6EE7B7;
          border: 1px solid #1B4D3E;
          padding: 12px 18px;
          border-radius: 12px;
          margin-bottom: 22px;
          font-size: 13px;
          font-weight: 700;
          font-family: var(--font-heading);
        }

        /* Eye-Safe Muted Cards Grid */
        .pr-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .maroon-card {
          background: #1D1416;
          border: 1px solid #332025;
          border-radius: 18px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }

        .maroon-card:hover {
          border-color: #55323B;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        .pr-card-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 14px;
        }

        .pr-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .pr-icon-wrap.gold { background: #2B1D14; color: #F59E0B; }
        .pr-icon-wrap.red { background: #33151A; color: #F87171; }
        .pr-icon-wrap.green { background: #13271F; color: #34D399; }
        .pr-icon-wrap.purple { background: #2A1633; color: #C084FC; }

        .pr-card-header h3 {
          font-size: 17.5px;
          font-weight: 800;
          color: #F8FAFC;
          font-family: var(--font-heading);
        }

        .pr-card-header span {
          font-size: 12.5px;
          color: #94A3B8;
          margin-top: 2px;
          display: block;
        }

        .pr-text {
          font-size: 13.5px;
          color: #CBD5E1;
          line-height: 1.55;
          margin-bottom: 16px;
        }

        .pr-rule-box {
          background: #171012;
          border-left: 3px solid #F59E0B;
          border-radius: 0 10px 10px 0;
          padding: 14px 18px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .pr-rule-box.red-border { border-left-color: #F87171; }
        .pr-rule-box.green-border { border-left-color: #34D399; }

        .pr-rule-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #F8FAFC;
          font-family: var(--font-heading);
        }

        .pr-rule-box p {
          font-size: 12.5px;
          color: #94A3B8;
          line-height: 1.48;
        }

        /* Checklist Component */
        .pr-checklist {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 8px;
        }

        .pr-check-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: #171012;
          border: 1px solid #301E22;
          border-radius: 12px;
          padding: 14px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .pr-check-row.is-checked {
          border-color: #55323B;
          background: #24181B;
        }

        .pr-check-row input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #E11D48;
          cursor: pointer;
          margin-top: 2px;
        }

        .pr-check-row strong {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #F8FAFC;
          font-family: var(--font-heading);
        }

        .pr-check-row span {
          font-size: 12px;
          color: #94A3B8;
          margin-top: 2px;
          display: block;
        }

        @media (max-width: 900px) {
          .pr-hero-banner { flex-direction: column; align-items: flex-start; gap: 14px; }
        }
      `}</style>
    </div>
  );
}

