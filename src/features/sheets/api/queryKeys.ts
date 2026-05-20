export const sheetsKeys = {
  all: ["sheets"] as const,
  page: (templateId: string, page: number) =>
    [...sheetsKeys.all, templateId, page] as const,
};
