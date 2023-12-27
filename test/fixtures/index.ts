import { resolve } from 'path';

const flags = {
  ae: resolve(__dirname, 'flag_ae.png'),
  de: resolve(__dirname, 'flag_de.png'),
  gr: resolve(__dirname, 'flag_gr.png'),
  sc: resolve(__dirname, 'flag_sc.png'),
  za: resolve(__dirname, 'flag_za.png'),
} as const;

// The photos are licensed under the Creative Commons Zero (CC0) license.
const photos = {
  // https://www.pexels.com/photo/yellow-pink-and-violet-tulips-52508/
  tulips: resolve(__dirname, 'pexels-pixabay-52508.jpg'),
  // https://www.pexels.com/photo/close-up-photo-of-assorted-colored-chalks-1153895/
  chalks: resolve(__dirname, 'pexels-alexander-grey-1153895.jpg'),
  // https://www.pexels.com/photo/closeup-photo-of-doughnuts-1191639/
  donuts: resolve(__dirname, 'pexels-alexander-grey-1191639.jpg'),
} as const;

export default {
  flags,
  photos,
};
