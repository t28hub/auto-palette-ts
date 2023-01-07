<script lang="ts">
  import { onMount } from 'svelte';

  export let src: string = '';
  export let width: number = 300;
  export let height: number = 150;
  export let settings: CanvasRenderingContext2DSettings = {};

  let image: HTMLImageElement;

  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;

  onMount(() => {
    context = canvas.getContext('2d', settings);
  });

  function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = window.document.createElement('img');
      image.onload = () => {
        resolve(image);
      };

      image.onerror = (cause) => {
        reject(cause);
      };

      image.crossOrigin = 'Anonymous';
      image.src = src;
      if (image.complete) {
        resolve(image);
      }
    });
  }

  $: loadImage(src).then((img) => {
    image = img;
  });

  function drawImage(
    ctx: CanvasRenderingContext2D,
    imageElement: HTMLImageElement
  ) {
    if (!ctx || !imageElement) {
      return;
    }

    context.clearRect(0, 0, width, height);

    const imageWidth = imageElement.naturalWidth;
    const imageHeight = imageElement.naturalHeight;
    if (imageWidth === 0 || imageHeight === 0) {
      return;
    }

    const scale = Math.min(width / imageWidth, height / imageHeight);
    const scaledWidth = Math.round(imageWidth * scale);
    const scaledHeight = Math.round(imageHeight * scale);
    const positionX = Math.round((width - scaledWidth) / 2.0);
    const positionY = Math.round((height - scaledHeight) / 2.0);
    context.drawImage(
      imageElement,
      0,
      0,
      imageWidth,
      imageHeight,
      positionX,
      positionY,
      scaledWidth,
      scaledHeight
    );
  }

  $: drawImage(context, image);
</script>

<canvas data-testid="canvas" bind:this={canvas} {width} {height} />
