import { Swatch } from 'auto-palette';
import { ReactElement } from 'react';
import { useRecoilValue } from 'recoil';

import BackgroundImage from '@/components/BackgroundImage';
import Container from '@/components/Container';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { photoQuery } from '@/store/photo';
import { paletteQuery } from '@/store/palette';

export default function HomeLayout(): ReactElement {
  const photo = useRecoilValue(photoQuery);
  const palette = useRecoilValue(paletteQuery);

  return (
    <Container>
      <Header />
      {photo && <BackgroundImage src={photo.url} blurhash={photo.blurhash} />}
      {palette &&
        (
          <div className="flex flex-row items-center">
            {palette.getSwatches().map((swatch: Swatch): ReactElement => {
              const color = swatch.color;
              const coordinate = swatch.coordinate;
              console.info(coordinate);
              const hexColor = color.toString().toUpperCase();
              return (
                <div key={hexColor} className="p-4 flex-1" style={{ backgroundColor: hexColor }}>
                  <p
                    className={`font-mono text-sm text-center ${color.isDark ? 'text-slate-100/80' : 'text-slate-900/80'}`}>{hexColor}</p>
                </div>
              );
            })}
          </div>
        )
      }
      <Footer />
    </Container>
  );
}
