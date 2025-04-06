import { Info } from "@mui/icons-material";
import { Alert, CssVarsProvider, Link } from "@mui/joy";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { Outlet } from "react-router";
import { toast } from "react-toastify";
import { Plausible } from "../../components/analytics/Plausible";
import { IntroTour } from "../../components/onboarding/IntroTour";
import { TrialModal } from "../../components/organisation/UpgradeModal";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { GuidelinesModal } from "../../components/util/GuidelinesModal";
import { NotFound } from "../../components/util/NotFound";
import { useGuidelines } from "../../lib/api/guidelines";
import { usePartOfCurrentOrganization } from "../../lib/api/organization";
import { trpc } from "../../lib/api/trpc/trpc";
import { useMe, useMutateMe } from "../../lib/api/user";
import { useTrialStore } from "../../lib/context/trialModalStore";
import useBreakingPoint from "../../lib/hooks/useBreakpoint";
import { useLoggedInOnly } from "../../lib/hooks/useLoggedInOnly";
import { useTheme } from "../../lib/hooks/useTheme";
import { useNavigate, useParams } from "../../router";
import usePersistentState from "../../lib/hooks/usePersistentState";
import { OrganizationProvider } from '../../context/organization';
export default function OrganizationLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = usePersistentState<boolean>(
    "sidebar-state",
    true
  );

  const isSmallScreen = useBreakingPoint("lg");

  useEffect(() => {
    if (isSmallScreen) {
      setIsSidebarOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSmallScreen]);

  useLoggedInOnly();
  usePartOfCurrentOrganization();
  const me = useMe();
  const mutateMe = useMutateMe();
  const navigate = useNavigate();
  const params = useParams("/:organizationId");

  const { t } = useTranslation();

  const { data: organization, isLoading: isLoadingOrganization } =
    trpc.organization.getOrganization.useQuery();

  useEffect(() => {
    if (organization && organization.phaseStatus !== "ok") {
      useTrialStore.setState({
        status: organization.phaseStatus,
      });
      return;
    }

    if (me && me.onboarded === false) {
      void navigate("/:organizationId/onboarding", { params, replace: true });
    }

    if (!me || !organization) return;

    if (organization.isAcademyOnly) {
      void navigate("/:organizationId/learn/:workshopId", {
        params: {
          ...params,
          workshopId: "none",
        },
        replace: true,
      });
    }
  }, [me, navigate, params, organization]);

  useEffect(() => {
    // set the title of the page to the organization name
    if (organization?.customTitle) {
      document.title = organization.customTitle;
    } else {
      document.title = "deingpt";
    }
  }, [organization?.customTitle]);

  const theme = useTheme();

  const guidelinesAccepted = me?.acceptedGuidelines ?? false;
  const { mutateGuidelines } = useGuidelines();
  const acceptGuidelines = () => {
    mutateGuidelines({ accepted: true })
      .then(() => {
        void mutateMe();
      })
      .catch(() => {
        toast.error(t("errors.unknown"));
      });
  };

  if (isLoadingOrganization) {
    return null;
  }

  if (!organization) {
    return <NotFound />;
  }

  return (
    <OrganizationProvider>

    <CssVarsProvider theme={theme}>
      <TrialModal />
      <IntroTour />
      <Plausible />
      <GuidelinesModal
        forceAccept
        isOpen={!guidelinesAccepted}
        onClose={acceptGuidelines}
      />
      <div className="border-red relative flex h-screen w-screen flex-row">
        {me?.isSuperUserOnly && (
          <>
            <div className="pointer-events-none absolute right-1 top-0 z-50 p-2">
              <Alert
                variant="soft"
                color="danger"
                size="sm"
                startDecorator={<Info />}
              >
                Super User View. You are not a member of this organization.
              </Alert>
            </div>
            <div className="pointer-events-none fixed z-40 h-screen w-screen border-4 border-red-500" />
          </>
        )}
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="relative h-full flex-1 overflow-y-auto">
          <div className="absolute left-0 right-0 top-0 z-10 flex flex-col items-center gap-4 p-4">
            {organization?.banners?.map((banner) => (
              <Banner banner={banner} key={banner.id} />
            ))}
          </div>
          <Outlet />
        </div>
      </div>
    </CssVarsProvider>
          <Outlet />
    </OrganizationProvider>
  );
}

function Banner({
  banner,
}: {
  banner: {
    content: string;
    type: "danger" | "warning" | "success";
  };
}) {
  return (
    <Alert
      sx={{
        width: "100%",
      }}
      variant="soft"
      color={banner.type ?? "primary"}
      size="lg"
      startDecorator={<Info />}
    >
      <ReactMarkdown
        components={{
          a: ({ ...props }) => (
            <Link>
              <a {...props} target="_blank" rel="noopener noreferrer" />
            </Link>
          ),
        }}
      >
        {banner.content}
      </ReactMarkdown>
    </Alert>
  );
}
