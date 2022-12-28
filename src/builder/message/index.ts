import { ErrorResponseMessage } from './error';
import { RequestMessage } from './request';
import { ResponseMessage } from './response';

export type Request = RequestMessage;
export type Response = ErrorResponseMessage | ResponseMessage;
export type { ErrorResponseMessage, RequestMessage, ResponseMessage };
