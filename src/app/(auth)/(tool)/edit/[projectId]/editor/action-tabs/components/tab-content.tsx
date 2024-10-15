import {useHover} from "../index";
import {usePresentation} from "@/context/presentation-context";
import {Icons} from "@/components/icons";

const TabContent = ({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
}) => {
  const {setMode} = usePresentation()!;

  const {isHovering} = useHover()!;

  return (
    <>
      <div
        style={{width: isHovering ? "100%" : "calc(100% - 85px"}}
        className={`  h-full z-[80] hidden md:block overflow-hidden
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
        <div className="w-full  relative h-full z-10">
          <div
            style={{width: isHovering ? "100%" : "100%"}}
            className="p-4 absolute  h-full overflow-hidden"
          >
            <div className="flex flex-col h-12 relative z-10">
              <h1 className="font-bold text-xl poppins-bold">{title}</h1>
              <p className=" text-sm poppins-regular">{description}</p>
            </div>
            {children}
          </div>
        </div>
      </div>

      <div
        // style={{width: isHovering ? "100%" : "calc(100% - 85px"}}
        className={` h-fit z-[80] block md:hidden w-full
          
          `}
      >
        <div className="p-4 w-full h-fit overflow-hidden">
          {title && description && (
            <div className="flex flex-col h-12 ">
              <h1 className="font-bold text-xl poppins-bold">{title}</h1>
              <p className=" text-sm poppins-regular">{description}</p>
            </div>
          )}
          <div className="h-fit w-full ">{children}</div>
        </div>
      </div>
    </>
  );
};

export default TabContent;
