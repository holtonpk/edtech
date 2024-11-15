import {NextResponse} from "next/server";
const fs = require("fs");
export const maxDuration = 300;
async function checkJobStatus(jobId: string, token: string) {
  const statusUrl = `https://api.canva.com/rest/v1/imports/${jobId}`;
  const delay = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));

  while (true) {
    const statusRes = await fetch(statusUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const statusData = await statusRes.json();
    console.log("Job Status:", statusData.job.status);

    if (statusData.job.status === "success") {
      // Extract and return the edit_url
      const editUrl = statusData.job.result.designs[0].urls.edit_url;
      return {success: true, edit_url: editUrl};
    } else if (statusData.job.status === "failed") {
      return {success: false, error: statusData.job.error};
    }

    // Wait before checking again
    await delay(2000); // Poll every 2 seconds
  }
}

export async function POST(req: Request) {
  try {
    const requestData = await req.json();
    const {token} = requestData;

    const res = await fetch("https://api.canva.com/rest/v1/imports", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Length": fs.statSync("public/MyAwesomeDesign.pptx").size,
        "Content-Type": "application/octet-stream",
        "Import-Metadata": JSON.stringify({
          title_base64: "TXkgQXdlc29tZSBEZXNpZ24g8J+YjQ==",
          mime_type:
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        }),
      },
      body: fs.createReadStream("public/MyAwesomeDesign.pptx"),
      duplex: "half" as any,
    } as RequestInit);

    const data = await res.json();

    // If the initial request is successful, check the job status
    if (data.job && data.job.status === "in_progress") {
      const result = await checkJobStatus(data.job.id, token);
      return NextResponse.json(result);
    } else {
      return NextResponse.json({
        success: false,
        message: "Job creation failed",
      });
    }
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({success: false, error: error.message});
  }
}
