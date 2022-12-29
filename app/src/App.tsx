import { ReactElement } from 'react';
import { RecoilRoot } from 'recoil';

import HomeLayout from '@/layouts/HomeLayout';

export default function App(): ReactElement {
  return (
    <RecoilRoot>
      <HomeLayout />
    </RecoilRoot>
  );
}
