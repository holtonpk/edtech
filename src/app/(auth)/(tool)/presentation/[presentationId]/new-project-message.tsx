import Confetti from "react-confetti";

export const NewProjectMessage = () => {
  return (
    <div className="z-[999]">
      <div className="w-screen h-screen fixed bg-black/20 blurBack flex items-center justify-center">
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          colors={["#FF6920", "#DC4987", "#6236B2", "#F3BB0A", "#3F52FC"]}
          className="fixed z-[99]"
        />
        <div className="h-fit w-[400px] rounded-lg bg-background border relative z-[100] p-8">
          <h1 className="poppins-bold text-center text-xl">
            Your presentation was created successfully!
          </h1>
          <p className="text-muted-foreground text-center">
            Open in your favorite app to edit further
          </p>
        </div>
      </div>
    </div>
  );
};
