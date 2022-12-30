import React, { ReactElement } from 'react';
import { RecoilRoot } from 'recoil';

import HomeLayout from '@/layouts/HomeLayout';

export default function App(): ReactElement {
  return (
    <RecoilRoot>
      <React.Suspense fallback={(<div>loading...</div>)}>
        <HomeLayout />
      </React.Suspense>
    </RecoilRoot>
  );
}
