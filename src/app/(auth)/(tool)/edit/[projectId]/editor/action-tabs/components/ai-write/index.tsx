import React, {Children, useEffect, useRef} from "react";
import {Textarea} from "@/components/ui/textarea";
import {Icons} from "@/components/icons";
import {usePresentation} from "@/context/presentation-context";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {useHover} from "../../index";
import TabContent from "../tab-content";
import {set} from "zod";
import {extractTextFromHTML} from "@/lib/utils";
import {GeneratedText, Preset} from "@/config/data";
import {AiRewritePresets} from "./data";
const AiRewrite = ({
  tab,
  setTab,
  generatedData,
  setGeneratedData,
  selectedPreset,
  setSelectedPreset,
}: {
  tab: "start" | "config" | "apply";
  setTab: React.Dispatch<React.SetStateAction<"start" | "config" | "apply">>;
  generatedData: GeneratedText[];
  setGeneratedData: React.Dispatch<React.SetStateAction<GeneratedText[]>>;
  selectedPreset: Preset;
  setSelectedPreset: React.Dispatch<React.SetStateAction<Preset>>;
}) => {
  const {
    selectedTextBox,
    groupSelectedTextBoxes,
    setSelectedForAiWrite,
    selectedForAiWrite,
  } = usePresentation()!;

  useEffect(() => {
    if (selectedTextBox) {
      setSelectedForAiWrite([selectedTextBox.textBoxId]);
    }
  }, [selectedTextBox]);

  useEffect(() => {
    if (groupSelectedTextBoxes && groupSelectedTextBoxes.length > 0) {
      setSelectedForAiWrite([...groupSelectedTextBoxes]);
    }
  }, [groupSelectedTextBoxes]);

  const {setIsHovering, setIsHoveringGroup} = useHover()!;

  return (
    <>
      <div className="flex flex-col overflow-scroll h-full  disableTextboxListeners">
        {tab == "apply" && <Apply generatedData={generatedData} />}
        {tab == "config" && (
          <Config
            tab={tab}
            setTab={setTab}
            selectedPreset={selectedPreset}
            setGeneratedData={setGeneratedData}
          />
        )}

        {tab == "start" && (
          <Start
            setTab={setTab}
            selectedPreset={selectedPreset}
            setSelectedPreset={setSelectedPreset}
          />
        )}
      </div>
    </>
  );
};

export default AiRewrite;

const Start = ({
  setTab,
  selectedPreset,
  setSelectedPreset,
}: {
  setTab: React.Dispatch<React.SetStateAction<"start" | "config" | "apply">>;
  selectedPreset: Preset;
  setSelectedPreset: React.Dispatch<React.SetStateAction<Preset>>;
}) => {
  const {isHovering} = useHover()!;
  return (
    <TabContent
      title="Magic Rewrite"
      description="Use the power of AI to quickly rewrite your content"
    >
      <div className="flex flex-col gap-3 mt-4 flex-grow ">
        <div
          className={`gap-4 flex flex-col justify-between  mt-2 
          ${isHovering ? "w-full" : "w-[280px]"}`}
        >
          {AiRewritePresets.map((preset, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedPreset(preset);
                setTab("config");
              }}
              className="flex items-center gap-2 hover:bg-muted rounded-[4px] rounded-r-full p-1 h-fit justify-start poppins-semibold group pr-4"
            >
              <div
                className={`p-1 h-fit w-fit rounded-[4px] text-white bg-primary`}
              >
                <preset.icon className="h-6 w-6" />
              </div>
              <div className="flex flex-col items-start">
                {preset.label}
                <span className="text-[12px] poppins-regular">
                  {preset.description}
                </span>
              </div>
              <Icons.chevronRight className="h-4 w-4 ml-auto transition-transform duration-700 group-hover:translate-x-[5px]" />
            </button>
          ))}
        </div>
      </div>
    </TabContent>
  );
};

const Config = ({
  tab,
  setTab,
  selectedPreset,
  setGeneratedData,
}: {
  tab: "start" | "config" | "apply";
  setTab: React.Dispatch<React.SetStateAction<"start" | "config" | "apply">>;
  selectedPreset: Preset;
  setGeneratedData: React.Dispatch<React.SetStateAction<GeneratedText[]>>;
}) => {
  const {
    selectedTextBox,
    selectedSlide,
    selectedForAiWrite,
    setSelectedForAiWrite,
  } = usePresentation()!;
  const {isHovering} = useHover()!;

  const [description, setDescription] = React.useState<string>("");

  const generateText = async () => {
    if (!selectedSlide || !selectedForAiWrite) return;
    setIsLoading(true);

    const generatedResponses: Promise<GeneratedText>[] = selectedForAiWrite
      .map(async (textBoxId) => {
        const textBox = selectedSlide.textBoxes.find(
          (textBox) => textBox.textBoxId === textBoxId
        );
        if (!textBox) return;

        let generatedText: GeneratedText = {
          text: textBox.text,
          textBoxId: textBox.textBoxId,
          aiResponses: [],
        };
        console.log("results ===> ", {
          uploadText: extractTextFromHTML(textBox.text),
          instructions: selectedPreset.prompt
            ? selectedPreset.prompt
            : description,
        });
        const response = await fetch("/api/ai-rewrite", {
          method: "POST",
          body: JSON.stringify({
            uploadText: extractTextFromHTML(textBox.text),
            instructions: selectedPreset.prompt
              ? selectedPreset.prompt
              : description,
          }),
        });

        const data = await response.json();
        generatedText.aiResponses =
          data.response as GeneratedText["aiResponses"];
        return generatedText as GeneratedText;
      })
      .filter(
        (result): result is Promise<GeneratedText> => result !== undefined
      );

    const generatedTextResponses = await Promise.all(generatedResponses);

    setGeneratedData(generatedTextResponses);

    setIsLoading(false);
    setTab("apply");
  };

  const [isLoading, setIsLoading] = React.useState(false);

  const selectAll = () => {
    setSelectedForAiWrite(
      selectedSlide?.textBoxes.map((textBox) => textBox.textBoxId)
    );
  };

  const deSelectAll = () => {
    setSelectedForAiWrite(undefined);
  };

  return (
    <TabContent
      title={selectedPreset?.label}
      description={selectedPreset?.description}
    >
      <div
        className={`h-fit z-10 relative 
      ${isLoading ? "pointer-events-none " : "pointer-events-auto"}
      `}
      >
        <div className="flex flex-col gap-2 h-full">
          <div className="flex flex-col   rounded-sm mt-3 border ">
            <div className="flex justify-between  w-full  p-3  items-center">
              <Label>Select text to change</Label>
              {(selectedForAiWrite ? selectedForAiWrite.length : 0) <
              (selectedSlide?.textBoxes
                ? selectedSlide?.textBoxes.length
                : 0) ? (
                <button
                  onClick={selectAll}
                  className="text-primary w-fit text-[10px] leading-[10px]"
                >
                  select all
                </button>
              ) : (
                <button
                  onClick={deSelectAll}
                  className="text-primary w-fit text-[10px] leading-[10px]"
                >
                  deselect all
                </button>
              )}
            </div>
            <div
              className={`flex flex-wrap gap-1 bg-muted p-2  overflow-scroll
            ${
              selectedPreset && selectedPreset.label === "Custom Rewrite"
                ? "max-h-[250px]"
                : isHovering
                ? "max-h-[225px]"
                : "max-h-[450px]"
            } }
            `}
            >
              {selectedSlide?.textBoxes.map((textBox) => (
                <div
                  key={textBox.textBoxId}
                  className="grid  gap-1 items-center"
                >
                  <button
                    onClick={() => {
                      if (!textBox.textBoxId) return;
                      if (
                        selectedForAiWrite &&
                        selectedForAiWrite.includes(textBox.textBoxId)
                      ) {
                        setSelectedForAiWrite(
                          (prev) =>
                            prev &&
                            prev.filter((id) => id !== textBox.textBoxId)
                        );
                      } else {
                        setSelectedForAiWrite((prev) =>
                          prev
                            ? [...prev, textBox.textBoxId]
                            : [textBox.textBoxId]
                        );
                      }
                    }}
                    className={`max-w-full w-fit border relative rounded-[8px] p-2 gap-1 hover:border-primary bg-background text-left
                ${
                  selectedForAiWrite &&
                  selectedForAiWrite.includes(textBox.textBoxId)
                    ? "border-primary"
                    : "border-border "
                }
                `}
                  >
                    {selectedForAiWrite &&
                      selectedForAiWrite.includes(textBox.textBoxId) && (
                        <div className="bg-primary h-fit w-fit rounded-full absolute top-0 right-0 translate-x-1/2 -translate-y-1/2">
                          <Icons.check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    <div
                      className=" aiwrite-textBoxPreview-closesd text-ellipsis text-[12px] pointer-events-non"
                      dangerouslySetInnerHTML={{
                        __html: extractTextFromHTML(textBox.text),
                      }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        {selectedPreset && selectedPreset.label === "Custom Rewrite" && (
          <div className="flex flex-col gap-2 disableTextboxListeners mt-3">
            <Label>Describe the change</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="no-resize border-primary "
              placeholder="describe the change (ex. make it shorter or use a more fun playful tone) "
            ></Textarea>
          </div>
        )}
        <div className="flex flex-col gap-2 mt-3">
          <button
            onClick={() => generateText()}
            disabled={!selectedForAiWrite || selectedForAiWrite.length === 0}
            className={`text-white rounded-md py-2 group flex items-center justify-center gap-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 bg-primary`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="">Generating Text</span>
                <Loader />
              </div>
            ) : (
              <span className="w-fit relative  ">
                {selectedPreset.buttonLabel}
                <Icons.chevronRight className="h-4 w-4 absolute -right-2 top-1/2 translate-x-full -translate-y-1/2 transition-transform duration-700 group-hover:translate-x-[150%]" />
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("start")}
            className="flex items-center w-full  justify-center text-sm group"
          >
            <span className="w-fit relative ">
              <Icons.chevronLeft className="h-4 w-4 absolute -left-2 top-1/2 -translate-x-full -translate-y-1/2 transition-transform duration-700 group-hover:-translate-x-[150%]" />
              go back
            </span>
          </button>
        </div>
      </div>
    </TabContent>
  );
};

const Apply = ({generatedData}: {generatedData: GeneratedText[]}) => {
  const {setMode} = usePresentation()!;

  return (
    <div
      style={{width: "calc(100% - 85px"}}
      className={` h-full z-[80] hidden md:block overflow-hidden
         translate-x-full tab-content-animation left-[80px]  absolute bg-background/70 rounded-md  border    shadow-lg   blurBack 

          `}
    >
      <button
        onClick={() => setMode("default")}
        className="absolute top-0 right-0  rounded-full p-2 h-fit w-fit  hover:text-primary z-20"
      >
        <Icons.close className="h-6 w-6" />
      </button>

      <div className="w-full  relative h-full z-10">
        <div
          style={{width: "100%"}}
          className="p-4 pr-0 absolute  h-full overflow-hidden"
        >
          <div className="flex flex-col h-12 relative z-10">
            <h1 className="font-bold text-xl poppins-bold">
              {"Results generated"}
            </h1>
            <p className=" text-sm poppins-regular">
              {"Select the text you want to use"}
            </p>
          </div>

          <div className="flex flex-col  gap-4 divide-muted-foreground/30 divide-y-2 h-full overflow-scroll pb-28 pr-4">
            {generatedData.map((textbox, i) => (
              <AiResponses textbox={textbox} key={i} />
            ))}
          </div>
          <div className="absolute bottom-0 left-0 w-full bg-background p-2">
            <Button onClick={() => setMode("default")} className="w-full">
              Save and close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AiResponses = ({textbox}: {textbox: GeneratedText}) => {
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);

  return (
    <div className="flex flex-col gap-2 pt-4">
      <ResponseOption
        textBoxId={textbox.textBoxId}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        textBox={{text: textbox.text, id: textbox.textBoxId}}
        index={0}
      />
      {textbox.aiResponses.map((response, index) => (
        <ResponseOption
          key={response.id}
          textBoxId={textbox.textBoxId}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          textBox={response}
          index={index + 1}
        />
      ))}
    </div>
  );
};

const ResponseOption = ({
  textBoxId,
  selectedIndex,
  setSelectedIndex,
  textBox,
  index,
}: {
  textBoxId: string;
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  textBox: {
    id: string;
    text: string;
  };
  index: number;
}) => {
  const {updateData} = usePresentation()!;

  const selectNewText = (text: string) => {
    const element = document.getElementById(`ai-rewrite-text-box-${textBoxId}`);

    if (!element) return;
    const paragraph = element.querySelector("p");
    if (!paragraph) return;
    const font = element.querySelector("font");
    if (!font) return;
    font.innerHTML = text;
    // element.textContent = text;
    const updatedText = `<p>${paragraph.innerHTML}</p>`;
    updateData({text: updatedText}, textBoxId);
  };

  const [expanded, setExpanded] = React.useState(false);

  const textAreaRef = useRef<HTMLDivElement>(null);

  // const [isOverflowing, setIsOverflowing] = React.useState(false);

  // const isOverflowActive = () => {
  //   const textHeight = textAreaRef.current?.getBoundingClientRect().height;
  //   if (textHeight && textHeight >= 128) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  // useEffect(() => {
  //   if (!textAreaRef?.current) {
  //     return;
  //   }
  //   if (isOverflowActive()) {
  //     setIsOverflowing(true);
  //     return;
  //   }
  //   setIsOverflowing(false);
  // }, [textAreaRef]);

  const isOverflowing = extractTextFromHTML(textBox.text).length > 150;

  return (
    <div
      className={`fade-in-custom text-left w-full bg-background h-fit shadow-sm rounded-md border flex flex-col   relative overflow-hidden z-0
        ${
          expanded
            ? "responseOption-content-open"
            : "responseOption-content-closed "
        }
   ${
     selectedIndex === index
       ? "border-primary"
       : "border-border hover:border-primary"
   }
   ${isOverflowing ? "pb-4" : "pb-0"}
  
  `}
    >
      <button
        onClick={() => {
          selectNewText(textBox.text);
          setSelectedIndex(index);
        }}
        className=" absolute w-full h-full z-[15]"
      ></button>
      {index === 0 ? (
        <div className="w-fit text-[12px] px-2 bg-primary/20 text-primary rounded-br-[10px]">
          Original
        </div>
      ) : (
        <div className="w-fit text-[12px] px-2 bg-primary/20 text-primary rounded-br-[10px]">
          {"v" + index}
        </div>
      )}
      {isOverflowing && (
        <>
          {expanded ? (
            <div className="absolute bottom-0 z-30  w-full text-center text-primary bg-background items-center  flex opacity-100  hover:opacity-100 ">
              <button
                onClick={() => setExpanded(false)}
                className="p-1  flex items-center bg-background/80 text-[8px] transition-color duration-700 rounded-sm px-2 group poppins-bold"
              >
                Show less
                <Icons.chevronUp className="h-4 w-4 group-hover:transition-transform duration-700 delay-200 group-hover:-translate-y-[2px]" />
              </button>
            </div>
          ) : (
            <>
              {/* <div className="z-20 h-[100px] pointer-events-none w-full absolute  bottom-0  bg-gradient-to-b  from-background/20 to-background"></div> */}
              <div className="absolute bottom-0 z-30  w-full text-center text-primary bg-background items-center  flex opacity-100  hover:opacity-100 ">
                <button
                  onClick={() => setExpanded(true)}
                  className="p-1  flex items-center bg-background/80 text-[8px] transition-color duration-700 rounded-sm px-2 group poppins-bold"
                >
                  Show more
                  <Icons.chevronDown className="h-4 w-4 group-hover:transition-transform duration-700 delay-200 group-hover:translate-y-[2px]" />
                </button>
              </div>
            </>
          )}
        </>
      )}
      {selectedIndex === index && (
        <div className="absolute z-30 bottom-0 right-0 w-fit text-[12px] px-2 bg-[#D4E5FF]   text-primary rounded-tl-[10px] flex items-center">
          <Icons.check className="h-4 w-4 text-primary" />
          selected
        </div>
      )}
      <div
        ref={textAreaRef}
        className="w-full h-fit p-2 pt-0 relative z-10 responseOption-content-box text-ellipsis"
      >
        {extractTextFromHTML(textBox.text)}
      </div>
    </div>
  );
};

const Loader = () => {
  return (
    <div className="loader loader--style6" title="5">
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="24px"
        height="24px"
        viewBox="0 0 24 30"
      >
        <rect x="0" y="13" width="4" height="5" className="fill-white">
          <animate
            attributeName="height"
            attributeType="XML"
            values="5;21;5"
            begin="0s"
            dur="0.6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            attributeType="XML"
            values="13; 5; 13"
            begin="0s"
            dur="0.6s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="10" y="13" width="4" height="5" className="fill-white">
          <animate
            attributeName="height"
            attributeType="XML"
            values="5;21;5"
            begin="0.15s"
            dur="0.6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            attributeType="XML"
            values="13; 5; 13"
            begin="0.15s"
            dur="0.6s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="20" y="13" width="4" height="5" className="fill-white">
          <animate
            attributeName="height"
            attributeType="XML"
            values="5;21;5"
            begin="0.3s"
            dur="0.6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            attributeType="XML"
            values="13; 5; 13"
            begin="0.3s"
            dur="0.6s"
            repeatCount="indefinite"
          />
        </rect>
      </svg>
    </div>
  );
};

const DummyData: GeneratedText[] = [
  {
    text: '<p><font color="#000000">The American Civil War, which spanned from 1861 to 1865, was a dramatic and intense period marked by a fierce conflict between the Union, composed of northern states, and the Confederate South. The North pursued the vision of a unified, centralized nation and opposed slavery, while the South fought for independence mainly to preserve their established way of life, which heavily relied on slavery. Slavery was particularly entrenched in the Southern economy, especially in the plantation system where cotton, tobacco, and other crops were cultivated on a large scale using slave labor. The North, in contrast, was more industrially diverse and used more advanced, less labor-intensive farming techniques. Significant battles such as the Battle of Gettysburg and the Siege of Vicksburg not only decided military outcomes but also played pivotal roles in shaping the future political doctrines and societal structures. These clashes represented not just military tactics but also a clash of ideologies that would define the character and governance of the nation for generations to come.</font></p>',
    textBoxId: "0.7363228096208099",
    aiResponses: [
      {
        id: "1",
        text: "The American Civil War, spanning from 1861 to 1865, was a significant period in U.S. history, characterized by intense and bloody confrontations between the Union and the Confederate States. The Union, primarily northern states, was driven by a vision to maintain a unified and centralized nation and was ideologically opposed to slavery. This opposition was not just based on moral grounds but also reflected the economic and social dynamics that differentiated the North from the South. The South, however, fought tenaciously for its independence to preserve a way of life that was deeply intertwined with slavery. This economic system in the South was heavily reliant on slave labor, which was integral to its agricultural sector where large plantations growing cotton and tobacco dominated. Unlike the South, the North's economy was more industrially based and utilized progressive, less labor-intensive agricultural methods. Key battles like the Battle of Gettysburg and the Siege of Vicksburg were not only critical to the military trajectories but also instrumental in defining future political and social structures in America. These battles underscored the profound ideological divide between the North and South, a schism that profoundly influenced the nation’s identity and governance standards for future generations.",
      },
      {
        id: "2",
        text: "The American Civil War, ",
      },
      {
        id: "3",
        text: "The American Civil War, running from 1861 to 1865, was a defining ordeal in American history that saw a fierce confrontation between the Union and the Confederate South. This war was driven by profound disagreements over national unity and the role of slavery. The Union, comprised of northern states, was committed to a vision of a centralized nation united under a federal government. They opposed slavery, aligning with their more industrialized economy and advanced agricultural techniques that were less dependent on human labor. On the other hand, the Confederate South fought vigorously for sovereignty to preserve a lifestyle deeply entrenched in slavery, crucial for their agriculture-based economy. In the South, large plantations where crops like cotton and tobacco were grown depended heavily on enslaved labor. Battles such as the Battle of Gettysburg and the Siege of Vicksburg were decisive, not only in military terms but also in shaping the political and ideological landscapes of the future United States. These battles highlighted the stark ideological divides between the North and South, setting the stage for the enduring impact on the nation's structure and governance, influencing the political doctrines and social configurations for generations to follow.",
      },
    ],
  },
];
