import { SIDEBAR_ANIMATION_DURATION } from "../Sidebar.js";
import { IconButton, Tooltip } from "@mui/joy";
import { useNavigate, type Path } from "../../../router.js";
import { useLocation } from "react-router";
import { comparePath } from "../../../lib/routeUtils.js";

export default function SidebarSectionWithHistory({
  isSidebarOpen,
  content,
  icon,
  historyPath,
  params,
  tooltipContent,
}: {
  isSidebarOpen?: boolean;
  content: React.ReactElement & { props: { onAction?: () => void } };
  icon: React.ReactNode;
  historyPath: Path;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any;
  tooltipContent: string;
}) {
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  return (
    <div className="relative w-full">
      {/* Icon Button on the collapsed sidebar */}
      <Tooltip
        title={isSidebarOpen ? "" : tooltipContent}
        placement="right"
        size="sm"
      >
        <IconButton
          color={comparePath(pathname, historyPath) ? "primary" : "neutral"}
          variant={comparePath(pathname, historyPath) ? "soft" : "plain"}
          sx={{
            position: "absolute",
            width: "100%",
            padding: 0,
            opacity: isSidebarOpen ? 0 : 1,
            transition: "opacity ease-out",
            transitionDuration:
              (isSidebarOpen ? 0 : 1) * SIDEBAR_ANIMATION_DURATION + "ms",
            transitionDelay:
              (isSidebarOpen ? 0 : 0.7) * SIDEBAR_ANIMATION_DURATION + "ms",
            pointerEvents: isSidebarOpen ? "none" : "auto",
          }}
          onClick={async () => {
            await navigate(historyPath, { params });
          }}
        >
          {icon}
        </IconButton>
      </Tooltip>
      {/* Content on the expanded sidebar */}
      <div
        style={{
          transition: "all ease-out",
          transitionDuration: SIDEBAR_ANIMATION_DURATION + "ms",
          opacity: isSidebarOpen ? 1 : 0,
          maxHeight: isSidebarOpen ? "1000px" : "36px",
          pointerEvents: isSidebarOpen ? "auto" : "none",
          overflow: !isSidebarOpen ? "hidden" : "inherit",
        }}
      >
        {content}
      </div>
    </div>
  );
}
