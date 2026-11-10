import { FieldErrors } from "react-hook-form";

export const parseConfigData = (data: unknown): unknown => {
  if (data == null || typeof data !== "string") return data;
  const trimmed = data.trim();
  const looksLikeJson =
    (trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"));
  if (!looksLikeJson) return data;
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return data;
  }
};

export const flattenErrors = (errors: Record<string, string[] | string>): string => {
  return Object.entries(errors)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}: ${value.join(" | ")}`;
      }
      return `${key}: ${value}`;
    })
    .join("\n");
};


export const errorMessageForm = (errors: FieldErrors): string => {
  const isMessageObject = (value: unknown): value is { message?: string } =>
    typeof value === "object" && value !== null && "message" in value;

  const findAllErrorMessages = (data: unknown, prefix = ""): string[] => {
    const messages: string[] = [];

    const pushMessage = (value: unknown) => {
      if (typeof value === "string" && value.trim()) {
        messages.push(`• ${value.trim()}`);
      }
    };

    if (!data) return messages;

    // Handle array of errors (e.g. field arrays)
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        const fieldPath = prefix ? `${prefix}[${index}]` : `[${index}]`;
        if (isMessageObject(item) && item.message) {
          pushMessage(item.message);
        } else if (typeof item === "object") {
          messages.push(...findAllErrorMessages(item, fieldPath));
        } else {
          pushMessage(item);
        }
      });
      return messages;
    }

    // Handle object errors
    for (const key in data as FieldErrors) {
      const error = (data as FieldErrors)[key];
      if (!error) continue;

      const fieldPath = prefix ? `${prefix}.${key}` : key;

      if (isMessageObject(error) && error.message) {
        pushMessage(error.message);
      } else if (Array.isArray(error)) {
        messages.push(...findAllErrorMessages(error, fieldPath));
      } else if (typeof error === "object") {
        const nested = findAllErrorMessages(error as FieldErrors, fieldPath);
        messages.push(...nested);
      } else {
        pushMessage(error);
      }
    }
    return messages;
  };

  const allMessages = findAllErrorMessages(errors);

  if (allMessages.length === 0) {
    return "Error de validación";
  }

  if (allMessages.length === 1) {
    return (allMessages[0] ?? "").replace("• ", "");
  }

  return allMessages.join("\n");
};