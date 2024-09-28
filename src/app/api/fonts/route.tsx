import {NextResponse} from "next/server";

export async function GET() {
  const API_KEY = "AIzaSyAJIjZPPgwJm6zOiO_x1iTftFwYvffOVDU";
  const url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}&sort=popularity`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const fonts = data.items.map((item: any) => item.family);

    console.log("fonts", fonts);

    return NextResponse.json({
      success: true,
      fonts,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch fonts from Google Fonts API",
      },
      {status: 500}
    );
  }
}
