// /pages/api/canva-auth.js
import {NextResponse} from "next/server";

export async function POST(req: Request) {
  try {
    const requestData = await req.json();
    const {code} = requestData;
    const codeVerifier = sessionStorage.getItem("code_verifier"); // Retrieve the code verifier

    const tokenResponse = await fetch("https://www.canva.com/api/oauth/token", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        client_id: "OC-AZLz4cnziII1",
        redirect_uri: "https://edtech-lac.vercel.app/",
        grant_type: "authorization_code",
        code_verifier: codeVerifier,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();
    // Handle the access token (store, use for API calls, etc.)

    return NextResponse.json(tokenData);
  } catch (e) {
    console.error(e);
    return NextResponse.json({success: false});
  }
}
