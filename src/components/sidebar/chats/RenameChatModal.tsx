import { useTranslation } from "../../../lib/i18n";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
} from "@mui/joy";
import type {
  Chat,
  ChatListItem,
  ChatSearchResult,
} from "../../../../backend/src/api/chat/chatTypes";
import { trpc } from "../../../lib/api/trpc/trpc";
import z from "zod";
import { handleGenericError } from "../../../lib/errorHandling";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Form, Formik } from "formik";

const validationSchema = z.object({
  name: z.string().min(1),
});
type FormValues = z.infer<typeof validationSchema>;

export function RenameChatModal({
  open,
  chat,
  onClose,
}: {
  open: boolean;
  chat: (Chat | ChatSearchResult | ChatListItem) | null;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { mutateAsync: renameChat } = trpc.chat.rename.useMutation();

  const utils = trpc.useUtils();

  async function handleSubmit(values: FormValues) {
    try {
      await renameChat({
        chatId: chat!.id,
        name: values.name,
      });
      await utils.chat.invalidate();
      onClose();
    } catch (e) {
      handleGenericError(
        e instanceof Error ? e : new Error("rename chat", { cause: e }),
        "rename chat"
      );
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <ModalClose />
        <Typography level="title-lg">{t("renameChat")}</Typography>

        <Formik
          initialValues={{ name: chat?.name ?? "" }}
          validationSchema={toFormikValidationSchema(validationSchema)}
          onSubmit={handleSubmit}
          validateOnMount={true}
        >
          {({
            errors,
            touched,
            getFieldProps,
            isValid,
            isSubmitting,
            resetForm,
          }) => (
            <Form className="flex flex-col gap-4 overflow-hidden">
              <FormControl
                error={Boolean(errors.name) && touched.name}
                required
              >
                <FormLabel>{t("name")}</FormLabel>
                <Input placeholder="Name" {...getFieldProps("name")} />
              </FormControl>
              <div className="flex justify-end gap-2">
                <Button
                  variant="plain"
                  onClick={() => {
                    resetForm();
                    onClose();
                  }}
                >
                  {t("cancel")}
                </Button>
                <Button
                  type="submit"
                  variant="solid"
                  disabled={!isValid}
                  loading={isSubmitting}
                >
                  {t("rename")}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </ModalDialog>
    </Modal>
  );
}
