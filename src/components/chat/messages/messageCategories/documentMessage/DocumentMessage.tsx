import Avatar from "@mui/joy/Avatar";
import { Download } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { ChatItemLayout } from "../../ChatItemLayout";
import Typography from "@mui/joy/Typography";
import CircularProgress from "@mui/joy/CircularProgress";
import { type ModelOverride } from "../../../../../../backend/src/api/chat/chatTypes";
import { ModelIcon } from "../../../../../lib/ModelIcon";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import { getDocumentOutputTypeFromMime } from "../../../../../../backend/src/constants/mime";

export function DocumentMessage({
  outputDocumentUrl,
  generationModel,
}: {
  outputDocumentUrl: string;
  generationModel: ModelOverride;
}) {
  const { t } = useTranslation();
  const extension = outputDocumentUrl.split("?")[0].split(".").pop();
  const documentType = extension
    ? getDocumentOutputTypeFromMime(extension)
    : undefined;

  const downloadButtonText = documentType
    ? t("downloadDocumentType", { documentType })
    : t("download");

  return (
    <ChatItemLayout
      icon={
        <Avatar variant="outlined">
          <ModelIcon modelName={generationModel} />
        </Avatar>
      }
      message={null}
    >
      <div className="flex items-center gap-4">
        {outputDocumentUrl === "LOADING" ? (
          <>
            <CircularProgress color="primary" variant="solid" thickness={4}>
              <Download color="primary" />
            </CircularProgress>
            <Typography>{t("documents.documentGenerationPending")}</Typography>
          </>
        ) : (
          <Stack spacing={2}>
            <Typography>{t("documents.generationSuccess")} ✅</Typography>
            <a href={outputDocumentUrl} download>
              <Button variant="soft" startDecorator={<Download />}>
                {downloadButtonText}
              </Button>
            </a>
          </Stack>
        )}
      </div>
    </ChatItemLayout>
  );
}
