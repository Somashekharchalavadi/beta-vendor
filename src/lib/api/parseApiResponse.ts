import { toast } from "sonner";
import { notifyApiMessage } from "./apiFeedback";
import type { ApiResponse } from "./types";

export type ParseApiResponseOptions = {
  /** Show global success dialog when the API returns a message field. Default true. */
  notifySuccess?: boolean;
  /** Show a non-blocking toast instead of the global dialog (when message is present). */
  notifyToast?: boolean;
};

export async function parseApiResponse<T>(
  res: Response,
  options: ParseApiResponseOptions = {},
): Promise<T> {
  const { notifySuccess = true, notifyToast = false } = options;
  const body = (await res.json()) as ApiResponse<T>;
  if (!res.ok || !("success" in body) || !body.success) {
    const message = "message" in body ? body.message : "Request failed";
    toast.error(message);
    throw new Error(message);
  }
  if (body.message) {
    if (notifySuccess) {
      notifyApiMessage(body.message);
    } else if (notifyToast) {
      toast.success(body.message);
    }
  }
  return body.data as T;
}
