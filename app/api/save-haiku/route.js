import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccountPath = './serviceAccountKey.json';

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export async function POST(req) {
  const { haiku, keywords } = await req.json();

  try {
    const docRef = await db.collection('haikus').add({
      haiku,
      keywords,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('Error saving haiku:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
