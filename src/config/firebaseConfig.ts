import admin from 'firebase-admin';
import type { Auth } from 'firebase-admin/auth';

let firebaseApp: admin.app.App | undefined;
let authInstance: Auth;


try {
  
  const serviceAccount = require('./firebase-adminsdk-fbsvc-eaa0f79613.json');

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  authInstance = admin.auth();
} catch (error) {
  
  const stubVerify = async (_token: string) => {
    throw new Error(
      'Firebase service account not found. For local dev put your service account JSON in src/config and do not commit it.'
    );
  };

  
  authInstance = ( {
    verifyIdToken: stubVerify,
    
  } as unknown) as Auth;
}

export { firebaseApp, authInstance as auth };
export default firebaseApp;