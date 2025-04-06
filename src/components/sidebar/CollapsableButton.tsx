import { type ButtonProps, Tooltip, Button } from "@mui/joy";
import { Link, type Path } from "../../router";
import { SIDEBAR_ANIMATION_DURATION } from "./Sidebar";
import { cloneElement } from "react";
import { cn } from "../../lib/cn";
import { type SxProps } from "@mui/joy/styles/types";

export function CollapsableButton({
  icon,
  isSidebarOpen,
  content,
  className,
  onClick,
  isActive,
  to,
  params,
  contentStyle,
  iconSx,
  ...props
}: {
  icon: React.ReactElement;
  isSidebarOpen: boolean;
  content: string;
  isActive?: boolean;
  onClick?: () => void;
  to?: Path;
  params?: Record<string, string>;
  contentStyle?: React.CSSProperties;
  iconSx?: SxProps;
} & ButtonProps) {
  return (
    <Tooltip title={isSidebarOpen ? "" : content} placement="right" size="sm">
      <Button
        component={Link}
        to={to ?? ""}
        params={params}
        startDecorator={cloneElement(icon, {
          sx: {
            fontSize: "1.5rem",
            transition: "transform cubic-bezier(0.34, 1.56, 0.64, 1)",
            transitionDuration: SIDEBAR_ANIMATION_DURATION + "ms",
            transitionDelay: isSidebarOpen
              ? "0ms"
              : SIDEBAR_ANIMATION_DURATION + "ms",
            transform: isSidebarOpen ? "scale(0.8)" : "scale(1)",
            ...iconSx,
          },
        })}
        fullWidth
        className={cn("!justify-start gap-1 !px-2.5", className)}
        slotProps={{
          startDecorator: { sx: { m: 0 } },
        }}
        onClick={onClick}
        color={isActive ? "primary" : "neutral"}
        variant={isActive ? "soft" : "plain"}
        {...props}
      >
        <div
          style={{
            fontWeight: "normal",
            overflowX: "hidden",
            whiteSpace: "nowrap",
            marginLeft: "0.2rem",
            ...contentStyle,
          }}
        >
          {content}
        </div>
      </Button>
    </Tooltip>
  );
}
