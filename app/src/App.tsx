import { ReactElement } from 'react';

import BackgroundImage from './components/BackgroundImage';
import Container from './components/Container';
import Footer from './components/Footer';
import Header from './components/Header';

export default function App(): ReactElement {
  return (
    <Container>
      <Header />
      <BackgroundImage
        src="https://images.unsplash.com/photo-1490349368154-73de9c9bc37c?crop=entropy\u0026cs=tinysrgb\u0026fm=jpg\u0026ixid=MnwzNDM0Mjd8MHwxfGFsbHwzfHx8fHx8MXx8MTY3MjEzNDY5OQ\u0026ixlib=rb-4.0.3\u0026q=80"
        blurhash="LQJInG*JMyIm^ROpxbNFyCNGnln4"
      />
      {/* <BackgroundImage */}
      {/*  src="https://images.unsplash.com/photo-1563473213013-de2a0133c100?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=MnwzNDM0Mjd8MHwxfGFsbHwyfHx8fHx8MXx8MTY3MjEzNDY5OQ\u0026ixlib=rb-4.0.3\u0026q=80\u0026w=1080" */}
      {/*  blurhash="LBJPSa4o0hW?pI4;-.R*E459O?sk" */}
      {/* /> */}
      <Footer />
    </Container>
  );
}
