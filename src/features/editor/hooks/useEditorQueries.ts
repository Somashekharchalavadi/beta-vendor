import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../auth/AuthContext";
import { fieldDefinitionKeys, templateKeys } from "../api/queryKeys";
import {
  createTemplateApi,
  deleteTemplateApi,
  duplicateTemplateApi,
  fetchFieldDefinitionsApi,
  fetchTemplateApi,
  listTemplatesApi,
  patchTemplateApi,
  saveTemplateApi,
  uploadTemplateAssetApi,
  type TemplateListResponse,
} from "../templateApi";
import type { EditorDocument } from "../types";

export function useFieldDefinitionsQuery() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: fieldDefinitionKeys.all,
    queryFn: fetchFieldDefinitionsApi,
    enabled: isAuthenticated,
    staleTime: 5 * 60_000,
  });
}

export function useTemplatesListQuery(
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  },
  enabled = true,
) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: templateKeys.list(params),
    queryFn: () => listTemplatesApi(params),
    enabled: isAuthenticated && enabled,
  });
}

export function useTemplateQuery(templateId: string | null) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: templateKeys.detail(templateId ?? ""),
    queryFn: () => fetchTemplateApi(templateId!),
    enabled: isAuthenticated && Boolean(templateId),
  });
}

export function useCreateTemplateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: Partial<EditorDocument>) => createTemplateApi(body),
    onSuccess: (data) => {
      queryClient.setQueryData(templateKeys.detail(data.template.id), data);
      void queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    },
  });
}

export function useSaveTemplateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, document }: { id: string; document: EditorDocument }) =>
      saveTemplateApi(id, document),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(templateKeys.detail(id), data);
      void queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    },
  });
}

export function usePatchTemplateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      patch: { title?: string; status?: string };
    }) => patchTemplateApi(id, patch),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(templateKeys.detail(id), data);
      void queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    },
  });
}

export function useDuplicateTemplateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => duplicateTemplateApi(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    },
  });
}

export function useDeleteTemplateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTemplateApi(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: templateKeys.detail(id) });
      void queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    },
  });
}

export function useUploadTemplateAssetMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      templateId,
      dataUrl,
      fileName,
    }: {
      templateId: string;
      dataUrl: string;
      fileName?: string;
    }) => uploadTemplateAssetApi(templateId, dataUrl, fileName),
    onSuccess: (_asset, { templateId }) => {
      void queryClient.invalidateQueries({ queryKey: templateKeys.detail(templateId) });
    },
  });
}

export type { TemplateListResponse };
