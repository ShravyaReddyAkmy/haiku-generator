import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
// import { readFileSync } from 'fs';

// const serviceAccountPath = './serviceAccountKey.json';

if (!admin.apps.length) {
  // const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
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
