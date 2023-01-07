<script lang="ts">
  import Canvas from './components/Canvas.svelte';
  import { currentPhoto } from './stores/photo';
  import Background from './components/Background.svelte';
</script>

<main class="w-full h-full">
  <Canvas src="{$currentPhoto.url}" width="600" height="500" />
  <Background photo="{$currentPhoto}"></Background>
</main>
