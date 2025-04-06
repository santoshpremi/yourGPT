import { Select, Option } from "@mui/joy";
import { useTranslation } from "react-i18next";
import {
  type LlmName,
  LLM_META,
} from "../../../../../../../backend/src/ai/llmMeta";
import { type Message } from "../../../../../../../backend/src/api/chat/message/messageTypes";
import { trpc } from "../../../../../../lib/api/trpc/trpc";
import { ModelIcon } from "../../../../../../lib/ModelIcon";

export function RateLimitActions({
  switchToModel,
  message,
}: {
  switchToModel: (model: LlmName) => void;
  message: Message;
}) {
  const { t } = useTranslation();

  const { data: enabledModels } = trpc.modelConfig.getEnabled.useQuery();

  const filteredModels = enabledModels?.filter(
    (model) => model !== message.generationModel
  );

  return (
    <Select variant="outlined" placeholder={t("switchToAnotherModel")}>
      {filteredModels?.map((model) => (
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
  );
}
