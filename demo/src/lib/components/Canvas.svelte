<script lang="ts">
  import { onMount } from 'svelte';
  import { swatches } from '$lib/stores/palette';

  import { AutoPalette, create } from 'auto-palette';

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
    context.drawImage(img, 0, 0, imageWidth, imageHeight, 0, 0, scaledWidth, scaledHeight);

    const imageData = context.getImageData(0, 0, scaledWidth, scaledHeight);
    const begin = performance.now();
    const autoPalette = create({ quality: 'middle', maxImageSize: 112 * 112 });
    autoPalette.extract(imageData)
      .then((result) => swatches.set(result.getSwatches()))
      .catch((cause) => console.warn({ cause }))
      .finally(() => console.info(performance.now() - begin));
  }

  $: drawImage(context, image);
</script>

<canvas data-testid="canvas" bind:this={canvas} {width} {height} />
