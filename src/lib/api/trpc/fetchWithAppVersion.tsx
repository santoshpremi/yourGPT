import { Refresh } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { t } from "i18next";
import { toast } from "react-toastify";

let lastAppVersion: string | null = null;

export async function fetchWithAppVersion(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const headers = new Headers(init?.headers);
  
  // Add mock version if missing
  if (!headers.has('x-app-version')) {
    headers.set('x-app-version', '1.0.0-mock');
  }

  const res = await fetch(input, {
    ...init,
    headers
  });
  
  handleAppVersionHeader(res.headers.get("x-app-version"));
  return res;
}

function handleAppVersionHeader(appVersion: string | null) {
  if (!appVersion) {
    console.warn("No app version header found");
    return;
  }

  if (!lastAppVersion) {
    lastAppVersion = appVersion;
    return;
  }

  if (lastAppVersion !== appVersion) {
    console.warn("App version mismatch detected");
    toast.info(
      <div className="flex flex-col gap-2">
        {t("appVersionMismatch")}
        <Button
          className="mt-2"
          onClick={() => window.location.reload()}
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