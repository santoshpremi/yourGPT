import { Card, Button, Modal, ModalDialog, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { BrandedLogo } from "../branding/BrandedLogo";
import { useGuidelines } from "../../lib/api/guidelines";
import { useMe } from "../../lib/api/user";
import { MarkdownRenderer } from "../chat/markdown/MarkdownRenderer";

export function GuidelinesModal({
  forceAccept,
  isOpen,
  onClose,
}: {
  forceAccept?: boolean;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { guidelines, guidelinesLastUpdate } = useGuidelines();

  const { t, i18n } = useTranslation();

  const me = useMe();

  if (!me || !guidelines || !guidelinesLastUpdate) return null;

  return (
    <Modal open={isOpen} disableEscapeKeyDown>
      <ModalDialog
        sx={{
          height: "90vh",
          width: "80%",
          maxWidth: "1000px",
          p: 5,
          gap: 5,
          overflowY: "scroll",
        }}
      >
        <BrandedLogo style={{ height: "100px" }} />
        <Typography level="h2" textAlign="center">
          {t("usageGuidelines")}
        </Typography>
        <Card>
          <MarkdownRenderer
            content={
              guidelines +
              "\n\n" +
              t("lastUpdated") +
              new Date(guidelinesLastUpdate).toLocaleDateString(i18n.language) +
              " " +
              (new Date(guidelinesLastUpdate).toLocaleTimeString(
                i18n.language
              ) ?? "")
            }
          />
        </Card>
        <Button onClick={onClose} size="lg" sx={{ alignSelf: "flex-end" }}>
          {forceAccept ? t("accept") : t("close")}
        </Button>
      </ModalDialog>
    </Modal>
  );
}
