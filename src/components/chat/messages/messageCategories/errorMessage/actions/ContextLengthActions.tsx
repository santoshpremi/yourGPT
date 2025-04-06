import { Select, Option, Button } from "@mui/joy";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  type LlmName,
  LLM_META,
} from "../../../../../../../backend/src/ai/llmMeta";
import { useCurrentOrganizationId } from "../../../../../../lib/api/trpc/helpers/useCurrentOrganizationId";
import { trpc } from "../../../../../../lib/api/trpc/trpc";
import { ModelIcon } from "../../../../../../lib/ModelIcon";
import { Link } from "../../../../../../router";

export function ContextLengthActions({
  errorCodeDetails,
  switchToModel,
}: {
  errorCodeDetails: string;
  switchToModel: (model: LlmName) => void;
}) {
  const { t } = useTranslation();
  const organizationId = useCurrentOrganizationId();

  const { data: enabledModels } = trpc.modelConfig.getEnabled.useQuery();

  const chatContextTokens = parseInt(errorCodeDetails ?? "0", 10) || 0;
  const largerModels: LlmName[] = (enabledModels ?? [])
    .filter(
      (model) =>
        LLM_META[model].allowChat &&
        LLM_META[model].contextWindow >= chatContextTokens
    )
    .sort();

  return (
    <div className="flex items-center gap-3">
      {largerModels.length > 0 && (
        <Select variant="outlined" placeholder={t("switchToLargerModel")}>
          {largerModels.map((model) => (
            <Option
              key={model}
              onClick={() => {
                switchToModel(model);
              }}
              value={model}
            >
              <div className="space-between flex">
                {LLM_META[model].name}
                <ModelIcon modelName={model} className="ml-2 h-5 w-5" />
              </div>
            </Option>
          ))}
        </Select>
      )}
      <Typography>{t("or")}</Typography>
      <Link
        to="/:organizationId"
        params={{
          organizationId,
        }}
      >
        <Button>{t("newChat")}</Button>
      </Link>
    </div>
  );
}
