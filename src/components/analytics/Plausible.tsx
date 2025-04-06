import { useEffect } from "react";
import { useOrganization } from "../../lib/api/organization";
import { useMe } from "../../lib/api/user";

export function Plausible() {
  const me = useMe();
  const organization = useOrganization();

  useEffect(() => {
    if (!me?.primaryEmail || !organization?.tenantId) return;
    const script = document.createElement("script");

    script.src =
      "https://trends.adhikari.de/js/script.pageview-props.local.js";
    script.async = true;

    script.setAttribute("data-domain", "app.deingpt.com");
    script.setAttribute("event-user-email", me.primaryEmail);
    script.setAttribute("event-tenant-id", organization.tenantId);

    document.body.appendChild(script);

    console.log("added plausible script");

    return () => {
      document.body.removeChild(script);
    };
  }, [me?.primaryEmail, organization?.tenantId]);

  return null;
}
