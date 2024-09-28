"use client";
import React, {useEffect} from "react";
import {Icons} from "@/components/icons";
import {usePresentation} from "@/context/presentation-context";
import {HexColorPicker, HexColorInput} from "react-colorful";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import debounce from "lodash.debounce";

export const ColorMenu = ({
  colorCommand,
  currentColor,
}: {
  colorCommand: (color: string) => void;
  currentColor: string;
}) => {
  const {recentColors} = usePresentation()!;

  const [color, setColor] = React.useState<string>(currentColor);

  const debounceColorCommand = debounce((color: string) => {
    colorCommand(color);
  }, 0);

  useEffect(() => {
    if (color === currentColor) return;
    debounceColorCommand(color);
  }, [color]);

  return (
    <div className=" relative w-full ">
      <Tabs defaultValue="custom" className="w-full">
        <TabsList className="w-fit">
          <TabsTrigger value="custom">Custom</TabsTrigger>
          <TabsTrigger value="default">Default</TabsTrigger>
        </TabsList>
        <TabsContent value="custom" className="h-fit w-full">
          <section className="color-picker   rounded-md flex flex-col gap-3">
            <HexColorPicker color={color} onChange={setColor} />
            <div className="grid grid-cols-[30px_1fr] items-center gap-2">
              <div
                style={{background: currentColor}}
                className="w-full aspect-square border rounded-[12px]"
              ></div>
              {/* <input
              onChange={(e) => setColor(e.target.value)}
                type="text"
                value={currentColor}
                placeholder="Enter color code"
                className="w-full p-2 rounded-md border border-border"
              /> */}
              <HexColorInput
                prefixed={true}
                color={color}
                onChange={setColor}
                className="w-full p-2 rounded-md border border-border disableSelector"
              />
            </div>
          </section>

          {recentColors && recentColors.length > 0 && (
            <>
              <div className="flex items-center gap-1 mt-2">
                <Icons.history className="h-5 w-5" />
                Recent colors
              </div>

              <div className="grid grid-cols-6 gap-1 w-full mt-1">
                {recentColors.slice(0, 12).map((color) => {
                  return (
                    <TooltipProvider key={color}>
                      <Tooltip delayDuration={500}>
                        <TooltipTrigger>
                          <button
                            key={color}
                            onClick={() => setColor(color)}
                            style={{background: color}}
                            className={`rounded-full w-full aspect-square border hover:border-4 hover:border-border 
                    
                    ${
                      currentColor === color
                        ? "border-border hover:border-4"
                        : " "
                    }
                    `}
                          ></button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{color}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            </>
          )}
        </TabsContent>
        <TabsContent value="default" className="w-full">
          <div className="flex items-center gap-1">
            <Icons.palette className="h-5 w-5" />
            Default colors
          </div>

          <div className="flex flex-col  mt-2 w-full flex-grow  rounded-md ">
            {colors.map((color) => {
              return (
                <div
                  key={color.paletteName}
                  className="grid grid-cols-8 w-full  h-fit overflow-hidden gap-0"
                >
                  {color.swatches.reverse().map((swatch) => (
                    <TooltipProvider>
                      <Tooltip delayDuration={500}>
                        <TooltipTrigger>
                          <button
                            onClick={() => setColor(swatch.color)}
                            style={{background: swatch.color}}
                            className={`rounded-full w-full aspect-square border-[2px]  hover:border-muted-foreground relative
                  
                    `}
                          >
                            {currentColor === swatch.color && (
                              <Icons.check
                                className={`h-4 w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                ${
                                  ["900", "800", "700", "600"].includes(
                                    swatch.name
                                  )
                                    ? "text-white"
                                    : "text-black"
                                }
                                
                                `}
                              />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{swatch.color}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const defaultShortColors = [
  "#FE3030",
  "#CB6CE5",
  "#05C0DF",
  "#7ED857",
  "#FF904D",
];

const defaultColors = [
  "#000000",
  "#545454",
  "#737373",
  "#A6A6A6",
  "#D9D9D9",
  "#FFFFFF",
  "#FE3030",
  "#FF5756",
  "#FF66C3",
  "#CB6CE5",
  "#8C51FF",
  "#5E15EB",
  "#0097B2",
  "#05C0DF",
  "#5BE1E6",
  "#38B6FF",
  "#5271FE",
  "#004AAD",
  "#00BF62",
  "#7ED857",
  "#C0FF72",
  "#FEDE59",
  "#FEBC59",
  "#FF904D",
];

const colors = [
  {
    paletteName: "gray",
    swatches: [
      {
        name: "200",
        color: "#ffffff",
      },
      {
        name: "400",
        color: "#cbd5e0",
      },

      {
        name: "500",
        color: "#a0aec0",
      },
      {
        name: "600",
        color: "#718096",
      },
      {
        name: "700",
        color: "#4a5568",
      },
      {
        name: "800",
        color: "#2d3748",
      },
      {
        name: "900",
        color: "#1a202c",
      },
      {
        name: "900",
        color: "#000000",
      },
    ],
  },
  {
    paletteName: "red",
    swatches: [
      {
        name: "200",
        color: "#fed7d7",
      },
      {
        name: "300",
        color: "#feb2b2",
      },
      {
        name: "400",
        color: "#fc8181",
      },
      {
        name: "500",
        color: "#f56565",
      },
      {
        name: "600",
        color: "#e53e3e",
      },
      {
        name: "700",
        color: "#c53030",
      },
      {
        name: "800",
        color: "#9b2c2c",
      },
      {
        name: "900",
        color: "#742a2a",
      },
    ],
  },
  {
    paletteName: "orange",
    swatches: [
      {
        name: "200",
        color: "#feebc8",
      },
      {
        name: "300",
        color: "#fbd38d",
      },
      {
        name: "400",
        color: "#f6ad55",
      },
      {
        name: "500",
        color: "#ed8936",
      },
      {
        name: "600",
        color: "#dd6b20",
      },
      {
        name: "700",
        color: "#c05621",
      },
      {
        name: "800",
        color: "#9c4221",
      },
      {
        name: "900",
        color: "#7b341e",
      },
    ],
  },
  {
    paletteName: "yellow",
    swatches: [
      {
        name: "200",
        color: "#fefcbf",
      },
      {
        name: "300",
        color: "#faf089",
      },
      {
        name: "400",
        color: "#f6e05e",
      },
      {
        name: "500",
        color: "#ecc94b",
      },
      {
        name: "600",
        color: "#d69e2e",
      },
      {
        name: "700",
        color: "#b7791f",
      },
      {
        name: "800",
        color: "#975a16",
      },
      {
        name: "900",
        color: "#744210",
      },
    ],
  },
  {
    paletteName: "green",
    swatches: [
      {
        name: "200",
        color: "#c6f6d5",
      },
      {
        name: "300",
        color: "#9ae6b4",
      },
      {
        name: "400",
        color: "#68d391",
      },
      {
        name: "500",
        color: "#48bb78",
      },
      {
        name: "600",
        color: "#38a169",
      },
      {
        name: "700",
        color: "#2f855a",
      },
      {
        name: "800",
        color: "#276749",
      },
      {
        name: "900",
        color: "#22543d",
      },
    ],
  },
  {
    paletteName: "teal",
    swatches: [
      {
        name: "200",
        color: "#b2f5ea",
      },
      {
        name: "300",
        color: "#81e6d9",
      },
      {
        name: "400",
        color: "#4fd1c5",
      },
      {
        name: "500",
        color: "#38b2ac",
      },
      {
        name: "600",
        color: "#319795",
      },
      {
        name: "700",
        color: "#2c7a7b",
      },
      {
        name: "800",
        color: "#285e61",
      },
      {
        name: "900",
        color: "#234e52",
      },
    ],
  },
  {
    paletteName: "blue",
    swatches: [
      {
        name: "200",
        color: "#bee3f8",
      },
      {
        name: "300",
        color: "#90cdf4",
      },
      {
        name: "400",
        color: "#63b3ed",
      },
      {
        name: "500",
        color: "#4299e1",
      },
      {
        name: "600",
        color: "#3182ce",
      },
      {
        name: "700",
        color: "#2b6cb0",
      },
      {
        name: "800",
        color: "#2c5282",
      },
      {
        name: "900",
        color: "#2a4365",
      },
    ],
  },
  {
    paletteName: "indigo",
    swatches: [
      {
        name: "200",
        color: "#c3dafe",
      },
      {
        name: "300",
        color: "#a3bffa",
      },
      {
        name: "400",
        color: "#7f9cf5",
      },
      {
        name: "500",
        color: "#667eea",
      },
      {
        name: "600",
        color: "#5a67d8",
      },
      {
        name: "700",
        color: "#4c51bf",
      },
      {
        name: "800",
        color: "#434190",
      },
      {
        name: "900",
        color: "#3c366b",
      },
    ],
  },
  {
    paletteName: "purple",
    swatches: [
      {
        name: "200",
        color: "#e9d8fd",
      },
      {
        name: "300",
        color: "#d6bcfa",
      },
      {
        name: "400",
        color: "#b794f4",
      },
      {
        name: "500",
        color: "#9f7aea",
      },
      {
        name: "600",
        color: "#805ad5",
      },
      {
        name: "700",
        color: "#6b46c1",
      },
      {
        name: "800",
        color: "#553c9a",
      },
      {
        name: "900",
        color: "#44337a",
      },
    ],
  },
  {
    paletteName: "pink",
    swatches: [
      {
        name: "200",
        color: "#fed7e2",
      },
      {
        name: "300",
        color: "#fbb6ce",
      },
      {
        name: "400",
        color: "#f687b3",
      },
      {
        name: "500",
        color: "#ed64a6",
      },
      {
        name: "600",
        color: "#d53f8c",
      },
      {
        name: "700",
        color: "#b83280",
      },
      {
        name: "800",
        color: "#97266d",
      },
      {
        name: "900",
        color: "#702459",
      },
    ],
  },
];
