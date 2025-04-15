import type { AxiosError } from "axios";
import { toast } from "react-toastify";
import * as Sentry from "@sentry/react";
import { ErrorToastContent } from "../components/util/ErrorToastContent";

export let shownNoInternetError = false;

type Extra = {
  [key: string]: unknown;
};

export function handleGenericError(
  error: Error,
  customMessage: string | undefined,
  extra?: Extra,
  propagate: boolean = false,
) {
  console.error("An error occurred:");
  console.trace("Error Stack:");
  console.error(error);

  const customId = generateClientErrorCode();
  Sentry.captureException(error, {
    extra: {
      ...extra,
      customId,
    },
    tags: {
      customId,
    },
  });

  showErrorToast(customId, customMessage);

  if (propagate) {
    throw error;
  }
}

export function genericErrorHandlerFactory(customMessage: string | undefined) {
  return (error: Error) => {
    handleGenericError(error, customMessage);
  };
}

export function handleAxiosError(
  err: AxiosError,
  setLoggedIn: (loggedIn: boolean) => void,
  t: (key: string) => string,
  disableErrorToast: boolean = false,
) {
  if (err.response?.status === 401) {
    setLoggedIn(false);
  } else {
    if (!err.response) {
      if (!shownNoInternetError) {
        const id = toast.error(t("noInternet"), {
          autoClose: false,
        });
        toast.onChange((notification) => {
          if (notification.id === id) {
            if (notification.status === "removed") {
              shownNoInternetError = false;
            }
          }
        });
        shownNoInternetError = true;
      }

      return;
    }

    const url = (err.config?.baseURL ?? "") + "/" + err.config?.url;
    console.error(err);

    const serverSentryGeneratedId = (
      err.response?.data as
        | {
            customId?: string;
          }
        | undefined
    )?.customId;

    // if we received a custom id from the server, we use that
    // otherwise we generate our own. that way we can match the client side error with the server side error
    const customSentryId = serverSentryGeneratedId ?? generateClientErrorCode();

    const sentryErrorId = Sentry.captureException(err, {
      extra: {
        url,
        response: {
          status: err.response?.status,
          data: err.response?.data,
        },
        message: err.message,
        request: {
          headers: err.config?.headers,
          method: err.config?.method,
          data: err.config?.data,
        },
        customId: customSentryId,
        receivedCustomId: !!serverSentryGeneratedId,
      },
      tags: {
        customId: customSentryId,
      },
    });

    console.error("Sentry error id: ", sentryErrorId);
    console.error("Custom error id: ", customSentryId);

    if (!disableErrorToast) {
      showErrorToast(customSentryId, "errors.network", "networkError");
    }

    throw err;
  }
}

function showErrorToast(
  code: string,
  customMessage: string | undefined,
  toastId?: string,
) {
  toast.error(<ErrorToastContent code={code} customMessage={customMessage} />, {
    toastId,
    autoClose: import.meta.env.DEV ? 1000 : false,
    closeOnClick: false,
    draggable: false,
  });
}

// format: C-XXXX (C for client)
// this is to make the error id more user friendly and to make it easier to match the client side error with the server side error
function generateClientErrorCode() {
  return `C-${Math.random().toString(36).substring(7, 11)}`.toUpperCase();
}
