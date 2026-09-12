export default function StatCard({ label, value, icon: Icon, tone = 'primary' }) {
  return (
    <div className={`rc-stat-card tone-${tone}`}>
      {/* X-Ray Ray & Grid Background Visual */}
      <div className="rc-stat-card__xray-grid" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={`xray-grid-${tone}`} width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.12" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#xray-grid-${tone})`} />
        </svg>
      </div>

      <div className="rc-stat-card__icon">
        <Icon size={20} />
      </div>

      <div className="rc-stat-card__content">
        <span className="rc-stat-card__value">{value}</span>
        <span className="rc-stat-card__label">{label}</span>
      </div>

      <style>{`
        .rc-stat-card {
          position: relative;
          border-radius: 14px;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          border: 1.5px solid;
          overflow: hidden;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: var(--font-body);
        }

        .rc-stat-card:hover {
          transform: translateY(-3px);
        }

        .rc-stat-card__xray-grid {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none;
          z-index: 0;
        }

        .rc-stat-card__icon {
          position: relative;
          z-index: 1;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .rc-stat-card:hover .rc-stat-card__icon {
          transform: scale(1.08);
        }

        .rc-stat-card__content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
        }

        .rc-stat-card__value {
          font-size: 26px;
          font-weight: 800;
          font-family: var(--font-heading);
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .rc-stat-card__label {
          font-size: 12px;
          font-weight: 700;
          font-family: var(--font-heading);
          margin-top: 3px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        /* ── TONE COLORED X-RAY GLOW THEMES ── */
        .tone-primary {
          background: linear-gradient(135deg, #FFFFFF 0%, #FFF0F2 100%);
          border-color: #FCA5A5;
          box-shadow: 0 4px 14px rgba(200, 16, 46, 0.08);
          color: #C8102E;
        }
        .tone-primary .rc-stat-card__icon {
          background: linear-gradient(135deg, #C8102E 0%, #A80F28 100%);
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(200, 16, 46, 0.3);
        }
        .tone-primary .rc-stat-card__value { color: #1F2937; }
        .tone-primary .rc-stat-card__label { color: #C8102E; }

        .tone-draft {
          background: linear-gradient(135deg, #FFFFFF 0%, #F5F3FF 100%);
          border-color: #DDD6FE;
          box-shadow: 0 4px 14px rgba(147, 51, 234, 0.08);
          color: #9333EA;
        }
        .tone-draft .rc-stat-card__icon {
          background: linear-gradient(135deg, #9333EA 0%, #7E22CE 100%);
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(147, 51, 234, 0.3);
        }
        .tone-draft .rc-stat-card__value { color: #1F2937; }
        .tone-draft .rc-stat-card__label { color: #9333EA; }

        .tone-pending {
          background: linear-gradient(135deg, #FFFFFF 0%, #EFF6FF 100%);
          border-color: #BFDBFE;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.08);
          color: #2563EB;
        }
        .tone-pending .rc-stat-card__icon {
          background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
        .tone-pending .rc-stat-card__value { color: #1F2937; }
        .tone-pending .rc-stat-card__label { color: #2563EB; }

        .tone-scheduled {
          background: linear-gradient(135deg, #FFFFFF 0%, #FFFBEB 100%);
          border-color: #FDE68A;
          box-shadow: 0 4px 14px rgba(217, 119, 6, 0.08);
          color: #D97706;
        }
        .tone-scheduled .rc-stat-card__icon {
          background: linear-gradient(135deg, #D97706 0%, #B45309 100%);
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
        }
        .tone-scheduled .rc-stat-card__value { color: #1F2937; }
        .tone-scheduled .rc-stat-card__label { color: #D97706; }

        .tone-published {
          background: linear-gradient(135deg, #FFFFFF 0%, #ECFDF5 100%);
          border-color: #A7F3D0;
          box-shadow: 0 4px 14px rgba(5, 150, 105, 0.08);
          color: #059669;
        }
        .tone-published .rc-stat-card__icon {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
        }
        .tone-published .rc-stat-card__value { color: #1F2937; }
        .tone-published .rc-stat-card__label { color: #059669; }
      `}</style>
    </div>
  );
}
