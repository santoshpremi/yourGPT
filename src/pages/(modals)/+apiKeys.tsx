import { ContentCopy, Delete } from "@mui/icons-material";
import {
  Alert,
  Button,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemContent,
  ModalClose,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import RouteModal from "../../components/util/RouteModal";
import { trpc } from "../../lib/api/trpc/trpc";
import { TrpcProvider } from "../../lib/api/trpc/TrpcProvider";
import { useCopySafe } from "../../lib/hooks/useCopySafe";
import { ConfirmModal } from "../../components/sidebar/tree/ConfirmModal";

export default function Route() {
  return (
    <TrpcProvider>
      <ApiKeysModal />
    </TrpcProvider>
  );
}

function ApiKeysModal() {
  const { t } = useTranslation();

  const utils = trpc.useUtils();

  const copy = useCopySafe();

  const [newKeyName, setNewKeyName] = useState("");

  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  const { data: apiKeys } = trpc.apiKeys.list.useQuery();
  const {
    mutateAsync: createKey,
    data: createdApiKey,
    isPending: createKeyPending,
  } = trpc.apiKeys.create.useMutation();

  const {
    mutateAsync: deleteKey,
    isPending: deleteKeyPending,
    variables: deletingKeyVariables,
  } = trpc.apiKeys.delete.useMutation();

  return (
    <>
      <ConfirmModal
        open={!!deletingKey}
        onClose={() => setDeletingKey(null)}
        onSure={async () => {
          await deleteKey({ id: deletingKey! });
          toast.success("API key deleted");
          void utils.apiKeys.invalidate();
        }}
      />
      <RouteModal>
        <ModalDialog sx={{ maxWidth: 500, width: "100%" }}>
          <ModalClose />
          <Typography id="api-key-modal-title" level="title-lg">
            {t("apiKeysModal.title")}
          </Typography>
          <Stack spacing={2} mb={2}>
            <Typography id="api-key-modal-description" level="body-md">
              {t("apiKeysModal.description")}
            </Typography>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await createKey({ displayName: newKeyName });
                void utils.apiKeys.invalidate();
                setNewKeyName("");
                toast.success(t("apiKeysModal.keyCreated"));
              }}
            >
              <Input
                placeholder={t("apiKeysModal.keyNamePlaceholder")}
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                disabled={createKeyPending}
                endDecorator={
                  <Button
                    type="submit"
                    disabled={!newKeyName.length}
                    loading={createKeyPending}
                  >
                    {t("create")}
                  </Button>
                }
              />
            </form>
            {createdApiKey && (
              <Stack spacing={2} alignItems="center">
                <FormControl className="w-full">
                  <FormLabel>{t("apiKeysModal.newKeyLabel")}</FormLabel>
                  <Input
                    fullWidth
                    value={createdApiKey.key}
                    readOnly
                    endDecorator={
                      <IconButton
                        size="sm"
                        onClick={() => copy(createdApiKey.key)}
                      >
                        <ContentCopy />
                      </IconButton>
                    }
                  />
                </FormControl>
                <Alert color="warning" variant="soft">
                  {t("apiKeysModal.newKeyCopyReminder")}
                </Alert>
              </Stack>
            )}
          </Stack>
          <Divider />
          <List>
            {apiKeys &&
              apiKeys.map((key) => (
                <ListItem
                  key={key.id}
                  endAction={
                    <IconButton
                      aria-label="Delete"
                      size="sm"
                      color="danger"
                      loading={
                        !!(
                          deleteKeyPending &&
                          deletingKeyVariables?.id === key.id
                        )
                      }
                      onClick={() => setDeletingKey(key.id)}
                    >
                      <Delete />
                    </IconButton>
                  }
                >
                  <ListItemContent>
                    <Typography>{key.displayName}</Typography>
                  </ListItemContent>
                </ListItem>
              ))}
          </List>
        </ModalDialog>
      </RouteModal>
    </>
  );
}
