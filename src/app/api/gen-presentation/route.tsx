import {NextResponse} from "next/server";
import OpenAI from "openai";
import {Size} from "@/config/data";
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const {uploadText, description, numOfSlides} = await req.json();

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Respond only in the following json type: ${responseType}. Create a presentation with the following in mind ${description}. The presentation should have ${numOfSlides} slides. Each slide should have one text box with a title and one or more text boxes with body text. Text should be formatted in html. The presentation should help teach the following material:${uploadText}`,
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
  const description = "a fun engaging presentation for may 5th grade class";
  const numOfSlides = "5";

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Respond only in the following json type: ${responseType}. Create a presentation with the following in mind ${description}. The presentation should have ${numOfSlides} slides. The material for the presentation is as follows:${uploadText}`,
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

const responseType = `type UnformattedResponse = {
    slides: {
      textBoxes: {
        text: string;
      }[];
    }[];
  };
}`;

// export const testResponseTypeString = JSON.stringify(responseFormat);

const dummyUploadText = `Throughout my years, I’ve been captivated by the stories that shape our  world – tales of determination, of individuals rising against odds, of  dreams sculpting realities. The world is teeming with success stories, each  as unique as the fingerprints of those who forged them. But as I navigated  my way through countless tales of triumphs and trials, I noticed a void.  While there were countless expansive biographies and technical business  texts, there was a lack of compelling narratives that could inspire us in  mere minutes. I envisioned a collection that could be savored during brief  moments stolen from a bustling day—a coffee break, a short commute, or  those fleeting minutes before sleep.  “Snapshots of Success” is the culmination of that vision. It is  a passion project, fueled by my deep respect for the indomitable spirit  of entrepreneurs and an earnest desire to offer nuggets of inspiration to  dreamers everywhere. Every narrative chosen, every entrepreneur’s story  penned down, has been a personal journey for me, intertwining my pas -  sion for storytelling with my respect for the world’s changemakers. This is  not just a book; it’s a labor of love, capturing the essence of the entrepre -  neurial journey.  Preface Justin Kan  Bernard Arnault  Tyler Perry  Ray Kroc  Elon Musk  Mrs. B  Howard Schultz  Michael Dell  Austin Russell  Mr. Beast  Richard Branson  Pavel Durov  Reed Hastings  Tope Awotona  Ingvar Kamprad  Travis Kalanick  Whitney Wolfe Herd  Jan Koum  The Collison Brothers  Masayoshi Son  Peter Thiel  Michael Rubin  Mark Zuckerberg  Sophia Amoruso  Palmer Luckey  Jamie Siminoff  Phil Knight  Shahid Khan  Dave Portnoy  Tony Xu  Stewart Butterfield  Henry Ford  Felix Dennis  Dana White  Oprah Winfrey  Jeff Bezos  Samwer Brothers  Ben Francis  Steve Ells  Luis von Ahn  Walt Disney  Mark Cuban  Sam Altman  Marc Lore  Flexport  Rocket Labs  Melanie Perkins  Apoorva Mehta  Steve Jobs  Sam Zemurray  1   80  4   83  14   93  7   86  10   89  17   96  20   99  23   102  26   105  29   108  33   111  36   114  39   118  42   121  45   125  48   129  53   133  56   136  59   139  62   142  65   145  68   148  71   151  74   154  77   157  Contents Entrepreneurship is about more than just profits and losses. It is about  heartbeats, relentless pursuits, and the unyielding spirit that rises from  failures to embrace success. “Snapshots of Success” is a curated journey  through the tapestry of such dreams and realities. Through these pages,  you will traverse the lives of 50 trailblazers, witnessing their lowest lows  and their highest highs. You will delve deep into the moments of doubt,  the leaps of faith, and the tireless perseverance that define each journey.  You will read stories of people who, just like you, started with a dream,  navigated through storms and transformed their vision into ventures that  left an indelible mark on the business realm.  But more than the tales of their success, this collection seeks to  unveil the person behind the business, making it a profoundly human  experience. The ethos of this book is to inspire, but also to remind readers  that success isn’t just about the destination; it’s profoundly about the jour -  ney. Whether you’re an aspiring entrepreneur at the cusp of a new venture  or a seasoned veteran seeking a spark of inspiration, these tales promise  insights, lessons, and above all, a reflection of a human’s innate drive to  create, conquer, and thrive.  Introduction 1  This college student’s seemingly silly idea exploded into an online revolu -  tion. A hat, a camera, and a vision led to a nearly billion-dollar handshake.  Let’s uncover the mastermind behind the game-changer.  After graduating from Yale with a double major in physics and  philosophy, Justin Kan, armed with a curious mind and a desire to make  his mark in the world, embarked on a path that would change the face of  live streaming and gaming forever.  The story began when Justin launched Justin.tv, a platform where  he lifecasted every moment of his daily life using a camera affixed to his  cap. This concept of “lifecasting” was novel and quickly captured the  world’s attention. Media outlets clamored for interviews with Justin to  delve deeper into this fascinating idea and the platform itself.  Justin Kan  1 2  However, as Justin explored the possibilities of his creation, he  realized its potential beyond just lifecasting. Together with his friends  Emmett Shear, Michael Seibel, and Kyle Vogt, he relaunched Justin.tv in  2007, this time allowing other users to create their own channels and lives -  tream anything they wanted.  The platform’s popularity soared as it attracted millions of viewers  to watch everything from football to UFC. Within a year, Justin.tv boast -  ed over 30,000 broadcasting accounts and started expanding its horizons,  adding various categories to cater to a diverse audience. Among these new  categories, gaming streams emerged as the most popular and compelling  content, attracting a massive and dedicated following.  The success of gaming streams inspired Justin to create a dedi -  cated platform for gamers. Thus, on June 6, 2011, Twitch.tv was born, a  live streaming service exclusively for gaming enthusiasts. Twitch quickly  became a sensation in the gaming community, drawing over 35 million  unique visitors every month by 2013. The platform’s meteoric rise earned  it a place as a leader in the industry.  The burgeoning popularity of Twitch led to significant changes  within the parent company, Justin.tv, Inc. After three years of operating  as an offshoot of Justin.tv, Twitch took over as the primary brand and the  company rebranded to Twitch Interactive in 2014, signaling a shift in fo -  cus and resources towards Twitch as their primary offering. Twitch contin -  ued to flourish, captivating millions with gameplay streams and transform -  ing gamers into online celebrities.  Not long after, the Twitch team announced that they would delete  all of Justin.tv’s archived content, which marked the true beginning of the  end for Justin.tv. Around this time, rumors began circulating that Google  and YouTube were both interested in acquiring Twitch. Finally, on August 3  5, 2014, Justin.tv’s co-founders announced that they were shutting down  their original platform for good.  Less than a month later, Amazon announced that it had acquired  Twitch for a jaw-dropping $970 million. It’s estimated that each of the  four Twitch founders owned around 12.5% of Twitch at the time it sold.  That means Justin’s pre-tax cut would have been around $120 million.  After cashing out of Twitch, Justin went on to found multiple other  successful ventures including Socialcam, a video sharing app that was  acquired for a remarkable $60 million just a year after launch.  Today, Justin can be found pouring his millions into what he be -  lieves is the next big thing; Web 3 Gaming.  1 Lesson For You: “First they ignore you, then  they laugh at you, then they fight you, then you  win.”  - Mahatma Gandhi`;
