import axios from "axios";
import _ from "lodash";
import { useMemo, useRef } from "react";
import type { SWRConfiguration } from "swr";
import useSWR from "swr";
import type z from "zod";
import { useParams } from "../../router";
import { useAuthStore } from "../context/authStore";
import { handleAxiosError } from "../errorHandling";
import { useTranslation } from "../i18n";

type UseApiOptions = Partial<{ disableErrorToast: boolean }>;

export function useRootApi(options?: UseApiOptions) {
  return useApiWithBasePath(`/api`, options);
}

export function useOrganizationApi(options?: UseApiOptions) {
  const params = useParams("/:organizationId");
  const organizationId = params?.organizationId || import.meta.env.VITE_DEFAULT_ORG_ID;

  if (!organizationId && import.meta.env.PROD) {
    throw new Error("Organization ID is required in production");
  }

  return useApiWithBasePath(
    `/api/organizations/${organizationId || 'default_org'}`,
    options
  );
}
// Update useOrganizationApi

function useApiWithBasePath(basePath: string, options?: UseApiOptions) {
  const { t } = useTranslation();
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);

  return useMemo(() => {
    const api = axios.create({
      baseURL: basePath,
      withCredentials: true,
      validateStatus: (status) => status < 400,
    });

    api.interceptors.response.use(
      (response) => response,
      (error) => {
        handleAxiosError(error, setLoggedIn, t, options?.disableErrorToast);
        return Promise.reject(error);
      }
    );

    return api;
  }, [basePath, options?.disableErrorToast, setLoggedIn, t]);
}

type useApiSWROptions = Partial<SWRConfiguration>;

export function useOrganizationSchemaResource<T extends z.ZodSchema>(
  path: string,
  schema: T,
  options?: useApiSWROptions
): z.infer<T> | undefined {
  const data = useOrganizationResource(path, options);
  const lastParsed = useRef<null | z.infer<T>>(null);

  if (data === undefined) return undefined;

  if (!_.isEqual(schema.parse(data), lastParsed.current)) {
    lastParsed.current = schema.parse(data);
  }

  return lastParsed.current;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useOrganizationResource<T = any>(
  path: string | null,
  options?: Partial<SWRConfiguration & { auth: boolean }>
): T | null | undefined {
  const swr = useOrganizationSWR(path, options);

  if (swr.isLoading) return undefined;
  if (swr.error) return undefined;
  if (!swr.data) return null;

  return swr.data;
}

export function useRootSchemaResource<T extends z.ZodSchema>(
  path: string,
  schema: T,
  options?: useApiSWROptions
): z.infer<T> | undefined {
  const data = useRootResource(path, options);
  const lastParsed = useRef<null | z.infer<T>>(null);

  if (data === undefined) return undefined;

  if (!_.isEqual(schema.parse(data), lastParsed.current)) {
    lastParsed.current = schema.parse(data);
  }

  return lastParsed.current;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useRootResource<T = any>(
  path: string,
  options?: Partial<SWRConfiguration & { auth: boolean }>
): T | null | undefined {
  const swr = useRootSWR(path, options);

  if (swr.isLoading) return undefined;
  if (swr.error) return undefined;
  if (!swr.data) return null;

  return swr.data;
}

// Update useOrganizationSWR
export function useOrganizationSWR(
  path: string | null,
  options?: useApiSWROptions
) {
  const params = useParams("/:organizationId");
  const organizationId = params?.organizationId;
  
  return useSWR(
    organizationId && path ? `${path}?org=${organizationId}` : null,
    useOrganizationFetcher(),
    {
      ...options,
      enabled: !!organizationId && !!path
    }
  );
}

export function useRootSWR(path: string, options?: useApiSWROptions) {
  return useSWR(path, useRootFetcher(), {
    ...options,
  });
}

function useFetcherFromApi(api: ReturnType<typeof useOrganizationApi>) {
  return async (url: string) => {
    return await api.get(url).then((res) => res?.data ?? null);
  };
}

export function useOrganizationFetcher() {
  return useFetcherFromApi(useOrganizationApi());
}

export function useRootFetcher() {
  return useFetcherFromApi(useRootApi());
}
