import { useEffect } from "react";
import { useNavigate } from "../router";
import { useTranslation } from "../lib/i18n";
import { Typography, CircularProgress } from "@mui/joy";
import { TrpcProvider } from "../lib/api/trpc/TrpcProvider";

export default function IndexPage() {
  return (
    <TrpcProvider>
      <OrganizationRedirect />
    </TrpcProvider>
  );
}

function OrganizationRedirect() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    // For now, redirect to default organization
    // In a real app, this would check if user has organizations and redirect accordingly
    const defaultOrgId = "org_cm8yflh26064xmw01zbalts9c"; // matches our mock data
    
    // Small delay to show loading state
    const timer = setTimeout(() => {
      void navigate("/:organizationId", { 
        params: { organizationId: defaultOrgId },
        replace: true 
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <CircularProgress />
        <Typography level="body-lg">
          {t("loading", "Loading...")}
        </Typography>
      </div>
    </div>
  );
}
