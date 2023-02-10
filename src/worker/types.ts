import { Coordinate, Quality, PackedColor } from '../types';
import { UUID } from '../utils';

/**
 * Interface representing message.
 */
export interface Message<T> {
  /**
   * The ID of this message.
   */
  readonly id: UUID;

  /**
   * The type of this message.
   */
  readonly type: string;

  /**
   * The content of this message.
   */
  readonly content: T;
}

/**
 * Interface representing the content of request.
 */
export interface RequestContent {
  /**
   * The height of image.
   */
  readonly height: number;

  /**
   * The width of image.
   */
  readonly width: number;

  /**
   * The buffer of image.
   */
  readonly buffer: ArrayBuffer;

  /**
   * The quality of color extraction.
   */
  readonly quality: Quality;
}

/**
 * Interface representing request message.
 */
export interface RequestMessage extends Message<RequestContent> {
  /**
   * The type of this message.
   */
  readonly type: 'request';
}

/**
 * Interface representing the result of request.
 */
export interface FeaturePoint {
  /**
   * The packed color of the extraction result.
   */
  readonly color: PackedColor;

  /**
   * The population of the extraction result.
   */
  readonly population: number;

  /**
   * The coordinate of the extraction result.
   */
  readonly coordinate: Coordinate;
}

/**
 * Interface representing the payload of the response.
 */
export interface ResponseContent {
  /**
   * The feature points of the requested image.
   */
  readonly points: FeaturePoint[];
}

/**
 * Interface representing response message.
 */
export interface ResponseMessage extends Message<ResponseContent> {
  /**
   * The type of this message.
   */
  readonly type: 'response';
}

/**
 * Interface representing the content of the error response.
 */
export interface ErrorResponseContent {
  /**
   * The error message.
   */
  readonly message: string;
}

/**
 * Interface representing error response message.
 */
export interface ErrorResponseMessage extends Message<ErrorResponseContent> {
  /**
   * The type of this message.
   */
  readonly type: 'error';
}

export type Request = RequestMessage;
export type Response = ResponseMessage | ErrorResponseMessage;
