import Joyride, {
  ACTIONS,
  type CallBackProps,
  EVENTS,
  STATUS,
} from "react-joyride";
import { useOrganizationApi } from "../../lib/hooks/useApi";
import { usePrimaryColor } from "../../lib/hooks/useTheme";
import { useTranslation } from "../../lib/i18n";
import { useNavigate, useParams } from "../../router";
import { useGuide } from "./useGuide";

export function IntroTour() {
  const params = useParams("/:organizationId");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const primaryColor = usePrimaryColor() ?? "#0B6BCB";
  const { step, setStep, run, setRun, setCompleted, completed } = useGuide();
  const orgApi = useOrganizationApi();

  const enabled = run && !completed;

  const handleCallback = async (event: CallBackProps) => {
    const { action, index, status, type } = event;

    if (type === EVENTS.TOUR_START) {
      void navigate("/:organizationId", { params });
      return;
    }

    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      // Update state to advance the tour
      setStep(index + (action === ACTIONS.PREV ? -1 : 1));
      if (action === ACTIONS.CLOSE) {
        setRun(false);
      }
      return;
    }

    if (
      action === ACTIONS.CLOSE ||
      status === STATUS.SKIPPED ||
      status === STATUS.FINISHED
    ) {
      // Need to set our running state to false, so we can restart if we click start again.
      setRun(false);
      // TODO: Implement tour completion tracking when API endpoint is available
      // Currently the API endpoint returns 404, so we'll skip this for now
      if (status === STATUS.FINISHED) {
        setCompleted(true);
      }
    }
  };

  return (
    <Joyride
      locale={{
        back: t("back"),
        close: t("close"),
        last: t("next"),
        next: t("next"),
        skip: t("skip"),
        open: t("open"),
      }}
      debug
      disableOverlayClose
      styles={{
        options: {
          primaryColor,
        },
        buttonNext: {
          backgroundColor: primaryColor,
          padding: "6px 16px",
          fontWeight: 600,
          lineHeight: "14px",
          minHeight: "36px",
          borderRadius: "6px",
        },
        tooltipTitle: {
          fontSize: "1.5rem",
          fontWeight: "bold",
        },
      }}
      continuous
      stepIndex={step}
      callback={handleCallback}
      disableScrollParentFix
      disableScrolling
      run={enabled}
      steps={[
        {
          title: t("intro.welcome.title"),
          content: t("intro.welcome.content"),
          placement: "center",
          target: "body",
        },
        {
          title: t("intro.sidebar.title"),
          content: t("intro.sidebar.content"),
          target: "#sidebar",
          placement: "right",
        },
        {
          title: t("intro.firstChat.title"),
          content: t("intro.firstChat.content"),
          target: "#newChatButton",
          spotlightClicks: true,
          styles: {
            buttonNext: {
              display: "none",
            },
          },
        },
        {
          title: t("intro.sendMessage.title"),
          content: t("intro.sendMessage.content"),
          target: "#messageInput",
          spotlightClicks: true,
          placement: "bottom",
          styles: {
            buttonNext: {
              display: "none",
            },
          },
        },
        {
          title: t("intro.workflows.title"),
          content: t("intro.workflows.content"),
          target: "#sidebarWorkflowsSection",
          styles: {
            buttonBack: {
              display: "none",
            },
          },
        },
        {
          title: t("intro.runWorkflow.title"),
          content: t("intro.runWorkflow.content"),
          placement: "right",
          target: "#demoWorkflow",
          spotlightClicks: true,
          styles: {
            buttonNext: {
              display: "none",
            },
          },
        },
      ]}
    />
  );
}
