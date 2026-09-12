import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../Firebase/FirebaseConfig';

const POSTS_KEY = 'redcross_posts_v1';

export const INITIAL_POSTS = [
  {
    id: 'post-1',
    title: 'World Blood Donor Day recap',
    caption: 'Thank you to all our selfless donors who stepped up yesterday! Over 350 pints collected across Colombo centres. #RedCross #BloodDonation #SaveLives',
    imageUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80',
    platforms: ['facebook', 'instagram'],
    campaignId: 'blood-donation',
    creator: 'Seminda Fernando',
    status: 'published',
    schedule: '2026-09-10T10:00',
    date: '10 Sep 2026',
    feedback: '',
  },
  {
    id: 'post-2',
    title: 'Emergency Medical & First Aid Response',
    caption: 'Immediate first aid for minor thermal burns and emergency trauma care: cool with clean running water for 20 mins. Certified Red Cross first aid teams deployed across Western province. #FirstAid #RedCrossCare #SafetyFirst',
    imageUrl: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80',
    platforms: ['instagram', 'facebook'],
    campaignId: 'first-aid-training',
    creator: 'Seminda Fernando',
    status: 'pending',
    schedule: '2026-09-11T14:30',
    date: '10 Sep 2026',
    feedback: 'Please verify medical accuracy clause regarding cold water duration.',
  },
  {
    id: 'post-3',
    title: 'Volunteer drive - Kandy branch',
    caption: 'Join our emergency response volunteer unit in Kandy. Orientation session this Saturday at 9 AM! Sign up link in bio. #RedCrossVolunteers #Kandy #Community',
    imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80',
    platforms: ['facebook', 'twitter'],
    campaignId: 'disaster-response',
    creator: 'Savini Gunarathna',
    status: 'approved',
    schedule: '2026-09-12T09:00',
    date: '09 Sep 2026',
    feedback: 'Approved for broadcast.',
  },
  {
    id: 'post-4',
    title: 'Dengue prevention checklist',
    caption: 'Protect your home & family from mosquito breeding grounds. Clear standing water weekly and inspect rainwater gutters! #DengueAwareness #HealthTips #RedCross',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    platforms: ['instagram', 'facebook'],
    campaignId: 'dengue-awareness',
    creator: 'Seminda Fernando',
    status: 'scheduled',
    schedule: '2026-09-13T09:00',
    date: '08 Sep 2026',
    feedback: '',
  },
  {
    id: 'post-5',
    title: 'Disaster relief: flood response update',
    caption: 'Our response teams have distributed over 1,200 dry ration packs in Ratnapura district. Support the relief fund at redcross.lk/donate #FloodRelief',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    platforms: ['twitter'],
    campaignId: 'disaster-response',
    creator: 'Vinuki Pasangi',
    status: 'draft',
    schedule: '',
    date: '07 Sep 2026',
    feedback: '',
  },
];

export const REDCROSS_PHOTOS = [
  { id: 'p1', title: 'Emergency Ambulance & First Aid', url: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80' },
  { id: 'p2', title: 'Blood Donation Camp', url: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80' },
  { id: 'p3', title: 'Community Volunteers', url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80' },
  { id: 'p4', title: 'Disaster Relief Distribution', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80' },
  { id: 'p5', title: 'Medical Response Team', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80' },
];

async function syncPostToFirestore(postObj) {
  if (db && postObj && postObj.id) {
    try {
      const postRef = doc(db, 'posts', postObj.id);
      await setDoc(postRef, {
        ...postObj,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      console.log('Synced post to Firestore database collection "posts":', postObj.id);
    } catch (err) {
      console.warn('Firestore post sync notice:', err.message);
    }
  }
}

export function getPosts() {
  const data = localStorage.getItem(POSTS_KEY);
  if (!data) {
    localStorage.setItem(POSTS_KEY, JSON.stringify(INITIAL_POSTS));
    INITIAL_POSTS.forEach((p) => syncPostToFirestore(p));
    return INITIAL_POSTS;
  }
  try {
    const parsed = JSON.parse(data);
    let updated = false;
    const migrated = parsed.map((p) => {
      let isMod = false;
      let newPost = { ...p };
      if (p.id === 'post-2' && (!p.imageUrl || p.imageUrl.includes('photo-1584515979956'))) {
        newPost.imageUrl = 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80';
        newPost.title = 'Emergency Medical & First Aid Response';
        isMod = true;
      }
      if (p.creator === 'Tarindu Fernando' || p.creator === 'Nipuni Perera') {
        newPost.creator = 'Seminda Fernando';
        isMod = true;
      }
      if (isMod) updated = true;
      return newPost;
    });
    if (updated) {
      localStorage.setItem(POSTS_KEY, JSON.stringify(migrated));
      migrated.forEach((p) => syncPostToFirestore(p));
      return migrated;
    }
    return parsed;
  } catch (e) {
    return INITIAL_POSTS;
  }
}

export function savePost(post) {
  const posts = getPosts();
  const newPost = {
    id: post.id || 'post-' + Date.now(),
    title: post.title,
    caption: post.caption,
    imageUrl: post.imageUrl || 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80',
    hashtags: post.hashtags || [],
    platforms: post.platforms || ['facebook'],
    campaignId: post.campaignId || null,
    creator: post.creator || 'Content Creator',
    status: post.status || 'draft',
    schedule: post.schedule || '',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    feedback: post.feedback || '',
  };

  const existingIndex = posts.findIndex((p) => p.id === newPost.id);
  let updated;
  if (existingIndex >= 0) {
    updated = [...posts];
    updated[existingIndex] = newPost;
  } else {
    updated = [newPost, ...posts];
  }

  localStorage.setItem(POSTS_KEY, JSON.stringify(updated));
  syncPostToFirestore(newPost);
  return newPost;
}

export function updatePostStatus(postId, status, feedback = '') {
  const posts = getPosts();
  let targetPost = null;
  const updated = posts.map((p) => {
    if (p.id === postId) {
      targetPost = { ...p, status, feedback: feedback || p.feedback };
      return targetPost;
    }
    return p;
  });
  localStorage.setItem(POSTS_KEY, JSON.stringify(updated));
  if (targetPost) syncPostToFirestore(targetPost);
  return updated;
}

export function updatePostImage(postId, imageUrl) {
  const posts = getPosts();
  let targetPost = null;
  const updated = posts.map((p) => {
    if (p.id === postId) {
      targetPost = { ...p, imageUrl };
      return targetPost;
    }
    return p;
  });
  localStorage.setItem(POSTS_KEY, JSON.stringify(updated));
  if (targetPost) syncPostToFirestore(targetPost);
  return updated;
}

export function deletePost(postId) {
  const posts = getPosts();
  const updated = posts.filter((p) => p.id !== postId);
  localStorage.setItem(POSTS_KEY, JSON.stringify(updated));
  if (db) {
    try {
      deleteDoc(doc(db, 'posts', postId));
    } catch (e) {
      console.warn('Firestore delete notice:', e);
    }
  }
  return updated;
}
