import {
  EXPECTED_COLOR,
  matcherErrorMessage,
  matcherHint,
  printExpected,
  printReceived,
  printWithType,
} from 'jest-matcher-utils';

import { color } from '../../color';
import { Color } from '../../types';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeSimilarColor(expected: unknown): R;

      toBeSimilarColor(expected: unknown, threshold: number): R;
    }

    interface Expect {
      toBeSimilarColor(expected: unknown): unknown;

      toBeSimilarColor(expected: unknown, threshold: number): unknown;
    }
  }
}

/**
 * Check whether the received color is similar to the expected color.
 *
 * @param received The received color to be checked.
 * @param expected The expected color.
 * @param threshold The allowed threshold.
 * @return The matcher result.
 */
export function toBeSimilarColor(received: Color, expected: unknown, threshold = 40.0): jest.CustomMatcherResult {
  const expectedColor = color(expected);
  if (!expectedColor) {
    const errorMessage = matcherErrorMessage(
      matcherHint('toBeSimilarColor', 'received', 'expected'),
      `${EXPECTED_COLOR('expected')} value must be a Color or string`,
      printWithType('Expected', expected, printExpected),
    );
    throw new Error(errorMessage);
  }

  const difference = received.differenceTo(expectedColor);
  const pass = difference < threshold;

  const passMessage =
    matcherHint('.not.toBeSimilarColor', 'received', 'expected') +
    '\n\n' +
    'Expected color to not be similar:\n\n' +
    `Expected: ${printExpected(expectedColor.toString())}\n` +
    `Received: ${printReceived(received.toString())}\n\n` +
    `Expected difference: > ${printExpected(threshold)}\n` +
    `Received difference:   ${printReceived(difference)}`;

  const failMessage =
    matcherHint('.toBeSimilarColor', 'received', 'expected') +
    '\n\n' +
    'Expected color to be similar:\n\n' +
    `Expected: ${printExpected(expectedColor.toString())}\n` +
    `Received: ${printReceived(received.toString())}\n\n` +
    `Expected difference: < ${printExpected(threshold)}\n` +
    `Received difference:   ${printReceived(difference)}`;

  return {
    pass,
    message: (): string => (pass ? passMessage : failMessage),
  };
}
