import { HSLColor } from '../../color/hsl';

describe('.toBeSimilarColor', () => {
  it('should pass when expected color is same color', () => {
    expect(new HSLColor(120, 1.0, 0.5, 1.0)).toBeSimilarColor(new HSLColor(120, 1.0, 0.5, 1.0));
  });

  it('should pass when expected color is similar color', () => {
    expect(new HSLColor(120, 1.0, 0.5, 1.0)).toBeSimilarColor(new HSLColor(120, 0.8, 0.5, 1.0));
  });

  it('should throw Error when expected color is not similar color', () => {
    expect(() => {
      expect(new HSLColor(120, 1.0, 0.5, 1.0)).toBeSimilarColor(new HSLColor(0, 1.0, 0.5, 1.0));
    }).toThrowError();
  });

  it('should throw Error when expected valid is not parseable', () => {
    expect(() => {
      expect(new HSLColor(120, 1.0, 0.5, 1.0)).toBeSimilarColor({});
    }).toThrowError();
  });
});

describe('.not.toBeSimilarColor', () => {
  it('should pass when expected color is not similar color', () => {
    expect(new HSLColor(120, 1.0, 0.5, 1.0)).not.toBeSimilarColor(new HSLColor(0, 1.0, 0.5, 1.0));
  });

  it('should throw Error when expected color is similar color', () => {
    expect(() => {
      expect(new HSLColor(120, 1.0, 0.5, 1.0)).not.toBeSimilarColor(new HSLColor(1200, 0.8, 0.5, 1.0));
    }).toThrowError();
  });

  it('should throw Error when expected valid is not parseable', () => {
    expect(() => {
      expect(new HSLColor(120, 1.0, 0.5, 1.0)).toBeSimilarColor({});
    }).toThrowError();
  });
});
