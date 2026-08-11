const fs = require('node:fs');
const path = require('node:path');
const { applicationDefault, cert, getApps, initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');

function parseCredentialJson(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function readCredentialSource() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return parseCredentialJson(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    return parseCredentialJson(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8')
    );
  }

  const explicitPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH || process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!explicitPath) {
    return null;
  }

  try {
    const absolutePath = path.resolve(explicitPath);
    return parseCredentialJson(fs.readFileSync(absolutePath, 'utf8'));
  } catch {
    return null;
  }
}

function normalizeCredential(rawCredential) {
  if (!rawCredential) {
    return null;
  }

  const projectId = rawCredential.projectId || rawCredential.project_id || process.env.FIREBASE_PROJECT_ID;
  const clientEmail = rawCredential.clientEmail || rawCredential.client_email;
  const privateKey = (rawCredential.privateKey || rawCredential.private_key || '').replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return { projectId, clientEmail, privateKey };
}

function getStorageBucketName() {
  return process.env.FIREBASE_STORAGE_BUCKET || 'constantia-agency.firebasestorage.app';
}

function initFirebaseAdmin() {
  const existing = getApps()[0];
  if (existing) {
    return existing;
  }

  const storageBucket = getStorageBucketName();
  const credentialData = normalizeCredential(readCredentialSource());

  if (credentialData) {
    return initializeApp({
      credential: cert(credentialData),
      storageBucket,
    });
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return initializeApp({
      credential: applicationDefault(),
      storageBucket,
    });
  }

  throw new Error(
    'Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON, FIREBASE_SERVICE_ACCOUNT_BASE64, FIREBASE_SERVICE_ACCOUNT_PATH, or GOOGLE_APPLICATION_CREDENTIALS.'
  );
}

function getFirestoreDb() {
  return getFirestore(initFirebaseAdmin());
}

function getStorageBucket() {
  return getStorage(initFirebaseAdmin()).bucket(getStorageBucketName());
}

module.exports = {
  getFirestoreDb,
  getStorageBucket,
  getStorageBucketName,
  initFirebaseAdmin,
};
