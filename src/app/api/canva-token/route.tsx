// /pages/api/canva-auth.js
import {NextResponse} from "next/server";

export async function POST(req: Request) {
  try {
    const requestData = await req.json();
    const {code, codeVerifier} = requestData;

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code_verifier", codeVerifier);
    params.append("code", code);
    params.append("redirect_uri", "http://127.0.0.1:3000/canva-redirect");

    // Create the Basic authorization header

    const clientId = "OC-AZL0x6smOLHY";
    const clientSecret = process.env.NEXT_PUBLIC_CANVA_PRIVATE;

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64"
    );

    // Fetch access token from Canva's API
    const tokenResponse = await fetch(
      "https://api.canva.com/rest/v1/oauth/token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    if (!tokenResponse.ok) {
      throw new Error(`Token exchange failed: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();

    return NextResponse.json(tokenData);
  } catch (e) {
    console.error(e);
    return NextResponse.json({success: false});
  }
}
