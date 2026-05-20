export const templateKeys = {
  all: ["templates"] as const,
  lists: () => [...templateKeys.all, "list"] as const,
  list: (filters?: { search?: string; status?: string }) =>
    [...templateKeys.lists(), filters ?? {}] as const,
  details: () => [...templateKeys.all, "detail"] as const,
  detail: (id: string) => [...templateKeys.details(), id] as const,
};

export const fieldDefinitionKeys = {
  all: ["field-definitions"] as const,
};
