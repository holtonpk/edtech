import {Layout, Pages} from "./pages";
import {PresentationProvider} from "@/context/presentation-context";
import SlideSelector from "./slide-selector";

const Page = () => {
  return (
    <PresentationProvider projectId={"BVXG0nFcE2z5ILfeezNy"}>
      <div className="h-full relative overflow-hidden grid w-[200px] mx-auto mt-10 gap-4">
        <div className="h-full w-full max-h-full relative overflow-scroll">
          <div className="flex flex-col w-full h-fit justify-start items-start gap-4 z-20  relative pt-2">
            <SlideSelector />
          </div>
        </div>
      </div>
    </PresentationProvider>
  );
};

export default Page;
