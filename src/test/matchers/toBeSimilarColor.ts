import {
  EXPECTED_COLOR,
  matcherErrorMessage,
  matcherHint,
  printExpected,
  printReceived,
  printWithType,
} from 'jest-matcher-utils';

import { ciede2000, Color } from '../../color';

import { MatcherResult } from './types';

/**
 * Check whether the received color is similar to the expected color.
 *
 * @param received The received color to be checked.
 * @param expected The expected color.
 * @param threshold The allowed threshold.
 * @return The matcher result.
 */
export function toBeSimilarColor(received: Color, expected: unknown, threshold = 40.0): MatcherResult {
  let expectedColor: Color | undefined;
  try {
    expectedColor = Color.parse(expected);
  } catch (e) {
    expectedColor = undefined;
  }

  if (!expectedColor) {
    const errorMessage = matcherErrorMessage(
      matcherHint('toBeSimilarColor', 'received', 'expected'),
      `${EXPECTED_COLOR('expected')} value must be a Color or string`,
      printWithType('Expected', expected, printExpected),
    );
    throw new Error(errorMessage);
  }

  const difference = received.differenceTo(expectedColor, ciede2000);
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
