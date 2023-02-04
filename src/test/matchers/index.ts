import { expect } from 'vitest';

import { toBeSimilarColor } from './toBeSimilarColor';

expect.extend({
  toBeSimilarColor,
});
