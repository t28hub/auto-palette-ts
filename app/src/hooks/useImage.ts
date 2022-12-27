import { useLayoutEffect, useRef, useState } from 'react';

export default function useImage(src: string, crossOrigin: string | null = null) {
  const imageRef = useRef<HTMLImageElement>();
  // For firing events
  const [_, setState] = useState(Math.random());

  useLayoutEffect(() => {
    const image = document.createElement('img');
    function onLoad() {
      imageRef.current = image;
      setState(Math.random());
    }

    function onError() {
      imageRef.current = undefined;
      setState(Math.random());
    }

    image.addEventListener('load', onLoad);
    image.addEventListener('error', onError);
    image.crossOrigin = crossOrigin;
    image.src = src;

    return () => {
      image.removeEventListener('load', onLoad);
      image.removeEventListener('error', onError);
    };
  }, [src, crossOrigin]);

  return [imageRef.current];
}
