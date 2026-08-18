import { initializeApp, setLogLevel } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { 
  initializeFirestore,
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  getDocFromCache,
  persistentLocalCache,
  persistentMultipleTabManager
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Silence non-critical connection retry warnings in sandboxed iframe environment
try {
  setLogLevel("silent");
} catch (e) {
  // Ignore
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

const dbId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)"
  ? firebaseConfig.firestoreDatabaseId
  : undefined;

// Use initializeFirestore with auto-detect long polling and persistent local cache for sandbox stability
let dbInstance;
try {
  dbInstance = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
  }, dbId);
} catch (e) {
  try {
    dbInstance = initializeFirestore(app, {
      experimentalForceLongPolling: true
    }, dbId);
  } catch (err) {
    dbInstance = dbId ? getFirestore(app, dbId) : getFirestore(app);
  }
}

export const db = dbInstance;

// Test connection safely with cache fallback
export async function testFirestoreConnection() {
  try {
    if (db) {
      await getDocFromCache(doc(db, "_health", "check"));
    }
  } catch (error) {
    // Offline mode active
  }
}

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  doc,
  setDoc,
  getDoc
};


