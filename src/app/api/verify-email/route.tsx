import {NextResponse} from "next/server";
import admin from "firebase-admin";

if (admin.apps.length === 0) {
  // Check if the app is already initialized
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(
        process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY as string
      ) as admin.ServiceAccount
    ),
  });
}
async function verifyEmail(userId: string) {
  try {
    // Update the emailVerified field to true
    await admin.auth().updateUser(userId, {
      emailVerified: true,
    });

    return {success: "User email verification status updated successfully."};
  } catch (error: any) {
    return {error: error.message};
  }
}

export async function POST(req: Request) {
  const {userId} = await req.json();

  try {
    await verifyEmail(userId);
    return NextResponse.json({
      success: true,
      response: "User email verification status updated successfully.",
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      response: error.message,
    });
  }
}
