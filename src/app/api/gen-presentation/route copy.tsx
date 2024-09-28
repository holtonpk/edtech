import {NextResponse} from "next/server";
import OpenAI from "openai";
import {Size} from "@/config/data";
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

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
    ? `<p style= "font-size:40px"><b>${text}</b></p>`
    : `<p style= "font-size:20px">${text}</p>`;
  return format;
};

const formatResponse = (unformattedData: UnformattedResponse) => {
  const textBoxes = unformattedData.slideData.slides.map((slide) => {
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
  const {
    testName,
    uploadText,
    description,
    numOfSlides,
    answerChoices,
    variants,
  } = await req.json();

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Respond only in the following json type: ${responseFormat}. Create a presentation with the following in mind ${description}. The presentation should have ${numOfSlides} slides. ${
          uploadText
            ? `The material for the presentation is as follows:${uploadText}`
            : ""
        }`,
      },
    ],
    model: "gpt-4-turbo",
  });

  return NextResponse.json({
    success: true,
    response: formatResponse(
      // DummyResponse
      JSON.parse(completion.choices[0].message.content) as UnformattedResponse
    ),
  });
}

export async function GET() {
  const description =
    "Create a presentation on the American Civil War for an 8th-grade history class.";
  const numOfSlides = "5";
  const studyMaterialText = "no material provided";

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Respond only in JSON format in the following json type: ${responseType}. Create a presentation with the following in mind ${description}. The test should have ${numOfSlides} slides.`,
      },
    ],
    model: "gpt-4-turbo",
  });

  return NextResponse.json({
    success: true,
    response:
      // JSON.parse(completion.choices[0].message.content),
      formatResponse(
        JSON.parse(completion.choices[0].message.content) as UnformattedResponse
      ),
  });
}

const dummyData = {
  title: "Civil war unit 1 test",
  studyMaterialText:
    "American Civil War Study Guide - Grade 8  Overview  The American Civil War, fought from 1861 to 1865, was a pivotal conflict in United  States history. It was primarily between the Northern states (the Union) and the  Southern states that seceded to form the Confederate States of America.  Key Topics  1. Causes of the Civil War  Economic Differences: Industrial North vs. Agricultural South.  Slavery: Central issue, differing views on morality and economics of slavery.  States' Rights: Debate over the power of federal vs. state governments.  Key Events: Missouri Compromise, Compromise of 1850, Kansas-Nebraska Act, Dred  Scott Decision.  2. Major Battles and Campaigns  First Battle of Bull Run: First major battle, showed that the war would be long and costly.  Battle of Gettysburg: Turning point of the war, Union victory that stopped Confederate  invasion of the North.  Siege of Vicksburg: Gave the Union control of the Mississippi River.  Sherman's March to the Sea: Devastating total war strategy used by the North to break  the Southern will to fight.  3. Important Figures  Abraham Lincoln: President of the United States, led the Union.  Jefferson Davis: President of the Confederate States of America.  Ulysses S. Grant: Union general, later became the 18th President of the U.S.  Robert E. Lee: Confederate general, known for his leadership in several major battles.  4. Emancipation Proclamation  Issued by Lincoln in 1863: Declared the freedom of all slaves in Confederate-held  territory.  Impact: Changed the moral and political stakes of the Civil War, allowing Union to recruit  African American soldiers.  5. End of the War and Reconstruction  Appomattox Court House: Site of Lee's surrender to Grant in 1865, marking the end of  the Civil War.  Reconstruction: Period following the war, focused on rebuilding the South and  integrating freed slaves into society. Amendments: 13th (abolished slavery), 14th (citizenship and equal protection under the  law), and 15th (voting rights regardless of race).  Study Tips  Review Key Dates and Events: Helps in understanding the sequence and impact of  events.  Understand Key Figures' Contributions: Knowing what each person contributed can help  contextualize the war.  Use Flashcards: For memorizing important terms and definitions.  Practice with Timelines: Helps visualize the chronological order of events.  Sample Questions What were the main economic differences between the North and the South?  Explain the significance of the Emancipation Proclamation.  Describe the effects of the American Civil War on the southern states.",
  gradeLevel: "8",
  numOfSlides: 5,
};

type UnformattedResponse = {
  slideData: {
    slides: {
      textBoxes: {
        text: string;
      }[];
      id: string;
    }[];
  };
};

const responseType = `type UnformattedResponse = {
  slideData: {
    slides: {
      textBoxes: {
        text: string;
      }[];
      id: string;
    }[];
  };
}`;

const DummyResponse = {
  slideData: {
    slides: [
      {
        textBoxes: [
          {text: "Introduction to the American Civil War"},
          {
            text: "The American Civil War, fought from 1861 to 1865, was a pivotal conflict in United States history. It stemmed primarily from issues of slavery and states' rights and was fought between the Northern states (Union) and the Southern states (Confederate States of America). This war resulted in significant social, economic, and political changes in the United States.",
          },
        ],
        id: "1",
      },
      {
        id: "2",
        textBoxes: [
          {text: "Causes of the Civil War"},
          {
            text: "The primary causes of the Civil War include the economic and social differences between the North and the South, the fight between Slave and Non-Slave State Proponents, growth of the Abolition Movement, and the election of Abraham Lincoln in 1860. The South feared that Lincoln would abolish slavery, leading to Southern states seceding from the Union.",
          },
        ],
      },
      {
        id: "3",
        textBoxes: [
          {text: "Major Battles and Turning Points"},
          {
            text: "Key battles of the Civil War include the Battle of Gettysburg, the Battle of Antietam, and Sherman's March to the Sea. The Battle of Gettysburg was particularly significant as it represented the turning point of the war, leading to the ultimate victory of the Union forces. These battles were crucial in weakening Confederate forces both strategically and morally.",
          },
        ],
      },
      {
        textBoxes: [
          {text: "The Emancipation Proclamation"},
          {
            text: "In 1863, President Abraham Lincoln issued the Emancipation Proclamation, which declared the freedom of all slaves in Confederate-held territory. This was a crucial step in abolishing slavery in America and redefined the purpose of the war. The proclamation also allowed African Americans to join the Union Army and Navy, adding further strength to the Union's forces.",
          },
        ],
        id: "4",
      },
      {
        id: "5",
        textBoxes: [
          {text: "Impact and Legacy of the Civil War"},
          {
            text: "The Civil War had profound impacts on America. It led to the abolition of slavery (13th Amendment), strengthened the federal government, and laid the groundwork for the Reconstruction era. The war also had lasting effects on the American social fabric and the economy. It remains one of the most significant events in American history.",
          },
        ],
      },
    ],
  },
};

const responseFormat = {
  slides: [
    {
      textBoxes: [
        {text: "Introduction to the American Civil War"},
        {
          text: "The Civil War had profound impacts on America. It led to the abolition of slavery (13th Amendment), strengthened the federal government, and laid the groundwork for the Reconstruction era. The war also had lasting effects on the American social fabric and the economy. It remains one of the most significant events in American history.",
        },
      ],
      id: "1",
    },
  ],
};

const responseFormatFull = {
  slides: [
    {
      textBoxes: [
        {
          text: '<font size="7">The American Civil War</font>',
          size: {width: 800, height: 90},
          position: {x: 20, y: 20},
          textBoxId: "h7wt42k",
        },
        {
          text: '<font size="5">The American Civil War, occurring from 1861 to 1865, was a defining conflict in U.S. history, primarily fought between the Northern states (Union) and Southern states that seceded to form the Confederate States of America. Key issues included economic differences, slavery, and states\' rights.</font>',
          size: {width: 700, height: 200},
          position: {x: 20, y: 100},
          textBoxId: "k8sh36s",
        },
      ],
      background: "#ffffff",
      id: "1",
    },
  ],
};

export const testResponseTypeString = JSON.stringify(responseFormat);
