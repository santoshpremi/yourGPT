import { ApiDocumentHeader } from "../../../packages/apiTypes/src/Documents";
import {
  useOrganizationApi,
  useOrganizationSchemaResource,
} from "../hooks/useApi";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export function useUploadDocument() {
  const organizationApi = useOrganizationApi();
  const { t } = useTranslation();
  const uploadDocument = async (file: File) => {
    if (file.size > 524_288_000) {
      toast.error(t("errors.fileTooLarge", { size: 500 }));
      throw new Error("File too large");
    }
    const formData = new FormData();
    formData.append("file", file);

    const response = await organizationApi.post(
      `/documents/adi/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return ApiDocumentHeader.parse(response.data);
  };

  return uploadDocument;
}

export function useUploadDocumentWithToast() {
  const uploadDocument = useUploadDocument();
  const { t } = useTranslation();
  return async (file: File) => {
    const uploaded = await toast.promise<
      Awaited<ReturnType<typeof uploadDocument>>
    >(uploadDocument(file), {
      error: t("documents.error"),
    });
    return uploaded as ApiDocumentHeader;
  };
}

export function useDocumentHeader(documentId: string) {
  return useOrganizationSchemaResource(
    `/documents/${documentId}/header`,
    ApiDocumentHeader,
  );
}
