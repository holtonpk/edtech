"use client";
import {Icons} from "@/components/icons";
import React, {
  useContext,
  useRef,
  createContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  FullSlideData,
  Slide,
  Modes,
  AlignType,
  TextBoxType,
  Image,
  Position,
  Size,
} from "@/config/data";
import {collection, addDoc, setDoc, getDoc, doc} from "firebase/firestore";
import {db} from "@/config/firebase";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import ProfileNav from "@/src/app/(auth)/(tool)/components/profile-nav";
import {useAuth} from "@/context/user-auth";
import Background from "@/components/background";

export const FeaturedPresentations = () => {
  const {currentUser} = useAuth()!;

  const [featuredPresentations, setFeaturedPresentations] = useState<string[]>([
    "yflufzmscJypio6Fthh2",
    "DkKdB59cscUg0RSZJOJx",
    "CB00UYqiIpyp63UqulO5",
    "3xni3hVzMqYJBNWhsGfh",
  ]);

  return (
    <div className="grid gap-1">
      <h1 className=" text-2xl poppins-bold ">Featured Projects</h1>
      <div className="w-full overflow-scroll">
        <div className="flex  gap-4 mt-2 w-fit">
          {featuredPresentations.map((presentation) => (
            <PresentationCard presId={presentation} key={presentation} />
          ))}
        </div>
      </div>
    </div>
  );
};

const PresentationCard = ({presId}: {presId: string}) => {
  const [title, setTitle] = useState<string | undefined>(undefined);

  const [slide, setSlide] = useState<Slide | undefined>(undefined);

  const dataIsFetched = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "presentations", presId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSlide(docSnap.data().slideData.slides[0]);
        setTitle(docSnap.data().title);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    };

    if (!dataIsFetched.current) {
      fetchData();
      dataIsFetched.current = true;
    }
  }, [presId]);

  const selectorContainerRef = React.useRef<HTMLDivElement>(null);

  const [thumbScale, setThumbScale] = useState<number | undefined>(undefined);

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
    setScale();
  }, [slide]);

  const router = useRouter();

  return (
    <div className="flex flex-col gap-2">
      {slide && (
        <div
          ref={selectorContainerRef}
          style={{
            background: slide.background,
          }}
          onClick={() => {
            router.push(`/edit/${presId}`);
          }}
          className={`rounded-lg w-[200px] relative aspect-[16/9] overflow-hidden p-6 flex items-center justify-center bg-white text-black   duration-300 cursor-pointer border hover:border-4 hover:border-primary transition-all 
  
  `}
        >
          {thumbScale ? (
            <div
              className="w-[1000px]   aspect-[16/9] absolute overflow-hidden"
              style={{transform: `scale(${thumbScale})`}}
            >
              {slide &&
              slide.backgroundImage &&
              slide.backgroundImage.path !== "undefined" ? (
                <div
                  className="absolute w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${slide.backgroundImage.path})`,
                  }}
                />
              ) : (
                <div
                  className="absolute w-full h-full bg-cover bg-center"
                  style={{
                    backgroundColor: slide ? slide.background : "#ffffff",
                    opacity: slide?.backgroundOpacity
                      ? slide?.backgroundOpacity
                      : 1,
                  }}
                />
              )}
              {slide.textBoxes &&
                slide.textBoxes.map((textbox: TextBoxType, index: number) => (
                  <div
                    key={index}
                    className=" p-2 absolute pointer-events-none"
                    style={{
                      top: textbox.position.y,
                      left: textbox.position.x,
                      height: "fit-content",
                      width: textbox.size.width,
                      transform: `rotate(${textbox.rotation}deg)`,
                      fontSize: `${textbox.fontSize}px`,
                    }}
                    dangerouslySetInnerHTML={{__html: textbox.text}}
                  />
                ))}
              {slide.images &&
                slide.images.map((image, index) => (
                  <div
                    key={index}
                    style={{
                      top: image.position.y,
                      left: image.position.x,
                      width: image.size.width,
                      transform: `rotate(${image.rotation}deg)`,
                    }}
                    className="p-2 h-fit w-fit absolute origin-center pointer-events-none"
                  >
                    <img
                      src={image.image.path}
                      alt={image.image.title}
                      className="origin-center p-2 pointer-events-none h-full w-full"
                    />
                  </div>
                ))}
            </div>
          ) : (
            <>no scale</>
          )}
        </div>
      )}
      <div className="flex flex-col">
        <h1 className="font-bold ">{title}</h1>
        <h2 className="font-bold text-sm text-muted-foreground">@patrick</h2>
      </div>
    </div>
  );
};
