<script lang="ts">
	import { heading3 } from './classes';

	let { outpoint, name } = $props();
</script>

<div class="flex flex-col items-center">
	<img src="https://ordfs.network/content/{outpoint}" alt={name} class="w-1/4" />
	<h3 class={heading3}>{name !== undefined ? name : ''}</h3>
</div>
