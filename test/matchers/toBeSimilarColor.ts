import {
  EXPECTED_COLOR,
  matcherErrorMessage,
  matcherHint,
  printExpected,
  printReceived,
  printWithType,
} from 'jest-matcher-utils';

import { Color, ciede2000 } from '../../src';

import { MatcherResult } from './types';

/**
 * Check whether the received color is similar to the expected color.
 *
 * @param received - The received color to be checked.
 * @param expected - The expected color.
 * @param threshold - The threshold of the color difference. The default value is 10.0.
 * @return The matcher result.
 * @throws {Error} If the expected value is not a valid color.
 */
export function toBeSimilarColor(received: Color, expected: unknown, threshold = 10.0): MatcherResult {
  let expectedColor: Color | undefined;
  try {
    expectedColor = Color.parse(expected);
  } catch (e) {
    expectedColor = undefined;
  }

  if (!expectedColor) {
    const errorMessage = matcherErrorMessage(
      matcherHint('toBeSimilarColor', 'received', 'expected'),
      `${EXPECTED_COLOR('expected')} value is not parseable as a color:`,
      printWithType('Expected', expected, printExpected),
    );
    throw new Error(errorMessage);
  }

  const difference = received.differenceTo(expectedColor, ciede2000);
  const pass = difference < threshold;

  const passMessage = `${matcherHint('.not.toBeSimilarColor', 'received', 'expected')}
    
    Expected color to not be similar:
      Expected: ${printExpected(expectedColor.toString())}
      Received: ${printReceived(received.toString())}
      
      Expected difference: > ${printExpected(threshold)}
      Received difference:   ${printReceived(difference)}`;

  const failMessage = `${matcherHint('.toBeSimilarColor', 'received', 'expected')}
    
    Expected color to be similar:
      Expected: ${printExpected(expectedColor.toString())}
      Received: ${printReceived(received.toString())}
      
      Expected difference: < ${printExpected(threshold)}
      Received difference:   ${printReceived(difference)}`;

  return {
    pass,
    message: (): string => (pass ? passMessage : failMessage),
  };
}
