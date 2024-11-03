// /pages/api/canva-auth.js
import {NextResponse} from "next/server";

export async function POST(req: Request) {
  try {
    const requestData = await req.json();
    const code = requestData.fileName;
    const clientId = "OC-AZLz4cnziII1";
    const redirectUri = "https://edtech-lac.vercel.app/";

    const codeVerifier = sessionStorage.getItem("code_verifier");

    if (!codeVerifier) {
      return NextResponse.json({success: false});
    }

    const tokenResponse = await fetch("https://www.canva.com/api/oauth/token", {
      method: "POST",
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code_verifier: codeVerifier, // Now guaranteed to be a string
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    return NextResponse.json(tokenData);
  } catch (e) {
    console.error(e);
    return NextResponse.json({success: false});
  }
}
