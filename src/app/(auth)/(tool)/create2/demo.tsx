"use client";
import {motion} from "framer-motion";

export const Demo = () => {
  return (
    <div className="h-fit w-screen relative z-40 justify-center flex flex-col container gap-10 mt-10 ">
      <div className=" flex gap-2 flex-col text-center items-center  w-[650px] mx-auto">
        <h1 className="text-3xl poppins-bold ">
          A process so simple, anyone can do it
        </h1>
        <p className="poppins-regular ">
          With Frizzle AI, you can create presentations in minutes. Just upload
          your content, describe your slides, and let Frizzle AI do the rest
        </p>
      </div>
      <div className="w-full flex flex-col gap-8 rounded-md  px-20">
        <div className="grid grid-cols-2 gap-20 items-center border p-8 rounded-md shadow-xl bg-background">
          <div className=" flex gap-2 flex-col text-left">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary/20 rounded-full text-primary flex items-center justify-center">
                1
              </div>
              <h1 className="text-primary poppins-bold text-xl"> Import</h1>
            </div>
            <h1 className="text-3xl poppins-bold">
              Import your content in seconds
            </h1>
            <p className="poppins-regular">
              Frizzle ai can turn anything into a presentation. Just upload your
              content and let Frizzle AI do the rest
            </p>
          </div>
          <div className="h-full w-full flex flex-col  gap-4">
            <div className="w-full aspect-video  bg-background shadow-lg rounded-md border p-2">
              Demo video here
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-20 items-center border p-8 rounded-md shadow-xl bg-background">
          <div className="h-full w-full flex flex-col gap-4">
            <div className="w-full aspect-video  bg-background shadow-lg rounded-md border p-2">
              Demo video here
            </div>
          </div>
          <div className=" flex gap-2 flex-col text-left">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary/20 rounded-full text-primary flex items-center justify-center">
                2
              </div>
              <h1 className="text-primary poppins-bold text-xl">Describe</h1>
            </div>
            <h1 className="text-3xl poppins-bold">Describe your vision</h1>
            <p className="poppins-regular">
              Tell Frizzle AI what you want. It will do the rest.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-20 items-center border p-8 rounded-md shadow-xl bg-background">
          <div className=" flex gap-2 flex-col text-left">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary/20 rounded-full text-primary flex items-center justify-center">
                3
              </div>
              <h1 className="text-primary poppins-bold text-xl">Format</h1>
            </div>
            <h1 className="text-3xl poppins-bold">
              Choose your presentation format
            </h1>
            <p className="poppins-regular">
              Choose from a variety of formats to present your content in the
              best way possible
            </p>
          </div>
          <div className="h-full w-full flex flex-col gap-4">
            <div className="w-full aspect-video  bg-background shadow-lg rounded-md border p-2">
              Demo video here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
