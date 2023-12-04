import 'jest-extended';
import 'jest-extended/all';

import { ImageData } from 'canvas';
import './matchers';
import { vi } from 'vitest';

vi.stubGlobal('ImageData', ImageData);
