import 'jest-extended';
import 'jest-extended/all';
import { randomUUID } from 'node:crypto';

import { ImageData } from 'canvas';
import './src/test/matchers';
import { vi } from 'vitest';

vi.stubGlobal('ImageData', ImageData);
vi.stubGlobal('crypto', { randomUUID });
