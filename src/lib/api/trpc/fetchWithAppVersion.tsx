import { Refresh } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { t } from "i18next";
import { toast } from "react-toastify";

let lastAppVersion: string | null = null;

export async function fetchWithAppVersion(
  ...args: Parameters<typeof fetch>
): ReturnType<typeof fetch> {
  const res = await fetch(...args);
  handleAppVersionHeader(res.headers.get("X-App-Version"));
  return res;
}

function handleAppVersionHeader(appVersion: string | null) {
  if (!appVersion) {
    console.error("No app version header found");
    return;
  }
  if (!lastAppVersion) {
    lastAppVersion = appVersion;
    return;
  }
  if (lastAppVersion !== appVersion) {
    console.error("App version mismatch detected.");
    toast.info(
      <div className="flex flex-col gap-2">
        {t("appVersionMismatch")}
        <Button
          className="mt-2"
          onClick={() => {
            window.location.reload();
          }}
          variant="soft"
          startDecorator={<Refresh />}
          size="sm"
        >
          {t("updateApp")}
        </Button>
      </div>,
      {
        toastId: "appVersionMismatch",
        theme: "colored",
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  }
}
