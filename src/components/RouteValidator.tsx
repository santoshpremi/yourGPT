import { useParams, useNavigate } from "../router";
import { useEffect } from "react";

export function RouteValidator() {
  const params = useParams("/:organizationId");
  const organizationId = params?.organizationId;
  const navigate = useNavigate();

  useEffect(() => {
    if (!organizationId) {
      navigate("/organization-select");
    }
  }, [params.organizationId]);

  return null;
}