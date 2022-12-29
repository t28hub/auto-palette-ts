import { ReactElement } from 'react';
import { useRecoilValue } from 'recoil';

import BackgroundImage from '@/components/BackgroundImage';
import Container from '@/components/Container';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { randomPhoto } from '@/store';

export default function HomeLayout(): ReactElement {
  const photo = useRecoilValue(randomPhoto);
  return (
    <Container>
      <Header />
      {photo && <BackgroundImage src={photo.url} blurhash={photo.blurhash} />}
      <Footer />
    </Container>
  );
}
