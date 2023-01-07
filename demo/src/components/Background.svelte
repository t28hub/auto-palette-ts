<script lang="ts">
  import { decode } from 'blurhash';
  import { onMount, tick } from 'svelte';
  import type { Photo } from '../stores/photo';

  export let photo: Photo;

  let screenWidth: number = window.innerWidth;
  let screenHeight: number = window.innerHeight;
  let devicePixelRatio: number = window.devicePixelRatio;

  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D | undefined;
  onMount(() => {
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
    context.clearRect(0, 0, width, height);
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

<div class="w-full h-full position-absolute top-0 left-0 -z-50 bg-slate-200">
  <canvas
    bind:this={canvas}
    width="{screenWidth * devicePixelRatio}"
    height="{screenHeight * devicePixelRatio}"
  >
  </canvas>
</div>
