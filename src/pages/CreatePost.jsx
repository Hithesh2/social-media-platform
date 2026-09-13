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
  FiShield,
  FiCheck,
  FiZap,
  FiLink,
  FiUserCheck,
  FiRadio,
  FiTag,
  FiFileText,
} from 'react-icons/fi';
import { FaHeartbeat, FaMagic } from 'react-icons/fa';
import Sidebar from '../components/sidebar';
import Navbar from '../components/Navbar';
import { savePost } from '../Services/postService';
import { getCampaigns } from '../Services/campaignService';
import { useAuth } from '../Context/AuthContext';

const REDCROSS_PRESET_IMAGES = [
  {
    id: 'p1',
    label: 'Blood Donation',
    tag: 'Healthcare',
    url: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p2',
    label: 'First Aid Care',
    tag: 'Emergency',
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p3',
    label: 'Volunteer Drive',
    tag: 'Community',
    url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p4',
    label: 'Disaster Relief',
    tag: 'Flood Aid',
    url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p5',
    label: 'Health Sanitation',
    tag: 'Hygiene',
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p6',
    label: 'Ambulance Response',
    tag: 'Trauma',
    url: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p7',
    label: 'Food Rations Aid',
    tag: 'Relief',
    url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p8',
    label: 'Community Clinic',
    tag: 'Outreach',
    url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p10',
    label: 'School Workshop',
    tag: 'Youth',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
  },
];

const PLATFORMS = [
  { key: 'facebook', label: 'Facebook', reach: '45.2K Followers', icon: FiFacebook, color: '#1877F2', bg: '#EFF6FF', border: '#BFDBFE' },
  { key: 'instagram', label: 'Instagram', reach: '28.4K Followers', icon: FiInstagram, color: '#E4405F', bg: '#FDF2F8', border: '#FBCFE8' },
  { key: 'twitter', label: 'X (Twitter)', reach: '14.1K Followers', icon: FiTwitter, color: '#0F172A', bg: '#F8FAFC', border: '#E2E8F0' },
];

const QUICK_CAMPAIGN_PRESETS = [
  {
    id: 'blood-donation',
    name: '🩸 World Blood Donor Day 2026',
    title: 'World Blood Donor Day 2026 Voluntary Drive',
    caption: 'Join Sri Lanka Red Cross Society for our annual voluntary blood donation camp! Over 350 pints collected so far. Every donor is a lifesaver. #RedCross #BloodDonation #SaveLives',
    tags: 'RedCross, BloodDonation, SaveLives, DonateBloodLK',
    imageUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'disaster-response',
    name: '🌧️ Emergency Flood Relief',
    title: 'Monsoon Emergency Flood Relief Fund & Volunteer Drive',
    caption: 'Sri Lanka Red Cross disaster response units are actively delivering food rations, clean water, and medical kits to flood-affected families. Support our emergency response effort today.',
    tags: 'RedCross, FloodRelief, EmergencyResponse, HumanitarianAid',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'dengue-awareness',
    name: '🦟 Dengue Prevention Campaign',
    title: 'Dengue Vector Control & Community Sanitation Awareness',
    caption: 'Prevent mosquito breeding in your local area! Follow our Red Cross 5-step home inspection guide to keep your family safe this monsoon season.',
    tags: 'DenguePrevention, CommunityHealth, RedCrossLK, FirstAidLK',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'first-aid-training',
    name: '🏥 Community First Aid Workshops',
    title: 'Certified First Aid & CPR Training Registration',
    caption: 'Empower yourself to save lives! Register for the upcoming Sri Lanka Red Cross certified First Aid & Trauma Care workshop. Free for community leaders & volunteers.',
    tags: 'FirstAidLK, SaveLives, RedCrossVolunteers, CPRTraining',
    imageUrl: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80',
  },
];

const POPULAR_TAGS = ['RedCross', 'BloodDonation', 'FirstAidLK', 'HumanitarianAid', 'VolunteerLK', 'FloodRelief', 'EmergencyLK'];

export default function CreatePost() {
  const [title, setTitle] = useState('World Blood Donor Day 2026 Drive');
  const [caption, setCaption] = useState(
    'Join Sri Lanka Red Cross Society for our annual voluntary blood donation camp! Over 350 pints collected so far. Every donor is a lifesaver. #RedCross #BloodDonation #SaveLives'
  );
  const [hashtags, setHashtags] = useState('RedCross, BloodDonation, SaveLives');
  const [platforms, setPlatforms] = useState(['facebook', 'instagram']);
  const [campaignId, setCampaignId] = useState('blood-donation');
  const [scheduleAt, setScheduleAt] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [activePlatformTab, setActivePlatformTab] = useState('facebook');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(REDCROSS_PRESET_IMAGES[0].url);
  const [campaignsList] = useState(() => getCampaigns());
  const [errors, setErrors] = useState({});
  const [statusMsg, setStatusMsg] = useState(null);

  // Red Cross Geneva Compliance Checks
  const [complianceChecks, setComplianceChecks] = useState({
    dignityConsent: true,
    genevaEmblem: true,
    factVerified: true,
  });

  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const togglePlatform = (key) => {
    setPlatforms((prev) => (prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]));
  };

  const applyPresetTemplate = (preset) => {
    setTitle(preset.title);
    setCaption(preset.caption);
    setHashtags(preset.tags);
    setCampaignId(preset.id);
    setImagePreviewUrl(preset.imageUrl);
    setImageFile(null);
    setCustomImageUrl('');
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
    setCustomImageUrl('');
    setImagePreviewUrl(url);
  };

  const applyCustomUrl = () => {
    if (customImageUrl.trim()) {
      setImageFile(null);
      setImagePreviewUrl(customImageUrl.trim());
    }
  };

  const addTag = (tag) => {
    const currentTags = hashtags.split(/[\s,]+/).map((t) => t.replace(/^#/, '')).filter(Boolean);
    if (!currentTags.includes(tag)) {
      const updated = [...currentTags, tag].join(', ');
      setHashtags(updated);
    }
  };

  const removeTag = (tagToRemove) => {
    const currentTags = hashtags.split(/[\s,]+/).map((t) => t.replace(/^#/, '')).filter(Boolean);
    const updated = currentTags.filter((t) => t !== tagToRemove).join(', ');
    setHashtags(updated);
  };

  const handleAiPolish = () => {
    if (!caption.trim()) return;
    setCaption(
      (prev) =>
        ` humanitarian update: ${prev.trim()} Together, Sri Lanka Red Cross Society empowers lives across our communities with dignity and urgent care.`
    );
  };

  const appendHotlineCallout = () => {
    setCaption((prev) => `${prev}\n\n🚨 Red Cross Emergency Hotline: 1912 | 24/7 Response Center`);
  };

  const validate = ({ requirePlatform }) => {
    const next = {};
    if (!title.trim()) next.title = 'Please enter a title for this post.';
    if (!caption.trim()) next.caption = 'Please write a caption for your post.';
    if (requirePlatform && platforms.length === 0) next.platforms = 'Select at least one social broadcast channel.';
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
    genevaCompliant: complianceChecks.genevaEmblem && complianceChecks.dignityConsent,
  });

  const handleSaveDraft = () => {
    if (!validate({ requirePlatform: false })) return;
    const record = buildPostRecord('draft');
    savePost(record);
    setStatusMsg({ type: 'draft', text: 'Draft post saved! Redirecting to All Posts...' });
    setTimeout(() => navigate('/posts'), 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate({ requirePlatform: true })) return;
    const record = buildPostRecord('pending');
    savePost(record);
    setStatusMsg({ type: 'submitted', text: 'Post submitted for Red Cross Approver Review! Redirecting...' });
    setTimeout(() => navigate('/posts'), 1200);
  };

  const parsedTagsList = hashtags
    .split(/[\s,]+/)
    .map((h) => h.replace(/^#/, '').trim())
    .filter(Boolean);

  const hashtagFormattedList = parsedTagsList.map((h) => `#${h}`);

  return (
    <div className="app-shell">
      <Sidebar activeKey="create-post" />

      <div className="app-main">
        <Navbar title="Create Social Post" />

        <main className="app-content">
          {/* Hero Header */}
          <div className="cp-hero-card">
            <div className="cp-hero-info">
              <div className="cp-badge">
                <FiRadio size={13} className="cp-pulse-icon" />
                <span>Red Cross Broadcast Studio • AI Enabled</span>
              </div>
              <h2>Compose & Launch Social Campaign Posts</h2>
              <p>Craft high-impact humanitarian posts, attach verified media gallery photos, and syndicate across official Red Cross social feeds.</p>
            </div>
            <div className="cp-hero-telemetry">
              <div className="cp-telemetry-badge">
                <FiShield size={14} style={{ color: '#22C55E' }} />
                <span>Geneva Audit: Active</span>
              </div>
              <div className="cp-telemetry-badge">
                <FiUserCheck size={14} style={{ color: '#3B82F6' }} />
                <span>Approver Workflow Ready</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="cp-grid">

              {/* Form Input Section (THE REDESIGNED FIRST PART) */}
              <section className="rc-card cp-form" aria-label="Post Composer Form">

                {/* Section Header */}
                <div className="cp-section-header">
                  <div>
                    <h3 className="cp-section-title">
                      <FiEdit3 size={18} style={{ color: '#C8102E' }} />
                      <span>Post Composer & Content Config</span>
                    </h3>
                    <p className="cp-section-desc">Fill out details below to auto-render your live platform previews.</p>
                  </div>
                  <div className="cp-ai-copilot-pill">
                    <FaMagic size={13} />
                    <span>AI Assistant Ready</span>
                  </div>
                </div>

                {/* 1. Target Broadcast Channels (Visual Cards) */}
                <div className="cp-field-group">
                  <label className="cp-group-label">
                    <span>1. Target Social Broadcast Channels *</span>
                    <span className="cp-label-hint">{platforms.length} Selected</span>
                  </label>

                  <div className="cp-channels-grid">
                    {PLATFORMS.map(({ key, label, reach, icon: Icon, color, bg, border }) => {
                      const active = platforms.includes(key);
                      return (
                        <div
                          key={key}
                          className={`cp-channel-card${active ? ' is-active' : ''}`}
                          onClick={() => togglePlatform(key)}
                          style={{
                            '--channel-color': color,
                            '--channel-bg': bg,
                            '--channel-border': border,
                          }}
                        >
                          <div className="channel-card-top">
                            <div className="channel-card-icon" style={{ backgroundColor: bg, color }}>
                              <Icon size={20} />
                            </div>
                            <div className="channel-card-checkbox">
                              {active ? <FiCheck size={14} /> : <div className="channel-checkbox-dot" />}
                            </div>
                          </div>

                          <div className="channel-card-info">
                            <h4 className="channel-card-name">{label}</h4>
                            <span className="channel-card-reach">{reach}</span>
                          </div>

                          <div className={`channel-status-pill ${active ? 'active' : 'inactive'}`}>
                            {active ? 'Syndicating' : 'Click to add'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {errors.platforms && <span className="cp-error">{errors.platforms}</span>}
                </div>

                {/* 2. Quick Campaign Templates & Selection */}
                <div className="cp-field-group">
                  <label className="cp-group-label">
                    <span>2. Campaign Quick Templates & Association</span>
                    <span className="cp-label-hint">Auto-fill verified templates</span>
                  </label>

                  <div className="cp-preset-chips">
                    {QUICK_CAMPAIGN_PRESETS.map((preset) => (
                      <button
                        type="button"
                        key={preset.id}
                        className={`preset-chip-btn ${campaignId === preset.id ? 'is-active' : ''}`}
                        onClick={() => applyPresetTemplate(preset)}
                      >
                        <FiZap size={13} className="chip-icon" />
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="cp-field-row" style={{ marginTop: '12px' }}>
                    <div className="cp-field">
                      <label htmlFor="post-campaign">Linked Master Campaign</label>
                      <select
                        id="post-campaign"
                        name="campaignId"
                        value={campaignId}
                        onChange={(e) => setCampaignId(e.target.value)}
                      >
                        <option value="">No Associated Campaign (Independent Post)</option>
                        {campaignsList.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.status || 'Active'})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="cp-field">
                      <label htmlFor="post-schedule">Publish Date & Time Schedule</label>
                      <div className="cp-input-icon">
                        <FiCalendar size={15} />
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
                </div>

                {/* 3. Post Title */}
                <div className="cp-field">
                  <div className="cp-label-row">
                    <label htmlFor="post-title">3. Campaign Post Title *</label>
                    <span className="char-count">{title.length} / 120 chars</span>
                  </div>
                  <input
                    id="post-title"
                    name="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. World Blood Donor Day 2026 Voluntary Drive"
                    maxLength={120}
                  />
                  {errors.title && <span className="cp-error">{errors.title}</span>}
                </div>

                {/* 4. Social Copywriting & AI Studio */}
                <div className="cp-field">
                  <div className="cp-label-row">
                    <label htmlFor="post-caption">4. Social Caption & Copywriting *</label>
                    <div className="cp-ai-toolbar">
                      <button type="button" className="ai-tool-btn" onClick={handleAiPolish} title="Enhance tone with AI">
                        <FaMagic size={13} />
                        <span>AI Polish</span>
                      </button>
                      <button type="button" className="ai-tool-btn" onClick={appendHotlineCallout} title="Add 1912 emergency helpline">
                        <FiRadio size={13} />
                        <span>+ Helpline Callout</span>
                      </button>
                    </div>
                  </div>

                  <div className="cp-textarea-wrapper">
                    <textarea
                      id="post-caption"
                      name="caption"
                      rows={5}
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Write your humanitarian campaign update or paste press release text..."
                    />
                    <div className="cp-textarea-footer">
                      <span className="char-meter">{caption.length} / 2200 characters</span>
                      {caption.length > 0 && (
                        <span className="words-meter">{caption.trim().split(/\s+/).length} Words</span>
                      )}
                    </div>
                  </div>
                  {errors.caption && <span className="cp-error">{errors.caption}</span>}
                </div>

                {/* 5. Media Cover Photo Studio */}
                <div className="cp-field-group">
                  <div className="cp-label-row">
                    <label className="cp-group-label" style={{ margin: 0 }}>
                      <span>5. Humanitarian Media Gallery & Cover Photo</span>
                    </label>
                    <button
                      type="button"
                      className="cp-link-btn"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                    >
                      <FiLink size={13} />
                      <span>{showUrlInput ? 'Hide URL Input' : 'Use Direct Image URL'}</span>
                    </button>
                  </div>

                  {showUrlInput && (
                    <div className="cp-url-input-box">
                      <input
                        type="url"
                        placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                      />
                      <button type="button" className="cp-url-apply-btn" onClick={applyCustomUrl}>
                        Apply Image URL
                      </button>
                    </div>
                  )}

                  {/* Verified Preset Photo Grid */}
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
                          <span className="preset-thumb__tag">{img.tag}</span>
                          <span className="preset-thumb__label">{img.label}</span>
                          {isSelected && (
                            <div className="preset-check-badge">
                              <FiCheck size={12} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Upload Dropzone */}
                  <div className="cp-custom-upload">
                    <button
                      type="button"
                      className="cp-upload-btn"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FiUploadCloud size={20} className="upload-icon" />
                      <div>
                        <strong>{imageFile ? imageFile.name : 'Upload Custom Media Asset (PNG, JPG, WEBP)'}</strong>
                        <span>Resolution recommended: 1080x1080px (Square) or 1200x630px</span>
                      </div>
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

                {/* 6. Smart Hashtags Studio */}
                <div className="cp-field-group">
                  <label className="cp-group-label">
                    <span>6. Campaign Hashtags Studio</span>
                    <span className="cp-label-hint">Click chips to quickly add</span>
                  </label>

                  <div className="cp-input-icon">
                    <FiHash size={16} />
                    <input
                      id="post-hashtags"
                      name="hashtags"
                      type="text"
                      value={hashtags}
                      onChange={(e) => setHashtags(e.target.value)}
                      placeholder="RedCross, BloodDonation, FirstAidLK"
                    />
                  </div>

                  {/* Selected Tags Display Pills */}
                  {parsedTagsList.length > 0 && (
                    <div className="cp-active-tags-row">
                      <span className="active-tags-title"><FiTag size={12} /> Active Tags:</span>
                      {parsedTagsList.map((tag) => (
                        <span key={tag} className="active-tag-pill">
                          #{tag}
                          <button type="button" onClick={() => removeTag(tag)} aria-label="Remove tag">
                            <FiX size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Quick Add Preset Tag Chips */}
                  <div className="cp-quick-tags">
                    <span className="quick-tag-label">Suggested Tags:</span>
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

                {/* 7. Red Cross Dignity & Geneva Convention Checklist */}
                <div className="cp-compliance-card">
                  <div className="compliance-card-header">
                    <FiShield size={18} style={{ color: '#C8102E' }} />
                    <div>
                      <h4>Red Cross Humanitarian Dignity & Compliance Audit</h4>
                      <p>Ensure content conforms to international Red Cross Code of Conduct & Emblem protection guidelines.</p>
                    </div>
                  </div>

                  <div className="compliance-checklist">
                    <label className="compliance-checkbox-item">
                      <input
                        type="checkbox"
                        checked={complianceChecks.dignityConsent}
                        onChange={(e) =>
                          setComplianceChecks((prev) => ({ ...prev, dignityConsent: e.target.checked }))
                        }
                      />
                      <span>Beneficiary Dignity & Photo Consent Standard Verified</span>
                    </label>

                    <label className="compliance-checkbox-item">
                      <input
                        type="checkbox"
                        checked={complianceChecks.genevaEmblem}
                        onChange={(e) =>
                          setComplianceChecks((prev) => ({ ...prev, genevaEmblem: e.target.checked }))
                        }
                      />
                      <span>Geneva Convention Emblem Placement Guidelines Compliant</span>
                    </label>

                    <label className="compliance-checkbox-item">
                      <input
                        type="checkbox"
                        checked={complianceChecks.factVerified}
                        onChange={(e) =>
                          setComplianceChecks((prev) => ({ ...prev, factVerified: e.target.checked }))
                        }
                      />
                      <span>Fact-Checked & Verified Emergency Contact / Branch Details</span>
                    </label>
                  </div>
                </div>

                {statusMsg && (
                  <div className={`cp-status cp-status--${statusMsg.type}`} role="status">
                    <FiCheckCircle size={18} />
                    <span>{statusMsg.text}</span>
                  </div>
                )}

                {/* Form Actions */}
                <div className="cp-actions">
                  <button type="button" className="cp-btn cp-btn--ghost" onClick={handleSaveDraft}>
                    <FiFileText size={16} />
                    <span>Save as Draft</span>
                  </button>
                  <button type="submit" className="cp-btn cp-btn--primary">
                    <FiCheckCircle size={16} />
                    <span>Submit for Content Approver Review</span>
                  </button>
                </div>
              </section>

              {/* Realistic Social Live Preview Box (PRESERVED PREVIEW SIDE) */}
              <section className="rc-card cp-preview" aria-label="Live Post Preview">
                <div className="cp-preview-header">
                  <h3>Live Broadcast Preview</h3>
                  <p>Real-time rendering across target platforms</p>
                </div>

                <div className="cp-preview-tabs">
                  {PLATFORMS.map(({ key, label, icon: Icon, color }) => (
                    <button
                      type="button"
                      key={key}
                      className={`preview-tab${activePlatformTab === key ? ' is-active' : ''}`}
                      onClick={() => setActivePlatformTab(key)}
                    >
                      <Icon size={14} style={{ color: activePlatformTab === key ? color : '#9CA3AF' }} />
                      <span>{label}</span>
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
                    <h4 className="feed-title">{title || 'Untitled Campaign Post'}</h4>
                    <p>{caption || 'Your campaign message will render live here...'}</p>
                    {hashtagFormattedList.length > 0 && (
                      <p className="feed-tags">{hashtagFormattedList.join(' ')}</p>
                    )}
                  </div>

                  {/* Feed Image Banner */}
                  <div className="feed-image">
                    {imagePreviewUrl ? (
                      <img src={imagePreviewUrl} alt="Campaign Post Preview" />
                    ) : (
                      <div className="feed-image-placeholder">
                        <FiImage size={32} />
                        <span>Select a Red Cross cover image</span>
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
        /* Hero Section */
        .cp-hero-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 40%, #500B15 100%);
          border: 1px solid rgba(254, 202, 202, 0.25);
          border-radius: 20px;
          padding: 26px 32px;
          margin-bottom: 24px;
          box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.25), 0 4px 16px rgba(80, 11, 21, 0.25);
        }

        .cp-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
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

        .cp-pulse-icon {
          animation: pulseIcon 1.5s infinite alternate;
        }

        @keyframes pulseIcon {
          from { opacity: 0.6; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1.1); }
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
          max-width: 680px;
        }

        .cp-hero-telemetry {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cp-telemetry-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 6px 14px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 700;
          color: #F8FAFC;
        }

        .cp-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 24px;
          align-items: start;
        }

        /* Form Container (First Part) */
        .cp-form {
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 22px;
          border-radius: 20px;
          background: #FFFFFF;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border: 1px solid #E2E8F0;
        }

        .cp-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 16px;
          border-bottom: 1px solid #F1F5F9;
        }

        .cp-section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 17px;
          font-weight: 800;
          color: #0F172A;
          font-family: var(--font-heading);
          margin-bottom: 2px;
        }

        .cp-section-desc {
          font-size: 12.5px;
          color: #64748B;
        }

        .cp-ai-copilot-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #FEF2F4 0%, #FEE2E2 100%);
          border: 1px solid #FECDD3;
          color: #C8102E;
          font-size: 11.5px;
          font-weight: 800;
          padding: 5px 12px;
          border-radius: 999px;
          font-family: var(--font-heading);
        }

        .cp-field-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: #FAFBFD;
          border: 1px solid #F1F5F9;
          padding: 16px;
          border-radius: 14px;
        }

        .cp-group-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13.5px;
          font-weight: 800;
          color: #1E293B;
          font-family: var(--font-heading);
        }

        .cp-label-hint {
          font-size: 11.5px;
          font-weight: 700;
          color: #64748B;
        }

        /* Broadcast Channel Cards */
        .cp-channels-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .cp-channel-card {
          border: 2px solid var(--channel-border);
          background: #FFFFFF;
          border-radius: 12px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          gap: 8px;
          position: relative;
        }

        .cp-channel-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
        }

        .cp-channel-card.is-active {
          border-color: var(--channel-color);
          background: var(--channel-bg);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
        }

        .channel-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .channel-card-icon {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .channel-card-checkbox {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #E2E8F0;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cp-channel-card.is-active .channel-card-checkbox {
          background: var(--channel-color);
        }

        .channel-checkbox-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #94A3B8;
        }

        .channel-card-name {
          font-size: 13px;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 2px;
        }

        .channel-card-reach {
          font-size: 11px;
          color: #64748B;
          font-weight: 600;
        }

        .channel-status-pill {
          font-size: 10px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 6px;
          width: fit-content;
          text-transform: uppercase;
        }

        .channel-status-pill.active {
          background: rgba(255, 255, 255, 0.8);
          color: var(--channel-color);
        }

        .channel-status-pill.inactive {
          background: #F1F5F9;
          color: #94A3B8;
        }

        /* Preset Chips */
        .cp-preset-chips {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .preset-chip-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          color: #334155;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: var(--font-heading);
        }

        .preset-chip-btn:hover {
          border-color: #C8102E;
          color: #C8102E;
          background: #FEF2F4;
        }

        .preset-chip-btn.is-active {
          background: #C8102E;
          border-color: #C8102E;
          color: #FFFFFF;
          box-shadow: 0 2px 8px rgba(200, 16, 46, 0.25);
        }

        .chip-icon {
          color: inherit;
        }

        /* Fields */
        .cp-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cp-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cp-field label {
          font-size: 13px;
          font-weight: 800;
          color: #1E293B;
          font-family: var(--font-heading);
        }

        .char-count {
          font-size: 11.5px;
          color: #94A3B8;
          font-weight: 600;
        }

        .cp-field input[type="text"],
        .cp-field input[type="datetime-local"],
        .cp-field select {
          border: 1px solid #CBD5E1;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 13.5px;
          font-family: var(--font-body);
          color: #0F172A;
          background: #FFFFFF;
          width: 100%;
          transition: all 0.15s ease;
        }

        .cp-field input:focus,
        .cp-field select:focus {
          outline: none;
          border-color: #C8102E;
          box-shadow: 0 0 0 3px rgba(200, 16, 46, 0.12);
        }

        .cp-ai-toolbar {
          display: flex;
          gap: 6px;
        }

        .ai-tool-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #F1F5F9;
          border: 1px solid #E2E8F0;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .ai-tool-btn:hover {
          background: #FEF2F4;
          border-color: #FECDD3;
          color: #C8102E;
        }

        .cp-textarea-wrapper {
          position: relative;
          border: 1px solid #CBD5E1;
          border-radius: 12px;
          overflow: hidden;
          background: #FFFFFF;
        }

        .cp-textarea-wrapper textarea {
          width: 100%;
          border: none;
          padding: 12px 14px;
          font-size: 13.5px;
          font-family: var(--font-body);
          color: #0F172A;
          resize: vertical;
          outline: none;
          min-height: 100px;
        }

        .cp-textarea-wrapper:focus-within {
          border-color: #C8102E;
          box-shadow: 0 0 0 3px rgba(200, 16, 46, 0.12);
        }

        .cp-textarea-footer {
          display: flex;
          justify-content: space-between;
          padding: 6px 12px;
          background: #F8FAFC;
          border-top: 1px solid #F1F5F9;
          font-size: 11px;
          color: #64748B;
          font-weight: 700;
        }

        .cp-link-btn {
          background: none;
          border: none;
          color: #2563EB;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .cp-link-btn:hover {
          text-decoration: underline;
        }

        .cp-url-input-box {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }

        .cp-url-input-box input {
          flex: 1;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 12.5px;
        }

        .cp-url-apply-btn {
          background: #0F172A;
          color: #FFFFFF;
          border: none;
          padding: 0 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        /* Photo Gallery Grid */
        .cp-preset-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
          margin-bottom: 8px;
        }

        .preset-thumb {
          position: relative;
          height: 76px;
          border-radius: 10px;
          overflow: hidden;
          border: 2px solid #E2E8F0;
          padding: 0;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #F1F5F9;
        }

        .preset-thumb:hover {
          transform: scale(1.03);
          border-color: #94A3B8;
        }

        .preset-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preset-thumb__tag {
          position: absolute;
          top: 3px;
          left: 3px;
          background: rgba(15, 23, 42, 0.75);
          color: #FFFFFF;
          font-size: 8.5px;
          font-weight: 800;
          padding: 1px 5px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .preset-thumb__label {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.7);
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
          box-shadow: 0 0 0 3px rgba(200, 16, 46, 0.25);
        }

        .preset-check-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 18px;
          height: 18px;
          background: #C8102E;
          color: #FFFFFF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .cp-upload-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1.5px dashed #CBD5E1;
          border-radius: 12px;
          padding: 12px 16px;
          background: #FFFFFF;
          color: #334155;
          font-size: 12.5px;
          cursor: pointer;
          width: 100%;
          transition: all 0.15s ease;
          text-align: left;
        }

        .cp-upload-btn:hover {
          border-color: #C8102E;
          background: #FEF2F4;
        }

        .upload-icon {
          color: #C8102E;
          flex-shrink: 0;
        }

        .cp-upload-btn div strong {
          display: block;
          color: #0F172A;
          font-size: 13px;
        }

        .cp-upload-btn div span {
          color: #64748B;
          font-size: 11px;
        }

        /* Tags */
        .cp-active-tags-row {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          margin-top: 4px;
        }

        .active-tags-title {
          font-size: 11px;
          font-weight: 800;
          color: #475569;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .active-tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #FEF2F4;
          border: 1px solid #FECDD3;
          color: #C8102E;
          font-size: 11.5px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 6px;
        }

        .active-tag-pill button {
          background: none;
          border: none;
          color: #C8102E;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0;
        }

        .cp-quick-tags {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          margin-top: 6px;
        }

        .quick-tag-label {
          font-size: 11.5px;
          color: #64748B;
          font-weight: 700;
        }

        .quick-tag-chip {
          border: 1px solid #DBEAFE;
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
          background: #BFDBFE;
        }

        /* Compliance Card */
        .cp-compliance-card {
          background: linear-gradient(135deg, #FFF5F5 0%, #FEF2F4 100%);
          border: 1px solid #FECDD3;
          border-radius: 14px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .compliance-card-header {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .compliance-card-header h4 {
          font-size: 13.5px;
          font-weight: 800;
          color: #991B1B;
          font-family: var(--font-heading);
          margin-bottom: 2px;
        }

        .compliance-card-header p {
          font-size: 11.5px;
          color: #7F1D1D;
        }

        .compliance-checklist {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .compliance-checkbox-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 700;
          color: #334155;
          cursor: pointer;
        }

        .compliance-checkbox-item input {
          accent-color: #C8102E;
          width: 15px;
          height: 15px;
        }

        .cp-input-icon {
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #CBD5E1;
          border-radius: 10px;
          padding: 0 14px;
          background: #FFFFFF;
        }

        .cp-input-icon svg { color: #64748B; }
        .cp-input-icon input { border: none; padding: 10px 0; font-size: 13.5px; width: 100%; background: transparent; outline: none; }

        .cp-field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .cp-error { font-size: 12px; color: #DC2626; font-weight: 600; }

        .cp-status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
        }

        .cp-status--draft {
          background: #F0FDF4;
          border: 1px solid #BBF7D0;
          color: #166534;
        }

        .cp-status--submitted {
          background: #FEF2F4;
          border: 1px solid #FECDD3;
          color: #991B1B;
        }

        .cp-actions {
          display: flex;
          gap: 14px;
          margin-top: 6px;
        }

        .cp-btn {
          flex: 1;
          border-radius: 12px;
          padding: 13px 18px;
          font-size: 14px;
          font-weight: 800;
          font-family: var(--font-heading);
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .cp-btn--ghost {
          background: #FFFFFF;
          border-color: #CBD5E1;
          color: #334155;
        }

        .cp-btn--ghost:hover {
          background: #F8FAFC;
          border-color: #94A3B8;
        }

        .cp-btn--primary {
          background: linear-gradient(135deg, #059669 0%, #10B981 100%);
          color: #FFFFFF;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.28);
        }

        .cp-btn--primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(16, 185, 129, 0.4);
        }

        /* Live Preview Card */
        .cp-preview {
          padding: 24px;
          border-radius: 20px;
          position: sticky;
          top: 84px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .cp-preview-header {
          margin-bottom: 14px;
        }

        .cp-preview-header h3 {
          font-size: 16px;
          font-weight: 800;
          color: #0F172A;
          font-family: var(--font-heading);
          margin-bottom: 2px;
        }

        .cp-preview-header p {
          font-size: 12px;
          color: #64748B;
        }

        .cp-preview-tabs {
          display: flex;
          border-bottom: 1px solid #E2E8F0;
          margin-bottom: 18px;
        }

        .preview-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 4px;
          border: none;
          background: transparent;
          font-size: 12.5px;
          font-weight: 700;
          color: #94A3B8;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          font-family: var(--font-heading);
        }

        .preview-tab.is-active {
          color: #0F172A;
          border-bottom-color: #C8102E;
        }

        .preview-feed-card {
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          background: #FFFFFF;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .feed-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 16px;
          border-bottom: 1px solid #F1F5F9;
        }

        .feed-avatar {
          width: 38px;
          height: 38px;
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
          color: #0F172A;
        }

        .verified-badge {
          color: #2563EB;
          font-size: 12px;
        }

        .feed-user-info span {
          font-size: 11px;
          color: #64748B;
        }

        .feed-caption {
          padding: 14px 16px 10px;
        }

        .feed-title {
          font-size: 15px;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 6px;
        }

        .feed-caption p {
          font-size: 13.5px;
          color: #334155;
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
          height: 230px;
          background: #F1F5F9;
          overflow: hidden;
        }

        .feed-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .feed-image-placeholder {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #94A3B8;
          font-size: 13px;
        }

        .feed-engagement {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          padding: 12px;
          border-top: 1px solid #F1F5F9;
          background: #FAFBFD;
          text-align: center;
        }

        .feed-engagement div {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: #64748B;
        }

        @media (max-width: 1024px) {
          .cp-grid { grid-template-columns: 1fr; }
          .cp-channels-grid { grid-template-columns: 1fr; }
          .cp-preset-grid { grid-template-columns: repeat(3, 1fr); }
          .cp-field-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}