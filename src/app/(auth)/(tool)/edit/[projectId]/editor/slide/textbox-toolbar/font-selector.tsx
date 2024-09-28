"use client";
import React, {useEffect} from "react";
import {usePresentation} from "@/context/presentation-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import googleFonts from "@/public/fonts/fonts.json";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {applyCommand} from "@/lib/utils";
import {Check, ChevronsUpDown} from "lucide-react";

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

export const FontSelector = () => {
  const {selectedTextBox, updateData} = usePresentation()!;

  const [fonts, setFonts] = React.useState<string[]>(googleFonts.fonts);
  const [selectedFont, setSelectedFont] = React.useState<string>(fonts[0]);

  const onSelectChange = (commandValue: string) => {
    if (!selectedTextBox) return;
    applyCommand(selectedTextBox?.textBoxId, "fontName", commandValue);
    setSelectedFont(commandValue);
    const newText = document.getElementById(
      `text-box-${selectedTextBox.textBoxId}`
    )?.innerHTML;
    updateData({text: newText}, selectedTextBox.textBoxId);
  };

  const [open, setOpen] = React.useState(false);

  const frameworks = [
    {
      value: "next.js",
      label: "Next.js",
    },
    {
      value: "sveltekit",
      label: "SvelteKit",
    },
    {
      value: "nuxt.js",
      label: "Nuxt.js",
    },
    {
      value: "remix",
      label: "Remix",
    },
    {
      value: "astro",
      label: "Astro",
    },
  ];

  const [value, setValue] = React.useState("");

  return (
    // <Select value={selectedFont} onValueChange={onSelectChange}>
    //   <TooltipProvider>
    //     <Tooltip delayDuration={500}>
    //       <TooltipTrigger asChild>
    //         <SelectTrigger className="w-[150px] dark:bg-[#34323D]">
    //           <SelectValue defaultValue={selectedFont}>
    //             <div className="text-ellipsis whitespace-nowrap max-w-full overflow-hidden text-left p-0">
    //               {selectedFont}
    //             </div>
    //           </SelectValue>
    //         </SelectTrigger>
    //       </TooltipTrigger>
    //       <TooltipContent>
    //         <p>Font</p>
    //       </TooltipContent>
    //     </Tooltip>
    //   </TooltipProvider>
    //   <SelectContent>
    //     {fonts.map((font) => (
    //       <SelectItem key={font} value={font} style={{fontFamily: font}}>
    //         {font}
    //       </SelectItem>
    //     ))}
    //   </SelectContent>
    // </Select>

    <Popover open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip delayDuration={500}>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="flex-grow justify-between"
              >
                {/* {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select framework..."} */}
                {selectedFont}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Font</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search for a font" />
          <CommandList>
            {/* <CommandEmpty>Change font</CommandEmpty> */}
            <CommandGroup>
              {fonts.map((font) => (
                <CommandItem
                  style={{fontFamily: font}}
                  key={font}
                  value={font}
                  onSelect={(currentValue) => {
                    onSelectChange(currentValue);
                    setValue(currentValue === value ? "" : currentValue);
                    // setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === font ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {font}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
