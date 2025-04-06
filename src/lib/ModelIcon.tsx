import type { HTMLProps } from "react";
import type { ModelOverride } from "../../../backend/src/api/chat/chatTypes.ts";
import deingptIcon from "../assets/logo.svg";
import claudeIcon from "../assets/modelicons/claude.webp";
import googleIcon from "../assets/modelicons/google.png";
import openaiIcon from "../assets/modelicons/openai.png";
import perplexityIcon from "../assets/modelicons/perplexity.png";
import nebiusIcon from "../assets/modelicons/nebius.png";
import deepseekIcon from "../assets/modelicons/deepseek.png";

export function ModelIcon({
  modelName,
  ...props
}: {
  modelName: ModelOverride;
} & HTMLProps<HTMLImageElement>) {
  let src: string | undefined;

  const model = modelName.toLowerCase();

  if (modelName === "automatic") {
    src = deingptIcon;
  } else if (model.includes("llama")) {
    src = nebiusIcon;
  } else if (model.includes("deepseek")) {
    src = deepseekIcon;
  } else if (model.includes("online") || model.includes("sonar")) {
    src = perplexityIcon;
  } else if (model.includes("gpt-")) {
    src = openaiIcon;
  } else if (model.includes("claude")) {
    src = claudeIcon;
  } else if (model.includes("gemini")) {
    src = googleIcon;
  } else {
    src = openaiIcon;
  }
  return <img src={src} alt={modelName + " icon"} {...props} />;
}
