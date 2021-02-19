import * as admin from 'firebase-admin'

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(require('../serviceAccount.json')),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  })
}

export default admin
export const database = admin.database()
export const firestore = admin.firestore()
export const bucket = admin.storage().bucket(process.env.FIREBASE_BUCKET ?? '')
