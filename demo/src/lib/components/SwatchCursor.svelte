<script lang="ts">
  import type { Color } from 'auto-palette';

  export let x: number = 0;
  export let y: number = 0;
  export let color: Color;
</script>

<div class="absolute w-8 h-8 z-50 cursor-pointer drop-shadow" style="top: {y}px; left: {x}px;">
  <div class="w-full h-full rounded-full border-2 border-solid" style="background-color: {color.toString()}" />
</div>
