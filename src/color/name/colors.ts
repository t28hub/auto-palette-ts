import type { LAB, NamedColor } from '../types';

/**
 * A list of named colors from the CSS3 specification.
 *
 * @see [Color keywords - W3C Wiki](https://www.w3.org/wiki/CSS/Properties/color/keywords)
 */
export const COLORS: NamedColor<LAB>[] = [
  {
    name: 'AliceBlue',
    color: { l: 97.179, a: -1.35, b: -4.277 },
  },
  {
    name: 'AntiqueWhite',
    color: { l: 93.731, a: 1.835, b: 11.514 },
  },
  {
    name: 'Aqua',
    color: { l: 91.115, a: -48.081, b: -14.143 },
  },
  {
    name: 'Aquamarine',
    color: { l: 92.035, a: -45.523, b: 9.708 },
  },
  {
    name: 'Azure',
    color: { l: 98.933, a: -4.882, b: -1.702 },
  },
  {
    name: 'Beige',
    color: { l: 95.949, a: -4.196, b: 12.037 },
  },
  {
    name: 'Bisque',
    color: { l: 92.013, a: 4.426, b: 19 },
  },
  {
    name: 'Black',
    color: { l: 0, a: 0, b: 0 },
  },
  {
    name: 'BlanchedAlmond',
    color: { l: 93.92, a: 2.126, b: 17.014 },
  },
  {
    name: 'Blue',
    color: { l: 32.301, a: 79.194, b: -107.869 },
  },
  {
    name: 'BlueViolet',
    color: { l: 42.189, a: 69.849, b: -74.776 },
  },
  {
    name: 'Brown',
    color: { l: 37.524, a: 49.687, b: 30.537 },
  },
  {
    name: 'BurlyWood',
    color: { l: 77.018, a: 7.044, b: 30.01 },
  },
  {
    name: 'CadetBlue',
    color: { l: 61.154, a: -19.678, b: -7.43 },
  },
  {
    name: 'Chartreuse',
    color: { l: 89.873, a: -68.07, b: 85.78 },
  },
  {
    name: 'Chocolate',
    color: { l: 55.988, a: 37.046, b: 56.737 },
  },
  {
    name: 'Coral',
    color: { l: 67.293, a: 45.348, b: 47.485 },
  },
  {
    name: 'CornflowerBlue',
    color: { l: 61.927, a: 9.339, b: -49.31 },
  },
  {
    name: 'Cornsilk',
    color: { l: 97.455, a: -2.222, b: 14.281 },
  },
  {
    name: 'Crimson',
    color: { l: 47.033, a: 70.918, b: 33.591 },
  },
  {
    name: 'Cyan',
    color: { l: 91.115, a: -48.081, b: -14.143 },
  },
  {
    name: 'DarkBlue',
    color: { l: 14.756, a: 50.428, b: -68.687 },
  },
  {
    name: 'DarkCyan',
    color: { l: 52.206, a: -30.616, b: -9.006 },
  },
  {
    name: 'DarkGoldenRod',
    color: { l: 59.22, a: 9.858, b: 62.728 },
  },
  {
    name: 'DarkGray',
    color: { l: 69.238, a: -0.002, b: -0.01 },
  },
  {
    name: 'DarkGreen',
    color: { l: 36.203, a: -43.37, b: 41.859 },
  },
  {
    name: 'DarkGrey',
    color: { l: 69.238, a: -0.002, b: -0.01 },
  },
  {
    name: 'DarkKhaki',
    color: { l: 73.382, a: -8.793, b: 39.285 },
  },
  {
    name: 'DarkMagenta',
    color: { l: 32.599, a: 62.552, b: -38.742 },
  },
  {
    name: 'DarkOliveGreen',
    color: { l: 42.234, a: -18.831, b: 30.595 },
  },
  {
    name: 'DarkOrange',
    color: { l: 69.483, a: 36.818, b: 75.484 },
  },
  {
    name: 'DarkOrchid',
    color: { l: 43.38, a: 65.156, b: -60.11 },
  },
  {
    name: 'DarkRed',
    color: { l: 28.087, a: 50.997, b: 41.288 },
  },
  {
    name: 'DarkSalmon',
    color: { l: 69.855, a: 28.168, b: 27.702 },
  },
  {
    name: 'DarkSeaGreen',
    color: { l: 72.087, a: -23.821, b: 18.03 },
  },
  {
    name: 'DarkSlateBlue',
    color: { l: 30.829, a: 26.054, b: -42.091 },
  },
  {
    name: 'DarkSlateGray',
    color: { l: 31.256, a: -11.719, b: -3.729 },
  },
  {
    name: 'DarkSlateGrey',
    color: { l: 31.256, a: -11.719, b: -3.729 },
  },
  {
    name: 'DarkTurquoise',
    color: { l: 75.292, a: -40.038, b: -13.523 },
  },
  {
    name: 'DarkViolet',
    color: { l: 39.58, a: 76.325, b: -70.379 },
  },
  {
    name: 'DeepPink',
    color: { l: 55.958, a: 84.536, b: -5.714 },
  },
  {
    name: 'DeepSkyBlue',
    color: { l: 72.548, a: -17.65, b: -42.553 },
  },
  {
    name: 'DimGray',
    color: { l: 54.365, a: -0.002, b: -0.01 },
  },
  {
    name: 'DimGrey',
    color: { l: 54.365, a: -0.002, b: -0.01 },
  },
  {
    name: 'DodgerBlue',
    color: { l: 59.38, a: 9.967, b: -63.399 },
  },
  {
    name: 'FireBrick',
    color: { l: 39.115, a: 55.913, b: 37.643 },
  },
  {
    name: 'FloralWhite',
    color: { l: 98.402, a: -0.04, b: 5.363 },
  },
  {
    name: 'ForestGreen',
    color: { l: 50.594, a: -49.586, b: 45.015 },
  },
  {
    name: 'Fuchsia',
    color: { l: 60.323, a: 98.236, b: -60.842 },
  },
  {
    name: 'Gainsboro',
    color: { l: 87.761, a: -0.002, b: -0.012 },
  },
  {
    name: 'GhostWhite',
    color: { l: 97.757, a: 1.245, b: -3.359 },
  },
  {
    name: 'Gold',
    color: { l: 86.929, a: -1.932, b: 87.13 },
  },
  {
    name: 'GoldenRod',
    color: { l: 70.817, a: 8.517, b: 68.759 },
  },
  {
    name: 'Gray',
    color: { l: 53.585, a: -0.001, b: -0.008 },
  },
  {
    name: 'Green',
    color: { l: 46.228, a: -51.699, b: 49.897 },
  },
  {
    name: 'GreenYellow',
    color: { l: 91.957, a: -52.486, b: 81.863 },
  },
  {
    name: 'Grey',
    color: { l: 53.585, a: -0.001, b: -0.008 },
  },
  {
    name: 'HoneyDew',
    color: { l: 98.566, a: -7.567, b: 5.462 },
  },
  {
    name: 'HotPink',
    color: { l: 65.484, a: 64.235, b: -10.66 },
  },
  {
    name: 'IndianRed',
    color: { l: 53.393, a: 44.823, b: 22.108 },
  },
  {
    name: 'Indigo',
    color: { l: 20.47, a: 51.688, b: -53.321 },
  },
  {
    name: 'Ivory',
    color: { l: 99.64, a: -2.555, b: 7.149 },
  },
  {
    name: 'Khaki',
    color: { l: 90.328, a: -9.016, b: 44.971 },
  },
  {
    name: 'Lavender',
    color: { l: 91.828, a: 3.707, b: -9.675 },
  },
  {
    name: 'LavenderBlush',
    color: { l: 96.069, a: 5.885, b: -0.608 },
  },
  {
    name: 'LawnGreen',
    color: { l: 88.877, a: -67.86, b: 84.953 },
  },
  {
    name: 'LemonChiffon',
    color: { l: 97.648, a: -5.431, b: 22.222 },
  },
  {
    name: 'LightBlue',
    color: { l: 83.814, a: -10.891, b: -11.489 },
  },
  {
    name: 'LightCoral',
    color: { l: 66.155, a: 42.805, b: 19.546 },
  },
  {
    name: 'LightCyan',
    color: { l: 97.868, a: -9.945, b: -3.389 },
  },
  {
    name: 'LightGoldenRodYellow',
    color: { l: 97.369, a: -6.485, b: 19.225 },
  },
  {
    name: 'LightGray',
    color: { l: 84.556, a: -0.002, b: -0.012 },
  },
  {
    name: 'LightGreen',
    color: { l: 86.549, a: -46.33, b: 36.942 },
  },
  {
    name: 'LightGrey',
    color: { l: 84.556, a: -0.002, b: -0.012 },
  },
  {
    name: 'LightPink',
    color: { l: 81.054, a: 27.958, b: 5.023 },
  },
  {
    name: 'LightSalmon',
    color: { l: 74.705, a: 31.471, b: 34.539 },
  },
  {
    name: 'LightSeaGreen',
    color: { l: 65.786, a: -37.51, b: -6.34 },
  },
  {
    name: 'LightSkyBlue',
    color: { l: 79.724, a: -10.827, b: -28.514 },
  },
  {
    name: 'LightSlateGray',
    color: { l: 55.917, a: -2.247, b: -11.117 },
  },
  {
    name: 'LightSlateGrey',
    color: { l: 55.917, a: -2.247, b: -11.117 },
  },
  {
    name: 'LightSteelBlue',
    color: { l: 78.452, a: -1.281, b: -15.223 },
  },
  {
    name: 'LightYellow',
    color: { l: 99.285, a: -5.111, b: 14.825 },
  },
  {
    name: 'Lime',
    color: { l: 87.736, a: -86.184, b: 83.18 },
  },
  {
    name: 'LimeGreen',
    color: { l: 72.607, a: -67.126, b: 61.436 },
  },
  {
    name: 'Linen',
    color: { l: 95.311, a: 1.674, b: 6.009 },
  },
  {
    name: 'Magenta',
    color: { l: 60.323, a: 98.236, b: -60.842 },
  },
  {
    name: 'Maroon',
    color: { l: 25.533, a: 48.043, b: 38.054 },
  },
  {
    name: 'MediumAquaMarine',
    color: { l: 75.692, a: -38.334, b: 8.299 },
  },
  {
    name: 'MediumBlue',
    color: { l: 24.975, a: 67.182, b: -91.508 },
  },
  {
    name: 'MediumOrchid',
    color: { l: 53.643, a: 59.061, b: -47.416 },
  },
  {
    name: 'MediumPurple',
    color: { l: 54.975, a: 36.8, b: -50.102 },
  },
  {
    name: 'MediumSeaGreen',
    color: { l: 65.272, a: -48.217, b: 24.284 },
  },
  {
    name: 'MediumSlateBlue',
    color: { l: 52.157, a: 41.073, b: -65.408 },
  },
  {
    name: 'MediumSpringGreen',
    color: { l: 87.34, a: -70.684, b: 32.456 },
  },
  {
    name: 'MediumTurquoise',
    color: { l: 76.882, a: -37.356, b: -8.365 },
  },
  {
    name: 'MediumVioletRed',
    color: { l: 44.764, a: 70.991, b: -15.182 },
  },
  {
    name: 'MidnightBlue',
    color: { l: 15.859, a: 31.718, b: -49.581 },
  },
  {
    name: 'MintCream',
    color: { l: 99.156, a: -4.165, b: 1.233 },
  },
  {
    name: 'MistyRose',
    color: { l: 92.656, a: 8.744, b: 4.823 },
  },
  {
    name: 'Moccasin',
    color: { l: 91.723, a: 2.434, b: 26.349 },
  },
  {
    name: 'NavajoWhite',
    color: { l: 90.101, a: 4.505, b: 28.261 },
  },
  {
    name: 'Navy',
    color: { l: 12.974, a: 47.506, b: -64.707 },
  },
  {
    name: 'OldLace',
    color: { l: 96.78, a: 0.168, b: 8.153 },
  },
  {
    name: 'Olive',
    color: { l: 51.869, a: -12.935, b: 56.674 },
  },
  {
    name: 'OliveDrab',
    color: { l: 54.65, a: -28.226, b: 49.689 },
  },
  {
    name: 'Orange',
    color: { l: 74.934, a: 23.925, b: 78.947 },
  },
  {
    name: 'OrangeRed',
    color: { l: 57.579, a: 67.777, b: 68.955 },
  },
  {
    name: 'Orchid',
    color: { l: 62.802, a: 55.282, b: -34.419 },
  },
  {
    name: 'PaleGoldenRod',
    color: { l: 91.141, a: -7.354, b: 30.961 },
  },
  {
    name: 'PaleGreen',
    color: { l: 90.75, a: -48.299, b: 38.52 },
  },
  {
    name: 'PaleTurquoise',
    color: { l: 90.061, a: -19.638, b: -6.412 },
  },
  {
    name: 'PaleVioletRed',
    color: { l: 60.567, a: 45.515, b: 0.391 },
  },
  {
    name: 'PapayaWhip',
    color: { l: 95.076, a: 1.267, b: 14.513 },
  },
  {
    name: 'PeachPuff',
    color: { l: 89.349, a: 8.08, b: 21.011 },
  },
  {
    name: 'Peru',
    color: { l: 61.753, a: 21.389, b: 47.913 },
  },
  {
    name: 'Pink',
    color: { l: 83.586, a: 24.139, b: 3.313 },
  },
  {
    name: 'Plum',
    color: { l: 73.373, a: 32.529, b: -21.999 },
  },
  {
    name: 'PowderBlue',
    color: { l: 86.133, a: -14.092, b: -8.02 },
  },
  {
    name: 'Purple',
    color: { l: 29.784, a: 58.929, b: -36.498 },
  },
  {
    name: 'RebeccaPurple',
    color: { l: 32.903, a: 42.885, b: -47.158 },
  },
  {
    name: 'Red',
    color: { l: 53.237, a: 80.088, b: 67.199 },
  },
  {
    name: 'RosyBrown',
    color: { l: 63.607, a: 17.009, b: 6.6 },
  },
  {
    name: 'RoyalBlue',
    color: { l: 47.832, a: 26.27, b: -65.274 },
  },
  {
    name: 'SaddleBrown',
    color: { l: 37.468, a: 26.438, b: 40.981 },
  },
  {
    name: 'Salmon',
    color: { l: 67.262, a: 45.22, b: 29.084 },
  },
  {
    name: 'SandyBrown',
    color: { l: 73.953, a: 23.02, b: 46.784 },
  },
  {
    name: 'SeaGreen',
    color: { l: 51.534, a: -39.715, b: 20.047 },
  },
  {
    name: 'SeaShell',
    color: { l: 97.121, a: 2.159, b: 4.541 },
  },
  {
    name: 'Sienna',
    color: { l: 43.798, a: 29.317, b: 35.633 },
  },
  {
    name: 'Silver',
    color: { l: 77.704, a: -0.002, b: -0.011 },
  },
  {
    name: 'SkyBlue',
    color: { l: 79.208, a: -14.836, b: -21.288 },
  },
  {
    name: 'SlateBlue',
    color: { l: 45.337, a: 36.044, b: -57.783 },
  },
  {
    name: 'SlateGray',
    color: { l: 52.836, a: -2.143, b: -10.58 },
  },
  {
    name: 'SlateGrey',
    color: { l: 52.836, a: -2.143, b: -10.58 },
  },
  {
    name: 'Snow',
    color: { l: 98.644, a: 1.654, b: 0.574 },
  },
  {
    name: 'SpringGreen',
    color: { l: 88.471, a: -76.901, b: 47.022 },
  },
  {
    name: 'SteelBlue',
    color: { l: 52.467, a: -4.073, b: -32.201 },
  },
  {
    name: 'Tan',
    color: { l: 74.975, a: 5.016, b: 24.419 },
  },
  {
    name: 'Teal',
    color: { l: 48.255, a: -28.842, b: -8.484 },
  },
  {
    name: 'Thistle',
    color: { l: 80.078, a: 13.216, b: -9.242 },
  },
  {
    name: 'Tomato',
    color: { l: 62.204, a: 57.845, b: 46.412 },
  },
  {
    name: 'Turquoise',
    color: { l: 81.266, a: -44.078, b: -4.038 },
  },
  {
    name: 'Violet',
    color: { l: 69.695, a: 56.356, b: -36.825 },
  },
  {
    name: 'Wheat',
    color: { l: 89.351, a: 1.506, b: 23.997 },
  },
  {
    name: 'White',
    color: { l: 100, a: -0.002, b: 0.011 },
  },
  {
    name: 'WhiteSmoke',
    color: { l: 96.537, a: -0.002, b: -0.014 },
  },
  {
    name: 'Yellow',
    color: { l: 97.139, a: -21.562, b: 94.477 },
  },
  {
    name: 'YellowGreen',
    color: { l: 76.535, a: -37.993, b: 66.583 },
  },
] as const;
