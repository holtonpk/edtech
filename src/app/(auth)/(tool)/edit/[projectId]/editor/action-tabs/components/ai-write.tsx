import React, {Children, useEffect, useRef} from "react";
import {Textarea} from "@/components/ui/textarea";
import {Icons} from "@/components/icons";
import {usePresentation} from "@/context/presentation-context";
import {Label} from "@/components/ui/label";

import {useHover} from "../index";
import TabContent from "./tab-content";

const AiRewrite = () => {
  const {
    setMode,
    selectedTextBox,
    updateData,
    groupSelectedTextBoxes,
    selectedSlide,
    selectedForAiWrite,
    setSelectedForAiWrite,
  } = usePresentation()!;

  const [originalText, setOriginalText] = React.useState<string>(
    selectedTextBox?.text || ""
  );

  function extractTextFromHTML(htmlString: string): string {
    // Create a DOMParser to parse the HTML string
    const parser = new DOMParser();

    // Parse the string as an HTML document
    const doc = parser.parseFromString(htmlString, "text/html");

    // Return the text content of the document
    return doc.body.textContent || "";
  }

  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);

  const [description, setDescription] = React.useState<string>("");

  type GeneratedText = {
    text: string;
    id: number;
  }[];

  const [generatedText, setGeneratedText] = React.useState<
    GeneratedText | undefined
  >();

  const generateText = async () => {
    setIsGenerating(true);
    const response = await fetch("/api/ai-rewrite", {
      method: "POST",
      body: JSON.stringify({
        uploadText: selectedTextBox?.text,
        description,
      }),
    });

    const data = await response.json();

    setGeneratedText(data.response);
    setIsGenerating(false);
  };

  const changeTextToVersion = (text: string) => {
    if (!selectedTextBox?.textBoxId) return;
    updateData({text}, selectedTextBox?.textBoxId);
  };

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

  const selectAll = () => {
    setSelectedForAiWrite(
      selectedSlide?.textBoxes.map((textBox) => textBox.textBoxId)
    );
  };

  const deSelectAll = () => {
    setSelectedForAiWrite(undefined);
  };

  const [editMode, setEditMode] = React.useState<boolean>(false);

  type Preset = {
    label: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    description: string;
    background: string;
    buttonLabel: string;
    prompt: string;
  };

  const AiRewritePresets: Preset[] = [
    {
      label: "Add More Detail",
      icon: Icons.pencil,
      description: "Expand on this",
      background: "bg-primary",
      buttonLabel: "Replace",
      prompt: "Expand on this",
    },
    {
      label: "Make it Shorter",
      icon: Icons.ruler,
      description: "Shorten this",
      background: "bg-theme-purple",
      buttonLabel: "Replace",
      prompt: "Shorten this",
    },
    {
      label: "Completely Rewrite",
      icon: Icons.reWrite,
      description: "Say this in a different way",
      background: "bg-theme-red",
      buttonLabel: "Replace",
      prompt: "Say this in a different way",
    },
    {
      label: "Add More Fun",
      icon: Icons.smile,
      description: "Make this more fun",
      background: "bg-theme-yellow",
      buttonLabel: "Replace",
      prompt: "Make this more fun",
    },
    // {
    //   label: "Add More Detail",
    //   icon: Icons.pencil,
    //   description: "Expand on this",
    //   background: "bg-primary",
    //   buttonLabel: "Replace",
    //   prompt: "Expand on this",
    // },
    {
      label: "Custom Rewrite",
      icon: Icons.wand2,
      description: "Tell the AI how to rewrite it",
      background: "bg-theme-green",
      buttonLabel: "Replace",
      prompt: "Tell the AI how to rewrite it",
    },
  ];

  const [selectedPreset, setSelectedPreset] = React.useState<Preset>(
    AiRewritePresets[0]
  );

  const {isHovering} = useHover()!;

  return (
    <>
      <div className="flex flex-col overflow-scroll h-full  disableTextboxListeners">
        {editMode ? (
          <TabContent
            title={selectedPreset?.label}
            description={selectedPreset?.description}
          >
            <div className="h-fit ">
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
                      selectedPreset &&
                      selectedPreset.label === "Custom Rewrite"
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
                          className={`max-w-full w-fit border relative rounded-[8px] p-2 gap-1 hover:bg-muted bg-background text-left
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
                  disabled={
                    !selectedForAiWrite || selectedForAiWrite.length === 0
                  }
                  className={`text-white rounded-md py-2 group flex items-center justify-center gap-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 bg-primary`}
                >
                  {isGenerating && (
                    <Icons.spinner className="h-6 w-6 animate-spin mr-2" />
                  )}
                  <span className="w-fit relative  ">
                    {selectedPreset.buttonLabel}
                    <Icons.chevronRight className="h-4 w-4 absolute -right-2 top-1/2 translate-x-full -translate-y-1/2 transition-transform duration-700 group-hover:translate-x-[150%]" />
                  </span>
                </button>
                <button
                  onClick={() => setEditMode(false)}
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
        ) : (
          <TabContent
            title="Magic Rewrite"
            description="Use the power of AI to quickly rewrite your content"
          >
            <div className="flex flex-col gap-3 mt-4 flex-grow ">
              <div className="gap-4 flex flex-col justify-between w-full mt-2 ">
                {/* <Label className="font-bold">Magic Options</Label> */}
                {AiRewritePresets.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedPreset(preset);
                      setEditMode(true);
                    }}
                    className="flex items-center gap-2 hover:bg-muted rounded-[4px] rounded-r-full p-1 h-fit justify-start poppins-semibold group pr-4"
                  >
                    <div
                      className={`p-1 h-fit w-fit rounded-[4px] text-white bg-primary`}
                      // className={`p-1 h-fit w-fit rounded-[4px] text-white ${preset.background}`}
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
        )}
      </div>
    </>
  );
};

export default AiRewrite;
