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

export async function GET() {
  try {
    const snapshot = await db
      .collection('haikus')
      .orderBy('timestamp', 'desc')
      .get();

    const haikus = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ haikus });
  } catch (error) {
    console.error('Error fetching haikus:', error);
    return NextResponse.json({ haikus: [], error: error.message }, { status: 500 });
  }
}
