import { ImageSource, palette, Palette } from 'auto-palette';
import { atom, RecoilState, RecoilValueReadOnly, selector } from 'recoil';

export const imageSourceState: RecoilState<ImageSource | undefined> = atom<ImageSource | undefined>({
  key: 'paletteImageSourceState',
  default: undefined
});
export const paletteQuery: RecoilValueReadOnly<Palette | undefined> = selector<Palette | undefined>({
  key: 'paletteQuery',
  get: async ({ get }) => {
    const imageSource = get(imageSourceState);
    if (!imageSource) {
      return undefined;
    }
    return await palette(imageSource).build();
  }
});
