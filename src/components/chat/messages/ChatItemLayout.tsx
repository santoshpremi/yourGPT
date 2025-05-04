import { Card } from "@mui/joy";
import { twMerge } from "tailwind-merge";
import type { PropsWithChildren } from "react";
import React from "react";
import { type Message } from "../../../../backend/src/api/chat/message/messageTypes";

export function ChatItemLayout({
  embedded,
  message,
  generating,
  error,
  icon,
  children,
}: PropsWithChildren<{
  embedded?: boolean;
  message: Message | null; // Null message is used for loading state
  generating?: boolean;
  icon?: React.ReactNode;
  error?: boolean;
}>) {
  const fromAi = message?.fromAi ?? true;
  let cardColor;
  if (error) {
    cardColor = "danger";
  } else if (fromAi) {
    cardColor = "primary";
  } else {
    cardColor = "neutral";
  }
  let cardVariant;
  if (embedded) {
    cardVariant = "soft";
  } else if (error || (fromAi && !generating)) {
    cardVariant = "outlined";
  } else {
    cardVariant = "plain";
  }
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={twMerge(
        "mx-10 my-5 flex flex-row items-start gap-6",
        embedded && "mx-0 my-2 gap-2",
        fromAi && "aiMessage",
      )}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          {icon && <div>{icon}</div>}
        </div>
      </div>
      <div
        className={twMerge(
          "flex-grow basis-0 overflow-hidden",
          embedded && fromAi && "pr-10",
          embedded && !fromAi && "pl-20",
        )}
      >
        <Card
          variant="outlined"
          color="neutral"
          className={twMerge(
            "relative flex w-full flex-col rounded-xl px-4 py-2",
            fromAi && "ml-auto bg-primary",
          )}
        >
          {children}
        </Card>
      </div>
    </div>
  );
}
