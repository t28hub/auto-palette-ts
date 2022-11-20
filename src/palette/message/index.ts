import { CompleteMessage } from './complete';
import { ErrorMessage } from './error';
import { ExtractMessage } from './extract';

export { type CompleteMessage } from './complete';
export { type ErrorMessage } from './error';
export { type ExtractMessage } from './extract';

export type Message = CompleteMessage | ErrorMessage | ExtractMessage;
