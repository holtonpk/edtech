import React, {useEffect} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Icons} from "@/components/icons";
import {usePresentation} from "@/context/presentation-context";
import {Button} from "@/components/ui/button";
import {set} from "zod";
import {Description} from "@radix-ui/react-dialog";
import {Modes, Position} from "@/config/data";
import {getDoc, doc} from "firebase/firestore";
import {db} from "@/config/firebase";
import {useAuth} from "@/context/user-auth";
import ProfileNav from "../../../../components/profile-nav";

const RightPanel = () => {
  const {mode, setMode} = usePresentation()!;

  const TabButtons = [
    {
      name: "Themes",
      description: "Change the look and feel of your presentation",
      value: "themes",
      icon: Icons.theme,
      color: "hsla(0 100% 50 / 1)",
    },
    {
      name: "Layouts",
      description: "Change the layout of your slides",
      value: "layout",
      icon: Icons.layout,
      color: "hsla(21 92% 47% / 1)",
    },
    {
      name: "Ai Write",
      description: "Use the power of AI to quickly rewrite your content",
      value: "aiRewrite",
      icon: Icons.magicWand,
      color: "hsla(138 40% 48% / 1)",
    },
    {
      name: "Text",
      description: "Add text to your slides",
      value: "text",
      icon: Icons.text,
      color: "hsla(212 90% 58% / 1)",
    },
    {
      name: "Images",
      description: "Add images to your slides",
      value: "images",
      icon: Icons.image,
      color: "hsla(259 82% 67% / 1)",
    },
  ];

  return (
    <div className="flex h-full justify-center relative  origin-right  ">
      <div
        className={`flex flex-col bg-background/30 border rounded-md blurBack w-[70px] h-full gap-4 mr-auto items-center  py-4    relative z-[60]

`}
      >
        {TabButtons.map((tab, index) => {
          const Icon = tab.icon;
          return (
            <button
              id={tab.value + "-menu-button"}
              key={index}
              onClick={() => setMode(tab.value as Modes)}
              className={`flex flex-col  h-fit aspect-square p-2  items-center group gap-1 relative border rounded-md shadow-sm  transition-all duration-200 hover:bg-muted-foreground/5 
text-muted-foreground
                `}
            >
              <Icon
                className={`h-6 w-6 opacity-100
 ${mode === tab.value ? "text-primary" : "currentColor"}
                `}
                // style={{color: mode === tab.value ? tab.color : "currentColor"}}
              />

              <div
                // style={{background: tab.color}}
                className={`h-[5px] w-[5px] rounded-full absolute  z-10 top-1/2 -translate-y-1/2 -right-[10px] fade-in-0 duration-500 bg-primary  ${
                  mode === tab.value ? "fade-in-500" : "fade-out-500"
                }`}
              ></div>
            </button>
          );
        })}
        <div className="mt-auto">
          <ProfileNav />
        </div>
      </div>

      {mode === "aiRewrite" && <AiRewrite />}
      {mode === "themes" && <Themes />}
      {mode === "text" && <Text />}
      {mode === "images" && <Images />}
      {mode === "layout" && <Layouts />}
    </div>
  );
};

export default RightPanel;

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
  return (
    <div
      style={{width: "calc(100% - 85px"}}
      className="translate-x-full  h-full z-[80] bg-background/30 blurBack rounded-md  border  absolute left-[80px] shadow-lg tab-content-animation"
    >
      <button
        onClick={() => setMode("default")}
        className="absolute top-0 right-0  rounded-full p-2 h-fit w-fit  hover:text-primary z-20"
      >
        <Icons.close className="h-4 w-4" />
      </button>
      <div className="w-full overflow-hidden relative  h-full z-10">
        <div
          style={{width: "calc(100vw - 110px - 1000px)"}}
          className="p-4 absolute right-0"
        >
          <div className="flex flex-col">
            <h1 className="font-bold text-xl">{title}</h1>
            <p className=" text-sm ">{description}</p>
          </div>

          <div className="h-full overflow-scroll ">
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

  const fetchUserImages = async () => {
    if (currentUser) {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserImages(docSnap.data().userImagesLocal);
      }
    }
  };

  useEffect(() => {
    fetchUserImages();
  }, []);

  const [open, setOpen] = React.useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    uploadImage(e.target.files![0]);
  };
  return (
    <TabContent title="Images" description="Add images to your slides">
      <div className="flex flex-col gap-4 w-full mt-4s">
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
            <Icons.image className="h-4 w-4 mr-2" />
            Import an image
          </Button>
          <Button variant={"outline"}>
            <Icons.magicWand className="h-4 w-4 mr-2" />
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
                        <Icons.trash className="h-4 w-4" />
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
            <Icons.text className="h-4 w-4 mr-2" />
            Add a text box
          </Button>
          <Button variant={"outline"}>
            <Icons.magicWand className="h-4 w-4 mr-2" />
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
      <div className="grid grid-cols-2 overflow-scroll gap-4 h-fit ">
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
      <div className="grid grid-cols-2 overflow-scroll gap-4 h-fit ">
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
  const {setMode, selectedTextBox, updateData} = usePresentation()!;

  const [originalText, setOriginalText] = React.useState<string>(
    selectedTextBox?.text
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

  return (
    <TabContent
      title="Magic Rewrite"
      description="Use the power of AI to quickly rewrite your content"
    >
      <div className="flex flex-col overflow-scroll  h-full disableTextboxListeners">
        {generatedText ? (
          <div className="flex flex-col gap-2 h-full">
            <button
              onClick={() => changeTextToVersion(originalText)}
              className="w-full "
            >
              <Label className="font-bold">Original</Label>
              <div
                className="bg-muted border rounded-md p-2 max-h-[150px] overflow-scroll"
                dangerouslySetInnerHTML={{
                  __html: originalText,
                }}
              />
            </button>
            {generatedText?.map((text, index) => (
              <button
                onClick={() => changeTextToVersion(text.text)}
                key={text.id}
                className="w-full hover:border-primary border"
              >
                <Label className="font-bold">Version {index + 1}</Label>
                <div
                  className="bg-muted rounded-md p-2 max-h-[150px] overflow-scroll border"
                  dangerouslySetInnerHTML={{
                    __html: text.text,
                  }}
                />
              </button>
            ))}
          </div>
        ) : (
          <>
            {selectedTextBox ? (
              <div className="flex flex-col gap-3 mt-4 h-full ">
                <div className="flex flex-col gap-2">
                  <Label className="font-bold">Selected text</Label>
                  <div
                    className="bg-muted rounded-md p-2 max-h-[150px] overflow-scroll"
                    dangerouslySetInnerHTML={{
                      __html: extractTextFromHTML(selectedTextBox?.text),
                    }}
                  />
                </div>

                <div className="flex flex-col gap-2 disableTextboxListeners">
                  <Label>Describe the change</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="no-resize border-primary "
                    placeholder="describe the change (ex. make it shorter or use a more fun playful tone) "
                  ></Textarea>
                </div>
                <div className="flex gap-1 mt-auto flex-col">
                  <Button
                    onClick={() => generateText()}
                    disabled={!description}
                    className="text-white bg-rose-600  rounded-md col-span-2 "
                  >
                    {isGenerating && (
                      <Icons.spinner className="h-4 w-4 animate-spin mr-2" />
                    )}
                    Generate
                  </Button>
                  <Button onClick={() => setMode("default")} variant={"ghost"}>
                    <Icons.chevronLeft className="h-4 w-4" />
                    Exit AI Rewrite
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 mt-4 h-full items-center pt-20">
                <div className="flex flex-col items-center bg-muted rounded-md h-fit w-fit p-6">
                  <Icons.click className="h-16 w-16 text-primary" />

                  <h1 className="text-primary">
                    Click on a textbox to rewrite
                  </h1>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </TabContent>
  );
};
