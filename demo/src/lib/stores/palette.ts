import type { Swatch } from 'auto-palette';
import { writable, type Writable } from 'svelte/store';

export const swatches: Writable<Swatch[]> = writable([]);
