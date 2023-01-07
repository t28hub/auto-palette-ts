<script lang="ts">
  import { palette } from 'auto-palette';
  import { onMount } from 'svelte';
  import { swatches } from '$lib/stores/palette';

  export let src: string = '';
  export let width: number = 300;
  export let height: number = 150;

  let image: HTMLImageElement;

  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;
  onMount(() => {
    context = canvas.getContext('2d', { colorSpace: 'srgb' });
  });

  function loadImage(url: string) {
    if (typeof window === 'undefined') {
      return;
    }

    const img = window.document.createElement('img');
    img.onload = () => {
      image = img;
    };
    img.onerror = (cause) => {
      console.warn(cause);
    };

    img.crossOrigin = 'Anonymous';
    img.src = url;
    if (img.complete) {
      image = img;
    }
  }

  $: loadImage(src);

  function drawImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
    if (!ctx || !img) {
      return;
    }

    context.clearRect(0, 0, width, height);

    const imageWidth = img.naturalWidth;
    const imageHeight = img.naturalHeight;
    if (imageWidth === 0 || imageHeight === 0) {
      return;
    }

    const scale = Math.min(width / imageWidth, height / imageHeight);
    const scaledWidth = Math.round(imageWidth * scale);
    const scaledHeight = Math.round(imageHeight * scale);
    const positionX = Math.round((width - scaledWidth) / 2.0);
    const positionY = Math.round((height - scaledHeight) / 2.0);
    context.drawImage(img, 0, 0, imageWidth, imageHeight, positionX, positionY, scaledWidth, scaledHeight);
    console.info('draw');

    const imageData = context.getImageData(positionY, positionY, scaledWidth, scaledHeight);
    palette(imageData)
      .build()
      .then((result) => swatches.set(result.getSwatches()))
      .catch((cause) => console.warn({ cause }));
  }

  $: drawImage(context, image);
</script>

<canvas data-testid="canvas" bind:this={canvas} {width} {height} />
