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

const Dashboard = () => {
  return (
    <div className="h-screen w-screen flex flex-col ">
      <NavBar />
      <div className="flex flex-col container py-4">
        {/* <Banner /> */}
        <CreateNew />
        <UserPresentations />
      </div>
    </div>
  );
};

export default Dashboard;

const NavBar = () => {
  return (
    <div className="h-fit py-2 w-full bg-background border-b flex items-center justify-between px-10">
      <div className="flex gap-1 items-center">
        <Icons.lightbulb className="w-6 h-6 text-primary" />
        <h1 className="font-bold">EDTech tool</h1>
      </div>
      <ProfileNav />
    </div>
  );
};

const Banner = () => {
  return (
    <div className="bg-background text-primary border p-4 flex flex-col items-center justify-center rounded-md shadow-lg">
      <h1 className="text-2xl font-bold">Created for Teachers by Teachers</h1>
      <p>
        Create beautiful interactive presentations for your students in minutes.
        Start creating now
      </p>
    </div>
  );
};

const CreateNew = () => {
  const router = useRouter();
  const {currentUser} = useAuth()!;

  const [isLoading, setIsLoading] = useState(false);

  const blankPresentation: FullSlideData = {
    slideData: {
      slides: [
        {
          textBoxes: [
            {
              textBoxId: "0.5025385440330408",
              fontSize: 40,
              rotation: 0,
              size: {width: 600},
              position: {x: 20, y: 20},
              text: '<p><b><font color="#939393">New presentation</font></b></p>',
            },
            {
              size: {width: 600},
              position: {x: 20, y: 100},
              text: '<p><font color="#939393">Add subheading here</font></p>',
              rotation: 0,
              textBoxId: "0.6930778945417186",
              fontSize: 24,
            },
          ],
          background: "white",
          id: "1",
          images: [],
        },
      ],
    },
    recentColors: [],
    title: "Untitled presentation",
  };

  const saveToFirebase = async () => {
    const docRef = await addDoc(
      collection(db, "presentations"),
      blankPresentation
    );
    const presentationId = docRef.id;

    // update user storage with the new presentation
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser?.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const updatedPresentations = [...userData.presentations, presentationId];
      await setDoc(userRef, {...userData, presentations: updatedPresentations});
    }

    return presentationId;
  };

  const createNew = async () => {
    setIsLoading(true);
    const projectId = await saveToFirebase();

    router.push(`/edit/${projectId}`);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full justify-center p-10">
      <Button
        onClick={createNew}
        disabled={isLoading}
        className=" p-4 flex rounded-full font-bold items-center justify-center"
      >
        {isLoading ? (
          <Icons.spinner className="animate-spin w-6 h-6 mr-2" />
        ) : (
          <Icons.add className="w-6 h-6 " />
        )}
        Mohamed click here to make a new blank presentation
      </Button>
    </div>
  );
};

const UserPresentations = () => {
  const {currentUser} = useAuth()!;

  console.log(currentUser);

  return (
    <div className="container ">
      <h1 className="font-bold text-2xl ">Recent Projects</h1>
      <div className="grid grid-cols-3 gap-4 mt-2">
        {currentUser?.presentations.map((presentation) => (
          <PresentationCard presId={presentation} key={presentation} />
        ))}
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
          className={`rounded-lg w-full relative aspect-[16/9]  p-6 flex items-center justify-center bg-white text-black  transition-colors duration-300 cursor-pointer border hover:border-primary

`}
        >
          {thumbScale ? (
            <div
              className="w-[1000px]   aspect-[16/9] absolute overflow-hidden"
              style={{transform: `scale(${thumbScale})`}}
            >
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
        <h2 className="font-bold text-sm text-muted-foreground">2 days ago</h2>
      </div>
    </div>
  );
};
