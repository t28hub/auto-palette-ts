import { ImageData } from '@napi-rs/canvas';
import { vi } from 'vitest';
import './matchers';

vi.stubGlobal('ImageData', ImageData);
