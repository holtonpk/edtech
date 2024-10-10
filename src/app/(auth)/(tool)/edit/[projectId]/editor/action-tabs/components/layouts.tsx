import React, {Children, useEffect, useRef, useState} from "react";

import {Icons} from "@/components/icons";
import {usePresentation} from "@/context/presentation-context";
import {SlideData, TextBoxType} from "@/config/data";
import TabContent from "./tab-content";
import {array} from "zod";
import {useHover} from "../index";
const Layouts = () => {
  // const [themes, setThemes] = React.useState<any>();

  // useEffect(() => {
  //   const fetchUserImages = async () => {
  //     const docRef = doc(db, "presentations", "h81MrdiggYhlbyrqTUZ2");
  //     const docSnap = await getDoc(docRef);
  //     if (docSnap.exists()) {
  //       setThemes(docSnap.data());
  //     }
  //   };
  //   fetchUserImages();
  // }, [setThemes]);

  // console.log(JSON.stringify(themes));
  const {isHovering, hoveredIndex} = useHover()!;

  return (
    <TabContent title="Layouts" description="Change the layout of your slides">
      <div
        className={`w-full  overflow-scroll 
        ${isHovering ? "h-[425px]" : "h-full pb-10"}
        `}
      >
        <div className="grid grid-cols overflow-scroll gap-4 h-fit w-full mt-4 ">
          {layoutsData.layouts.map((layout) => (
            <LayoutPreview layout={layout} key={layout.id} />
          ))}
        </div>
      </div>
    </TabContent>
  );
};

export default Layouts;

const LayoutPreview = ({layout}: {layout: Layout}) => {
  const selectorContainerRef = React.useRef<HTMLDivElement>(null);

  const [thumbScale, setThumbScale] = useState<number | undefined>(undefined);
  const {isHovering, hoveredIndex} = useHover()!;

  const setScale = () => {
    const selectorContainer = selectorContainerRef.current;
    if (!selectorContainer) return;
    const calculateScale = selectorContainer.clientWidth / 1000;
    setThumbScale(calculateScale);
  };

  React.useEffect(() => {
    window.addEventListener("resize", setScale);
    return () => {
      window.removeEventListener("resize", setScale);
    };
  }, []);

  React.useEffect(() => {
    setTimeout(() => {
      console.log("setting scale");
      setScale();
    }, 250);
  }, [hoveredIndex]);

  const {slideDataRef, selectedSlideRef, setSlideData} = usePresentation()!;

  const applyLayout = () => {
    if (!selectedSlideRef.current) return;
    let updatedSlideData = {...slideDataRef.current};

    const textBoxData = selectedSlideRef.current.textBoxes;
    const imageBoxes = selectedSlideRef.current.images;

    // Loop through layout text boxes
    layout.textBoxes.forEach((layoutTextBox: LayoutTextBox) => {
      // Use a for loop to allow breaking when a match is found
      for (let i = 0; i < textBoxData.length; i++) {
        const textBox = textBoxData[i];
        if (!textBox?.boxType) continue;

        if (textBox.boxType === layoutTextBox.boxType) {
          console.log("found a:", layoutTextBox.boxType, textBox.textBoxId);

          const targetSlide = updatedSlideData.slides?.find(
            (slide) => slide.id === selectedSlideRef.current?.id
          );

          if (targetSlide) {
            const textBoxIndex = targetSlide.textBoxes.findIndex(
              (tb) => tb.textBoxId === textBox.textBoxId
            );

            if (textBoxIndex !== -1) {
              // Replace the matching text box
              targetSlide.textBoxes[textBoxIndex] = {
                ...textBox,
                position: layoutTextBox.position,
                size: {width: layoutTextBox.size.width},
                rotation: layoutTextBox.rotation,
                fontSize: layoutTextBox.fontSize,
                textAlign: layoutTextBox.textAlign,
              };
            }
          }

          // Stop looping through textBoxData and continue with the next layoutTextBox
          break;
        }
      }
    });
    const targetSlide = updatedSlideData.slides?.find(
      (slide) => slide.id === selectedSlideRef.current?.id
    );

    if (targetSlide) {
      layout.images.forEach((layoutImage: Image, index) => {
        if (index < imageBoxes.length) {
          // Update the corresponding image with layout properties
          targetSlide.images[index] = {
            ...imageBoxes[index],
            position: layoutImage.position,
            size: {width: layoutImage.size.width},
            rotation: layoutImage.rotation,
          };
        }
      });
    }

    if (updatedSlideData) {
      setSlideData(updatedSlideData as SlideData);
    }
  };

  return (
    <button onClick={applyLayout} className="w-full  aspect-[16/9] ">
      <div
        ref={selectorContainerRef}
        className="h-full w-full bg-background rounded-lg flex items-center justify-center  border-4 hover:border-primary/70 relative overflow-hidden "
      >
        {/* <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-fit poppins-bold whitespace-nowrap">
          {layout.title}
        </div> */}
        {thumbScale ? (
          <div
            style={{transform: `scale(${thumbScale}) `}}
            className="w-[1000px]   aspect-[16/9] absolute overflow-hidden"
          >
            {layout.textBoxes.map((textBox) => (
              <div
                key={textBox.textBoxId}
                style={{
                  width: textBox.size.width,
                  height: textBox.size.height
                    ? textBox.size.height
                    : "fit-content",
                  left: textBox.position.x,
                  top: textBox.position.y,
                  textAlign: textBox.textAlign,
                }}
                className=" absolute h-fit flex flex-col gap-10 "
              >
                {textBox.boxType === "heading" && (
                  <div
                    style={{fontSize: textBox.fontSize}}
                    className="w-full h-full border-primary/60  border  "
                  >
                    Heading
                  </div>
                )}
                {textBox.boxType === "body" && (
                  <div
                    style={{fontSize: textBox.fontSize}}
                    className="w-full h-[400px] border-primary/60  border flex justify-center items-center "
                  >
                    Body
                  </div>
                )}
              </div>
            ))}
            {layout.images.map((image) => (
              <div
                key={image.imageId}
                style={{
                  width: image.size.width,
                  left: image.position.x,
                  top: image.position.y,
                }}
                className={`absolute  bg-primary/60 rounded-md flex items-center justify-center 
                  ${image.aspectRatio}
                  `}
              >
                <Icons.imagePlaceholder
                  style={{width: "50%", height: "50%"}}
                  className={`"  text-background 
                  `}
                />
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}
      </div>
    </button>
  );
};

type layoutsData = {
  layouts: Layout[];
};

type Layout = {
  images: Image[] | [];
  id: string;
  title: string;
  textBoxes: LayoutTextBox[] | [];
};

type Position = {
  x: number;
  y: number;
};

type Image = {
  imageId: string;
  position: Position;
  size: {width: number};
  rotation: number;
  aspectRatio: string;
};

type LayoutTextBox = {
  boxType: "heading" | "body";
  position: Position;
  size: {width: number; height?: number};
  rotation: number;
  textBoxId: string;
  fontSize: number;
  textAlign: "left" | "center" | "right" | "justify";
};

const layoutsData: layoutsData = {
  layouts: [
    {
      title: "Only Title Slide",
      images: [],
      textBoxes: [
        {
          position: {x: 38, y: 217},
          boxType: "heading",
          size: {width: 924},
          textBoxId: "0.42595694406981366",
          rotation: 0,
          fontSize: 60,
          textAlign: "center",
        },
      ],

      id: "0.10665107301683707",
    },
    {
      textBoxes: [
        {
          textBoxId: "0.42595694406981366",
          fontSize: 60,
          rotation: 0,
          boxType: "heading",
          size: {width: 924},
          position: {y: 210, x: 40},
          textAlign: "center",
        },
        {
          textBoxId: "0.78945984392843289",
          fontSize: 16,
          rotation: 0,
          boxType: "body",
          size: {width: 924, height: 100},
          position: {y: 315, x: 40},
          textAlign: "center",
        },
      ],
      id: "0.11059601320475898",
      images: [],
      title: "Title and Body text centered",
    },
    {
      title: "Big title left and body right",
      textBoxes: [
        {
          position: {y: 91, x: 22},
          boxType: "heading",
          textBoxId: "0.42595694406981366",
          size: {width: 508, height: 400},
          rotation: 0,
          fontSize: 94.95327102803739,
          textAlign: "center",
        },
        {
          boxType: "body",
          textBoxId: "0.34343207022023425",
          fontSize: 16,
          position: {y: 91, x: 566.5},
          rotation: 0,
          size: {width: 405},
          textAlign: "left",
        },
      ],
      id: "0.9195613307845063",
      images: [],
    },
    {
      textBoxes: [
        {
          textBoxId: "0.6025648225724507",
          fontSize: 16,
          size: {width: 921},
          boxType: "body",
          position: {x: 20, y: 100},
          rotation: 0,
          textAlign: "left",
        },
        {
          position: {y: 20, x: 20},
          boxType: "heading",

          textBoxId: "0.8147710539522983",
          rotation: 0,
          fontSize: 40,
          size: {width: 600},
          textAlign: "left",
        },
      ],
      id: "0.22536454962951247",

      title: "Small title and body left everything",
      images: [],
    },
    {
      textBoxes: [
        {
          size: {width: 469},
          textBoxId: "0.6025648225724507",
          position: {x: 20, y: 80},
          fontSize: 16,
          boxType: "body",
          rotation: 0,
          textAlign: "right",
        },
      ],
      title: "Image left, text right",

      id: "0.016475345459718183",
      images: [
        {
          rotation: 0,
          size: {width: 331},
          imageId: "0.7015932234970057",
          position: {x: 570, y: 160},
          aspectRatio: "aspect-[16/9]",
        },
      ],
    },
    {
      images: [
        {
          imageId: "0.7015932234970057",
          position: {x: 80, y: 160},
          size: {width: 331},
          rotation: 0,
          aspectRatio: "aspect-[16/9]",
        },
      ],
      title: "Image right, text left",

      textBoxes: [
        {
          fontSize: 16,
          boxType: "body",
          textBoxId: "0.6025648225724507",
          position: {x: 450, y: 80},
          rotation: 0,
          size: {width: 469},
          textAlign: "left",
        },
      ],
      id: "0.9371660059089435",
    },
    {
      textBoxes: [
        {
          textBoxId: "0.6025648225724507",
          rotation: 0,
          size: {width: 935, height: 300},
          position: {y: 40, x: 21.5},
          boxType: "body",
          fontSize: 16,
          textAlign: "left",
        },
      ],
      title: "Text up, image down",
      id: "0.18239892398061075",
      images: [
        {
          position: {y: 375, x: 23},
          imageId: "0.4212747187188053",
          rotation: 0,
          size: {width: 288},
          aspectRatio: "aspect-[16/9]",
        },
      ],
    },
    {
      id: "0.3429686764026365",

      textBoxes: [
        {
          boxType: "body",
          size: {width: 935, height: 300},
          rotation: 0,
          fontSize: 16,
          textBoxId: "0.6025648225724507",
          position: {x: 21.5, y: 225},
          textAlign: "left",
        },
      ],
      title: "Image up, text down",
      images: [
        {
          size: {width: 288},
          imageId: "0.4212747187188053",
          rotation: 0,
          position: {y: 40, x: 20},
          aspectRatio: "aspect-[16/9]",
        },
      ],
    },
    {
      title: "Text left, collage right",
      textBoxes: [
        {
          position: {y: 100, x: 18.5},
          textBoxId: "0.6025648225724507",
          boxType: "body",
          fontSize: 16,
          rotation: 0,
          size: {width: 500},
          textAlign: "left",
        },
      ],
      id: "0.7539064813227816",
      images: [
        {
          rotation: 0,
          imageId: "0.4212747187188053",
          size: {width: 288},
          position: {y: 86, x: 583},
          aspectRatio: "aspect-[16/9]",
        },
        {
          imageId: "0.19424310014240342",
          position: {y: 273, x: 777},
          size: {width: 130},
          rotation: 0,
          aspectRatio: "aspect-[9/16]",
        },
        {
          size: {width: 200},
          aspectRatio: "aspect-[16/9]",

          rotation: 0,
          position: {y: 277, x: 556},
          imageId: "0.3129233812078207",
        },
      ],
    },
  ],
};
