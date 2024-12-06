import {NextResponse} from "next/server";
import OpenAI from "openai";
// import {Size} from "@/config/data";
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
export const maxDuration = 300;

const calculateSize = (text: string, index: number) => {
  // Determine the font size based on the index
  const fontSize = index === 0 ? 40 : 20;

  // Set the maximum width
  const maxWidth = 960;

  // Adjust character width and line height based on whether the text is bold (index === 0)
  const charWidthMultiplier = index === 0 ? 1.2 : 0.6; // Increased multiplier for bold text
  const lineHeightMultiplier = index === 0 ? 1 : 1.4; // Increased line height for bold text

  const charWidth = fontSize * charWidthMultiplier;

  // Calculate the number of characters per line that can fit within the maxWidth
  const charsPerLine = Math.floor(maxWidth / charWidth);

  // Calculate the number of lines by dividing the total number of characters by charsPerLine
  const numLines = Math.ceil(text.length / charsPerLine);

  // Calculate the height based on the number of lines and the adjusted line height
  const lineHeight = fontSize * lineHeightMultiplier;
  const height = numLines * lineHeight;

  return {width: 960, height};
};

type Size = {
  width: number;
  height: number;
};

const calculatePosition = (previousTextBoxSize?: Size) => {
  // if its the first text box, position it at the top left
  if (!previousTextBoxSize) {
    return {x: 20, y: 20};
  } else {
    // if its not the first text box, position it below the previous text box calculate based on the previous text box size + 20px padding
    return {x: 20, y: previousTextBoxSize.height + 10};
  }
};

const formateText = (text: string, isTitle: boolean) => {
  const format = isTitle
    ? `<font style= "font-size:40px"><b>${text}</b></font>`
    : `<font style= "font-size:20px">${text}</font>`;
  return format;
};

const formatResponse = (unformattedData: UnformattedResponse) => {
  const textBoxes = unformattedData.slides.map((slide) => {
    let previousTextBoxSize: Size | undefined = undefined;
    const textBoxes = slide.textBoxes.map((textObject, index) => {
      const size = calculateSize(textObject.text, index);
      const position = calculatePosition(previousTextBoxSize);
      const textBoxId = Math.random().toString(36).substring(2, 9);
      const text = formateText(textObject.text, index === 0);
      previousTextBoxSize = size;
      return {
        text,
        size,
        position,
        textBoxId,
      };
    });
    return {
      textBoxes,
      id: slide.id,
    };
  });
  return {slides: textBoxes};
};

export async function POST(req: Request) {
  const {uploadText, selectedFormat} = await req.json();

  let slideLayout = "";

  if (selectedFormat === "less-words") {
    slideLayout = "with a max word count of 50.`";
  } else if (selectedFormat === "more-words") {
    slideLayout = "with a min word count of 100.";
  } else if (selectedFormat === "bullet-points") {
    slideLayout = "containing bullet points.";
  } else {
    slideLayout = "containing a mix of bullet points and paragraphs.";
  }

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Create presentation content based on: "${uploadText}". 
Only respond in this format: ${responseType} 
- The titleSlide.title should be a short, descriptive title. 
- The titleSlide.description should be a one-sentence overview. 
- Each slide should include a textBox for a header and text boxes ${slideLayout} with key data points or insights on the topic, ensuring clarity and engagement.
Focus on concise, impactful content that’s easy for a general audience to follow.`,
      },
    ],
    model: "gpt-4-turbo",
  });

  return NextResponse.json({
    success: true,
    response: JSON.parse(completion.choices[0].message.content || "[]"),
  });
}

export async function GET() {
  const uploadText = dummyUploadText;
  let selectedFormat = "more-words";
  let slideLayout = "";

  if (selectedFormat === "less-words") {
    slideLayout = "with a max word count of 50.`";
  } else if (selectedFormat === "more-words") {
    slideLayout = "with a min word count of 100.";
  } else if (selectedFormat === "bullet-points") {
    slideLayout = "containing bullet points.";
  } else {
    slideLayout = "containing a mix of bullet points and paragraphs.";
  }

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Create presentation content based on: "${uploadText}". 
Only respond in this format: ${responseType} 
- The titleSlide.title should be a short, descriptive title. 
- The titleSlide.description should be a one-sentence overview. 
- Each slide should include a textBox for a header and text boxes ${slideLayout} with key data points or insights on the topic, ensuring clarity and engagement.
Focus on concise, impactful content that’s easy for a general audience to follow.`,
      },
    ],
    model: "gpt-4-turbo",
  });

  return NextResponse.json({
    success: true,
    response: JSON.parse(completion.choices[0].message.content || "[]"),
  });
}

type UnformattedResponse = {
  titleSlide: {
    title: string;
    description: string;
  };
  slides: {
    textBoxes: {
      text: string;
    }[];
    id: string;
  }[];
};

const responseType = `type UnformattedResponse = {
titleSlide:{
  title: string;
  description: string;
  },
    slides: {
      textBoxes: {
        text: string;
      }[];
      id: string;
    }[];
  };
}`;

const dummyUploadText = `American Civil War Study Guide - Grade 8 Overview The American Civil War, fought from 1861 to 1865, was a pivotal conflict in United States history. It was primarily between the Northern states (the Union) and the Southern states that seceded to form the Confederate States of America. Key Topics 1. Causes of the Civil War Economic Differences: Industrial North vs. Agricultural South. Slavery: Central issue, differing views on morality and economics of slavery. States' Rights: Debate over the power of federal vs. state governments. Key Events: Missouri Compromise, Compromise of 1850, Kansas-Nebraska Act, Dred Scott Decision. 2. Major Battles and Campaigns First Battle of Bull Run: First major battle, showed that the war would be long and costly. Battle of Gettysburg: Turning point of the war, Union victory that stopped Confederate invasion of the North. Siege of Vicksburg: Gave the Union control of the Mississippi River. Sherman's March to the Sea: Devastating total war strategy used by the North to break the Southern will to fight. 3. Important Figures Abraham Lincoln: President of the United States, led the Union. Jefferson Davis: President of the Confederate States of America. Ulysses S. Grant: Union general, later became the 18th President of the U.S. Robert E. Lee: Confederate general, known for his leadership in several major battles. 4. Emancipation Proclamation Issued by Lincoln in 1863: Declared the freedom of all slaves in Confederate-held territory. Impact: Changed the moral and political stakes of the Civil War, allowing Union to recruit African American soldiers. 5. End of the War and Reconstruction Appomattox Court House: Site of Lee's surrender to Grant in 1865, marking the end of the Civil War. Reconstruction: Period following the war, focused on rebuilding the South and integrating freed slaves into society. Amendments: 13th (abolished slavery), 14th (citizenship and equal protection under the law), and 15th (voting rights regardless of race). Study Tips Review Key Dates and Events: Helps in understanding the sequence and impact of events. Understand Key Figures' Contributions: Knowing what each person contributed can help contextualize the war. Use Flashcards: For memorizing important terms and definitions. Practice with Timelines: Helps visualize the chronological order of events. Sample Questions What were the main economic differences between the North and the South? Explain the significance of the Emancipation Proclamation. Describe the effects of the American Civil War on the southern states.
`;
