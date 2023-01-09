import { derived, readable } from 'svelte/store';

export interface Photo {
  readonly id: string;
  readonly url: string;
  readonly blurhash: string;
}

export const photos = readable<Photo[]>([
  {
    id: 'XFmznQhx9lM',
    url: 'https://images.unsplash.com/photo-1563473213013-de2a0133c100?ixid=MnwzNDM0Mjd8MHwxfGFsbHwyfHx8fHx8MXx8MTY3MjkwMzQxNg&ixlib=rb-4.0.3',
    blurhash: 'LBJPSa4o0hW?pI4;-.R*E459O?sk'
  },
  {
    id: 'YDNvydD1jAY',
    url: 'https://images.unsplash.com/photo-1490349368154-73de9c9bc37c?ixid=MnwzNDM0Mjd8MHwxfGFsbHwzfHx8fHx8MXx8MTY3MjkwMzQxNg&ixlib=rb-4.0.3',
    blurhash: 'LQJInG*JMyIm^ROpxbNFyCNGnln4'
  },
  {
    id: '1c33ba-uh_8',
    url: 'https://images.unsplash.com/photo-1547327132-5d20850c62b5?ixid=MnwzNDM0Mjd8MHwxfGFsbHw1fHx8fHx8MXx8MTY3MjkwMzQxNg&ixlib=rb-4.0.3',
    blurhash: 'LfJ8*WE2M_oM_NR:flWVI_t6kCWC'
  },
  {
    id: 'BkR842UVXqk',
    url: 'https://images.unsplash.com/photo-1558816280-dee9521ff364?ixid=MnwzNDM0Mjd8MHwxfGFsbHwxMHx8fHx8fDF8fDE2NzI5MDM0MTY&ixlib=rb-4.0.3',
    blurhash: 'LA71AxX50_xHt7j[S1ju0_nm^8NZ'
  },
  {
    id: 'sN4vUso_ncs',
    url: 'https://images.unsplash.com/photo-1672676831425-207e5d4a0c41?ixid=MnwzNDM0Mjd8MHwxfGFsbHwxMHx8fHx8fDJ8fDE2NzI5MDMwNzA&ixlib=rb-4.0.3',
    blurhash: 'L38X5,8^9uVstko}R5NG9]ae$+M{'
  },
  {
    id: 'mqO0Rf-PUMs',
    url: 'https://images.unsplash.com/photo-1475694867812-f82b8696d610?ixid=MnwzNDM0Mjd8MHwxfGFsbHw5fHx8fHx8MXx8MTY3MzIzOTk3NQ&ixlib=rb-4.0.3',
    blurhash: 'LM6wyhozWXa}?wofV@bI-:jYbbjY'
  },
  {
    id: '4oovIxttThA',
    url: 'https://images.unsplash.com/photo-1560850038-f95de6e715b3?ixid=MnwzNDM0Mjd8MHwxfGFsbHw3fHx8fHx8MXx8MTY3MzIzOTk3NQ&ixlib=rb-4.0.3',
    blurhash: 'LaCt8}~BwNIpozoLofofWBWBaef6',
  },
  {
    id: 'V_Q25mLo6c8',
    url: 'https://images.unsplash.com/photo-1495379572396-5f27a279ee91?ixid=MnwzNDM0Mjd8MHwxfGFsbHw0fHx8fHx8MXx8MTY3MzIzOTk3NQ&ixlib=rb-4.0.3',
    blurhash: 'L5B:pjI90KRPDhxvS5M{_2?vD%IT'
  }
]);

export const currentPhoto = derived<typeof photos, Photo | undefined>(photos, ($photos): Photo | undefined => {
  const index = Math.floor(Math.random() * $photos.length);
  const photo = $photos.at(index);
  if (!photo) {
    return undefined;
  }
  return photo;
});
