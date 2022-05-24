import {MessageType} from './Message.type';

export type StakeValidatorErrorType = {
  errorMessage: string;
  errorType: MessageType | '';
};
