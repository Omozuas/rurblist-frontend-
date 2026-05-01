type ErrorResponseLike = {
  message?: string | string[];
};

export function getErrorMessage(response: ErrorResponseLike | null | undefined): string | null {
  if (!response) return null;

  if (typeof response.message === "string") return response.message;

  if (Array.isArray(response.message)) {
    return response.message.join(", ");
  }

  return null;
}
