"use client";

import React, {
  useContext,
  useRef,
  createContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {useAuth} from "@/context/user-auth";
import {
  SlideData,
  Slide,
  Modes,
  AlignType,
  TextBoxType,
  Image,
  Position,
  Size,
  TextBoxesToUpdate,
  SlideImage,
} from "@/config/data";
import {collection, addDoc, setDoc, getDoc, doc} from "firebase/firestore";
import {db} from "@/config/firebase";
import {useRouter} from "next/navigation";
import {
  isTextBoxType,
  isTextBoxTypeArray,
  isSlide,
  isSlideImage,
  isSlideImageArray,
} from "@/lib/utils";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
  listAll,
} from "firebase/storage";
import {app} from "@/config/firebase";
import debounce from "lodash.debounce";
import {set} from "zod";
import {promises} from "dns";

interface PresentationContextType {
  // states -----------------------------
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  studyMaterial: string;
  setStudyMaterial: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  numOfSlides: number[];
  setNumOfSlides: React.Dispatch<React.SetStateAction<number[]>>;
  isGenerating: boolean;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  studyMaterialText: string;
  setStudyMaterialText: React.Dispatch<React.SetStateAction<string>>;
  slideData: SlideData | undefined;
  setSlideData: React.Dispatch<React.SetStateAction<SlideData | undefined>>;
  selectedSlide: Slide | undefined;
  setSelectedSlide: React.Dispatch<React.SetStateAction<Slide | undefined>>;
  activeEdit: string | undefined;
  setActiveEdit: React.Dispatch<React.SetStateAction<string | undefined>>;
  mode: Modes;
  setMode: React.Dispatch<React.SetStateAction<Modes>>;
  align: AlignType;
  setAlign: React.Dispatch<React.SetStateAction<AlignType>>;
  selectedTextBox: TextBoxType | undefined;
  selectedImage: SlideImage | undefined;
  activeDragGlobal: boolean;
  setActiveDragGlobal: React.Dispatch<React.SetStateAction<boolean>>;
  history: SlideData[];
  historyRef: React.MutableRefObject<SlideData[]>;
  setHistory: React.Dispatch<React.SetStateAction<SlideData[]>>;
  historyIndex: number;
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
  recentColors: string[];
  selectedSlideRef: React.MutableRefObject<Slide | undefined>;
  textColor: string;
  setTextColor: React.Dispatch<React.SetStateAction<string>>;
  userImages: Image[];
  setUserImages: React.Dispatch<React.SetStateAction<Image[]>>;
  groupSelectedTextBoxes: string[] | undefined;
  setGroupSelectedTextBoxes: React.Dispatch<
    React.SetStateAction<string[] | undefined>
  >;
  activeGroupSelectedTextBoxes: string[] | undefined;
  setActiveGroupSelectedTextBoxes: React.Dispatch<
    React.SetStateAction<string[] | undefined>
  >;
  selectedForAiWrite: string[] | undefined;

  setSelectedForAiWrite: React.Dispatch<
    React.SetStateAction<string[] | undefined>
  >;
  slideDataRef: React.MutableRefObject<SlideData | undefined>;
  groupSelectedImages: string[] | undefined;
  setGroupSelectedImages: React.Dispatch<
    React.SetStateAction<string[] | undefined>
  >;
  activeGroupSelectedImages: string[] | undefined;
  setActiveGroupSelectedImages: React.Dispatch<
    React.SetStateAction<string[] | undefined>
  >;
  selectedSlideIndexRef: React.MutableRefObject<number>;
  activeSlide: string | undefined;
  setActiveSlide: React.Dispatch<React.SetStateAction<string | undefined>>;
  activeSlideRef: React.MutableRefObject<string | undefined>;
  // functions -----------------------------

  // add upload image function
  uploadImage: (file: File) => Promise<Image>;

  updateData: (value: Partial<TextBoxType>, textBoxId: string) => void;
  updateImageData: (value: Partial<TextBoxType>, imageId: string) => void;
  addRecentColor: (color: string) => void;
  deleteSlide: (slideId: string) => void;
  createNewSlide: (index?: number) => void;
  copySlide: (slideId: string) => void;
  deleteMultiTextBoxes: () => void;
  copySelected: () => void;
  cutSelected: () => void;
  pasteSelected: () => void;
  addImageToSlide: (image: Image, position?: Position, size?: Size) => void;
  updateMultipleTextBoxes: (textBoxesToUpdate: TextBoxesToUpdate[]) => void;
  addImageToBackground: (image: Image) => void;
}

const PresentationContext = createContext<PresentationContextType | null>(null);

export function usePresentation() {
  return useContext(PresentationContext);
}

interface Props {
  children?: React.ReactNode;
  projectId: string;
}

export const PresentationProvider = ({children, projectId}: Props) => {
  // states -----------------------------
  const [title, setTitle] = useState<string>("");
  const [studyMaterial, setStudyMaterial] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [numOfSlides, setNumOfSlides] = useState<number[]>([5]);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [studyMaterialText, setStudyMaterialText] = useState<string>("");

  // const [slideData, setSlideData] = useState<SlideData | undefined>(DummyData);
  const [slideData, setSlideData] = useState<SlideData | undefined>(undefined);

  const [recentColors, setRecentColors] = useState<string[]>([]);

  const [selectedSlide, setSelectedSlide] = React.useState<Slide | undefined>(
    undefined
  );

  const [activeSlide, setActiveSlide] = useState<string | undefined>();

  const activeSlideRef = useRef<string | undefined>(activeSlide);

  useEffect(() => {
    activeSlideRef.current = activeSlide;
  }, [activeSlide]);

  // const [selectedSlide, setSelectedSlide] = React.useState<Slide | undefined>(
  //   DummyData.slides[0]
  // );
  const [activeEdit, setActiveEdit] = React.useState<string | undefined>(
    undefined
  );

  const [mode, setMode] = useState<Modes>("default");

  const [align, setAlign] = useState<AlignType>({
    direction: "none",
    justify: "none",
  });

  const [activeDragGlobal, setActiveDragGlobal] = useState<boolean>(false);

  const selectedTextBox = useMemo(
    () =>
      selectedSlide?.textBoxes.find(
        (textBox) => textBox.textBoxId === activeEdit
      ),
    [selectedSlide, activeEdit]
  );

  const selectedImage = useMemo(
    () => selectedSlide?.images.find((image) => image.imageId === activeEdit),
    [selectedSlide, activeEdit]
  );

  const [history, setHistory] = useState<SlideData[]>([]);

  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const historyRef = useRef<SlideData[]>([]);

  const [selectedForAiWrite, setSelectedForAiWrite] = useState<
    string[] | undefined
  >(undefined);

  useEffect(() => {
    if (mode !== "aiRewrite") {
      setSelectedForAiWrite(undefined);
    }
  }, [mode]);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  const handleChangeIndex = useCallback(
    (index: number) => {
      if (
        historyIndex + index < 0 ||
        index + historyIndex >= historyRef.current.length
      )
        return;
      setHistoryIndex(historyIndex + index);
      setSlideData(historyRef.current[historyIndex + index]);

      if (
        !historyRef.current[historyIndex + index].slides.find(
          (slide) => slide.id === selectedSlide?.id
        )
      ) {
        setSelectedSlide(historyRef.current[historyIndex + index].slides[0]);
      }
    },
    [historyIndex, setHistoryIndex, historyRef.current]
  );

  const handleCommandZ = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "z") {
      handleChangeIndex(-1);
    } else if ((e.metaKey || e.ctrlKey) && e.key === "z") {
      handleChangeIndex(1);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleCommandZ);
    return () => {
      document.removeEventListener("keydown", handleCommandZ);
    };
  }, [history, historyIndex]);

  useEffect(() => {
    setAlign({
      direction: "none",
      justify: "none",
    });
  }, [activeEdit]);

  React.useEffect(() => {
    // update selected slide when slideData changes
    if (!slideData || !selectedSlide) return;
    setSelectedSlide(
      slideData.slides.find((slide) => slide.id === selectedSlide.id)
    );
  }, [slideData]);

  const dataIsFetched = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "presentations", projectId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSlideData(docSnap.data().slideData as SlideData);
        setSelectedSlide(docSnap.data().slideData.slides[0] as Slide);
        setRecentColors(docSnap.data().recentColors);
        setTitle(docSnap.data().title);
        setHistory([docSnap.data().slideData]);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    };

    if (!dataIsFetched.current) {
      fetchData();
      dataIsFetched.current = true;
    }
  }, []);

  const updateData = (value: Partial<TextBoxType>, textBoxId: string) => {
    if (!slideDataRef.current || !selectedSlide) return;
    const updatedSlideData = {
      ...slideDataRef.current,
      slides: slideDataRef.current.slides.map((slide) => {
        if (slide.id === selectedSlide.id) {
          return {
            ...slide,
            textBoxes: slide.textBoxes.map((textBox, idx) => {
              if (textBox.textBoxId === textBoxId) {
                return {
                  ...textBox,
                  ...value,
                };
              }
              return textBox;
            }),
          };
        }
        return slide;
      }),
    };

    if (JSON.stringify(updatedSlideData) !== JSON.stringify(slideData)) {
      setSlideData(updatedSlideData);
      setHistory([updatedSlideData, ...history]);
    }
  };

  const updateImageData = (value: Partial<TextBoxType>, imageId: string) => {
    if (!slideData || !selectedSlide) return;

    const updatedSlideData = {
      ...slideData,
      slides: slideData.slides.map((slide) => {
        if (slide.id === selectedSlide.id) {
          return {
            ...slide,
            images: slide.images.map((image, idx) => {
              if (image.imageId === imageId) {
                return {
                  ...image,
                  ...value,
                };
              }
              return image;
            }),
          };
        }
        return slide;
      }),
    };

    if (JSON.stringify(updatedSlideData) !== JSON.stringify(slideData)) {
      setSlideData(updatedSlideData);
      setHistory([updatedSlideData, ...history]);
    }
  };

  const updateMultipleTextBoxes = (textBoxesToUpdate: TextBoxesToUpdate[]) => {
    if (!slideData) return;

    const updatedSlideData = {
      ...slideData,
      slides: slideData.slides.map((slide) => ({
        ...slide,
        textBoxes: slide.textBoxes.map((textBoxData) => {
          const updateTextBox = textBoxesToUpdate.find(
            (tb) => tb.textBoxId === textBoxData.textBoxId
          );

          if (updateTextBox) {
            return {
              ...textBoxData,
              ...updateTextBox.value,
            };
          }

          return textBoxData;
        }),
      })),
    };

    if (JSON.stringify(updatedSlideData) !== JSON.stringify(slideData)) {
      setSlideData(updatedSlideData);
      setHistory([updatedSlideData, ...history]);
    }
  };

  const [slideDataDatabase, setSlideDataDatabase] = useDebouncedSave(
    projectId,
    slideData
  );

  useEffect(() => {
    if (!slideData) return;
    setSlideDataDatabase(slideData);
  }, [slideData]);

  useEffect(() => {
    if (title) {
      setDoc(
        doc(db, "presentations", projectId),
        {
          title: title,
        },
        {merge: true}
      );
    }
  }, [title]);

  const addRecentColor = debounce((color: string) => {
    if (!slideData) return;
    if (slideData.recentColors && slideData.recentColors.includes(color))
      return;
    if (recentColors && recentColors.includes(color)) return;
    let updatedRecentColors = [color, ...(recentColors || [])];

    if (updatedRecentColors.length > 12) {
      updatedRecentColors.pop();
    }
    setRecentColors(updatedRecentColors);
    setDoc(
      doc(db, "presentations", projectId),
      {
        recentColors: updatedRecentColors,
      },
      {merge: true}
    );
  }, 5000);

  const createNewSlide = (index?: number) => {
    if (!slideDataRef.current) return;

    const newSlide: Slide = {
      id: Math.random().toString(),
      background: "#ffffff",
      textBoxes: [],
      images: [],
    };

    const insertPosition = index ?? slideDataRef.current.slides.length; // Default to the end if no index is provided

    const updatedSlideData: SlideData = {
      ...slideDataRef.current,
      slides: [
        ...slideDataRef.current.slides.slice(0, insertPosition),
        newSlide,
        ...slideDataRef.current.slides.slice(insertPosition),
      ],
    };

    setSlideData(updatedSlideData);
    setHistory([updatedSlideData, ...history]);
    setSelectedSlide(updatedSlideData.slides[insertPosition]);
  };

  const deleteSlide = (slideId: string) => {
    if (!slideData || !slideDataRef.current) return;
    const updatedSlideData = {
      ...slideDataRef.current,
      slides: slideDataRef.current.slides.filter(
        (slide) => slide.id !== slideId
      ),
    };
    setSlideData(updatedSlideData);
    setHistory([updatedSlideData, ...(historyRef.current || [])]);

    // find index of selected slide
    const newIndex =
      slideDataRef.current.slides.indexOf(selectedSlideRef.current!) >
      updatedSlideData.slides.length - 1
        ? updatedSlideData.slides.length - 1
        : slideDataRef.current.slides.indexOf(selectedSlideRef.current!);

    setSelectedSlide(updatedSlideData.slides[newIndex]);
    setActiveSlide(updatedSlideData.slides[newIndex].id);
  };

  const slideClipboard = useRef<string | undefined>(undefined);

  async function copySlide(slideId: string) {
    if (!slideData || !slideDataRef.current) return;

    // copy slide and create a new id
    let copiedSlide = slideDataRef.current.slides.filter(
      (slide) => slide.id === slideId
    )[0];
    copiedSlide = {
      ...copiedSlide,
      id: Math.random().toString(),
    };
    if (!copiedSlide) return;
    slideClipboard.current = JSON.stringify(copiedSlide);
    // await navigator.clipboard.writeText(JSON.stringify(copiedSlide));
  }

  // };

  async function copySelected() {
    if (selectedTextBox) {
      slideClipboard.current = JSON.stringify(selectedTextBox);
    } else if (selectedImage) {
      slideClipboard.current = JSON.stringify(selectedImage);
    } else {
      const copiedTextBoxes = activeGroupSelectedTextBoxes?.length
        ? activeGroupSelectedTextBoxes.flatMap((textBoxId) =>
            slideData?.slides.flatMap((slide) =>
              slide.id === selectedSlide?.id
                ? slide.textBoxes
                    .filter((tb) => tb.textBoxId === textBoxId)
                    .map((tb) => tb)
                : []
            )
          )
        : [];

      const copiedImages = activeGroupSelectedImages?.length
        ? activeGroupSelectedImages.flatMap((imageId) =>
            slideData?.slides.flatMap((slide) =>
              slide.id === selectedSlide?.id
                ? slide.images
                    .filter((img) => img.imageId === imageId)
                    .map((img) => img)
                : []
            )
          )
        : [];

      if (copiedTextBoxes.length > 0 || copiedImages.length > 0) {
        const copiedData = {textBoxes: copiedTextBoxes, images: copiedImages};
        slideClipboard.current = JSON.stringify(copiedData);
      }
    }
  }

  async function pasteSelected() {
    console.log(
      "pasteSelected",
      selectedSlideRef.current,
      slideDataRef.current,
      slideClipboard.current
    );
    if (
      !selectedSlideRef.current ||
      !slideDataRef.current ||
      !slideClipboard.current
    )
      return;
    const text = slideClipboard.current;
    let parsedData;

    try {
      parsedData = JSON.parse(text); // Try to parse the string as JSON
    } catch (error) {
      console.log("clipboard contains a string:", text);
      return;
    }

    let newSlideData: Slide[] | undefined;
    if (isSlide(parsedData)) {
      // add parsed data to slide data as a new slide
      // newSlideData = slideDataRef.current.slides.map((slide) => slide);
      // newSlideData.push(parsedData);
      console.log("newSlideData &&&&&&&&&&&&&", selectedSlideIndexRef.current);
      const copiedTextBoxes = parsedData.textBoxes.map(
        (textBox: TextBoxType) => ({
          ...textBox,
          textBoxId: Math.random().toString(),
        })
      );

      const copiedDataImage = parsedData.images.map((image: SlideImage) => ({
        ...image,
        imageId: Math.random().toString(),
      }));

      const copiedSlideData = {
        ...parsedData,
        id: Math.random().toString(),
        textBoxes: copiedTextBoxes,
        images: copiedDataImage,
      };

      setSlideData({
        ...slideDataRef.current,
        slides: [
          ...slideDataRef.current.slides.slice(
            0,
            selectedSlideIndexRef.current !== undefined
              ? selectedSlideIndexRef.current + 1
              : slideDataRef.current.slides.length
          ),
          copiedSlideData,
          ...slideDataRef.current.slides.slice(
            selectedSlideIndexRef.current !== undefined
              ? selectedSlideIndexRef.current + 1
              : slideDataRef.current.slides.length
          ),
        ],
      });

      return;
    } else if (
      isTextBoxTypeArray(parsedData.textBoxes) &&
      parsedData.textBoxes.length > 0 &&
      isSlideImageArray(parsedData.images) &&
      parsedData.images.length > 0
    ) {
      // Ensure newSlideData is correctly updated and no undefined is returned

      const copiedData = {
        textBoxes: parsedData.textBoxes.map((textBox: TextBoxType) => ({
          ...textBox,
          textBoxId: Math.random().toString(),
          position: {
            x: textBox.position.x + 20,
            y: textBox.position.y + 20,
          },
        })),
        images: parsedData.images.map((image: SlideImage) => ({
          ...image,
          imageId: Math.random().toString(),
          position: {
            x: image.position.x + 20,
            y: image.position.y + 20,
          },
        })),
      };
      slideClipboard.current = JSON.stringify(copiedData);

      newSlideData = slideDataRef.current.slides.map((slide) => {
        if (slide.id === selectedSlideRef.current!.id) {
          // Update the selected slide with the new text boxes and images
          return {
            ...slide,
            textBoxes: [...slide.textBoxes, ...copiedData.textBoxes],
            images: [...slide.images, ...copiedData.images],
          };
        }
        // Return the slide unchanged if it doesn't match the selectedSlide id
        return slide;
      });

      // Set the group selections with the newly pasted textBoxes and images
      setTimeout(() => {
        setGroupSelectedTextBoxes([
          ...copiedData.textBoxes.flatMap((tb: TextBoxType) => tb.textBoxId),
        ]);
        setGroupSelectedImages([
          ...copiedData.images.flatMap((img: SlideImage) => img.imageId),
        ]);
      }, 10);
    } else if (isTextBoxType(parsedData)) {
      const copiedData = {
        ...parsedData,
        textBoxId: Math.random().toString(),
        position: {
          x: parsedData.position.x + 20,
          y: parsedData.position.y + 20,
        },
      };
      slideClipboard.current = JSON.stringify(copiedData);

      newSlideData = slideDataRef.current.slides.map((slide) => {
        if (slide.id === selectedSlideRef.current!.id) {
          return {
            ...slide,
            textBoxes: [...slide.textBoxes, copiedData],
          };
        }
        return slide;
      });
      setTimeout(() => {
        setActiveEdit(copiedData.textBoxId);
      }, 10);
    } else if (
      isTextBoxTypeArray(parsedData.textBoxes) &&
      parsedData.textBoxes.length > 0
    ) {
      const copiedData = parsedData.textBoxes.map((textBox: TextBoxType) => ({
        ...textBox,
        textBoxId: Math.random().toString(),
        position: {
          x: textBox.position.x + 20,
          y: textBox.position.y + 20,
        },
      }));
      slideClipboard.current = JSON.stringify(copiedData);

      newSlideData = slideDataRef.current.slides.map((slide) => {
        if (slide.id === selectedSlideRef.current!.id) {
          return {
            ...slide,
            textBoxes: [...slide.textBoxes, ...copiedData],
          };
        }
        return slide;
      });
      setTimeout(() => {
        setGroupSelectedTextBoxes(
          copiedData.map((tb: TextBoxType) => tb.textBoxId)
        );
      }, 10);
    } else if (isSlideImage(parsedData)) {
      const copiedData = {
        ...parsedData,
        imageId: Math.random().toString(),
        position: {
          x: parsedData.position.x + 20,
          y: parsedData.position.y + 20,
        },
      };

      slideClipboard.current = JSON.stringify(copiedData);
      newSlideData = slideDataRef.current.slides.map((slide) => {
        if (slide.id === selectedSlideRef.current!.id) {
          return {
            ...slide,
            images: [...slide.images, copiedData],
          };
        }
        return slide;
      });
      setTimeout(() => {
        setActiveEdit(copiedData.imageId);
      }, 10);
    } else if (
      isSlideImageArray(parsedData.images) &&
      parsedData.images.length > 0
    ) {
      const copiedData = parsedData.images.map((image: SlideImage) => ({
        ...image,
        imageId: Math.random().toString(),
        position: {
          x: image.position.x + 20,
          y: image.position.y + 20,
        },
      }));
      slideClipboard.current = JSON.stringify(copiedData);

      newSlideData = slideDataRef.current.slides.map((slide) => {
        if (slide.id === selectedSlideRef.current!.id) {
          return {
            ...slide,
            images: [...slide.images, ...copiedData],
          };
        }
        return slide;
      });
      setTimeout(() => {
        setGroupSelectedImages(
          copiedData.images.map((img: SlideImage) => img.imageId)
        );
      }, 10);
    }
    console.log(
      "newSlideData -----------------------",
      isSlide(parsedData),
      parsedData
    );

    if (newSlideData) {
      setSlideData({...slideDataRef.current, slides: newSlideData});
      setHistory([{...slideDataRef.current, slides: newSlideData}, ...history]);
    }
  }

  async function cutSelected() {
    await copySelected();

    if (slideClipboard.current && slideDataRef.current) {
      // remove clipboard items from slideData
      const parsedData = JSON.parse(slideClipboard.current);
      let newSlideData: Slide[] | undefined;
      if (
        isTextBoxTypeArray(parsedData.textBoxes) &&
        parsedData.textBoxes.length > 0 &&
        isSlideImageArray(parsedData.images) &&
        parsedData.images.length > 0
      ) {
        newSlideData = slideDataRef.current.slides.map((slide) => {
          if (slide.id === selectedSlideRef.current!.id) {
            return {
              ...slide,
              textBoxes: slide.textBoxes.filter(
                (textBox) =>
                  !parsedData.textBoxes
                    .map((tb: TextBoxType) => tb.textBoxId)
                    .includes(textBox.textBoxId)
              ),
              images: slide.images.filter(
                (image) =>
                  !parsedData.images
                    .map((img: SlideImage) => img.imageId)
                    .includes(image.imageId)
              ),
            };
          }
          return slide;
        });
        setGroupSelectedTextBoxes(undefined);
        setGroupSelectedImages(undefined);
      } else if (isTextBoxType(parsedData)) {
        newSlideData = slideDataRef.current.slides.map((slide) => {
          if (slide.id === selectedSlideRef.current!.id) {
            return {
              ...slide,
              textBoxes: slide.textBoxes.filter(
                (textBox) => textBox.textBoxId !== parsedData.textBoxId
              ),
            };
          }
          return slide;
        });
        setActiveEdit(undefined);
      } else if (
        isTextBoxTypeArray(parsedData.textBoxes) &&
        parsedData.textBoxes.length > 0
      ) {
        newSlideData = slideDataRef.current.slides.map((slide) => {
          if (slide.id === selectedSlideRef.current!.id) {
            return {
              ...slide,
              textBoxes: slide.textBoxes.filter(
                (textBox) =>
                  !parsedData.textBoxes
                    .map((tb: TextBoxType) => tb.textBoxId)
                    .includes(textBox.textBoxId)
              ),
            };
          }
          return slide;
        });
        setGroupSelectedTextBoxes(undefined);
      } else if (isSlideImage(parsedData)) {
        newSlideData = slideDataRef.current.slides.map((slide) => {
          if (slide.id === selectedSlideRef.current!.id) {
            return {
              ...slide,
              images: slide.images.filter(
                (image) => image.imageId !== parsedData.imageId
              ),
            };
          }
          return slide;
        });
        setActiveEdit(undefined);
      } else if (
        isSlideImageArray(parsedData.images) &&
        parsedData.images.length > 0
      ) {
        newSlideData = slideDataRef.current.slides.map((slide) => {
          if (slide.id === selectedSlideRef.current!.id) {
            return {
              ...slide,
              images: slide.images.filter(
                (image) =>
                  !parsedData.images
                    .map((img: SlideImage) => img.imageId)
                    .includes(image.imageId)
              ),
            };
          }
          return slide;
        });
        setGroupSelectedImages(undefined);
      }

      if (newSlideData) {
        setSlideData({...slideDataRef.current, slides: newSlideData});
        setHistory([
          {...slideDataRef.current, slides: newSlideData},
          ...history,
        ]);
      }
    }
  }

  const slideDataRef = useRef<SlideData | undefined>(slideData);

  useEffect(() => {
    slideDataRef.current = slideData;
  }, [slideData]);

  const selectedSlideRef = useRef<Slide | undefined>(selectedSlide);
  const selectedSlideIndexRef = useRef<number>(0);

  useEffect(() => {
    console.log("selectedSlideIndex", selectedSlideIndexRef);
    selectedSlideRef.current = selectedSlide;
    if (selectedSlide) {
      selectedSlideIndexRef.current =
        slideData?.slides.indexOf(selectedSlide) || 0;
    }
  }, [selectedSlide]);

  const defaultColor = "#000000";

  const findActiveColors = (selectedTextBoxText: string | undefined) => {
    if (!selectedTextBoxText) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(selectedTextBoxText, "text/html");
    const innerHtml = doc.body.childNodes[0] as HTMLElement;
    const fontTag = innerHtml.getElementsByTagName("font");
    var fontTagArr = Array.prototype.slice.call(fontTag);
    let activeColors: string[] = [];
    if (fontTagArr.length) {
      fontTagArr.forEach((tag) => {
        const selectedColor = tag.getAttribute("color");
        activeColors.push(selectedColor || defaultColor);
      });
      return activeColors;
    }
    return [defaultColor];
  };

  const textBoxValues = findActiveColors(selectedTextBox?.text);

  const [textColor, setTextColor] = React.useState<string>(
    (textBoxValues && textBoxValues[0]) || defaultColor
  );

  useEffect(() => {
    const textBoxValues = findActiveColors(selectedTextBox?.text);
    if (!textBoxValues) return;
    setTextColor(textBoxValues && textBoxValues[0]);
    // setCurrentColor(textBoxValues || [defaultColor]);
  }, [selectedTextBox]);

  const [userImages, setUserImages] = React.useState<Image[]>([]);

  const uploadImage = async (file: File) => {
    const image = await saveImageToFirebase(file);
    setUserImages([...(userImages || []), image]);
    saveImageToUserStorage([...(userImages || []), image]);
    return image;
  };

  const saveImageToFirebase = async (
    file: File
    // onProgress: (progress: number) => void
  ): Promise<Image> => {
    try {
      const fileID = Math.random().toString(36).substring(7);
      const storage = getStorage(app);
      const fileRef = ref(storage, fileID);
      const uploadTask = uploadBytesResumable(fileRef, file);

      // Wait for the upload to complete
      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            // onProgress(progress);
          },
          (error) => {
            reject(error);
          },
          () => {
            resolve(uploadTask.snapshot.ref);
          }
        );
      });

      // Get download URL and return the upload object
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

      const upload: Image = {
        title: file.name,
        path: downloadURL,
      };

      // setUploadData(upload as UploadType);
      return upload;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error; // Rethrow the error after logging it
    }
  };

  const {currentUser} = useAuth()!;

  const saveImageToUserStorage = async (
    userImagesLocal: Image[]
  ): Promise<any> => {
    if (userImagesLocal && currentUser) {
      setDoc(
        doc(db, "users", currentUser.uid),
        {
          userImagesLocal,
        },
        {merge: true}
      );
    }
  };

  const addImageToSlide = (image: Image, position?: Position, size?: Size) => {
    if (!selectedSlide || !slideData) return;

    const imageId = Math.random().toString();
    const updatedSlideData = {
      ...slideData,
      slides: slideData.slides.map((slide) => {
        if (slide.id === selectedSlide.id) {
          return {
            ...slide,
            images: [
              ...(slide.images || []),
              {
                imageId: imageId,
                image: image,
                position: position || {
                  x: 20,
                  y: 20,
                },
                size: size || {
                  width: 200,
                  height: 200,
                },
                rotation: 0,
              },
            ],
          };
        }
        return slide;
      }),
    };

    setSlideData(updatedSlideData);
    setActiveEdit(imageId);
  };

  const addImageToBackground = (image: Image) => {
    if (!selectedSlide || !slideDataRef.current) return;

    const updatedSlideData = {
      ...slideDataRef.current,
      slides: slideDataRef.current.slides.map((slide) => {
        if (slide.id === selectedSlide.id) {
          return {
            ...slide,
            backgroundImage: image,
          };
        }
        return slide;
      }),
    };

    setSlideData(updatedSlideData);
  };

  const [groupSelectedTextBoxes, setGroupSelectedTextBoxes] = useState<
    string[] | undefined
  >([]);

  const [activeGroupSelectedTextBoxes, setActiveGroupSelectedTextBoxes] =
    useState<string[] | undefined>([]);

  const [groupSelectedImages, setGroupSelectedImages] = useState<
    string[] | undefined
  >([]);

  const [activeGroupSelectedImages, setActiveGroupSelectedImages] = useState<
    string[] | undefined
  >([]);

  const deleteMultiTextBoxes = () => {
    if (!selectedSlide || !slideDataRef.current) return;
    const newSlideData = slideDataRef.current.slides.map((slide) => {
      if (slide.id === selectedSlide.id) {
        return {
          ...slide,
          textBoxes: slide.textBoxes.filter(
            (textB) => !groupSelectedTextBoxes?.includes(textB.textBoxId)
          ),
          images: slide.images.filter(
            (image) => !groupSelectedImages?.includes(image.imageId)
          ),
        };
      }
      return slide;
    });
    setSlideData({...slideDataRef.current, slides: newSlideData});
    setHistory([{...slideDataRef.current, slides: newSlideData}, ...history]);
    setActiveGroupSelectedTextBoxes(undefined);
    setGroupSelectedTextBoxes(undefined);
    setActiveGroupSelectedImages(undefined);
    setGroupSelectedImages(undefined);
  };

  useEffect(() => {
    console.log("groupSelect &&&&&&", activeGroupSelectedTextBoxes);
  }, [activeGroupSelectedTextBoxes]);

  const values = {
    // states -----------------------------
    title,
    setTitle,
    studyMaterial,
    setStudyMaterial,
    description,
    setDescription,
    numOfSlides,
    setNumOfSlides,
    isGenerating,
    setIsGenerating,
    studyMaterialText,
    setStudyMaterialText,
    slideData,
    setSlideData,
    selectedSlide,
    setSelectedSlide,
    activeEdit,
    setActiveEdit,
    mode,
    setMode,
    align,
    setAlign,
    selectedTextBox,
    selectedImage,
    history,
    historyRef,
    setHistory,
    historyIndex,
    setHistoryIndex,
    textColor,
    setTextColor,
    userImages,
    setUserImages,
    groupSelectedTextBoxes,
    setGroupSelectedTextBoxes,
    activeGroupSelectedTextBoxes,
    setActiveGroupSelectedTextBoxes,
    selectedForAiWrite,
    setSelectedForAiWrite,
    slideDataRef,
    activeGroupSelectedImages,
    setActiveGroupSelectedImages,
    selectedSlideIndexRef,
    activeSlide,
    setActiveSlide,
    activeSlideRef,
    // functions -----------------------------

    updateData,
    activeDragGlobal,
    setActiveDragGlobal,
    addRecentColor,
    recentColors,
    deleteSlide,
    createNewSlide,
    copySlide,
    deleteMultiTextBoxes,
    selectedSlideRef,
    copySelected,
    cutSelected,
    pasteSelected,
    uploadImage,
    addImageToSlide,
    updateImageData,
    updateMultipleTextBoxes,
    groupSelectedImages,
    setGroupSelectedImages,
    addImageToBackground,
  };

  return (
    <PresentationContext.Provider value={values}>
      {children}
    </PresentationContext.Provider>
  );
};

export default PresentationContext;

const useDebouncedSave = (
  projectId: string,
  initialSlideData: SlideData | undefined
) => {
  const slideDataRef = useRef(initialSlideData);

  const debouncedSave = useCallback(
    debounce((data: SlideData) => {
      console.log("Saving changes to firebase....", data);
      setDoc(
        doc(db, "presentations", projectId),
        {slideData: data},
        {merge: true}
      );
    }, 1000),
    [projectId]
  );

  const updateSlideData = useCallback(
    (newData: SlideData) => {
      slideDataRef.current = newData;
      debouncedSave(newData);
    },
    [debouncedSave]
  );

  useEffect(() => {
    return () => {
      debouncedSave.flush();
    };
  }, [debouncedSave]);

  return [slideDataRef.current, updateSlideData] as const;
};

const DummyUpload =
  "Markets 	Hot Stocks 	Fear & Greed Index 	            Latest Market News 	            Hot Stocks 	Follow:            In the hours after President Joe Biden’s historic decision to step aside from the 2024 presidential race last month, journalists across three major US newsrooms began receiving emails from an anonymous person claiming to have tantalizing new information about the election.                The individual, who identified themself only as “Robert,” sent a trove of private documents from inside Donald Trump’s campaign operation to journalists at Politico, The New York Times and The Washington Post.                Beginning on July 22, Politico reported, it began receiving emails from an AOL email address that contained internal communications from a senior Trump campaign official and a research dossier the campaign had put together on Trump’s running mate, Ohio Sen. JD Vance. The dossier included what the Trump campaign identified as Vance’s potential vulnerabilities. Politico was also sent portions of a research document about Florida Sen. Marco Rubio, who had been among the contenders to join Trump on the GOP ticket.                Related article      Suspected Iranian hackers breached Roger Stone’s personal email as part of effort to target Trump campaign, sources say                The Times and The Post later reported that they, too, had been sent a similar cache, including a 271-page document on Vance dated Feb. 23 and labeled “privileged & confidential,” that the outlets said was based on publicly available information.                But despite receiving the sensitive campaign files, the three outlets opted to not publish reporting on the trove they’d been handed, even as the the person suggested they still had a variety of additional documents “from [Trump’s] legal and court documents to internal campaign discussions.”                “Politico editors made a judgment, based on the circumstances as our journalists understood them at the time, that the questions surrounding the origins of the documents and how they came to our attention were more newsworthy than the material that was in those documents,” Politico spokesperson Brad Dayspring told CNN in a statement.                Instead, the first public sign of any release of private information came Saturday, when the Trump campaign went public with its announcement that it had been hacked, pointing the finger at Iranian operatives.                “These documents were obtained illegally from foreign sources hostile to the United States, intended to interfere with the 2024 election and sow chaos throughout our Democratic process,” Trump campaign spokesperson Steven Cheung said.                On Monday, CNN reported that the FBI and other investigators were probing the apparent security breach, which sources said involved compromising the personal email account of longtime Republican and Trump operative Roger Stone.                Iran has denied the allegations, and the US government has declined to officially blame Tehran for the hack, a source told CNN, adding that the hackers’ techniques closely resembled those used by Iranian operatives.                But while the hacking incident, which occurred in June, set off a scramble in the Trump campaign, the FBI and Microsoft, the three news organizations that had received the files held off on publishing information from the trove. The decision marked a reversal from the 2016 election, when news outlets breathlessly reported embarrassing and damaging stories about Hillary Clinton’s campaign after Russian hackers stole a cache of emails from the Democratic National Committee, publishing them on the website Wikileaks.                The decision underscored the challenge news organizations face when presented with information potentially obtained by nefarious means and the shifting publishing standards of newsrooms in the wake of the 2016 election, during which Russian disinformation efforts we seen as playing a key role in Trump’s victory. In the run up to the 2020 election, newsrooms were presented with another conundrum when the contents of Hunter Biden’s laptop were shopped to news organizations, with most refusing to publish its contents over fears of a possible Russian disinformation effort.                “As with any information we receive, we take into account the authenticity of the materials, any motives of the source and assess the public interest in making decisions about what, if anything, to publish,” a Washington Post spokesperson told CNN on Tuesday.                A New York Times spokesperson declined to comment, saying that the newspaper doesn’t discuss editorial decisions about ongoing coverage.                Trump on Tuesday downplayed the significance of the hack, calling the materials “boring information.”                “I’ve been briefed, and a lot of people think it was Iran, probably was,” Trump said in an interview with Univision. “I think it’s pretty boring information, and we know pretty much what it is, it’s, it’s not very important information.”                During the 2016 campaign, then-presidential hopeful Trump publicly encouraged the hack and release of embarrassing emails about Clinton, which emerged shortly after a videotape showing Trump bragging about sexually assaulting women was unearthed.                “Russia, if you’re listening, I hope you’re able to find the 30,000 emails that are missing, I think you will probably be rewarded mightily by our press,” Trump said at a July 2016 news conference.                “WikiLeaks, I love WikiLeaks,” he later told rallygoers.                The website, founded in 2006 by Julian Assange to facilitate the anonymous leaking of secrets, had previously published tens of thousands of classified documents relating to the Afghanistan war and military documents from the Iraq War. While Trump embraced the release of hacked files to embarrass his opponent, some believe the press went too far in its eager coverage of WikiLeaks’ releases.                “News organizations should proceed with caution when dealing with hacked documents. As long as they’re verified and newsworthy, then they’re fair game, but motive is an important part of the story, too,” Dan Kennedy, a journalism professor at Northeastern University, told CNN. “In 2016, too many news outlets ran with stories about the Democratic National Committee’s emails without questioning why WikiLeaks, which had ties to the Russian government, had hacked them in the first place.”                Jane Kirtley, a professor of media ethics and law at the University of Minnesota, said that news organizations must always vet documents and “make every effort to ensure they are what they purport to be,” an increasingly difficult task with the rise of sophisticated manipulation tools, including artificial intelligence.                “From an ethical perspective, journalists should ask:  who benefits from this disclosure? The role of the media is to act independently in this situation,” Kirtley told CNN. “Again, the journalists’ loyalty should be to the public, not one political party or candidate.”                Related article      As Trump flails and invites conspiracies, allies plea for him to stay on message                Still, some criticized the decision by news outlets to withhold publication on the files as hypocritical after reporting in 2016 on the DNC emails obtained by Russian hackers, even as it remained unclear if some materials could still be published.                “Seriously the double standard here is incredible. For all the yapping on interviews, it would be great for people making these decisions to be accountable to the public,” Neera Tenden, a domestic policy adviser to President Biden, wrote Tuesday on X. “Do they now admit they were wrong in 2016 or is the rule hacked materials are only used when it hurts Dems? There’s no in between.”                While it remains unclear who “Robert” is, news organizations appear to be showing the lessons learned over the last decade, offering a more cautious approach to hacking and state-run influence operations.                “This episode probably reflects that news organizations aren’t going to snap at any hack that comes in and is marked as ‘exclusive’ or ‘inside dope’ and publish it for the sake of publishing,” Washington Post executive editor Matt Murray told the newspaper. Instead, “all of the news organizations in this case took a deep breath and paused, and thought about who was likely to be leaking the documents, what the motives of the hacker might have been, and whether this was truly newsworthy or not.”    Most stock quote data provided by BATS. US market indices are shown in real time, except for the S&P 500 which is refreshed every two minutes. All times are ET. Factset: FactSet Research Systems Inc. All rights reserved. Chicago Mercantile: Certain market data is the property of Chicago Mercantile Exchange Inc. and its licensors. All rights reserved. Dow Jones: The Dow Jones branded indices are proprietary to and are calculated, distributed and marketed by DJI Opco, a subsidiary of S&P Dow Jones Indices LLC and have been licensed for use to S&P Opco, LLC and CNN. Standard & Poor’s and S&P are registered trademarks of Standard & Poor’s Financial Services LLC and Dow Jones is a registered trademark of Dow Jones Trademark Holdings LLC. All content of the Dow Jones branded indices Copyright S&P Dow Jones Indices LLC and/or its affiliates. Fair value provided by IndexArb.com. Market holidays and trading hours provided by Copp Clark Limited.© 2024 Cable News Network. A Warner Bros. Discovery Company. All Rights Reserved.  CNN Sans ™ & © 2016 Cable News Network.";
