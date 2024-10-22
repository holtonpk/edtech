import React, {Children, useEffect, useRef} from "react";
import {Icons} from "@/components/icons";
import {usePresentation} from "@/context/presentation-context";
import {Button} from "@/components/ui/button";
import {getDoc, doc} from "firebase/firestore";
import {db} from "@/config/firebase";

import TabContent from "./tab-content";

const Themes = () => {
  return (
    <TabContent
      title="Themes"
      description="Change the look and feel of your presentation"
    >
      <div className="grid grid-cols-2 overflow-scroll gap-4 h-fit w-full  mt-6">
        <div className="w-full bg-background rounded-lg  aspect-[16/9] border-4 hover:border-primary/70"></div>
        <div className="w-full bg-background rounded-lg  aspect-[16/9] border-4 hover:border-primary/70"></div>
        <div className="w-full bg-background rounded-lg  aspect-[16/9] border-4 hover:border-primary/70"></div>
        <div className="w-full bg-background rounded-lg  aspect-[16/9] border-4 hover:border-primary/70"></div>
        <div className="w-full bg-background rounded-lg  aspect-[16/9] border-4 hover:border-primary/70"></div>
      </div>
    </TabContent>
  );
};

export default Themes;

const themeProjectID = "h81MrdiggYhlbyrqTUZ2";

const layoutsRaw = {
  recentColors: [],
  title: "Layouts",
  slideData: {
    slides: [
      {
        images: [],
        background: "white",
        id: "1",
        title: "Blank",
        textBoxes: [
          {
            size: {width: 600},
            fontSize: 40,
            text: '<p><b><font color="#939393">Layout 1</font></b></p>',
            textBoxId: "0.33324667074609016",
            rotation: 0,
            position: {x: 21, y: 20},
          },
        ],
      },
      {
        title: "Only Title Slide",
        images: [],
        textBoxes: [
          {
            fontSize: 40,
            textBoxId: "0.33324667074609016",
            size: {width: 600},
            position: {y: 20, x: 20},
            text: '<p><b><font color="#939393">Layout 2</font></b></p>',
            rotation: 0,
          },
          {
            text: '<p style="text-align: center;"><b><font color="#939393">Add heading here</font></b></p>',
            position: {x: 38, y: 217},
            size: {width: 924},
            textBoxId: "0.42595694406981366",
            rotation: 0,
            fontSize: 60,
          },
        ],
        background: "white",
        id: "0.10665107301683707",
      },
      {
        background: "white",
        textBoxes: [
          {
            textBoxId: "0.33324667074609016",
            rotation: 0,
            position: {y: 20, x: 20},
            fontSize: 40,
            size: {width: 600},
            text: '<p><b><font color="#939393">Layout 3</font></b></p>',
          },
          {
            textBoxId: "0.42595694406981366",
            fontSize: 60,
            rotation: 0,
            text: '<p style="text-align: center;"><b><font color="#939393">Add heading here</font></b></p>',
            size: {width: 924},
            position: {y: 145, x: 38},
          },
        ],
        id: "0.11059601320475898",
        images: [],
        title: "Title and Body text centered",
      },
      {
        background: "white",
        title: "Big title left and body right",
        textBoxes: [
          {
            rotation: 0,
            textBoxId: "0.33324667074609016",
            position: {y: 22, x: 20},
            size: {width: 600},
            text: '<p><b><font color="#939393">Layout 4</font></b></p>',
            fontSize: 40,
          },
          {
            position: {y: 113.5, x: 22},
            text: '<p style="text-align: center;"><b><font color="#939393">Add heading here</font></b></p>',
            textBoxId: "0.42595694406981366",
            size: {width: 508},
            rotation: 0,
            fontSize: 94.95327102803739,
          },
          {
            text: '<p style="border-color: hsl(var(--border)); --tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgba(59,130,246,.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ;"><font color="#939393" style="border-color: hsl(var(--border)); --tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgba(59,130,246,.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ;">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</font>\n</p><div><font color="#939393" style="border-color: hsl(var(--border)); --tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgba(59,130,246,.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ;"><br></font></div><div><font color="#939393" style="border-color: hsl(var(--border)); --tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgba(59,130,246,.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ;">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.<br></font></div>',
            textBoxId: "0.34343207022023425",
            fontSize: 16,
            position: {y: 91, x: 566.5},
            rotation: 0,
            size: {width: 405},
          },
        ],
        id: "0.9195613307845063",
        images: [],
      },
      {
        textBoxes: [
          {
            fontSize: 40,
            text: '<p><b><font color="#939393">Layout 5</font></b></p>',
            size: {width: 600},
            rotation: 0,
            position: {y: 20, x: 20},
            textBoxId: "0.33324667074609016",
          },
          {
            textBoxId: "0.6025648225724507",
            fontSize: 16,
            size: {width: 921},
            text: '<p><font color="#939393">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</font>\n</p><p><font color="#939393"><br></font></p><p><span style="color: rgb(147, 147, 147);">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span><font color="#939393"><br></font></p><p><span style="color: rgb(147, 147, 147);"><br></span></p><p><span style="color: rgb(147, 147, 147);">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span><span style="color: rgb(147, 147, 147);"><br></span></p><p><span style="color: rgb(147, 147, 147);"><br></span></p><p><span style="color: rgb(147, 147, 147);">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span><span style="color: rgb(147, 147, 147);"><br></span></p>',
            position: {x: 39.5, y: 134},
            rotation: 0,
          },
          {
            position: {y: 78, x: 37},
            text: '<p><b><font color="#939393">Add heading here</font></p></b>',
            textBoxId: "0.8147710539522983",
            rotation: 0,
            fontSize: 40,
            size: {width: 600},
          },
        ],
        id: "0.22536454962951247",
        background: "white",
        title: "Small title and body left everything",
        images: [],
      },
      {
        textBoxes: [
          {
            rotation: 0,
            size: {width: 600},
            text: '<p><b><font color="#939393">Layout 6</font></b></p>',
            fontSize: 40,
            position: {y: 21, x: 20},
            textBoxId: "0.33324667074609016",
          },
          {
            size: {width: 469},
            textBoxId: "0.6025648225724507",
            position: {x: 22, y: 89},
            fontSize: 16,
            text: '<p><font color="#939393">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</font>\n</p><p><font color="#939393"><br></font></p><p><span style="color: rgb(147, 147, 147);">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span><font color="#939393"><br></font></p><p><span style="color: rgb(147, 147, 147);"><br></span></p><p><span style="color: rgb(147, 147, 147);">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </span><span style="color: rgb(147, 147, 147);">eiusmod tempor incididunt ut labore et dolore magna aliqua. </span></p>',
            rotation: 0,
          },
        ],
        title: "Image left, text right",
        background: "white",
        id: "0.016475345459718183",
        images: [
          {
            rotation: 0,
            image: {
              path: "https://firebasestorage.googleapis.com/v0/b/ai-teacher-79270.appspot.com/o/0l4i3c?alt=media&token=35495d9a-8931-4ce9-9004-3b12ad60462c",
              title: "11 (4).png",
            },
            size: {width: 331},
            imageId: "0.7015932234970057",
            position: {x: 570, y: 85},
          },
        ],
      },
      {
        images: [
          {
            imageId: "0.7015932234970057",
            position: {x: 13, y: 72},
            size: {width: 331},
            rotation: 0,
            image: {
              title: "11 (4).png",
              path: "https://firebasestorage.googleapis.com/v0/b/ai-teacher-79270.appspot.com/o/0l4i3c?alt=media&token=35495d9a-8931-4ce9-9004-3b12ad60462c",
            },
          },
        ],
        title: "Image right, text left",
        background: "white",
        textBoxes: [
          {
            fontSize: 40,
            position: {y: 22, x: 20},
            textBoxId: "0.33324667074609016",
            rotation: 0,
            size: {width: 600},
            text: '<p><b><font color="#939393">Layout 7</font></b></p>',
          },
          {
            fontSize: 16,
            text: '<p><font color="#939393">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</font>\n</p><p><font color="#939393"><br></font></p><p><span style="color: rgb(147, 147, 147);">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span><font color="#939393"><br></font></p><p><span style="color: rgb(147, 147, 147);"><br></span></p><p><span style="color: rgb(147, 147, 147);">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </span><span style="color: rgb(147, 147, 147);">eiusmod tempor incididunt ut labore et dolore magna aliqua. </span></p>',
            textBoxId: "0.6025648225724507",
            position: {x: 401, y: 74},
            rotation: 0,
            size: {width: 469},
          },
        ],
        id: "0.9371660059089435",
      },
      {
        background: "white",
        textBoxes: [
          {
            position: {y: 21, x: 19},
            fontSize: 40,
            rotation: 0,
            textBoxId: "0.33324667074609016",
            size: {width: 600},
            text: '<p><b><font color="#939393">Layout 8</font></b></p>',
          },
          {
            textBoxId: "0.6025648225724507",
            rotation: 0,
            size: {width: 935},
            position: {y: 85, x: 21.5},
            text: '<p><font color="#939393">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</font>\n</p><p><font color="#939393"><br></font></p><p><span style="color: rgb(147, 147, 147);">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span><font color="#939393"><br></font></p><p><span style="color: rgb(147, 147, 147);"><br></span></p><p><span style="color: rgb(147, 147, 147);">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </span><span style="color: rgb(147, 147, 147);">eiusmod tempor incididunt ut labore et dolore magna aliqua. </span></p>',
            fontSize: 16,
          },
        ],
        title: "Text up, image down",
        id: "0.18239892398061075",
        images: [
          {
            position: {y: 382, x: 23},
            imageId: "0.4212747187188053",
            rotation: 0,
            size: {width: 288},
            image: {
              path: "https://firebasestorage.googleapis.com/v0/b/ai-teacher-79270.appspot.com/o/tanllg?alt=media&token=f9bdbfd0-d70b-4c35-bc1a-124028b2020e",
              title: "istockphoto-1178017061-612x612.jpg",
            },
          },
        ],
      },
      {
        id: "0.3429686764026365",
        background: "white",
        textBoxes: [
          {
            textBoxId: "0.33324667074609016",
            position: {y: 21, x: 19},
            fontSize: 40,
            size: {width: 600},
            text: '<p><b><font color="#939393">Layout 8</font></b></p>',
            rotation: 0,
          },
          {
            text: '<p><font color="#939393">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</font>\n</p><p><font color="#939393"><br></font></p><p><span style="color: rgb(147, 147, 147);">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span><font color="#939393"><br></font></p><p><span style="color: rgb(147, 147, 147);"><br></span></p><p><span style="color: rgb(147, 147, 147);">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </span><span style="color: rgb(147, 147, 147);">eiusmod tempor incididunt ut labore et dolore magna aliqua. </span></p>',
            size: {width: 935},
            rotation: 0,
            fontSize: 16,
            textBoxId: "0.6025648225724507",
            position: {x: 21.5, y: 253},
          },
        ],
        title: "Image up, text down",
        images: [
          {
            size: {width: 288},
            imageId: "0.4212747187188053",
            rotation: 0,
            position: {y: 79, x: 13},
            image: {
              title: "istockphoto-1178017061-612x612.jpg",
              path: "https://firebasestorage.googleapis.com/v0/b/ai-teacher-79270.appspot.com/o/tanllg?alt=media&token=f9bdbfd0-d70b-4c35-bc1a-124028b2020e",
            },
          },
        ],
      },
      {
        background: "white",
        title: "Text left, collage right",
        textBoxes: [
          {
            fontSize: 40,
            size: {width: 600},
            textBoxId: "0.33324667074609016",
            rotation: 0,
            position: {y: 21, x: 19},
            text: '<p><b><font color="#939393">Layout 9</font></b></p>',
          },
          {
            position: {y: 100, x: 18.5},
            textBoxId: "0.6025648225724507",
            text: '<p><font color="#939393">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</font>\n</p><p><font color="#939393"><br></font></p><p><span style="color: rgb(147, 147, 147);">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span><font color="#939393"><br></font></p><p><span style="color: rgb(147, 147, 147);"><br></span></p><p><span style="color: rgb(147, 147, 147);">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </span><span style="color: rgb(147, 147, 147);">eiusmod tempor incididunt ut labore et dolore magna aliqua. </span></p>',
            fontSize: 16,
            rotation: 0,
            size: {width: 500},
          },
        ],
        id: "0.7539064813227816",
        images: [
          {
            image: {
              title: "istockphoto-1178017061-612x612.jpg",
              path: "https://firebasestorage.googleapis.com/v0/b/ai-teacher-79270.appspot.com/o/tanllg?alt=media&token=f9bdbfd0-d70b-4c35-bc1a-124028b2020e",
            },
            rotation: 0,
            imageId: "0.4212747187188053",
            size: {width: 288},
            position: {y: 86, x: 583},
          },
          {
            image: {
              title: "11 (4).png",
              path: "https://firebasestorage.googleapis.com/v0/b/ai-teacher-79270.appspot.com/o/0l4i3c?alt=media&token=35495d9a-8931-4ce9-9004-3b12ad60462c",
            },
            imageId: "0.19424310014240342",
            position: {y: 273, x: 777},
            size: {width: 200},
            rotation: 0,
          },
          {
            size: {width: 200},
            image: {
              path: "https://firebasestorage.googleapis.com/v0/b/ai-teacher-79270.appspot.com/o/tanllg?alt=media&token=f9bdbfd0-d70b-4c35-bc1a-124028b2020e",
              title: "istockphoto-1178017061-612x612.jpg",
            },
            rotation: 0,
            position: {y: 277, x: 556},
            imageId: "0.3129233812078207",
          },
        ],
      },
    ],
  },
};
