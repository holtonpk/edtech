import React, {Children, useEffect, useRef} from "react";
import {Icons} from "@/components/icons";
import {usePresentation} from "@/context/presentation-context";
import {Modes, Position, Image as ImageType} from "@/config/data";
import ProfileNav from "../../../../components/profile-nav";
import Images from "./components/images";
import Layouts from "./components/layouts";
import Themes from "./components/themes";
import AiRewrite from "./components/ai-write";
import Text from "./components/text";

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

const ActionPanel = () => {
  const {mode, setMode} = usePresentation()!;

  const TabButtons = [
    {
      name: "Themes",
      description: "Change the look and feel of your presentation",
      value: "themes",
      icon: Icons.theme,
      color: "hsla(0 100% 50 / 1)",
      height: "380",
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
      height: "500",

      HoverElement: (
        <HoverContainer id="layout">
          <Layouts />
        </HoverContainer>
      ),
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
    },
    {
      name: "Images",
      description: "Add images to your slides",
      value: "images",
      icon: Icons.image,
      color: "hsla(259 82% 67% / 1)",
      height: "300",

      HoverElement: (
        <HoverContainer id="images">
          <Images />
        </HoverContainer>
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
          <AiRewrite />
        </HoverContainer>
      ),
    },
  ];

  // const [hoverValue, setHoverValue] = React.useState<string | null>(null);

  const {isHovering, setIsHovering, setHoveredIndex} = useHover()!;
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

  return (
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
