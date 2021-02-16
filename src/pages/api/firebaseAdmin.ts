import * as admin from 'firebase-admin'

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(require('../../serviceAccount.json')),
  })
}

export const db = admin.firestore()
export const bucket = admin.storage().bucket(process.env.FIREBASE_BUCKET ?? '')
