import {NextResponse} from "next/server";
import OpenAI from "openai";
import {Size} from "@/config/data";
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const {uploadText, description} = await req.json();

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Respond only in the following json type: ${responseType}.Respond with 3 different versions.Text should be formatted in html. Apply the following changes :${description}. to the following text:${uploadText}`,
      },
    ],
    model: "gpt-4-turbo",
  });

  return NextResponse.json({
    success: true,
    response:
      // DummyResponse
      JSON.parse(completion.choices[0].message.content),
  });
}

export async function GET() {
  const uploadText = dummyUploadText;
  const description = "add more details";

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Respond only in the following json type: ${responseType}.Respond with 3 different versions. Apply the following changes :${description}. to the following text:${uploadText}`,
      },
    ],
    model: "gpt-4-turbo",
  });

  return NextResponse.json({
    success: true,
    response:
      // JSON.parse(completion.choices[0].message.content),
      JSON.parse(completion.choices[0].message.content),
  });
}

const responseType = `type Responses = {
id:number;
        text: string;
    }[];`;

// export const testResponseTypeString = JSON.stringify(responseFormat);

const dummyUploadText = `The American Civil War, a pivotal conflict from 1861 to 1865, saw the Northern states (the Union) clashing with the Southern states that seceded to form the Confederate States of America.`;
