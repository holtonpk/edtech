import React, {Children, useEffect, useRef} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Icons} from "@/components/icons";
import {usePresentation} from "@/context/presentation-context";
import {Button} from "@/components/ui/button";
import {set} from "zod";
import {Description} from "@radix-ui/react-dialog";
import {Modes, Position, Image as ImageType} from "@/config/data";
import {getDoc, doc} from "firebase/firestore";
import {db} from "@/config/firebase";
import {useAuth} from "@/context/user-auth";
import ProfileNav from "../../../../components/profile-nav";

type HoverContextType = {
  isHovering: boolean;
  setIsHovering: React.Dispatch<React.SetStateAction<boolean>>;
  isHoveringGroup: boolean;
  setIsHoveringGroup: React.Dispatch<React.SetStateAction<boolean>>;
  hoveredIndex: number | null;
  setHoveredIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

const HoverContext = React.createContext<HoverContextType | null>(null);

export function useHover() {
  return React.useContext(HoverContext);
}

const HoverContextProvider = ({children}: {children: React.ReactNode}) => {
  const [isHovering, setIsHovering] = React.useState<boolean>(false);
  const [isHoveringGroup, setIsHoveringGroup] = React.useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const values = {
    isHovering,
    setIsHovering,
    isHoveringGroup,
    setIsHoveringGroup,
    hoveredIndex,
    setHoveredIndex,
  };

  return (
    <HoverContext.Provider value={values}>{children}</HoverContext.Provider>
  );
};

export const ActionTabs = () => {
  return (
    <HoverContextProvider>
      <RightPanel />
    </HoverContextProvider>
  );
};

const RightPanel = () => {
  const {mode, setMode} = usePresentation()!;

  const TabButtons = [
    {
      name: "Themes",
      description: "Change the look and feel of your presentation",
      value: "themes",
      icon: Icons.theme,
      color: "hsla(0 100% 50 / 1)",
      HoverElement: (
        <HoverContainer id="themes">
          <Themes />
        </HoverContainer>
      ),
    },
    {
      name: "Layouts",
      description: "Change the layout of your slides",
      value: "layout",
      icon: Icons.layout,
      color: "hsla(21 92% 47% / 1)",
      HoverElement: (
        <HoverContainer id="layout">
          <Layouts />
        </HoverContainer>
      ),
    },
    {
      name: "Ai Write",
      description: "Use the power of AI to quickly rewrite your content",
      value: "aiRewrite",
      icon: Icons.magicWand,
      color: "hsla(138 40% 48% / 1)",
      HoverElement: (
        <HoverContainer id="aiRewrite">
          <AiRewrite />
        </HoverContainer>
      ),
    },
    {
      name: "Text",
      description: "Add text to your slides",
      value: "text",
      icon: Icons.text,
      color: "hsla(212 90% 58% / 1)",
      HoverElement: (
        <HoverContainer id="text">
          <Text />
        </HoverContainer>
      ),
    },
    {
      name: "Images",
      description: "Add images to your slides",
      value: "images",
      icon: Icons.image,
      color: "hsla(259 82% 67% / 1)",
      HoverElement: (
        <HoverContainer id="images">
          <Images />
        </HoverContainer>
      ),
    },
  ];

  // const [hoverValue, setHoverValue] = React.useState<string | null>(null);

  const {isHovering, setIsHovering} = useHover()!;
  const [hoverValue, setHoverValue] = React.useState<string | null>(null);

  const hoveredIndex = useRef<number | null>(null);

  const prevHoveredElement = useRef<string | null>(null);

  const onButtonHover = (id: any, index: number) => {
    if (mode !== "default") return;
    setIsHovering(true);
    setHoverValue(id);
    onHoverGroup();
    const buttonElement = document.getElementById(id + "-menu-button");
    const hoverContainer = document.getElementById(id + "-hoverContainer");
    const hoverPoint = document.getElementById(id + "-hover-point");
    const hoverIndicator = document.getElementById("hover-indicator");
    const buttonContainer = document.getElementById(id + "-buttonContainer");
    const hoverContainerMain = document.getElementById("hoverContainer");
    const animatedHoverContainer = document.getElementById(
      id + "-animated-hoverContainer"
    );

    if (
      !buttonElement ||
      !hoverContainer ||
      !hoverPoint ||
      !hoverIndicator ||
      !buttonContainer ||
      !hoverContainerMain ||
      !animatedHoverContainer
    )
      return;
    hoverContainer.style.top = buttonContainer?.offsetTop - 29 + "px";
    hoverContainer.style.left = buttonElement?.clientWidth + 31 + "px";
    hoverContainer.style.display = "block";
    hoverPoint.style.display = "block";
    hoverContainerMain.style.top = buttonContainer?.offsetTop - 30 + "px";
    hoverContainerMain.style.left = buttonElement?.clientWidth + 30 + "px";

    // hover indicator should animate to the top of the button
    hoverIndicator.style.height = buttonElement?.clientHeight + "px";
    hoverIndicator.style.top = buttonContainer?.offsetTop + "px";

    animatedHoverContainer.classList.remove("slide-down-out");
    animatedHoverContainer.classList.remove("slide-up-out");
    animatedHoverContainer.classList.remove("slide-right");
    animatedHoverContainer.classList.remove("slide-down-in");
    animatedHoverContainer.classList.remove("slide-up-in");

    console.log("hoveredIndex ===", hoveredIndex.current);
    if (hoveredIndex.current === null) {
      animatedHoverContainer?.classList.add("slide-right");
    } else if (hoveredIndex.current > index) {
      animatedHoverContainer?.classList.add("slide-down-in");
    } else if (hoveredIndex.current < index) {
      animatedHoverContainer?.classList.add("slide-up-in");
    }

    if (prevHoveredElement.current !== id) {
      onButtonHoverOff(prevHoveredElement.current, index);
    }

    hoveredIndex.current = index;
    prevHoveredElement.current = id;
  };

  const onButtonHoverOff = (id: any, newHoveredIndex: number) => {
    console.log(newHoveredIndex, hoveredIndex.current);
    if (!isHovering) return;

    const oldHoverPoint = document.getElementById(
      prevHoveredElement.current + "-hover-point"
    );

    if (oldHoverPoint) {
      oldHoverPoint.style.display = "none";
    }

    const animatedHoverContainer = document.getElementById(
      prevHoveredElement.current + "-animated-hoverContainer"
    );
    console.log("prev elem remove", prevHoveredElement.current);
    if (!animatedHoverContainer) return;

    animatedHoverContainer.classList.remove("slide-down-out");
    animatedHoverContainer.classList.remove("slide-up-out");
    animatedHoverContainer.classList.remove("slide-right");
    animatedHoverContainer.classList.remove("slide-down-in");
    animatedHoverContainer.classList.remove("slide-up-in");

    if (hoveredIndex.current && newHoveredIndex < hoveredIndex.current) {
      animatedHoverContainer.classList.add("slide-down-out");
    } else if (hoveredIndex.current && newHoveredIndex > hoveredIndex.current) {
      animatedHoverContainer.classList.add("slide-up-out");
    }

    setTimeout(() => {
      document.getElementById(id + "-hoverContainer")!.style.display = "none";
    }, 80);
  };

  //  create a context to track isHovering state

  const onHoverGroup = () => {
    if (mode !== "default") return;

    document.getElementById("hoverContainer")!.style.display = "block";
    document.getElementById("hover-indicator")!.style.display = "block";
  };

  const onHoverGroupOff = () => {
    if (mode !== "default") return;

    setHoverValue(null);
    document.getElementById("hoverContainer")!.style.display = "none";
    document.getElementById("hover-indicator")!.style.display = "none";

    document.getElementById(
      prevHoveredElement.current + "-hover-point"
    )!.style.display = "none";

    document.getElementById(
      prevHoveredElement.current + "-hoverContainer"
    )!.style.display = "none";

    // document.getElementById(
    //   hoveredIndex.current + "-hoverContainer"
    // )!.style.display = "none";

    hoveredIndex.current = null;
    prevHoveredElement.current = null;
  };

  return (
    <div className="flex h-full justify-center relative  origin-right  ">
      <div
        className={`flex flex-col bg-background border px-2 rounded-md blurBack w-[70px] h-full gap-2 mr-auto items-center  py-4    relative z-[60]

`}
      >
        <div
          className="relative flex flex-col w-full h-fit gap-2"
          onMouseEnter={onHoverGroup}
          onMouseLeave={onHoverGroupOff}
        >
          {/* {isHovering && ( */}
          <span
            id="hover-indicator"
            className="absolute bg-muted-foreground/5 w-[54px] aspect-square rounded-md z-10 top-transition hidden"
          ></span>
          {/* )} */}

          {TabButtons.map((tab, index) => {
            const Icon = tab.icon;
            // const HoverElement = tab.HoverElement;
            return (
              <div
                key={index}
                id={tab.value + "-buttonContainer"}
                className="relative w-full  z-20 "
                onMouseEnter={(e) => onButtonHover(tab.value, index)}
                // onMouseLeave={() => {
                //   onButtonHoverOff(tab.value);
                // }}
              >
                <div
                  id={tab.value + "-hover-point"}
                  className="absolute w-[200px] h-14 left-0  top-0 hidden"
                ></div>

                <button
                  id={tab.value + "-menu-button"}
                  onClick={() => {
                    setMode(tab.value as Modes);
                    setIsHovering(false);
                    onHoverGroupOff();
                    // onButtonHoverOff(tab.value);
                  }}
                  className={`flex flex-col  h-fit w-full aspect-square p-2 py-0  items-center justify-center group  relative  rounded-md   transition-all duration-200 
text-muted-foreground
${mode === tab.value && "bg-muted-foreground/5"}
                `}
                >
                  <Icon
                    className={`h-6 w-6 opacity-100
 ${
   mode === tab.value || hoverValue === tab.value
     ? "text-primary"
     : "currentColor group-hover:text-primary"
 }
                `}
                    // style={{color: mode === tab.value ? tab.color : "currentColor"}}
                  />
                  <span
                    className={`text-[12px] whitespace-nowrap
                  ${
                    mode === tab.value || hoverValue === tab.value
                      ? "text-primary"
                      : "currentColor group-hover:text-primary"
                  }
                  `}
                  >
                    {tab.name}
                  </span>

                  {/* <div className="absolute w-[200px] h-20 bg-red-200 top-0"></div> */}

                  {/* <div
                  // style={{background: tab.color}}
                  className={`h-[5px] w-[5px] rounded-full absolute  z-10 top-1/2 -translate-y-1/2 -right-[10px] fade-in-0 duration-500 bg-primary  ${
                    mode === tab.value || hoverValue === tab.value
                      ? "fade-in-500"
                      : "fade-outs-500 opacity-0 group-hover:opacity-100"
                  }`}
                ></div> */}
                </button>
                {tab.HoverElement}
              </div>
            );
          })}

          <div
            id="hoverContainer"
            className={`fixed hidden top-transition left-[200px] z-[9] bg-background  h-[400px] w-[350px] shadow-xl fade-in-500 rounded-md  border

            
            `}
          >
            <div className="absolute left-[5px] top-[50px]  -translate-x-full z-20">
              <Icons.menuArrow className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="mt-auto">
          <ProfileNav />
        </div>
      </div>

      {/* <div id="hover-point" className="fixed z-[99] pointer-events-none">
        <div className="h-[38px] w-[38px] bg-red-600 "></div>
      </div> */}

      {/* <HoverContainer id="aiRewrite">
        <AiRewrite />
      </HoverContainer>

      
      <HoverContainer id="text">
        <Text />
      </HoverContainer>

      <HoverContainer id="images">
        <Images />
      </HoverContainer>
      <HoverContainer id="layout">
        <Layouts />
      </HoverContainer> */}

      {mode === "aiRewrite" && <AiRewrite />}
      {mode === "themes" && <Themes />}
      {mode === "text" && <Text />}
      {mode === "images" && <Images />}
      {mode === "layout" && <Layouts />}
    </div>
  );
};

export default RightPanel;

const HoverContainer = ({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) => {
  const {isHovering} = useHover()!;

  return (
    <div
      id={id + "-hoverContainer"}
      className={`fixed  z-[10000]   hidden h-[398px] w-[348px] rounded-md 
            
            
            `}
    >
      <div className="relative overflow-hidden h-[400px] w-[350px] z-10">
        <div
          id={id + "-animated-hoverContainer"}
          className="relative h-[400px] w-[350px] "
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const TabContent = ({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
}) => {
  const {setMode} = usePresentation()!;

  const {isHovering} = useHover()!;

  return (
    <div
      style={{width: isHovering ? "100%" : "calc(100% - 85px"}}
      className={`  h-full z-[80]  
        ${
          isHovering
            ? ""
            : "translate-x-full tab-content-animation left-[80px]  absolute bg-background/70 rounded-md  border    shadow-lg   blurBack "
        }
        `}
    >
      {!isHovering && (
        <button
          onClick={() => setMode("default")}
          className="absolute top-0 right-0  rounded-full p-2 h-fit w-fit  hover:text-primary z-20"
        >
          <Icons.close className="h-6 w-6" />
        </button>
      )}
      <div className="w-full overflow-scroll relative h-full z-10">
        <div
          style={{width: isHovering ? "100%" : "calc(100vw - 110px - 1000px)"}}
          className="p-4 absolute  "
        >
          <div className="flex flex-col">
            <h1 className="font-bold text-xl">{title}</h1>
            <p className=" text-sm ">{description}</p>
          </div>

          <div className="h-full overflow-scrolls ">
            <div className="h-fit">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Images = () => {
  const {userImages, uploadImage, setUserImages, addImageToSlide} =
    usePresentation()!;

  const {currentUser} = useAuth()!;

  useEffect(() => {
    const fetchUserImages = async () => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserImages(docSnap.data().userImagesLocal);
        }
      }
    };
    fetchUserImages();
  }, [currentUser, setUserImages]);

  const [open, setOpen] = React.useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    uploadImage(e.target.files![0]);
  };

  return (
    <TabContent title="Images" description="Add images to your slides">
      <div className="flex flex-col gap-4 w-full mt-4s ">
        {/* <h1 className="font-bold text-lg">Images</h1> */}
        <div className="flex flex-col gap-2">
          <input
            id="image-input"
            type="file"
            className="hidden"
            onInput={onFileChange}
          />
          <Button
            onClick={() => {
              document.getElementById("image-input")?.click();
            }}
          >
            <Icons.image className="h-6 w-6 mr-2" />
            Import an image
          </Button>
          <Button variant={"outline"}>
            <Icons.magicWand className="h-6 w-6 mr-2" />
            AI Magic Images
          </Button>
        </div>
        {userImages && userImages.length > 0 && (
          <div className="flex flex-col gap-2">
            <Label className="font-bold">Your Images</Label>

            <div className="h-fit max-h-[150px] overflow-scroll">
              <div className="grid grid-cols-3 gap-2">
                {userImages.map((image: ImageType) => (
                  <button
                    key={image.title}
                    onClick={() => {
                      addImageToSlide(image, {x: 400, y: 200});
                    }}
                    className="h-20 w-full bg-muted rounded-sm relative border-4 border-muted hover:border-primary"
                  >
                    <img
                      src={image.path}
                      alt={image.title}
                      className="object-cover h-full w-full rounded-sm"
                    />
                    {/* <div className="absolute top-0 right-0 p-1 bg-black bg-opacity-50 text-white text-xs rounded-bl-sm">
                        <Icons.trash className="h-6 w-6" />
                      </div> */}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </TabContent>
  );
};

const Text = () => {
  const {
    slideData,
    selectedSlide,
    setSlideData,
    setActiveEdit,
    selectedTextBox,
    textColor,
  } = usePresentation()!;

  const createNewTextBox = (
    fontSize: number,
    text: string,
    position: Position
  ) => {
    if (slideData && selectedSlide) {
      const textBoxId = Math.random().toString();
      const updatedSlideData = {
        ...slideData,
        slides: slideData.slides.map((slide) => {
          if (slide.id === selectedSlide.id) {
            return {
              ...slide,
              textBoxes: [
                ...slide.textBoxes,
                {
                  text,
                  position,
                  size: {
                    width: 600,
                  },
                  rotation: 0,
                  textBoxId,
                  fontSize,
                },
              ],
            };
          }
          return slide;
        }),
      };
      setSlideData(updatedSlideData);
      setActiveEdit(textBoxId);
    }
  };

  return (
    <TabContent title="Text" description="Add text to your slides">
      <div className="flex flex-col gap-4 w-full mt-2">
        {/* <h1 className="font-bold text-lg">Text </h1> */}

        <div className="flex flex-col gap-2">
          <Button
            onClick={() => {
              createNewTextBox(
                24,
                `<p><font color="${textColor}">Add text here</font></p>`,
                {x: 20, y: 100}
              );
            }}
          >
            <Icons.text className="h-6 w-6 mr-2" />
            Add a text box
          </Button>
          <Button variant={"outline"}>
            <Icons.magicWand className="h-6 w-6 mr-2" />
            AI Magic Write
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="font-bold">Default Text Styles</Label>

          <Button
            onClick={() => {
              createNewTextBox(
                40,
                `<p><b><font color="${textColor}">Add heading here</font></p></b>`,
                {
                  x: 20,
                  y: 20,
                }
              );
            }}
            variant={"outline"}
            className="text-2xl text-left justify-start py-4 font-bold"
          >
            Add a heading
          </Button>
          <Button
            onClick={() => {
              createNewTextBox(
                24,
                `<p><font color="${textColor}">Add subheading here</font></p>`,
                {
                  x: 20,
                  y: 100,
                }
              );
            }}
            variant={"outline"}
            className="text-lg text-left justify-start py-2"
          >
            Add a subheading
          </Button>
          <Button
            onClick={() => {
              createNewTextBox(
                16,
                `<p><font color="${textColor}">Add body text here</font></p>`,
                {
                  x: 20,
                  y: 100,
                }
              );
            }}
            variant={"outline"}
            className="text-sm text-left justify-start py-1"
          >
            Add a body text
          </Button>
        </div>
      </div>
    </TabContent>
  );
};

const Layouts = () => {
  return (
    <TabContent title="Layouts" description="Change the layout of your slides">
      <div className="grid grid-cols-2 overflow-scroll gap-4 h-fit w-full ">
        <div className="w-full bg-background rounded-lg  aspect-[16/9] border-4 hover:border-primary/70"></div>
        <div className="w-full bg-background rounded-lg  aspect-[16/9] border-4 hover:border-primary/70"></div>
        <div className="w-full bg-background rounded-lg  aspect-[16/9] border-4 hover:border-primary/70"></div>
        <div className="w-full bg-background rounded-lg  aspect-[16/9] border-4 hover:border-primary/70"></div>
        <div className="w-full bg-background rounded-lg  aspect-[16/9] border-4 hover:border-primary/70"></div>
      </div>
    </TabContent>
  );
};

const Themes = () => {
  return (
    <TabContent
      title="Themes"
      description="Change the look and feel of your presentation"
    >
      <div className="grid grid-cols-2 overflow-scroll gap-4 h-fit w-full">
        <div className="w-full bg-background rounded-lg  aspect-[16/9] border-4 hover:border-primary/70"></div>
        <div className="w-full bg-background rounded-lg  aspect-[16/9] border-4 hover:border-primary/70"></div>
        <div className="w-full bg-background rounded-lg  aspect-[16/9] border-4 hover:border-primary/70"></div>
        <div className="w-full bg-background rounded-lg  aspect-[16/9] border-4 hover:border-primary/70"></div>
        <div className="w-full bg-background rounded-lg  aspect-[16/9] border-4 hover:border-primary/70"></div>
      </div>
    </TabContent>
  );
};

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

  const [editMode, setEditMode] = React.useState<boolean>(true);

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
      label: "Write More",
      icon: Icons.pencil,
      description: "Ai will write more content for you",
      background: "bg-primary",
      buttonLabel: "Write More",
      prompt: "Write more content",
    },
    {
      label: "Make it shorter",
      icon: Icons.ruler,
      description: "Ai will shorten the content",
      background: "bg-theme-purple",
      buttonLabel: "Shorten",
      prompt: "Shorten the content",
    },
    {
      label: "Rewrite",
      icon: Icons.reWrite,
      description: "Ai will rewrite the content",
      background: "bg-theme-red",
      buttonLabel: "Rewrite textboxes",
      prompt: "Rewrite the content",
    },
    {
      label: "More fun",
      icon: Icons.smile,
      description: "Ai will make the content more fun",
      background: "bg-theme-yellow",
      buttonLabel: "Make more fun",
      prompt: "Make the content more fun",
    },
    {
      label: "More detail",
      icon: Icons.addMore,
      description: "Ai will add more detail to the content",
      background: "bg-theme-orange",
      buttonLabel: "Add more detail",
      prompt: "Add more detail to the content",
    },
    {
      label: "Custom Rewrite",
      icon: Icons.wand2,
      description: "Tell Ai how to rewrite the content",
      background: "bg-theme-green",
      buttonLabel: "Apply Instructions",
      prompt: "",
    },
  ];

  const [selectedPreset, setSelectedPreset] = React.useState<Preset>(
    AiRewritePresets[0]
  );

  console.log("selectedForAiWrite", selectedForAiWrite);

  return (
    <>
      <div className="flex flex-col overflow-scroll   disableTextboxListeners">
        {editMode ? (
          <TabContent
            title={selectedPreset?.label}
            description={selectedPreset?.description}
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
                  className={`flex flex-wrap gap-1 bg-muted p-2 max-h-[450px] overflow-scroll
                  ${
                    selectedPreset && selectedPreset.label === "Custom Rewrite"
                      ? "max-h-[250px]"
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
                className={`text-white rounded-md py-2 group flex items-center justify-center gap-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ${selectedPreset.background}`}
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
          </TabContent>
        ) : (
          <TabContent
            title="Magic Rewrite"
            description="Use the power of AI to quickly rewrite your content"
          >
            <div className="flex flex-col gap-3 mt-4 flex-grow ">
              <div className="gap-4 flex flex-col justify-between w-full ">
                {/* <Label className="font-bold">Magic Options</Label> */}
                {AiRewritePresets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setSelectedPreset(preset);
                      setEditMode(true);
                    }}
                    className="flex items-center gap-2 hover:bg-muted rounded-[4px] rounded-r-full p-1 h-fit justify-start font-bold group pr-4"
                  >
                    <div
                      className={`p-1 h-fit w-fit rounded-[4px] text-white ${preset.background}`}
                    >
                      <preset.icon className="h-6 w-6" />
                    </div>
                    {preset.label}
                    <Icons.chevronRight className="h-4 w-4 ml-auto " />
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
