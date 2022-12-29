import { atom, RecoilState, RecoilValueReadOnly, selector } from 'recoil';

export interface Photo {
  readonly id: string;
  readonly url: string;
  readonly blurhash: string;
}

export const photosState: RecoilState<Photo[]> = atom<Photo[]>({
  key: 'photos',
  default: [
    {
      id: 'KR0WW6bjtt0',
      url: 'https://images.unsplash.com/photo-1661956601031-4cf09efadfce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNDM0Mjd8MXwxfGFsbHwxfHx8fHx8MXx8MTY3MjI5Mzc0OA&ixlib=rb-4.0.3&q=80&w=1080',
      blurhash: 'LZM7x_I9o$og~V.8M|t7p0NGMw%M',
    },
    {
      id: 'XFmznQhx9lM',
      url: 'https://images.unsplash.com/photo-1563473213013-de2a0133c100?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNDM0Mjd8MHwxfGFsbHwyfHx8fHx8MXx8MTY3MjI5Mzc0OA&ixlib=rb-4.0.3&q=80&w=1080',
      blurhash: 'LBJPSa4o0hW?pI4;-.R*E459O?sk',
    },
    {
      id: 'YDNvydD1jAY',
      url: 'https://images.unsplash.com/photo-1490349368154-73de9c9bc37c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNDM0Mjd8MHwxfGFsbHwzfHx8fHx8MXx8MTY3MjI5Mzc0OA&ixlib=rb-4.0.3&q=80&w=1080',
      blurhash: 'LQJInG*JMyIm^ROpxbNFyCNGnln4',
    },
    {
      id: '1c33ba-uh_8',
      url: 'https://images.unsplash.com/photo-1547327132-5d20850c62b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNDM0Mjd8MHwxfGFsbHw0fHx8fHx8MXx8MTY3MjI5Mzc0OA&ixlib=rb-4.0.3&q=80&w=1080',
      blurhash: 'LfJ8*WE2M_oM_NR:flWVI_t6kCWC',
    },
    {
      id: 'V_Q25mLo6c8',
      url: 'https://images.unsplash.com/photo-1495379572396-5f27a279ee91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNDM0Mjd8MHwxfGFsbHw1fHx8fHx8MXx8MTY3MjI5Mzc0OA&ixlib=rb-4.0.3&q=80&w=1080',
      blurhash: 'L5B:pjI90KRPDhxvS5M{_2?vD%IT',
    },
  ],
});

export const randomPhoto: RecoilValueReadOnly<Photo | undefined> = selector<Photo | undefined>({
  key: 'randomPhotos',
  get: ({ get }) => {
    const photos = get(photosState);
    const index = Math.round(photos.length * Math.random());
    return photos.at(index);
  },
});
