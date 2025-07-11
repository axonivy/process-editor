import type { Severity, ValidationResult } from '@axonivy/process-editor-inscription-protocol';

export type ValidationMessage = Omit<ValidationResult, 'path'>;

export type MessageData = {
  message?: string;
  variant?: Lowercase<Severity>;
};

export const toMessageDataArray = (validations: Array<ValidationMessage>): Array<MessageData> => {
  return validations.map(toMessageData) as Array<MessageData>;
};

export const toMessageData = (validation?: ValidationMessage): MessageData | undefined => {
  if (validation) {
    return { message: validation.message, variant: validation.severity.toLocaleLowerCase() as Lowercase<Severity> };
  }
  return undefined;
};
