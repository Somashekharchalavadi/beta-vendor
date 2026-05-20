export const sheetRequestKeys = {
  all: ["sheet-requests"] as const,
  lists: () => [...sheetRequestKeys.all, "list"] as const,
  list: (filters?: { page?: number; limit?: number }) =>
    [...sheetRequestKeys.lists(), filters ?? {}] as const,
};
