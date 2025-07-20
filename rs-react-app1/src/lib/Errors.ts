import type { IAppError } from './types';

export const APP_ERROR_TYPE: IAppError['type'] = 'ApplicationErrorDto' as const;

abstract class AppError implements IAppError {
  humanFriendlyMessage?: string | undefined;
  type: 'ApplicationErrorDto';
  message: string;
  abstract name: string;
  constructor(message: string, humanFriendlyMessage?: string) {
    this.message = message;
    this.humanFriendlyMessage = humanFriendlyMessage;
    this.type = APP_ERROR_TYPE;
  }
}

export class RequestError extends AppError implements IAppError {
  name = RequestError.name;
}

export class ResponceError extends AppError implements IAppError {
  name = ResponceError.name;
}

export class ValidationError extends AppError implements IAppError {
  name = ValidationError.name;
  messages: {
    [Field: string]: string;
  } = {};
}

export class UnexpectedError extends AppError implements IAppError {
  name = UnexpectedError.name;
  humanFriendlyMessage =
    "This error was not expected. This highly likely means there's a bug";
}
