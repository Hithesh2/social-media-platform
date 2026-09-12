import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiImage,
  FiHash,
  FiCalendar,
  FiX,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiCheckCircle,
  FiThumbsUp,
  FiMessageCircle,
  FiShare2,
  FiUploadCloud,
  FiStar,
  FiEdit3,
} from 'react-icons/fi';
import { FaHeartbeat } from 'react-icons/fa';
import Sidebar from '../components/sidebar';
import Navbar from '../components/Navbar';
import { savePost } from '../Services/postService';
import { getCampaigns } from '../Services/campaignService';
import { useAuth } from '../Context/AuthContext';

const REDCROSS_PRESET_IMAGES = [
  {
    id: 'p1',
    label: 'Blood Donation',
    url: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p2',
    label: 'First Aid Care',
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p3',
    label: 'Volunteer Drive',
    url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p4',
    label: 'Disaster Relief',
    url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p5',
    label: 'Health Sanitation',
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p6',
    label: 'Ambulance Response',
    url: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p7',
    label: 'Food Rations Aid',
    url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p8',
    label: 'Community Clinic',
    url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p10',
    label: 'School Workshop',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
  },
];

const PLATFORMS = [
  { key: 'facebook', label: 'Facebook', icon: FiFacebook, color: '#1877F2', bg: '#E7F1FF' },
  { key: 'instagram', label: 'Instagram', icon: FiInstagram, color: '#E4405F', bg: '#FDE8EC' },
  { key: 'twitter', label: 'X (Twitter)', icon: FiTwitter, color: '#14171A', bg: '#F0F0F0' },
];

const POPULAR_TAGS = ['RedCross', 'BloodDonation', 'FirstAidLK', 'HumanitarianAid', 'VolunteerLK'];

export default function CreatePost() {
  const [title, setTitle] = useState('World Blood Donor Day 2026 Drive');
  const [caption, setCaption] = useState(
    'Join Sri Lanka Red Cross Society for our annual voluntary blood donation camp! Over 350 pints collected so far. Every donor is a lifesaver. #RedCross #BloodDonation #SaveLives'
  );
  const [hashtags, setHashtags] = useState('RedCross, BloodDonation, SaveLives');
  const [platforms, setPlatforms] = useState(['facebook', 'instagram']);
  const [campaignId, setCampaignId] = useState('blood-donation');
  const [scheduleAt, setScheduleAt] = useState('');
  const [activePlatformTab, setActivePlatformTab] = useState('facebook');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(REDCROSS_PRESET_IMAGES[0].url);
  const [campaignsList] = useState(() => getCampaigns());
  const [errors, setErrors] = useState({});
  const [statusMsg, setStatusMsg] = useState(null);
  const fileInputRef = useRef(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const togglePlatform = (key) => {
    setPlatforms((prev) => (prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, image: 'Please select a valid image file.' }));
      return;
    }

    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: undefined }));
  };

  const selectPresetImage = (url) => {
    setImageFile(null);
    setImagePreviewUrl(url);
  };

  const addTag = (tag) => {
    if (!hashtags.includes(tag)) {
      setHashtags((prev) => (prev ? `${prev}, ${tag}` : tag));
    }
  };

  const validate = ({ requirePlatform }) => {
    const next = {};
    if (!title.trim()) next.title = 'Please enter a title for this post.';
    if (!caption.trim()) next.caption = 'Please write a caption for your post.';
    if (requirePlatform && platforms.length === 0) next.platforms = 'Select at least one social media platform.';
    setErrors((prev) => ({ image: prev.image, ...next }));
    return Object.keys(next).length === 0;
  };

  const buildPostRecord = (draftStatus) => ({
    title: title.trim(),
    caption: caption.trim(),
    imageUrl: imagePreviewUrl,
    hashtags: hashtags
      .split(/[\s,]+/)
      .map((h) => (h.startsWith('#') ? h : `#${h}`))
      .filter((h) => h !== '#'),
    platforms,
    campaignId: campaignId || null,
    schedule: scheduleAt || null,
    status: draftStatus,
    creator: user?.name || 'Content Creator',
  });

  const handleSaveDraft = () => {
    if (!validate({ requirePlatform: false })) return;
    const record = buildPostRecord('draft');
    savePost(record);
    setStatusMsg({ type: 'draft', text: 'Post saved as Draft! Redirecting to All Posts...' });
    setTimeout(() => navigate('/posts'), 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate({ requirePlatform: true })) return;
    const record = buildPostRecord('pending');
    savePost(record);
    setStatusMsg({ type: 'submitted', text: 'Post submitted for Content Approver review! Redirecting...' });
    setTimeout(() => navigate('/posts'), 1200);
  };

  const hashtagList = hashtags
    .split(/[\s,]+/)
    .map((h) => h.trim())
    .filter(Boolean)
    .map((h) => (h.startsWith('#') ? h : `#${h}`));

  return (
    <div className="app-shell">
      <Sidebar activeKey="create-post" />

      <div className="app-main">
        <Navbar title="Create Social Post" />

        <main className="app-content">
          {/* Hero Topic Header */}
          <div className="cp-hero-card">
            <div className="cp-hero-info">
              <div className="cp-badge">
                <FiEdit3 size={12} />
                <span>Campaign Content Creator</span>
              </div>
              <h2>Create & Preview Campaign Content</h2>
              <p>Compose social media updates, select Red Cross campaign imagery, and broadcast across channels.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="cp-grid">

              {/* Form Input Section */}
              <section className="rc-card cp-form" aria-label="Post Form">

                {/* Title */}
                <div className="cp-field">
                  <label htmlFor="post-title">Post Title *</label>
                  <input
                    id="post-title"
                    name="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. World Blood Donor Day Drive 2026"
                  />
                  {errors.title && <span className="cp-error">{errors.title}</span>}
                </div>

                {/* Caption */}
                <div className="cp-field">
                  <label htmlFor="post-caption">Social Caption / Copywriting *</label>
                  <textarea
                    id="post-caption"
                    name="caption"
                    rows={4}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write your campaign message..."
                  />
                  {errors.caption && <span className="cp-error">{errors.caption}</span>}
                </div>

                {/* Red Cross Preset Images & Upload Gallery */}
                <div className="cp-field">
                  <label className="label-with-badge">
                    <span>Red Cross Photo Gallery & Upload</span>
                    <span className="badge-preset"><FiStar size={11} /> Red Cross Verified Photos</span>
                  </label>

                  <div className="cp-preset-grid">
                    {REDCROSS_PRESET_IMAGES.map((img) => {
                      const isSelected = imagePreviewUrl === img.url;
                      return (
                        <button
                          type="button"
                          key={img.id}
                          className={`preset-thumb${isSelected ? ' is-selected' : ''}`}
                          onClick={() => selectPresetImage(img.url)}
                        >
                          <img src={img.url} alt={img.label} />
                          <span className="preset-thumb__label">{img.label}</span>
                          {isSelected && <FiCheckCircle size={14} className="preset-check" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="cp-custom-upload">
                    <button
                      type="button"
                      className="cp-upload-btn"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FiUploadCloud size={18} />
                      <span>{imageFile ? imageFile.name : 'Upload Custom Image File'}</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      id="post-image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                  {errors.image && <span className="cp-error">{errors.image}</span>}
                </div>

                {/* Hashtags & Quick Chips */}
                <div className="cp-field">
                  <label htmlFor="post-hashtags">Hashtags</label>
                  <div className="cp-input-icon">
                    <FiHash size={14} />
                    <input
                      id="post-hashtags"
                      name="hashtags"
                      type="text"
                      value={hashtags}
                      onChange={(e) => setHashtags(e.target.value)}
                      placeholder="RedCross, BloodDonation, FirstAid"
                    />
                  </div>
                  <div className="cp-quick-tags">
                    <span className="quick-tag-label">Quick Tags:</span>
                    {POPULAR_TAGS.map((t) => (
                      <button
                        type="button"
                        key={t}
                        className="quick-tag-chip"
                        onClick={() => addTag(t)}
                      >
                        +#{t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Platforms */}
                <div className="cp-field">
                  <label>Target Broadcast Channels *</label>
                  <div className="cp-platform-row">
                    {PLATFORMS.map(({ key, label, icon: Icon, color, bg }) => {
                      const active = platforms.includes(key);
                      return (
                        <button
                          type="button"
                          key={key}
                          className={`cp-platform-btn${active ? ' is-active' : ''}`}
                          style={{
                            backgroundColor: active ? color : '#FFFFFF',
                            borderColor: active ? color : '#E5E7EB',
                            color: active ? '#FFFFFF' : '#4B5563',
                          }}
                          onClick={() => togglePlatform(key)}
                        >
                          <Icon size={15} />
                          <span>{label}</span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.platforms && <span className="cp-error">{errors.platforms}</span>}
                </div>

                {/* Linked Campaign & Schedule Date */}
                <div className="cp-field-row">
                  <div className="cp-field">
                    <label htmlFor="post-campaign">Linked Campaign</label>
                    <select
                      id="post-campaign"
                      name="campaignId"
                      value={campaignId}
                      onChange={(e) => setCampaignId(e.target.value)}
                    >
                      <option value="">No Campaign</option>
                      {campaignsList.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="cp-field">
                    <label htmlFor="post-schedule">Publish Date/Time</label>
                    <div className="cp-input-icon">
                      <FiCalendar size={14} />
                      <input
                        id="post-schedule"
                        name="scheduleAt"
                        type="datetime-local"
                        value={scheduleAt}
                        onChange={(e) => setScheduleAt(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {statusMsg && (
                  <div className={`cp-status cp-status--${statusMsg.type}`} role="status">
                    <FiCheckCircle size={16} />
                    <span>{statusMsg.text}</span>
                  </div>
                )}

                {/* Form Actions */}
                <div className="cp-actions">
                  <button type="button" className="cp-btn cp-btn--ghost" onClick={handleSaveDraft}>
                    Save Draft
                  </button>
                  <button type="submit" className="cp-btn cp-btn--primary">
                    Submit for Approval
                  </button>
                </div>
              </section>

              {/* Realistic Social Live Preview Box */}
              <section className="rc-card cp-preview" aria-label="Live Post Preview">
                <div className="cp-preview-tabs">
                  {PLATFORMS.map(({ key, label, icon: Icon, color }) => (
                    <button
                      type="button"
                      key={key}
                      className={`preview-tab${activePlatformTab === key ? ' is-active' : ''}`}
                      onClick={() => setActivePlatformTab(key)}
                    >
                      <Icon size={14} style={{ color: activePlatformTab === key ? color : '#9CA3AF' }} />
                      <span>{label} Preview</span>
                    </button>
                  ))}
                </div>

                <div className="preview-feed-card">
                  {/* Feed Header */}
                  <div className="feed-header">
                    <div className="feed-avatar">
                      <FaHeartbeat size={14} />
                    </div>
                    <div className="feed-user-info">
                      <strong>Sri Lanka Red Cross Society <span className="verified-badge">✓</span></strong>
                      <span>Official Channel • Just now</span>
                    </div>
                  </div>

                  {/* Feed Post Title & Caption */}
                  <div className="feed-caption">
                    <h4 className="feed-title">{title || 'Untitled Post'}</h4>
                    <p>{caption || 'Your caption will render here live...'}</p>
                    {hashtagList.length > 0 && (
                      <p className="feed-tags">{hashtagList.join(' ')}</p>
                    )}
                  </div>

                  {/* Feed Image Banner */}
                  <div className="feed-image">
                    {imagePreviewUrl ? (
                      <img src={imagePreviewUrl} alt="Campaign Post Preview" />
                    ) : (
                      <div className="feed-image-placeholder">
                        <FiImage size={28} />
                        <span>Select a Red Cross photo above</span>
                      </div>
                    )}
                  </div>

                  {/* Feed Engagement Mockup */}
                  <div className="feed-engagement">
                    <div><FiThumbsUp size={14} /> Like</div>
                    <div><FiMessageCircle size={14} /> Comment</div>
                    <div><FiShare2 size={14} /> Share</div>
                  </div>
                </div>
              </section>

            </div>
          </form>
        </main>
      </div>

      <style>{`
        .cp-hero-card {
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

        .cp-badge {
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

        .cp-hero-info h2 {
          font-size: 24px;
          font-weight: 800;
          color: #FFFFFF;
          font-family: var(--font-heading);
          letter-spacing: -0.025em;
          margin-bottom: 4px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .cp-hero-info p {
          font-size: 14px;
          color: #E2E8F0;
        }

        .cp-grid {
          display: grid;
          grid-template-columns: 1.45fr 1fr;
          gap: 22px;
          align-items: start;
        }

        .cp-form {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          border-radius: 16px;
        }

        .cp-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cp-field label {
          font-size: 13px;
          font-weight: 700;
          color: var(--rc-text);
          font-family: var(--font-heading);
        }

        .label-with-badge {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .badge-preset {
          font-size: 11px;
          font-weight: 700;
          color: #C8102E;
          background: #FEF2F4;
          padding: 3px 8px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .cp-field input[type="text"],
        .cp-field input[type="datetime-local"],
        .cp-field textarea,
        .cp-field select {
          border: 1px solid #D1D5DB;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 13.5px;
          font-family: var(--font-body);
          color: var(--rc-text);
          background: var(--rc-white);
          width: 100%;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .cp-field input:focus,
        .cp-field textarea:focus,
        .cp-field select:focus {
          outline: none;
          border-color: #C8102E;
          box-shadow: 0 0 0 3px rgba(200, 16, 46, 0.1);
        }

        /* Preset Photo Gallery */
        .cp-preset-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
          margin-bottom: 8px;
        }

        .preset-thumb {
          position: relative;
          height: 72px;
          border-radius: 10px;
          overflow: hidden;
          border: 2px solid #E5E7EB;
          padding: 0;
          cursor: pointer;
          transition: all 0.15s ease;
          background: #F3F4F6;
        }

        .preset-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preset-thumb__label {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.65);
          color: #FFFFFF;
          font-size: 9.5px;
          font-weight: 700;
          padding: 2px 4px;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .preset-thumb.is-selected {
          border-color: #C8102E;
          box-shadow: 0 0 0 2px rgba(200, 16, 46, 0.25);
        }

        .preset-check {
          position: absolute;
          top: 4px;
          right: 4px;
          color: #FFFFFF;
          background: #C8102E;
          border-radius: 50%;
        }

        .cp-custom-upload {
          margin-top: 4px;
        }

        .cp-upload-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1.5px dashed #D1D5DB;
          border-radius: 10px;
          padding: 12px;
          background: #FAFBFD;
          color: #4B5563;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          transition: all 0.15s ease;
          font-family: var(--font-heading);
        }

        .cp-upload-btn:hover {
          border-color: #C8102E;
          color: #C8102E;
          background: #FEF2F4;
        }

        /* Quick Tags */
        .cp-quick-tags {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          margin-top: 4px;
        }

        .quick-tag-label {
          font-size: 11.5px;
          color: #6B7280;
          font-weight: 600;
        }

        .quick-tag-chip {
          border: 1px solid #E0E7FF;
          background: #EFF6FF;
          color: #2563EB;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
          font-family: var(--font-heading);
        }

        .quick-tag-chip:hover {
          background: #DBEAFE;
        }

        .cp-input-icon {
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #D1D5DB;
          border-radius: 10px;
          padding: 0 14px;
          background: var(--rc-white);
        }

        .cp-input-icon svg { color: var(--rc-text-secondary); }
        .cp-input-icon input { border: none; padding: 10px 0; font-size: 13.5px; width: 100%; background: transparent; outline: none; }

        .cp-platform-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .cp-platform-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid;
          border-radius: 999px;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 700;
          font-family: var(--font-heading);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .cp-field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .cp-error { font-size: 12px; color: var(--rc-danger); }

        .cp-actions {
          display: flex;
          gap: 12px;
          margin-top: 6px;
        }

        .cp-btn {
          flex: 1;
          border-radius: 10px;
          padding: 12px 0;
          font-size: 14px;
          font-weight: 700;
          font-family: var(--font-heading);
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.15s ease;
        }

        .cp-btn--ghost {
          background: var(--rc-white);
          border-color: #D1D5DB;
          color: var(--rc-text);
        }

        .cp-btn--ghost:hover { background: var(--rc-bg); }

        .cp-btn--primary {
          background: linear-gradient(135deg, #C8102E 0%, #A80F28 100%);
          color: var(--rc-white);
          box-shadow: 0 4px 12px rgba(200, 16, 46, 0.22);
        }

        .cp-btn--primary:hover {
          box-shadow: 0 6px 16px rgba(200, 16, 46, 0.3);
        }

        /* Live Preview Card */
        .cp-preview {
          padding: 20px;
          border-radius: 16px;
          position: sticky;
          top: 84px;
        }

        .cp-preview-tabs {
          display: flex;
          border-bottom: 1px solid #E5E7EB;
          margin-bottom: 16px;
        }

        .preview-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 4px;
          border: none;
          background: transparent;
          font-size: 12px;
          font-weight: 700;
          color: #9CA3AF;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          font-family: var(--font-heading);
        }

        .preview-tab.is-active {
          color: #1F2937;
          border-bottom-color: #C8102E;
        }

        .preview-feed-card {
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          background: #FFFFFF;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .feed-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 16px;
          border-bottom: 1px solid #F3F4F6;
        }

        .feed-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #C8102E 0%, #A80F28 100%);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(200, 16, 46, 0.2);
        }

        .feed-user-info strong {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13.5px;
          color: #1F2937;
        }

        .verified-badge {
          color: #2563EB;
          font-size: 12px;
        }

        .feed-user-info span {
          font-size: 11px;
          color: #6B7280;
        }

        .feed-caption {
          padding: 14px 16px 10px;
        }

        .feed-title {
          font-size: 15px;
          font-weight: 800;
          color: #1F2937;
          margin-bottom: 6px;
        }

        .feed-caption p {
          font-size: 13.5px;
          color: #374151;
          line-height: 1.5;
          margin-bottom: 6px;
          white-space: pre-wrap;
        }

        .feed-tags {
          font-size: 12.5px;
          color: #2563EB;
          font-weight: 700;
        }

        .feed-image {
          width: 100%;
          height: 220px;
          background: #F3F4F6;
          overflow: hidden;
        }

        .feed-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .feed-engagement {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          padding: 10px;
          border-top: 1px solid #F3F4F6;
          background: #FAFBFD;
          text-align: center;
        }

        .feed-engagement div {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #6B7280;
        }

        @media (max-width: 980px) {
          .cp-grid { grid-template-columns: 1fr; }
          .cp-preset-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </div>
  );
}