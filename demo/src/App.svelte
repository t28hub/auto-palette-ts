<script lang="ts">
  import Canvas from './components/Canvas.svelte';
  import { currentPhoto } from './stores/photo';
</script>

<main>
  <Canvas src="{$currentPhoto.url}" width="600" height="500" />
</main>
