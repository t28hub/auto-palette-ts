import { describe, expect, it } from 'vitest';

import { ciede2000 } from './ciede2000';

describe('ciede2000', () => {
  // The test data for CIEDE2000 is defined in the following paper:
  // "The CIEDE2000 Color-Difference Formula: Implementation Notes Supplementary Test Data, and Mathematical Observations"
  // by Gaurav Sharma, Wencheng Wu and Edul N. Dalal.
  // The paper can be found at the following URL:
  // https://hajim.rochester.edu/ece/sites/gsharma/papers/CIEDE2000CRNAFeb05.pdf
  it.each([
    {
      lab1: { l: 50.0, a: 2.6772, b: -79.7751 },
      lab2: { l: 50.0, a: 0.0, b: -82.7485 },
      expected: 2.0425,
    },
    {
      lab1: { l: 50.0, a: 3.1571, b: -77.2803 },
      lab2: { l: 50.0, a: 0.0, b: -82.7485 },
      expected: 2.8615,
    },
    {
      lab1: { l: 50.0, a: 2.8361, b: -74.02 },
      lab2: { l: 50.0, a: 0.0, b: -82.7485 },
      expected: 3.4412,
    },
    {
      lab1: { l: 50.0, a: -1.3802, b: -84.2814 },
      lab2: { l: 50.0, a: 0.0, b: -82.7485 },
      expected: 1.0,
    },
    {
      lab1: { l: 50.0, a: -1.1848, b: -84.8006 },
      lab2: { l: 50.0, a: 0.0, b: -82.7485 },
      expected: 1.0,
    },
    {
      lab1: { l: 50.0, a: -0.9009, b: -85.5211 },
      lab2: { l: 50.0, a: 0.0, b: -82.7485 },
      expected: 1.0,
    },
    {
      lab1: { l: 50.0, a: 0.0, b: 0.0 },
      lab2: { l: 50.0, a: -1.0, b: 2.0 },
      expected: 2.3669,
    },
    {
      lab1: { l: 50.0, a: -1.0, b: 2.0 },
      lab2: { l: 50.0, a: 0.0, b: 0.0 },
      expected: 2.3669,
    },
    {
      lab1: { l: 50.0, a: 2.49, b: -0.001 },
      lab2: { l: 50.0, a: -2.49, b: 0.0009 },
      expected: 7.1792,
    },
    {
      lab1: { l: 50.0, a: 2.49, b: -0.001 },
      lab2: { l: 50.0, a: -2.49, b: 0.001 },
      expected: 7.1792,
    },
    {
      lab1: { l: 50.0, a: 2.49, b: -0.001 },
      lab2: { l: 50.0, a: -2.49, b: 0.0011 },
      expected: 7.2195,
    },
    {
      lab1: { l: 50.0, a: 2.49, b: -0.001 },
      lab2: { l: 50.0, a: -2.49, b: 0.0012 },
      expected: 7.2195,
    },
    {
      lab1: { l: 50.0, a: -0.001, b: 2.49 },
      lab2: { l: 50.0, a: 0.0009, b: -2.49 },
      expected: 4.8045,
    },
    {
      lab1: { l: 50.0, a: -0.001, b: 2.49 },
      lab2: { l: 50.0, a: 0.001, b: -2.49 },
      expected: 4.8045,
    },
    {
      lab1: { l: 50.0, a: -0.001, b: 2.49 },
      lab2: { l: 50.0, a: 0.0011, b: -2.49 },
      expected: 4.7461,
    },
    {
      lab1: { l: 50.0, a: 2.5, b: 0.0 },
      lab2: { l: 50.0, a: 0.0, b: -2.5 },
      expected: 4.3065,
    },
    {
      lab1: { l: 50.0, a: 2.5, b: 0.0 },
      lab2: { l: 73.0, a: 25.0, b: -18.0 },
      expected: 27.1492,
    },
    {
      lab1: { l: 50.0, a: 2.5, b: 0.0 },
      lab2: { l: 61.0, a: -5.0, b: 29.0 },
      expected: 22.8977,
    },
    {
      lab1: { l: 50.0, a: 2.5, b: 0.0 },
      lab2: { l: 56.0, a: -27.0, b: -3.0 },
      expected: 31.903,
    },
    {
      lab1: { l: 50.0, a: 2.5, b: 0.0 },
      lab2: { l: 58.0, a: 24.0, b: 15.0 },
      expected: 19.4535,
    },
    {
      lab1: { l: 50.0, a: 2.5, b: 0.0 },
      lab2: { l: 50.0, a: 3.1736, b: 0.5854 },
      expected: 1.0,
    },
    {
      lab1: { l: 50.0, a: 2.5, b: 0.0 },
      lab2: { l: 50.0, a: 3.2972, b: 0.0 },
      expected: 1.0,
    },
    {
      lab1: { l: 50.0, a: 2.5, b: 0.0 },
      lab2: { l: 50.0, a: 1.8634, b: 0.5757 },
      expected: 1.0,
    },
    {
      lab1: { l: 50.0, a: 2.5, b: 0.0 },
      lab2: { l: 50.0, a: 3.2592, b: 0.335 },
      expected: 1.0,
    },
    {
      lab1: { l: 60.2574, a: -34.0099, b: 36.2677 },
      lab2: { l: 60.4626, a: -34.1751, b: 39.4387 },
      expected: 1.2644,
    },
    {
      lab1: { l: 63.0109, a: -31.0961, b: -5.8663 },
      lab2: { l: 62.8187, a: -29.7946, b: -4.0864 },
      expected: 1.263,
    },
    {
      lab1: { l: 61.2901, a: 3.7196, b: -5.3901 },
      lab2: { l: 61.4292, a: 2.248, b: -4.962 },
      expected: 1.8731,
    },
    {
      lab1: { l: 35.0831, a: -44.1164, b: 3.7933 },
      lab2: { l: 35.0232, a: -40.0716, b: 1.5901 },
      expected: 1.8645,
    },
    {
      lab1: { l: 22.7233, a: 20.0904, b: -46.694 },
      lab2: { l: 23.0331, a: 14.973, b: -42.5619 },
      expected: 2.0373,
    },
    {
      lab1: { l: 36.4612, a: 47.858, b: 18.3852 },
      lab2: { l: 36.2715, a: 50.5065, b: 21.2231 },
      expected: 1.4146,
    },
    {
      lab1: { l: 90.8027, a: -2.0831, b: 1.441 },
      lab2: { l: 91.1528, a: -1.6435, b: 0.0447 },
      expected: 1.4441,
    },
    {
      lab1: { l: 90.9257, a: -0.5406, b: -0.9208 },
      lab2: { l: 88.6381, a: -0.8985, b: -0.7239 },
      expected: 1.5381,
    },
    {
      lab1: { l: 6.7747, a: -0.2908, b: -2.4247 },
      lab2: { l: 5.8714, a: -0.0985, b: -2.2286 },
      expected: 0.6377,
    },
    {
      lab1: { l: 2.0776, a: 0.0795, b: -1.135 },
      lab2: { l: 0.9033, a: -0.0636, b: -0.5514 },
      expected: 0.9082,
    },
  ])('should return the color difference($expected) for Lab($lab1) and Lab($lab2)', ({ lab1, lab2, expected }) => {
    // Act
    const actual = ciede2000(lab1, lab2);

    // Assert
    expect(actual).toBeCloseTo(expected, 4);
  });
});
