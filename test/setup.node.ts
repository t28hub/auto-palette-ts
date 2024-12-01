import { ImageData } from 'canvas';
import { vi } from 'vitest';
import './matchers';

vi.stubGlobal('ImageData', ImageData);
