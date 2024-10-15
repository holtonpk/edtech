import {Icons} from "@/components/icons";
import {Preset} from "@/config/data";

export const AiRewritePresets: Preset[] = [
  {
    label: "Add More Detail",
    icon: Icons.pencil,
    description: "Expand on this",
    background: "bg-primary",
    buttonLabel: "Generate",
    prompt: "Write more information relative to the current text",
  },
  {
    label: "Make it Shorter",
    icon: Icons.ruler,
    description: "Shorten this",
    background: "bg-theme-purple",
    buttonLabel: "Generate",
    prompt: "condense this text while keeping the same meaning",
  },
  {
    label: "Completely Rewrite",
    icon: Icons.reWrite,
    description: "Say this in a different way",
    background: "bg-theme-red",
    buttonLabel: "Generate",
    prompt:
      "Say this in a different way while keeping the same meaning and same length",
  },
  {
    label: "Add More Fun",
    icon: Icons.smile,
    description: "Make this more fun",
    background: "bg-theme-yellow",
    buttonLabel: "Generate",
    prompt:
      "Make this more fun to read while keeping the same meaning and same length",
  },
  {
    label: "Custom Rewrite",
    icon: Icons.wand2,
    description: "Tell the AI how to rewrite it",
    background: "bg-theme-green",
    buttonLabel: "Generate",
  },
];
