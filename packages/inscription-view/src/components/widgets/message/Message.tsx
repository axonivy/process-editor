import type { Severity, ValidationResult } from '@axonivy/process-editor-inscription-protocol';

export type ValidationMessage = Omit<ValidationResult, 'path'>;

export type MessageData = {
  message?: string;
  variant?: Lowercase<Severity>;
  reference?: { tooltip: string; openUrl: () => void };
};

export const toMessageDataArray = (validations: Array<ValidationMessage>, openUrl: (url: string) => void): Array<MessageData> => {
  return validations.flatMap(validation => {
    const message = toMessageData(openUrl, validation);
    return message ? [message] : [];
  });
};

export const toMessageData = (openUrl: (url: string) => void, validation?: ValidationMessage): MessageData | undefined => {
  if (validation) {
    const url = validation.url;
    const message: MessageData = {
      message: validation.message,
      variant: validation.severity.toLocaleLowerCase() as Lowercase<Severity>
    };
    if (url) {
      message.reference = {
        tooltip: validation.code,
        openUrl: () => openUrl(url)
      };
    }
    return message;
  }
  return undefined;
};
