import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../Firebase/FirebaseConfig';

export const ADMIN_TEAM_PROFILES = [
  {
    id: 'off-1',
    name: 'Hithesh Maheepala',
    email: 'admin@redcross.org',
    role: 'Administrator',
    department: 'National Executive HQ',
    location: 'Colombo 07',
    avatar: 'HM',
    badgeColor: '#DC2626',
  },
  {
    id: 'off-2',
    name: 'Ramda Amaneth',
    email: 'approver@redcross.org',
    role: 'Content Approver',
    department: 'Media Relations & Governance',
    location: 'Colombo HQ',
    avatar: 'RA',
    badgeColor: '#9333EA',
  },
  {
    id: 'off-3',
    name: 'Seminda Fernando',
    email: 'creator@redcross.org',
    role: 'Content Creator',
    department: 'Disaster Emergency Comms',
    location: 'Gampaha Branch',
    avatar: 'SF',
    badgeColor: '#2563EB',
  },
  {
    id: 'off-4',
    name: 'Savini Gunarathna',
    email: 'savini.g@redcross.org',
    role: 'Content Creator',
    department: 'Volunteer & Youth Operations',
    location: 'Kandy Branch',
    avatar: 'SG',
    badgeColor: '#059669',
  },
  {
    id: 'off-5',
    name: 'Vinuki Pasangi',
    email: 'vinuki.p@redcross.org',
    role: 'Content Creator',
    department: 'Health & First Aid Outreach',
    location: 'Galle Branch',
    avatar: 'VP',
    badgeColor: '#D97706',
  },
];

export const DEMO_USERS = {
  creator: {
    uid: 'demo-creator-123',
    email: 'creator@redcross.org',
    name: 'Seminda Fernando',
    role: 'Content Creator',
    avatar: 'SF',
  },
  approver: {
    uid: 'demo-approver-456',
    email: 'approver@redcross.org',
    name: 'Ramda Amaneth',
    role: 'Content Approver',
    avatar: 'RA',
  },
  admin: {
    uid: 'demo-admin-789',
    email: 'admin@redcross.org',
    name: 'Hithesh Maheepala',
    role: 'Administrator',
    avatar: 'HM',
  },
};

const REGISTERED_USERS_KEY = 'redcross_registered_users_v1';

export function getStoredUsers() {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveStoredUser(userAccount) {
  try {
    const existing = getStoredUsers();
    const cleanEmail = userAccount.email.toLowerCase().trim();
    const filtered = existing.filter((u) => u.email.toLowerCase().trim() !== cleanEmail);
    filtered.push(userAccount);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn('Could not save user to localStorage:', e);
  }
}

export function isSharedAdminEmail(email = '') {
  const e = email.toLowerCase().trim();
  return (
    e === 'admin@redcross.org' ||
    e === 'admin' ||
    e === 'officer@redcross.org' ||
    e.includes('admin.team') ||
    e.includes('hq@redcross.org')
  );
}

export async function getUserRoleFromFirestore(uid) {
  if (db && uid) {
    try {
      const userDocRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          role: data.role || 'Administrator',
          name: data.name,
          department: data.department,
          location: data.location,
        };
      }
    } catch (err) {
      console.warn('Firestore role retrieval notice:', err.message);
    }
  }
  return null;
}

export async function syncUserToFirestore(userObj) {
  if (db && userObj && userObj.uid) {
    try {
      const userRef = doc(db, 'users', userObj.uid);
      await setDoc(
        userRef,
        {
          uid: userObj.uid,
          email: userObj.email,
          name: userObj.name || userObj.email.split('@')[0],
          role: userObj.role || 'Administrator',
          department: userObj.department || 'Red Cross Operations',
          location: userObj.location || 'Sri Lanka HQ',
          lastLogin: new Date().toISOString(),
        },
        { merge: true }
      );
      console.log('Synced user to Firestore database collection "users":', userObj.email);
    } catch (err) {
      console.warn('Firestore sync notice:', err.message);
    }
  }
}

export async function loginWithCredentials(email, password) {
  const cleanEmail = (email || '').toLowerCase().trim();
  const cleanPassword = (password || '').trim();
  const targetEmail = cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@redcross.org`;

  if (!cleanEmail) {
    throw new Error('Please enter your email address.');
  }
  if (!cleanPassword || cleanPassword.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  console.log('Attempting authentication for:', targetEmail);

  // 1. Check Demo User Presets
  if (cleanEmail === 'admin@redcross.org' || cleanEmail === 'admin' || cleanEmail === 'admin@admin.org') {
    const validPasses = ['redcross2026!', 'admin123', 'admin', 'redcross'];
    if (!validPasses.includes(cleanPassword.toLowerCase())) {
      throw new Error('Invalid password for Admin account. Please check your credentials.');
    }
    const adminUser = { ...DEMO_USERS.admin, email: cleanEmail.includes('@') ? cleanEmail : 'admin@redcross.org', isSharedTeam: true };
    await syncUserToFirestore(adminUser);
    return adminUser;
  }

  if (cleanEmail === 'approver@redcross.org' || cleanEmail === 'approver') {
    const validPasses = ['redcross2026!', 'approver123', 'approver', 'redcross'];
    if (!validPasses.includes(cleanPassword.toLowerCase())) {
      throw new Error('Invalid password for Approver account. Please check your credentials.');
    }
    return DEMO_USERS.approver;
  }

  if (cleanEmail === 'creator@redcross.org' || cleanEmail === 'creator') {
    const validPasses = ['redcross2026!', 'creator123', 'creator', 'redcross'];
    if (!validPasses.includes(cleanPassword.toLowerCase())) {
      throw new Error('Invalid password for Creator account. Please check your credentials.');
    }
    return DEMO_USERS.creator;
  }

  // Check additional admin team profiles
  const teamProfile = ADMIN_TEAM_PROFILES.find((p) => p.email.toLowerCase() === targetEmail);
  if (teamProfile) {
    const validPasses = ['redcross2026!', 'admin123', 'creator123', 'approver123', 'redcross'];
    if (!validPasses.includes(cleanPassword.toLowerCase())) {
      throw new Error(`Invalid password for ${teamProfile.name}. Please check your credentials.`);
    }
    const officerUser = {
      uid: teamProfile.id,
      email: teamProfile.email,
      name: teamProfile.name,
      role: teamProfile.role,
      department: teamProfile.department,
      location: teamProfile.location,
      avatar: teamProfile.avatar,
    };
    await syncUserToFirestore(officerUser);
    return officerUser;
  }

  // 2. Check Local Registered Accounts (localStorage persistence)
  const storedUsers = getStoredUsers();
  const localMatch = storedUsers.find((u) => u.email.toLowerCase().trim() === targetEmail);
  if (localMatch) {
    if (localMatch.password && localMatch.password !== cleanPassword) {
      throw new Error('Invalid password. Please verify your password and try again.');
    }
    const { password: _p, ...cleanUser } = localMatch;
    await syncUserToFirestore(cleanUser);
    return cleanUser;
  }

  // 3. Real Firebase Auth (if initialized and active)
  if (auth) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, targetEmail, cleanPassword);
      const firebaseUser = userCredential.user;

      if (firebaseUser) {
        const existingData = await getUserRoleFromFirestore(firebaseUser.uid);
        const isShared = isSharedAdminEmail(firebaseUser.email);
        const authenticatedUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: existingData?.name || firebaseUser.displayName || firebaseUser.email.split('@')[0],
          role: existingData?.role || 'Content Creator',
          department: existingData?.department || 'Red Cross Operations',
          location: existingData?.location || 'Sri Lanka HQ',
          isSharedTeam: isShared,
        };
        saveStoredUser({ ...authenticatedUser, password: cleanPassword });
        await syncUserToFirestore(authenticatedUser);
        return authenticatedUser;
      }
    } catch (err) {
      console.warn('Firebase Auth notice:', err.code, err.message);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password. Please verify your login details.');
      }
      if (err.code === 'auth/user-not-found') {
        throw new Error('Account not found. Please click "Register New User" tab to create an account.');
      }
      if (err.code === 'auth/invalid-email') {
        throw new Error('Invalid email address format.');
      }
      if (err.code === 'auth/api-key-not-valid') {
        console.warn('Firebase API key restricted, checking local registration fallback');
      } else if (err.message && !err.message.includes('api-key-not-valid')) {
        throw new Error(err.message || 'Authentication failed.');
      }
    }
  }

  // 4. Reject unregistered accounts
  throw new Error('Account not found. Please click "Register New User" tab to create an account first.');
}

export async function loginWithGoogle(customGoogleDetails) {
  if (customGoogleDetails && customGoogleDetails.email) {
    const isShared = isSharedAdminEmail(customGoogleDetails.email);
    const googleUser = {
      uid: customGoogleDetails.uid || 'google-usr-' + Date.now(),
      email: customGoogleDetails.email,
      name: customGoogleDetails.name || customGoogleDetails.email.split('@')[0],
      photoURL: customGoogleDetails.photoURL || null,
      role: customGoogleDetails.role || (isShared ? 'Administrator' : 'Content Creator'),
      department: customGoogleDetails.department || 'Red Cross Operations',
      location: customGoogleDetails.location || 'Colombo HQ',
      authProvider: 'google',
      isSharedTeam: isShared,
    };
    await syncUserToFirestore(googleUser);
    return googleUser;
  }

  if (auth) {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const existingData = await getUserRoleFromFirestore(user.uid);
      const isShared = isSharedAdminEmail(user.email);
      const googleUser = {
        uid: user.uid,
        email: user.email,
        name: existingData?.name || user.displayName || user.email.split('@')[0] || 'Red Cross Officer',
        photoURL: user.photoURL || null,
        role: existingData?.role || (isShared ? 'Administrator' : 'Content Creator'),
        department: existingData?.department || 'Red Cross Operations',
        location: existingData?.location || 'Colombo HQ',
        authProvider: 'google',
        isSharedTeam: isShared,
      };
      await syncUserToFirestore(googleUser);
      return googleUser;
    } catch (error) {
      console.warn('Google Auth popup notice:', error.code, error.message);
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        throw new Error('Google Sign-In popup was closed before completing login.');
      }
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Google Sign-In is disabled in Firebase Console. Please enable Google in Firebase Auth settings.');
      }
      if (error.code === 'auth/unauthorized-domain') {
        throw new Error('Domain not authorized. Please add domain in Firebase Auth Settings > Authorized Domains.');
      }
      throw new Error(error.message || 'Google Sign-In failed. Please try again.');
    }
  }

  throw new Error('Firebase Authentication is not initialized.');
}

export async function registerNewUserAccount(details) {
  const { name, email, password, role = 'Content Creator', department = 'Red Cross Operations', location = 'Colombo HQ' } = details;
  const cleanEmail = (email || '').toLowerCase().trim();
  const targetEmail = cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@redcross.org`;
  const cleanPassword = (password || '').trim();

  if (!cleanEmail) {
    throw new Error('Please enter a valid email address.');
  }
  if (!cleanPassword || cleanPassword.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  // Check if email already registered in local storage
  const storedUsers = getStoredUsers();
  const existingLocal = storedUsers.find((u) => u.email.toLowerCase().trim() === targetEmail);
  if (existingLocal) {
    throw new Error('An account with this email address already exists. Please sign in instead.');
  }

  const isDemo = ['admin@redcross.org', 'creator@redcross.org', 'approver@redcross.org'].includes(targetEmail);
  if (isDemo) {
    throw new Error('This email address belongs to a demo account. Please sign in directly or register with a unique email.');
  }

  const safeRole = role === 'Administrator' ? 'Content Creator' : role;
  console.log('Registering new Red Cross officer account:', targetEmail);

  let newUserObj = {
    uid: 'usr-' + Date.now(),
    email: targetEmail,
    name: name || targetEmail.split('@')[0],
    role: safeRole,
    department,
    location,
  };

  if (auth) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, targetEmail, cleanPassword);
      const user = userCredential.user;
      newUserObj = {
        uid: user.uid,
        email: user.email,
        name: name || user.displayName || user.email.split('@')[0],
        role: safeRole,
        department,
        location,
      };
    } catch (err) {
      console.warn('Firebase createUser notice:', err.code, err.message);
      if (err.code === 'auth/email-already-in-use') {
        throw new Error('This email address is already registered in Firebase. Please sign in instead.');
      }
      if (err.code === 'auth/invalid-email') {
        throw new Error('Invalid email format. Please check your email address.');
      }
      if (err.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please use a stronger password.');
      }
    }
  }

  // Store in localStorage for persistent offline/fallback authentication
  saveStoredUser({
    ...newUserObj,
    password: cleanPassword,
    createdAt: new Date().toISOString(),
  });

  await syncUserToFirestore(newUserObj);

  const { password: _p, ...cleanUser } = newUserObj;
  return cleanUser;
}

export async function logoutUser() {
  if (auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signOut error:', e);
    }
  }
}



