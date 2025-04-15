import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
// import { readFileSync } from 'fs';

// const serviceAccountPath = './serviceAccountKey.json';

if (!admin.apps.length) {
//   const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
  const serviceAccount = {
    type: process.env.FB_TYPE,
    project_id: process.env.FB_PROJECT_ID,
    private_key_id: process.env.FB_PRIVATE_KEY_ID,
    private_key: process.env.FB_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FB_CLIENT_EMAIL,
    client_id: process.env.FB_CLIENT_ID,
    auth_uri: process.env.FB_AUTH_URI,
    token_uri: process.env.FB_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FB_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FB_CLIENT_CERT_URL,
  };
  
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
