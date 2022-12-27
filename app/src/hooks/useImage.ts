import { useLayoutEffect, useRef, useState } from 'react';

export default function useImage(src: string, crossOrigin: string | undefined = undefined) {
  const imageRef = useRef<HTMLImageElement>();
  const [_, setState] = useState(Math.random()); // For firing events

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
    image.crossOrigin = crossOrigin || null;
    image.src = src;

    return () => {
      image.removeEventListener('load', onLoad);
      image.removeEventListener('error', onError);
    };
  }, [src, crossOrigin]);

  return [imageRef.current];
}
