import { Settings } from "@mui/icons-material";
import { Badge, IconButton } from "@mui/joy";
import { useState } from "react";
import type { ModelOverride } from "../../../../backend/src/api/chat/chatTypes.ts";
import { ModelSelectorModal } from "../../input/ModelSelectorModal";

export function ChatSettingsMenu({
  selectedModel,
  setSelectedModel,
}: {
  selectedModel: ModelOverride | null;
  setSelectedModel: (model: ModelOverride | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const hasOverrideSettings = selectedModel !== null;

  return (
    <div className="col-start-1 row-start-2 self-center">
      <Badge badgeContent={hasOverrideSettings ? "" : 0}>
        <IconButton
          variant="soft"
          color="primary"
          onClick={() => setOpen(true)}
        >
          <Settings />
        </IconButton>
      </Badge>
      <ModelSelectorModal
        open={open}
        onRequestClose={() => setOpen(false)}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />
    </div>
  );
}
