import 'server-only'

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

type FirebaseServiceAccount = {
  project_id?: string
  projectId?: string
  client_email?: string
  clientEmail?: string
  private_key?: string
  privateKey?: string
}

function parseJsonCredential(raw: string): FirebaseServiceAccount | null {
  try {
    return JSON.parse(raw) as FirebaseServiceAccount
  } catch {
    return null
  }
}

function readServiceAccountFromEnv() {
  const inlineJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (inlineJson) {
    return parseJsonCredential(inlineJson)
  }

  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
  if (base64) {
    return parseJsonCredential(Buffer.from(base64, 'base64').toString('utf8'))
  }

  const explicitPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ?? process.env.GOOGLE_APPLICATION_CREDENTIALS

  if (!explicitPath) {
    return null
  }

  try {
    const absolutePath = resolve(explicitPath)
    return parseJsonCredential(readFileSync(absolutePath, 'utf8'))
  } catch {
    return null
  }
}

function normalizeServiceAccount(account: FirebaseServiceAccount | null) {
  if (!account) return null

  const projectId = account.projectId ?? account.project_id ?? process.env.FIREBASE_PROJECT_ID
  const clientEmail = account.clientEmail ?? account.client_email
  const privateKey = (account.privateKey ?? account.private_key)?.replace(/\\n/g, '\n')

  if (!projectId || !clientEmail || !privateKey) {
    return null
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  }
}

function getFirebaseStorageBucketName() {
  return process.env.FIREBASE_STORAGE_BUCKET ?? 'constantia-agency.firebasestorage.app'
}

export function hasFirebaseAdminConfig() {
  return Boolean(normalizeServiceAccount(readServiceAccountFromEnv()) || process.env.GOOGLE_APPLICATION_CREDENTIALS)
}

function getFirebaseAdminApp() {
  const existing = getApps()[0]
  if (existing) {
    return existing
  }

  const storageBucket = getFirebaseStorageBucketName()
  const serviceAccount = normalizeServiceAccount(readServiceAccountFromEnv())

  if (serviceAccount) {
    return initializeApp({
      credential: cert(serviceAccount),
      storageBucket,
    })
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return initializeApp({
      credential: applicationDefault(),
      storageBucket,
    })
  }

  throw new Error(
    'Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON, FIREBASE_SERVICE_ACCOUNT_BASE64, FIREBASE_SERVICE_ACCOUNT_PATH, or GOOGLE_APPLICATION_CREDENTIALS.'
  )
}

export function getFirebaseAdminFirestore() {
  return getFirestore(getFirebaseAdminApp())
}

export function getFirebaseStoragePublicUrl(objectPath: string) {
  if (/^(https?:)?\/\//.test(objectPath) || objectPath.startsWith('/')) {
    return objectPath
  }

  return `https://firebasestorage.googleapis.com/v0/b/${getFirebaseStorageBucketName()}/o/${encodeURIComponent(objectPath)}?alt=media`
}

