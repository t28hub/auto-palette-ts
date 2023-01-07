<script lang="ts">
  import { decode } from 'blurhash';
  import { onMount, tick } from 'svelte';

  import type { Photo } from '$lib/stores/photo';

  export let photo: Photo;

  let screenWidth: number;
  let screenHeight: number;
  let devicePixelRatio: number;

  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D | undefined;
  onMount(() => {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    devicePixelRatio = window.devicePixelRatio;
    context = canvas.getContext('2d', { colorSpace: 'srgb', willReadFrequently: true });
  });

  async function render(context, width, height) {
    if (!context) {
      return;
    }

    // Wait for the state to change.
    await tick();

    const pixels = decode(photo.blurhash, width, height);
    const imageData = context.createImageData(width, height, { colorSpace: 'srgb' });
    imageData.data.set(pixels);
    context.putImageData(imageData, 0, 0);
  }

  $: render(context, screenWidth, screenHeight);

  function resize() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    devicePixelRatio = window.devicePixelRatio;
  }
</script>

<svelte:window on:resize|passive={resize} />

<div class="w-full h-full absolute top-0 left-0 -z-50">
  <canvas bind:this={canvas} width={screenWidth} height={screenHeight} />
</div>
