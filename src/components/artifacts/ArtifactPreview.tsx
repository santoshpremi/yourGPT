import { Description } from "@mui/icons-material";
import { trpc } from "../../lib/api/trpc/trpc";
import { useTranslation } from "react-i18next";
import { useArtifact } from "./ArtifactProvider";
import ReferenceContainer from "../chat/MessageReferences";
import { ARTIFACT_PREVIEW_ID } from "../../lib/testIds";

interface ArtifactPreviewProps {
  id: string | null;
}
export function ArtifactPreview({ id }: ArtifactPreviewProps) {
  const { showArtifact } = useArtifact();
  const { t } = useTranslation();

  const { data, isLoading } = trpc.artifact.getVersion.useQuery(
    { id: id! },
    { enabled: !!id }
  );

  return (
    <ReferenceContainer
      testId={ARTIFACT_PREVIEW_ID}
      title={data?.Artifact?.title ?? ""}
      subtitle={t("artifact.clickToOpen")}
      isLoading={isLoading || !id}
      onClick={id ? () => showArtifact(id) : undefined}
      icon={<Description />}
    />
  );
}
