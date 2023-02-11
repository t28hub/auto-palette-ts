import { degreeToRadian, radianToDegree } from '../../math';
import { DeltaE, DeltaEFunction, Lab } from '../../types';

import { asColorDifference } from './utils';

const POW7_25 = Math.pow(25, 7);

function toHPrime(x: number, y: number): number {
  if (x === 0.0 && y === 0.0) {
    return 0.0;
  }

  const angle = radianToDegree(Math.atan2(x, y));
  if (angle >= 0.0) {
    return angle;
  }
  return angle + 360.0;
}

function toHBarPrime(hPrime1: number, hPrime2: number): number {
  const deltaHPrime = Math.abs(hPrime1 - hPrime2);
  if (deltaHPrime > 180.0) {
    return (hPrime1 + hPrime2 + 360.0) / 2.0;
  }
  return (hPrime1 + hPrime2) / 2.0;
}

function toDeltaHPrime(c1: number, c2: number, h1: number, h2: number): number {
  if (c1 === 0.0 || c2 === 0.0) {
    return 0.0;
  }

  const deltaH = h2 - h1;
  if (Math.abs(deltaH) <= 180.0) {
    return deltaH;
  }

  if (h2 <= h1) {
    return deltaH + 360.0;
  }
  return deltaH - 360.0;
}

/**
 * CIEDE2000 color difference formula.
 *
 * @see [The CIEDE2000 Color-Difference Formula](https://hajim.rochester.edu/ece/sites/gsharma/papers/CIEDE2000CRNAFeb05.pdf)
 */
export class CIEDE2000 implements DeltaEFunction {
  /**
   * Create a new CIEDE 2000 color difference formula.
   * @param kL The kL value.
   * @param kC The kC value.
   * @param kH The kH value.
   * @see [Wikipedia](https://en.wikipedia.org/wiki/Color_difference#CIEDE2000).
   */
  constructor(private readonly kL = 1.0, private readonly kC = 1.0, private readonly kH = 1.0) {}
  compute(lab1: Lab, lab2: Lab): DeltaE {
    const deltaLPrime = lab2.l - lab1.l;
    const lBar = (lab1.l + lab2.l) / 2.0;

    const c1 = Math.sqrt(lab1.a * lab1.a + lab1.b * lab1.b);
    const c2 = Math.sqrt(lab2.a * lab2.a + lab2.b * lab2.b);
    const cBar = (c1 + c2) / 2.0;

    const g = Math.sqrt(Math.pow(cBar, 7.0) / (Math.pow(cBar, 7.0) + POW7_25));
    const aPrime1 = lab1.a + (lab1.a / 2.0) * (1.0 - g);
    const aPrime2 = lab2.a + (lab2.a / 2.0) * (1.0 - g);

    const cPrime1 = Math.sqrt(aPrime1 * aPrime1 + lab1.b * lab1.b);
    const cPrime2 = Math.sqrt(aPrime2 * aPrime2 + lab2.b * lab2.b);
    const cBarPrime = (cPrime1 + cPrime2) / 2.0;
    const deltaCPrime = cPrime2 - cPrime1;

    const hPrime1 = toHPrime(lab1.b, aPrime1);
    const hPrime2 = toHPrime(lab2.b, aPrime2);
    let deltaHPrime = toDeltaHPrime(c1, c2, hPrime1, hPrime2);
    deltaHPrime = 2.0 * Math.sqrt(cPrime1 * cPrime2) * Math.sin(degreeToRadian(deltaHPrime) / 2.0);

    const hBarPrime = toHBarPrime(hPrime1, hPrime2);
    const t =
      1.0 -
      0.17 * Math.cos(degreeToRadian(hBarPrime - 30.0)) +
      0.24 * Math.cos(degreeToRadian(2.0 * hBarPrime)) +
      0.32 * Math.cos(degreeToRadian(3.0 * hBarPrime + 6.0)) -
      0.2 * Math.cos(degreeToRadian(4.0 * hBarPrime - 63.0));

    const sL = 1.0 + (0.015 * Math.pow(lBar - 50.0, 2)) / Math.sqrt(20.0 + Math.pow(lBar - 50.0, 2));
    const sC = 1.0 + 0.045 * cBarPrime;
    const sH = 1.0 + 0.015 * cBarPrime * t;

    const pow7CBarPrime = Math.pow(cBarPrime, 7);
    const rT =
      -2.0 *
      Math.sqrt(pow7CBarPrime / (pow7CBarPrime + POW7_25)) *
      Math.sin(degreeToRadian(60.0 * Math.exp(-1.0 * Math.pow((hBarPrime - 275.0) / 25.0, 2))));

    const l = deltaLPrime / (this.kL * sL);
    const c = deltaCPrime / (this.kC * sC);
    const h = deltaHPrime / (this.kH * sH);

    const distance = Math.sqrt(l * l + c * c + h * h + rT * c * h);
    return asColorDifference(distance);
  }
}
