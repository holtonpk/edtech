import React, {Children, useEffect, useRef, SVGProps} from "react";
import {Icons} from "@/components/icons";
import {usePresentation} from "@/context/presentation-context";
import {Modes, Position, Image as ImageType} from "@/config/data";
import ProfileNav from "../../../../components/profile-nav";
import Images from "./components/images";
import Layouts from "./components/layouts";
import Themes from "./components/themes";
import AiRewrite from "./components/ai-write";
import Shapes from "./components/shapes";
import Text from "./components/text";
import {OverridableComponent} from "@mui/material/OverridableComponent";
import {SvgIconTypeMap} from "@mui/material";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {GeneratedText, Preset} from "@/config/data";
import {AiRewritePresets} from "./components/ai-write/data";

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
      <ActionPanel />
    </HoverContextProvider>
  );
};

type TabButtonType = {
  name: string;
  description: string;
  value: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {muiName: string};
  color: string;
  height: string;
  HoverElement: React.ReactNode;
  Element: React.ReactNode;
};

const MobileActionPanel = ({TabButtons}: {TabButtons: TabButtonType[]}) => {
  return (
    <div className="w-full bg-background h-fit  rounded-md flex items-center justify-between px-4">
      {TabButtons.map((tab, index) => {
        return <MobileTab tab={tab} key={index} />;
      })}
    </div>
  );
};

const MobileTab = ({tab}: {tab: TabButtonType}) => {
  const Icon = tab.icon;

  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <button
          className={`flex flex-col h-16 w-16 aspect-square  items-center justify-center group  relative  rounded-md   transition-all duration-200
          ${open && "bg-muted-foreground/5 text-primary"}
    `}
        >
          <Icon
            className={`h-6 w-6 opacity-100
    `}
          />
          <span
            className={`text-[12px] whitespace-nowrap poppins-regular
    `}
          >
            {tab.name}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        className="w-[300px] h-fit p-0 bg-background"
      >
        {tab.Element}
      </PopoverContent>
    </Popover>
  );
};

const ActionPanel = () => {
  const {mode, setMode, uploadImage} = usePresentation()!;

  // const [hoverValue, setHoverValue] = React.useState<string | null>(null);

  const {isHovering, setIsHovering, setHoveredIndex, setIsHoveringGroup} =
    useHover()!;
  const [hoverValue, setHoverValue] = React.useState<string | null>(null);

  const hoveredIndex = useRef<number | null>(null);

  const prevHoveredElement = useRef<string | null>(null);

  const onButtonHover = (id: any, index: number) => {
    if (mode !== "default") return;
    setIsHovering(true);
    setHoverValue(id);
    setHoveredIndex(index);
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
    hoverContainer.style.height = TabButtons[index].height + "px";
    hoverContainer.style.display = "block";
    hoverPoint.style.display = "block";
    hoverContainerMain.style.top = buttonContainer?.offsetTop - 30 + "px";
    hoverContainerMain.style.left = buttonElement?.clientWidth + 30 + "px";
    hoverContainerMain.style.height = TabButtons[index].height + "px";

    // hover indicator should animate to the top of the button
    hoverIndicator.style.height = buttonElement?.clientHeight + "px";
    hoverIndicator.style.top = buttonContainer?.offsetTop + "px";

    animatedHoverContainer.classList.remove("slide-down-out");
    animatedHoverContainer.classList.remove("slide-up-out");
    animatedHoverContainer.classList.remove("slide-right");
    animatedHoverContainer.classList.remove("slide-down-in");
    animatedHoverContainer.classList.remove("slide-up-in");

    animatedHoverContainer.style.height = TabButtons[index].height + "px";

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

    const hoverContainer = document.getElementById("hoverContainer");
    if (hoverContainer) hoverContainer.style.display = "block";
    const hoverIndicator = document.getElementById("hover-indicator");
    if (hoverIndicator) hoverIndicator.style.display = "block";
  };

  const onHoverGroupOff = () => {
    if (mode !== "default") return;

    setHoverValue(null);

    const hoverContainer = document.getElementById("hoverContainer");
    if (hoverContainer) hoverContainer.style.display = "none";
    const hoverIndicator = document.getElementById("hover-indicator");
    if (hoverIndicator) hoverIndicator.style.display = "none";

    const hoverPoint = document.getElementById(
      prevHoveredElement.current + "-hover-point"
    );
    if (hoverPoint) hoverPoint.style.display = "none";

    const prevHoverContainer = document.getElementById(
      prevHoveredElement.current + "-hoverContainer"
    );
    if (prevHoverContainer) prevHoverContainer.style.display = "none";

    // document.getElementById(
    //   hoveredIndex.current + "-hoverContainer"
    // )!.style.display = "none";

    hoveredIndex.current = null;
    prevHoveredElement.current = null;
  };

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      onHoverGroupOff();
    }, 500);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onHoverGroup;
  };

  const [isLoaderImage, setIsLoaderImage] = React.useState(false);

  // states for ai rewrite
  const [aiTab, setAiTab] = React.useState<"start" | "config" | "apply">(
    "start"
  );
  const [generatedData, setGeneratedData] = React.useState<GeneratedText[]>([]);

  useEffect(() => {
    if (mode !== "aiRewrite") {
      setAiTab("start");
    }
  }, [mode]);

  const [selectedPreset, setSelectedPreset] = React.useState<Preset>(
    AiRewritePresets[0]
  );

  const TabButtons: TabButtonType[] = [
    {
      name: "Themes",
      description: "Change the look and feel of your presentation",
      value: "themes",
      icon: Icons.theme,
      color: "hsla(0 100% 50 / 1)",
      height: "450",
      HoverElement: (
        <HoverContainer id="themes">
          <Themes />
        </HoverContainer>
      ),
      Element: <Themes />,
    },
    {
      name: "Layouts",
      description: "Change the layout of your slides",
      value: "layout",
      icon: Icons.layout,
      color: "hsla(21 92% 47% / 1)",
      height: "500",

      HoverElement: (
        <HoverContainer id="layout">
          <Layouts />
        </HoverContainer>
      ),
      Element: <Layouts />,
    },

    {
      name: "Text",
      description: "Add text to your slides",
      value: "text",
      icon: Icons.text,
      color: "hsla(212 90% 58% / 1)",
      height: "350",

      HoverElement: (
        <HoverContainer id="text">
          <Text />
        </HoverContainer>
      ),
      Element: <Text />,
    },
    // {
    //   name: "Shapes",
    //   description: "Add shapes to your slides",
    //   value: "shapes",
    //   icon: Icons.shapes as any,
    //   color: "hsla(21 92% 47% / 1)",
    //   height: "500",

    //   HoverElement: (
    //     <HoverContainer id="shapes">
    //       <Shapes />
    //     </HoverContainer>
    //   ),
    //   Element: <Shapes />,
    // },
    {
      name: "Images",
      description: "Add images to your slides",
      value: "images",
      icon: Icons.image,
      color: "hsla(259 82% 67% / 1)",
      height: "240",

      HoverElement: (
        <HoverContainer id="images">
          <Images
            onFileChange={onFileChange}
            isLoaderImage={isLoaderImage}
            setIsLoaderImage={setIsLoaderImage}
          />
        </HoverContainer>
      ),
      Element: (
        <Images
          onFileChange={onFileChange}
          isLoaderImage={isLoaderImage}
          setIsLoaderImage={setIsLoaderImage}
        />
      ),
    },
    {
      name: "Ai Write",
      description: "Use the power of AI to quickly rewrite your content",
      value: "aiRewrite",
      icon: Icons.magicWand,
      color: "hsla(138 40% 48% / 1)",
      height: "440",

      HoverElement: (
        <HoverContainer id="aiRewrite">
          <AiRewrite
            tab={aiTab}
            setTab={setAiTab}
            generatedData={generatedData}
            setGeneratedData={setGeneratedData}
            selectedPreset={selectedPreset}
            setSelectedPreset={setSelectedPreset}
          />
        </HoverContainer>
      ),
      Element: (
        <AiRewrite
          tab={aiTab}
          setTab={setAiTab}
          generatedData={generatedData}
          setGeneratedData={setGeneratedData}
          selectedPreset={selectedPreset}
          setSelectedPreset={setSelectedPreset}
        />
      ),
    },
  ];

  // this is for image tab probably should be moved to images component but for now it's here
  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIsLoaderImage(true);
    setMode("images");
    setIsHovering(false);
    setIsHoveringGroup(false);
    // onHoverGroupOff();
    await uploadImage(e.target.files![0]);
    setIsLoaderImage(false);
  }

  useEffect(() => {
    if (aiTab === "apply" || aiTab === "config") {
      setMode("aiRewrite");
      setIsHovering(false);
      setIsHoveringGroup(false);
      onHoverGroupOff();
    }
  }, [aiTab]);

  return (
    <>
      <div className="hidden md:block h-full">
        <div className="flex h-full justify-center relative  origin-right  ">
          <div
            className={`flex flex-col bg-background border px-2 rounded-md blurBack w-[70px] h-full gap-2 mr-auto items-center  py-4    relative z-[60]

`}
          >
            <div
              className="relative flex flex-col w-full h-fit gap-2"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
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
                      />
                      <span
                        className={`text-[12px] whitespace-nowrap poppins-regular
                  ${
                    mode === tab.value || hoverValue === tab.value
                      ? "text-primary"
                      : "currentColor group-hover:text-primary"
                  }
                  `}
                      >
                        {tab.name}
                      </span>
                    </button>
                    {tab.HoverElement}
                  </div>
                );
              })}

              <div
                id="hoverContainer"
                className={`fixed hidden top-transition left-[200px] z-[9] bg-background   w-[350px] shadow-xl fade-in-500 rounded-md  border

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

          {mode === "shapes" && <Shapes />}

          {mode === "aiRewrite" && (
            <AiRewrite
              tab={aiTab}
              setTab={setAiTab}
              generatedData={generatedData}
              setGeneratedData={setGeneratedData}
              selectedPreset={selectedPreset}
              setSelectedPreset={setSelectedPreset}
            />
          )}
          {mode === "themes" && <Themes />}
          {mode === "text" && <Text />}
          {mode === "images" && (
            <Images
              onFileChange={onFileChange}
              isLoaderImage={isLoaderImage}
              setIsLoaderImage={setIsLoaderImage}
            />
          )}
          {mode === "layout" && <Layouts />}
        </div>
      </div>
      <div className="md:hidden w-full ">
        <MobileActionPanel TabButtons={TabButtons} />
      </div>
    </>
  );
};

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
      className={`fixed  z-[10000]   hidden  w-[348px] rounded-md 
            
            
            `}
    >
      <div className="relative overflow-hidden w-[350px] z-10">
        <div
          id={id + "-animated-hoverContainer"}
          className="relative  w-[350px] "
        >
          {children}
        </div>
      </div>
    </div>
  );
};
