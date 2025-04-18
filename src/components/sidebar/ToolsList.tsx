import {
  InterpreterModeOutlined,
  Language,
  Translate,
  Wallpaper,
} from "@mui/icons-material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { useMemo } from "react";
import { trpc } from "../../lib/api/trpc/trpc";
import { useTranslation } from "../../lib/i18n";
import { comparePath } from "../../lib/routeUtils";
import { TRANSLATE_CONTENT_SIDEBAR_BUTTON_ID } from "../../lib/testIds";
import { type Path, useParams } from "../../router";
import { CollapsableButton } from "./CollapsableButton";
import { SidebarSection } from "./SidebarSection";
import { cn } from "../../lib/cn";
import { SIDEBAR_ANIMATION_DURATION } from "./Sidebar";
import { type LlmName } from "@backend/ai/llmMeta";
export type Tool = {
  name: string;
  icon: React.ReactElement;
  enabled: boolean;
  path: Path;
  testId?: string;
};

export default function ToolsList({
  isSidebarOpen,
}: {
  isSidebarOpen?: boolean;
}) {
  const { t } = useTranslation();
  const path = location.pathname;
  const organizationId = useParams("/:organizationId").organizationId;

  const { data: configuredImageModels } =
    trpc.tools.images.listConfigured.useQuery();
  const { data: enabledModels } = trpc.modelConfig.getEnabled.useQuery();
  const { data: productConfig } = trpc.productConfig.getProductConfig.useQuery();
  const { data: textTranslationEnabled } =
    trpc.tools.translateContent.textTranslator.isEnabled.useQuery();
  const { data: documentTranslatorEnabled } =
    trpc.tools.translateContent.documentTranslator.isEnabled.useQuery();
  const { data: isTechSupportEnabled } =
    trpc.tools.techSupport.isEnabled.useQuery(undefined, {
      trpc: {
        context: {
          silentError: true,
        },
      },
    });

  const tools: Tool[] = useMemo(
    () =>
      (
        [
          {
            name: t("generateImage"),
            icon: <Wallpaper />,
            path: "/:organizationId/tools/imageFactory",
            enabled: Boolean(
              productConfig?.imageGeneration && !!configuredImageModels?.length,
            ),
            testId: "imageGenerationSidebarButton",
          },
          {
            name: t("researchAssistant"),
            icon: <Language />,
            path: "/:organizationId/tools/researchAssistant",
            enabled: !!enabledModels?.includes("sonar" satisfies LlmName),
          },
          {
            name: t("tools.meetingTools.title"),
            icon: <InterpreterModeOutlined />,
            path: "/:organizationId/tools/meetingTools",
            enabled: Boolean(
              (productConfig?.meetingSummarizer ||
                productConfig?.meetingTranscription) &&
                enabledModels?.includes("gemini-1.5-pro"),
            ),
          },
          {
            name: t("techSupport.title"),
            icon: <SupportAgentIcon fontSize="small" />,
            path: "/:organizationId/tools/techSupport",
            enabled: !!isTechSupportEnabled,
          },
          {
            name: t("translateContent"),
            icon: <Translate />,
            path: "/:organizationId/tools/translateContent",
            enabled: !!textTranslationEnabled || !!documentTranslatorEnabled,
            testId: TRANSLATE_CONTENT_SIDEBAR_BUTTON_ID,
          },
        ] satisfies Tool[]
      ).filter((tool) => tool.enabled),
    [
      t,
      enabledModels,
      configuredImageModels,
      textTranslationEnabled,
      productConfig,
      documentTranslatorEnabled,
      isTechSupportEnabled,
    ],
  );

  const isActive = (tool: Tool) => {
    return "path" in tool && comparePath(path, tool.path);
  };

  if (tools.length === 0) return null;

  return (
    <SidebarSection title={t("aiTools")} isSidebarOpen={!!isSidebarOpen}>
      <div
        className={cn("flex flex-col gap-0.5", !isSidebarOpen && "gap-2")}
        style={{
          transition: "all ease-out",
          transitionDuration: SIDEBAR_ANIMATION_DURATION / 2 + "ms",
          transitionDelay: isSidebarOpen
            ? "0ms"
            : SIDEBAR_ANIMATION_DURATION / 2 + "ms",
        }}
      >
        {tools.map((tool) => {
          if (!tool.enabled) return null;
          return (
            <CollapsableButton
              key={tool.name}
              isActive={isActive(tool)}
              to={tool.path}
              icon={tool.icon}
              isSidebarOpen={!!isSidebarOpen}
              content={tool.name}
              params={{ organizationId }}
              data-testid={tool.testId}
              className="h-8 !min-h-0"
            />
          );
        })}
      </div>
    </SidebarSection>
  );
}
