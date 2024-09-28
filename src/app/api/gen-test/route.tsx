import {NextResponse} from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

//  this is for another project and shouldn't be here
export async function GET() {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "`/gen-test`:\n\n```javascript\n// pages/api/gen-test.js\n\nexport default function handler(req, res) {\n  res.status(200).json({ message: 'Success' });\n}\n```\n\nSave this file as `gen-test.js` in the `pages/api` directory of your Next.js project. This will create an endpoint accessible at `/api/gen-test`.",
      },
    ],
    model: "gpt-4o",
  });

  return NextResponse.json({
    success: true,
    response: completion.choices[0].message.content,
  });
}

export async function POST(req: Request) {
  const {
    testName,
    studyMaterialText,
    gradeLevel,
    numOfQuestions,
    answerChoices,
    variants,
  } = await req.json();

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Respond in json format with the following type: ${testResponseTypeString}. Create a test for ${gradeLevel} grade student. The test should have ${numOfQuestions} questions with ${answerChoices} answer choices. The study material for the test is as follows: ${studyMaterialText}`,
      },
    ],
    model: "gpt-4-turbo",
  });

  return NextResponse.json({
    success: true,
    response: completion.choices[0].message.content,
  });
}

const dummyData = {
  testName: "Civil war unit 1 test",
  studyMaterialText:
    "American Civil War Study Guide - Grade 8  Overview  The American Civil War, fought from 1861 to 1865, was a pivotal conflict in United  States history. It was primarily between the Northern states (the Union) and the  Southern states that seceded to form the Confederate States of America.  Key Topics  1. Causes of the Civil War  Economic Differences: Industrial North vs. Agricultural South.  Slavery: Central issue, differing views on morality and economics of slavery.  States' Rights: Debate over the power of federal vs. state governments.  Key Events: Missouri Compromise, Compromise of 1850, Kansas-Nebraska Act, Dred  Scott Decision.  2. Major Battles and Campaigns  First Battle of Bull Run: First major battle, showed that the war would be long and costly.  Battle of Gettysburg: Turning point of the war, Union victory that stopped Confederate  invasion of the North.  Siege of Vicksburg: Gave the Union control of the Mississippi River.  Sherman's March to the Sea: Devastating total war strategy used by the North to break  the Southern will to fight.  3. Important Figures  Abraham Lincoln: President of the United States, led the Union.  Jefferson Davis: President of the Confederate States of America.  Ulysses S. Grant: Union general, later became the 18th President of the U.S.  Robert E. Lee: Confederate general, known for his leadership in several major battles.  4. Emancipation Proclamation  Issued by Lincoln in 1863: Declared the freedom of all slaves in Confederate-held  territory.  Impact: Changed the moral and political stakes of the Civil War, allowing Union to recruit  African American soldiers.  5. End of the War and Reconstruction  Appomattox Court House: Site of Lee's surrender to Grant in 1865, marking the end of  the Civil War.  Reconstruction: Period following the war, focused on rebuilding the South and  integrating freed slaves into society. Amendments: 13th (abolished slavery), 14th (citizenship and equal protection under the  law), and 15th (voting rights regardless of race).  Study Tips  Review Key Dates and Events: Helps in understanding the sequence and impact of  events.  Understand Key Figures' Contributions: Knowing what each person contributed can help  contextualize the war.  Use Flashcards: For memorizing important terms and definitions.  Practice with Timelines: Helps visualize the chronological order of events.  Sample Questions What were the main economic differences between the North and the South?  Explain the significance of the Emancipation Proclamation.  Describe the effects of the American Civil War on the southern states.",
  gradeLevel: "8",
  numOfQuestions: 10,
  answerChoices: "multi",
  variants: 1,
};

export const testResponseTypeString = `{
    
    multiChoiceQuestions?: {
      question: string;
      choices: string[];
      answer: string;
    }[];
    openEndedQuestions?: {
      question: string;
      answer: string;
    }[];
  }`;
