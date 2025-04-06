import { useAuthStore } from "../context/authStore";
import { useRootApi, useRootResource } from "../hooks/useApi";

export const useLogout = () => {
  const api = useRootApi();
  const setLoggedIn = useAuthStore((s) => s.setLoggedIn);

  return async () => {
    await api.post("/auth/logout").then(
      () => {
        setLoggedIn(false);
        window.location.reload();
      },
      (error) => {
        console.log(error);
      }
    );
  };
};

export const useAuthMethods = () => {
  return useRootResource("auth/methods");
};
