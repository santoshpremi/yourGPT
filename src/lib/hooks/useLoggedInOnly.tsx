import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuthStore } from "../context/authStore";

export function useLoggedInOnly() {
  const loggedIn = useAuthStore((store) => store.loggedIn);
  const navigate = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    if (!loggedIn) {
      console.log("not logged in, redirecting to auth");
      localStorage.setItem("returnUrl", loc.pathname + loc.search);
      void navigate({
        pathname: "/auth",
      });
    }
  }, [loggedIn, navigate, loc.pathname, loc.search]);
}
