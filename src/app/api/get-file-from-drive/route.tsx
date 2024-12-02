import {access} from "fs";
import {NextResponse} from "next/server";
import {GoogleDriveFile} from "@/config/data";
const realFileIdHard = "1vED3wq4PngQvV1p-QNURZEs66a4-AChwsXSczWkaq5Y";
const authTokenHard =
  "ya29.a0AeDClZA9XBZszzMGg1ABX25am8ivW3WTTYTt7Ti2v8UVb_RRUtPfHVC5BEiQKIMZhv4xJUMjnCRxMVztf76XouC4szE6fdwhYlYQl3qMbnwaW5SeC4jK8EuEXw3lWNHdxO0kBiPVJQIqNH20DDM4Mjn2p8zgLnF3GEoSSHqkaCgYKAVoSARMSFQHGX2MiFoQi8Wka_daycAhN-tqR-w0175";

async function downloadFile(
  fileId: string,
  authToken: string,
  mimeType: string
) {
  if (!authToken) {
    throw new Error("Access token is missing.");
  }
  if (!fileId) {
    throw new Error("File ID is missing.");
  }

  try {
    // Use the `export` endpoint for Google Docs files, exporting as a PDF
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=application/pdf`,
      // `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=${mimeType}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error("Failed to download file: " + errorText);
    }

    // Retrieve file data as a buffer
    const fileBuffer = await response.arrayBuffer();
    const fileBase64 = Buffer.from(fileBuffer).toString("base64"); // Encode to base64 for easy transfer

    const base64String = `data:${mimeType};base64,${fileBase64}`;

    return base64String;
  } catch (error: any) {
    console.error("Download Error:", error);
    throw new Error("File download failed: " + error.message);
  }
}

export async function POST(req: Request) {
  const requestData = await req.json();
  const token = requestData.token;
  const files = requestData.files as GoogleDriveFile[];

  try {
    const downloadedFiles = await Promise.all(
      files.map(async (file) => {
        const fileBase64 = await downloadFile(file.id, token, file.mimeType);
        return {
          name: file.name,
          file: fileBase64,
        };
      })
    );

    return NextResponse.json({
      success: true,
      files: downloadedFiles, // Return base64-encoded file data
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}

const f = [
  {
    // id: "1gYuQYce6LJycrIZHTws5ju1wmEfYL_HtKPntHpqM3UQ",
    id: "1vED3wq4PngQvV1p-QNURZEs66a4-AChwsXSczWkaq5Y",
    name: "Frizzle 1 Pager",
    mimeType: "application/vnd.google-apps.document",
  },
];

export async function GET() {
  try {
    const downloadedFiles = await Promise.all(
      f.map(async (file) => {
        const fileBase64 = await downloadFile(
          file.id,
          authTokenHard,
          file.mimeType
        );
        return {
          name: file.name,
          file: fileBase64,
        };
      })
    );

    return NextResponse.json({
      success: true,
      files: downloadedFiles, // Return base64-encoded file data
    });
  } catch (error: any) {
    console.error("Error:", error);
    const access = await checkUserAccessScopes(authTokenHard);
    return NextResponse.json({
      success: false,
      message: error.message,
      access,
    });
  }
}

const checkUserAccessScopes = async (authToken: string) => {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${authToken}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    console.error("Error checking user access scopes:", response);
    return false;
  }
  const data = await response.json();
  const scopes = data.scope.split(" ");
  return scopes;
};
