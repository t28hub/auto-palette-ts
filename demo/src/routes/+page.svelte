<script lang="ts">
  import Background from '$lib/components/Background.svelte';
  import Canvas from '$lib/components/Canvas.svelte';
  import SwatchCursor from '$lib/components/SwatchCursor.svelte';
  import { swatches } from '$lib/stores/palette';
  import { currentPhoto } from '$lib/stores/photo';
</script>

<svelte:head>
  <title>Auto Palette</title>
  <meta name="description" content="Demo application using 'auto-palette'" />
</svelte:head>

<section class="prose">
  <h1>Auto Palette</h1>
  {#if $currentPhoto}
    <Background photo={$currentPhoto} />
    <Canvas src={$currentPhoto.url} width="600" height="500" />
  {/if}
  {#each $swatches as swatch}
    <SwatchCursor x={swatch.coordinate.x} y={swatch.coordinate.y} bind:color={swatch.color} />
  {/each}
</section>
