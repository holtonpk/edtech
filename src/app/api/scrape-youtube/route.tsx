import {NextResponse} from "next/server";
// import cheerio from "cheerio";
import * as cheerio from "cheerio";

import axios from "axios";
import {getSubtitles} from "youtube-captions-scraper";

export async function POST(req: Request) {
  try {
    const requestData = await req.json();
    const url = requestData.url;
    const videoID = url.split("=")[1];
    const api_key = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY;

    const captionsRes = await getSubtitles({
      videoID: videoID, // youtube video id
      lang: "en", // default: `en`
    });

    const captions = captionsRes.map((caption: any) => caption.text);
    const transcript = captions.join(" ");
    const {data} = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoID}&fields=items(id%2Csnippet)&key=${api_key}`
    );

    const title = data.items[0].snippet.title;

    return NextResponse.json({
      id: videoID,
      title: title,
      thumbnail: `https://img.youtube.com/vi/${videoID}/0.jpg`,
      text: transcript,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({message: error});
  }
}

export async function GET() {
  try {
    const url = "https://www.youtube.com/watch?v=-1NFirxhXWE";
    const videoID = url.split("=")[1];
    const api_key = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY;

    const captionsRes = await getSubtitles({
      videoID: videoID, // youtube video id
      lang: "en", // default: `en`
    });

    const captions = captionsRes.map((caption: any) => caption.text);
    const transcript = captions.join(" ");
    const {data} = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoID}&fields=items(id%2Csnippet)&key=${api_key}`
    );

    const title = data.items[0].snippet.title;

    return NextResponse.json({
      id: videoID,
      title: title,
      thumbnail: `https://img.youtube.com/vi/${videoID}/0.jpg`,
      text: transcript,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({message: error});
  }
}
