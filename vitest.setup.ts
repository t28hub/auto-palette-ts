import '@vitest/web-worker';
import 'jest-extended';
import 'jest-extended/all';
import * as crypto from 'node:crypto';

import './src/test/matchers';

Object.defineProperty(global.self, 'crypto', {
  value: {
    randomUUID: () => crypto.randomUUID(),
  },
});
