import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';

import { currentPhoto, type Photo, photos } from './photo';

describe('photo', () => {
  it('should return a list of photo', () => {
    const actual = get<Photo[]>(photos);

    expect(actual).toHaveLength(5);
  });

  it('should return a current photo', () => {
    const actual = get<Photo | undefined>(currentPhoto);

    expect(actual).toBeDefined();
    expect(actual).toSatisfy((value: Photo) => {
      const index = ['XFmznQhx9lM', 'YDNvydD1jAY', '1c33ba-uh_8', 'BkR842UVXqk', 'sN4vUso_ncs'].indexOf(value.id);
      return index >= 0;
    });
  });
});
