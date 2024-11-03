import {Storage} from "@google-cloud/storage";
import {NextResponse} from "next/server";
import {PassThrough} from "stream";
import ffmpeg from "fluent-ffmpeg";
import path from "path";

const ffmpegPath = path.resolve(
  process.cwd(),
  "node_modules",
  "ffmpeg-static",
  "ffmpeg"
);

ffmpeg.setFfmpegPath(ffmpegPath);

const convertVideoToAudio = async (fileName: string) => {
  try {
    const bucketName = "ai-teacher-79270.appspot.com";
    const outputFileName = `${fileName}-audio.mp3`;

    // get download url from firebase storage
    const storage = new Storage({
      projectId: "ai-teacher-79270",
      credentials: credentials,
    });

    const bucket = storage.bucket(bucketName);

    const [url] = await storage
      .bucket(bucketName)
      .file(fileName)
      .getSignedUrl({
        action: "read",
        expires: Date.now() + 1000 * 60 * 60,
      });

    const passThrough = new PassThrough();

    const uploadStream = bucket.file(outputFileName).createWriteStream({
      metadata: {
        contentType: "audio/mpeg",
      },
      resumable: false,
    });

    const uploadPromise = new Promise((resolve, reject) => {
      uploadStream.on("finish", resolve);
      uploadStream.on("error", reject);
    });

    ffmpeg()
      .input(url)
      .outputOptions("-ab", "192k")
      .toFormat("mp3")
      .pipe(passThrough)
      .on("progress", (progress) => {
        console.log(`Processing: ${JSON.stringify(progress)}% done`);
      })
      .on("end", () => {
        console.log("FFmpeg has finished.");
      })
      .on("error", (error) => {
        console.error("an error occored", error);
      });
    passThrough.pipe(uploadStream);

    // Wait for the upload to complete
    await uploadPromise;

    // Get the public URL for the uploaded file
    const [publicUrl] = await bucket.file(outputFileName).getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
    });

    return outputFileName;
  } catch (error) {
    console.error("Error:", error);
  }
};

export async function POST(req: Request) {
  try {
    const requestData = await req.json();
    const fileName = requestData.fileName;

    const audioFile = await convertVideoToAudio(fileName);

    console.log("audioFile", audioFile);

    const response = await fetch(
      "http://localhost:3000/api/convert-audio-to-text",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({fileName: audioFile}),
      }
    );

    const data = await response.json();

    // Assuming getTextFromJSON returns a promise that resolves with the extracted text
    const transcription = data.text;

    return NextResponse.json({success: true, text: transcription});
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({success: false, error: error.message});
  }
}

export async function GET() {
  try {
    const fileName = "dr61s6";
    const audioFile = await convertVideoToAudio(fileName);

    console.log("audioFile", audioFile);

    const response = await fetch(
      "http://localhost:3000/api/convert-audio-to-text",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({fileName: audioFile}),
      }
    );

    const data = await response.json();

    // Assuming getTextFromJSON returns a promise that resolves with the extracted text
    const text = data.text;

    return NextResponse.json({success: true, text: text});
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({success: false, error: error.message});
  }
}

const credentials = {
  type: "service_account",
  project_id: "ai-teacher-79270",
  private_key_id: "bb96df32cb3511d524007e1a4862f66b714eb5c0",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDNwzc+H8M6uAqc\n5tJ3tsiQ9Xwoh5ArX+nIG3alBoOOl7VwErgk8K8snaWIjK3ajGicPJJFxmJruYax\nU1+N0dgO3jtLgVvQVrFhBH+p3NxvLJkhgj/t0YbS5THKMV6ujXRfF6nua0TxNncy\nXPvR/yikVNDStmWhchsNL1wT/pHgRnX8d961eFb0pUPdFtyX3MDoat6MI49uU4y8\n1MLS1TJp16ft2M0wkwlDkTyWsp2Hzdd2u1BNTspfX/VSszH1xhMJ2jZVFIApTGgJ\n5ZeT+dbTi9Z8qfS8yMpCk/m+ezwtlo9CuMy1gboRsU9EQ/uQVnsHtGqFZJ4HRzl9\nlj6xl9sTAgMBAAECggEAJeuqTKqx4ip02kG33BQ1lnGHdji1myjL/vMAxJ0UtbzD\n1Wm9wiERR5muHiI/EB38UX7gPje3f77rUdbZr1tTBDp0lw+6CgVQH18i3/0yKtL/\nTauheIS64jcXG/pJRsYPAk9sI+JlDEdLZF66khMCPHbdHVg8FqrezWlDAPRTkg9V\nmD8oQUVOzaDvkIEBFkJ9oCcGH609hZ8srPFH9lNe+2gPhFZSoUE1MuWK+U1boUWO\n4l3g+WZIAC8xKvL/DO0iyJjRRCFDedLlejXtdqvUiufY+8xko1yklfjfjJhZMMAY\nR3hlzwTin0XkjlXm1eY8tnZtxnZxMwAQqQ8YvToGwQKBgQDvMEB2/i3WMkWZtg3f\nJCOwUBxCpO6asEGSE/9qLDL0aBIyXaVE9otXXoeTexPhqJZGw2rYAbci46Qg3hci\noG04N2SdEbwdGtM0HMahTTORspJvcjMH/I2sUqwFYoaCbcAdKuiiR+0bVY9o9aKV\nFY7IC5kIuO4F9WPE24QCgauGowKBgQDcOYb2cBVM7/34YEBG2L/6HTCBZNNC75F8\nPyc6DYf5calrS9Prbk0/xor0zO9iac+TlaqxMxBP5LYUFOMQpi7Z8AOyVqoVPusq\nPNQw5ASk3/AfBp7DYeIudOYDwinC7MmUT9cBiHEamTDzvYQVTgjiPG63ypfrrU9Z\nI8sQj1RQ0QKBgHCyvH0UkEZPU4n0RJ7x6Trm1Bn2mlIaYBrS/1JoVu3fp0tB4mAX\nBlp5OModgKWfiIb5BnuWe1KeDbRK0H3JNwz41JhJReg0vnTcZh6UQIsSp3qJRVAr\nCBm8rj6vSI9l5NIZaJkl6KsrajHbIuq5yJerF0UL1WLLV2HmyFFiBY6fAoGALItW\nSTKSnGVOsZaGac4dxrFwxjtmn/tlKgR8Irnp7wKWiiVkUBKXfXbjVHC/WuCcI/X5\n+K2jdwWD7rvq0ctLXrm1hbUR4go/9uMm6Fy2s8K4Bw6Hvm1mGo96lvgHCm5qt50O\nmDjI5+Bkjmie9tA568jdfD92Sy1bB2S+BjN3koECgYEAqle1mTE9RtnWawSbk+JN\n3dcrEOJEymOJOyC+mG+9wPPuiRzviDV3eE72wR0O4YCsB3QAWCXdi1Amg0wziYH/\nOqG8Df0t46C0NZbpEU4x8VtmcdwE9jND8da5Eu0yQnNNVTInRjsO2ezFmUTiNHlA\nRXSOHJ3uNpAoFfEqRcqTl9E=\n-----END PRIVATE KEY-----\n",
  client_email: "ai-teacher-79270@appspot.gserviceaccount.com",
  client_id: "102479765070592543300",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/ai-teacher-79270%40appspot.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

// // Usage

// export async function GET() {
//   try {
//     // Imports the Google Cloud client libraries
//     const speech = require("@google-cloud/speech").v1p1beta1;

//     // Creates a client

//     const bucketName = "ai-teacher-79270.appspot.com";
//     const fileName = "dr61s6";
//     const gcsSourceUri = `gs://${bucketName}/${fileName}`;

//     // const filename = 'Local path to audio file, e.g. /path/to/audio.raw';
//     const model = "video";
//     const encoding = "MP3";
//     const sampleRateHertz = 16000;
//     const languageCode = "en-US";

//     const config = {
//       encoding: encoding,
//       sampleRateHertz: sampleRateHertz,
//       languageCode: languageCode,
//       model: model,
//     };
//     const audio = {
//       uri: gcsSourceUri,
//     };

//     const request = {
//       config: config,
//       audio: audio,
//     };

//     // Detects speech in the audio file.
//     const [operation] = await client.longRunningRecognize(request);
//     const [response] = await operation.promise();

//     const transcription = response.results
//       .map((result) => result.alternatives[0].transcript)
//       .join("\n");
//     console.log("Transcription: ", transcription);

//     return NextResponse.json({
//       success: true,
//       result: JSON.stringify(response.results),
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json({sucess: false});
//   }
// }
