const STORAGE_KEY = 'redcross_campaigns_v1';

export const CAMPAIGN_COVER_PRESETS = [
  { id: 'c1', title: 'Blood Donation Camp', url: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80' },
  { id: 'c2', title: 'Emergency Relief & Flood Aid', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80' },
  { id: 'c3', title: 'First Aid & Trauma Care', url: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80' },
  { id: 'c4', title: 'Dengue & Sanitation Check', url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80' },
  { id: 'c5', title: 'Volunteer Unit Drive', url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80' },
];

export const INITIAL_CAMPAIGNS = [
  {
    id: 'blood-donation',
    name: 'World Blood Donor Day 2026',
    objective: 'Increase voluntary blood donations across western province by 25%. Target 500 pints across Colombo centres.',
    imageUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80',
    startDate: '2026-06-01',
    endDate: '2026-06-30',
    targetAudience: 'Youth (18-35) & University Students',
    status: 'Active',
    postsCount: 14,
    reach: '45,200',
    reachGoal: '50,000',
    progress: 90,
    engagement: '8.4%',
  },
  {
    id: 'dengue-awareness',
    name: 'Dengue Prevention Campaign',
    objective: 'Spread sanitation tips and emergency hotlines ahead of monsoon season across high-risk urban sectors.',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    startDate: '2026-09-01',
    endDate: '2026-10-15',
    targetAudience: 'Households & Local Communities',
    status: 'Active',
    postsCount: 8,
    reach: '28,100',
    reachGoal: '40,000',
    progress: 70,
    engagement: '6.2%',
  },
  {
    id: 'disaster-response',
    name: 'Monsoon Flood Relief Fund',
    objective: 'Emergency relief fundraising and volunteer recruitment for impacted districts in Ratnapura & Kalutara.',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    startDate: '2026-08-15',
    endDate: '2026-09-30',
    targetAudience: 'General Public & Corporate Donors',
    status: 'Active',
    postsCount: 22,
    reach: '92,400',
    reachGoal: '100,000',
    progress: 92,
    engagement: '11.8%',
  },
  {
    id: 'first-aid-training',
    name: 'Community First Aid Workshops',
    objective: 'Promote free certified first aid & CPR workshops in Colombo & Kandy Red Cross branches.',
    imageUrl: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80',
    startDate: '2026-05-10',
    endDate: '2026-07-20',
    targetAudience: 'School Teachers & Community Leaders',
    status: 'Completed',
    postsCount: 10,
    reach: '19,500',
    reachGoal: '20,000',
    progress: 100,
    engagement: '4.9%',
  },
];

export function getCampaigns() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CAMPAIGNS));
    return INITIAL_CAMPAIGNS;
  }
  try {
    const parsed = JSON.parse(data);
    let updated = false;
    const migrated = parsed.map((c) => {
      if (!c.imageUrl) {
        updated = true;
        const initialMatch = INITIAL_CAMPAIGNS.find((ic) => ic.id === c.id);
        return {
          ...c,
          imageUrl: initialMatch?.imageUrl || 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80',
          progress: c.progress || 75,
          reachGoal: c.reachGoal || '50,000',
        };
      }
      return c;
    });
    if (updated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
    return parsed;
  } catch (e) {
    return INITIAL_CAMPAIGNS;
  }
}

export function saveCampaign(campaign) {
  const current = getCampaigns();
  const newCampaign = {
    id: campaign.id || 'camp-' + Date.now(),
    name: campaign.name,
    objective: campaign.objective || '',
    startDate: campaign.startDate || new Date().toISOString().split('T')[0],
    endDate: campaign.endDate || '',
    targetAudience: campaign.targetAudience || 'General Public',
    status: campaign.status || 'Active',
    postsCount: campaign.postsCount || 0,
    reach: campaign.reach || '0',
    engagement: campaign.engagement || '0%',
  };
  const updated = [newCampaign, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newCampaign;
}
