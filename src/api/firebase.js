import { initializeApp } from 'firebase/app';

const FIREBASE_CONFIG = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
};

export const firebaseApp = initializeApp(FIREBASE_CONFIG);
