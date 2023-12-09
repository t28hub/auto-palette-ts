import 'jest-extended';
import 'jest-extended/all';

import { ImageData } from 'canvas';
import { vi } from 'vitest';
import './matchers';

vi.stubGlobal('ImageData', ImageData);
