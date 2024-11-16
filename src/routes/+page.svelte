<script lang="ts">
	import { onMount } from "svelte";
    import { getData } from '../lib/runes.svelte';
	import { goto } from "$app/navigation";

    onMount(() => {
        if (getData() === undefined) {
            goto('/create');
        } else {
            goto('/wallet');
        }
    })
</script>