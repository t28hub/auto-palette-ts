import { ReactElement } from 'react';

import Container from './components/Container';
import Header from './components/Header';

export default function App(): ReactElement {
  return (
    <Container>
      <Header></Header>
    </Container>
  );
}
