import { ReactElement, useLayoutEffect, useRef, useState } from 'react';

import CanvasImage from './CanvasImage';

interface Props {
  readonly src: string;

  readonly blurhash: string;
}

export default function BackgroundImage({ src, blurhash }: Props): ReactElement {
  const ref = useRef<HTMLHeadingElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    setWidth(ref.current.offsetWidth);
    setHeight(ref.current.offsetHeight);
  }, [ref]);

  return (
    <div ref={ref} className="w-screen h-screen absolute top-0 left-0 -z-50">
      <CanvasImage src={src} width={width} height={height} blurhash={blurhash} />
    </div>
  );
}
