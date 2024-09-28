"use client";
import React, {useEffect} from "react";
import {Size} from "@/config/data";
const Page = () => {
  const [selectedSlide, setSelectedSlide] = React.useState(0);

  const [formattedSlides, setFormattedSlides] = React.useState();

  useEffect(() => {
    const formattedSlides = DummyResponse.slides.map((slide) => {
      let previousTextBoxSize:
        | undefined
        | {
            size: {
              width: number;
              height: number;
            };
            position: {
              x: number;
              y: number;
            };
          } = undefined;
      const textBoxes = slide.textBoxes.map((textBox, index) => {
        const text = formateText(textBox.text, index === 0);
        const size = calculateSize(text, index);
        let position;
        if (index === 0) {
          position = {x: 20, y: 20};
        } else {
          if (!previousTextBoxSize) return;
          position = calculatePosition(previousTextBoxSize);
        }
        const fontSize = index === 0 ? 40 : 20;
        previousTextBoxSize = {size, position};
        return {text, position, size, fontSize};
      });

      return {...slide, textBoxes};
    });
    setFormattedSlides(formattedSlides);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <div className="flex">
        {DummyResponse.slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => setSelectedSlide(index)}
            className={`${
              selectedSlide === index ? "bg-blue-500" : "bg-blue-300"
            } p-2 m-2`}
          >
            {index}
          </button>
        ))}
      </div>
      <div className="w-[1000px] aspect-[16/9] border relative">
        {formattedSlides && (
          <>
            {formattedSlides[selectedSlide].textBoxes.map((textBox, index) => (
              <div
                key={index}
                className={`absolute  border-primary 
                    ${index === 0 ? "b-b" : "b-r"}
                    `}
                style={{
                  top: textBox.position.y,
                  left: textBox.position.x,
                  width: textBox.size.width,
                  height: "fit-content",
                  fontSize: textBox.fontSize,
                }}
                dangerouslySetInnerHTML={{__html: textBox.text}}
              >
                {/* <div className="absolute top-0 right-0 text-sm bg-background">
                  x:{textBox.position.x}, y:{textBox.position.y}, w:
                  {textBox.size.width}, h:{textBox.size.height}
                </div> */}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Page;

const formateText = (text: string, isTitle: boolean) => {
  const format = isTitle ? `<p><b>${text}</b></p>` : `<p>${text}</p>`;
  return format;
};

const calculatePosition = (previousTextBox: {
  size: {
    height: number;
    width: number;
  };
  position: {
    x: number;
    y: number;
  };
}) => {
  // if its the first text box, position it at the top left
  if (!previousTextBox) {
    return {x: 20, y: 20};
  } else {
    console.log("previousTextBoxSize", previousTextBox.size.height + 30);
    // if its not the first text box, position it below the previous text box calculate based on the previous text box size + 20px padding
    return {
      x: 20,
      y: previousTextBox.size.height + previousTextBox.position.y + 10,
    };
  }
};

const calculateSize = (text: string, index: number) => {
  // create a dummy div to calculate the size of the text
  const dummyDiv = document.createElement("div");
  dummyDiv.style.position = "absolute";
  dummyDiv.style.visibility = "hidden";
  dummyDiv.style.maxWidth = "960px";
  //   dummyDiv.style.width = "fit-content";
  dummyDiv.style.height = "fit-content";
  dummyDiv.style.fontSize = index === 0 ? "40px" : "20px";
  dummyDiv.innerHTML = text;
  document.body.appendChild(dummyDiv);
  const height = dummyDiv.clientHeight;
  const width = dummyDiv.clientWidth + 5;
  document.body.removeChild(dummyDiv);
  console.log(width, height);
  return {width, height};
};

const DummyResponse = {
  slides: [
    {
      textBoxes: [
        {text: "Welcome to 'Snapshots of Success'!"},
        {
          text: "1.) Discover the exciting journey of entrepreneurs who turned their dreams into reality. Get ready to be inspired!",
        },
        {
          text: "2.) Discover the exciting journey of entrepreneurs who turned their dreams into reality. Get ready to be inspired!",
        },
        {
          text: "3.) Discover the exciting journey of entrepreneurs who turned their dreams into reality. Get ready to be inspired!",
        },
      ],
    },
    {
      textBoxes: [
        {
          text: "Meet Justin Kan Meet Justin Kan Meet Justin Kan Meet Justin Kan",
        },
        {
          text: "Learn how Justin's idea of lifecasting evolved into Twitch, a leading platform for gamers that was later sold to Amazon for $970 million. Learn how Justin's idea of lifecasting evolved into Twitch, a leading platform for gamers that was later sold to Amazon for $970 million. Learn how Justin's idea of lifecasting evolved into Twitch, a leading platform for gamers that was later sold to Amazon for $970 million. Learn how Justin's idea of lifecasting evolved into Twitch, a leading platform for gamers that was later sold to Amazon for $970 million. Learn how Justin's idea of lifecasting evolved into Twitch, a leading platform for gamers that was later sold to Amazon for $970 million. Learn how Justin's idea of lifecasting evolved into Twitch, a leading platform for gamers that was later sold to Amazon for $970 million.",
        },
      ],
    },
    {
      textBoxes: [
        {text: "The Spirit of Entrepreneurship"},
        {
          text: "Entrepreneurship isn't just about profits; it's about passion, perseverance, and transforming vision into ventures.",
        },
      ],
    },
    {
      textBoxes: [
        {text: "Your Journey Awaits"},
        {
          text: "Every person you will learn about started with a simple dream and faced numerous challenges. Remember, it's all about the journey!",
        },
      ],
    },
    {
      textBoxes: [
        {text: "Think Big, Start Small"},
        {
          text: "Inspired? Remember Justin's journey and start mapping out your own dreams. Who knows? You might be the next big entrepreneur!",
        },
      ],
    },
  ],
};
