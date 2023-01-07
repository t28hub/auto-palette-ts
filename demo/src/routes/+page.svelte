<script lang="ts">
  import Background from '$lib/components/Background.svelte';
  import Canvas from '$lib/components/Canvas.svelte';
  import { currentPhoto } from '$lib/stores/photo';
</script>

<svelte:head>
  <title>Auto Palette</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="prose">
  <h1>Hello, world!</h1>
  <Background photo={$currentPhoto} />
  <Canvas src={$currentPhoto.url} width="600" height="500" />
</section>
