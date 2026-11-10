import { errorMessageForm } from "../helper";
import { useNotification } from "@itsa-develop/itsa-fe-components";
import type { ReactNode } from "react";
import { FieldErrors, UseFormSetFocus } from "react-hook-form";

export const useErrorFormulario = () => {
  const { openNotificationWithIcon } = useNotification();

  const formatNotificationDescription = (text: string): ReactNode =>
    text.includes("\n") ? <div style={{ whiteSpace: "pre-line" }}>{text}</div> : text;

  const errorFormMessage = (errors: FieldErrors) => {
    const message = errorMessageForm(errors);
    const description = formatNotificationDescription(message);

    openNotificationWithIcon({
      type: "error",
      message: "Verificar campos",
      // The component expects a string in its typing, but it renders React nodes.
      description: description as unknown as string,
    });
  };

  const errorFormMessageWithScroll = <T extends Record<string, unknown>>(
    errors: FieldErrors,
    setFocus?: UseFormSetFocus<T>,
  ) => {
    errorFormMessage(errors);

    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      if (setFocus) {
        try {
          setFocus(firstErrorField as Parameters<typeof setFocus>[0], {
            shouldSelect: true,
          });
        } catch {
          void 0;
        }
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            let element: Element | null = null;

            element = document.querySelector(`[name="${firstErrorField}"]`);

            if (!element) {
              element = document.getElementById(firstErrorField);
            }

            if (!element) {
              const errorText = document.querySelector(".text-red-500");
              if (errorText) {
                element = errorText.closest("div")?.parentElement || errorText;
              }
            }

            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 100);
        });
      });
    }
  };

  return {
    errorFormMessage,
    errorFormMessageWithScroll,
  };
};
