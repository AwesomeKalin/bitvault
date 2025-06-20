<script lang="ts">
    import { heading1, heading3, primaryButton, secondaryButton } from '$lib/classes';
    import { getOrdinals } from '$lib/addresses';
	import Ordinal from '$lib/Ordinal.svelte';

    const page: number = $state(0);
    //const from: number = $derived(page * 40);
    const from: string = '';
</script>

<h1 class={heading1}>Ordinals</h1>
<h3 class={heading3}>Click on an ordinal to see actions.<br />Page {page + 1}</h3>
<br />
<div class="space-x-8">
    <a href="/wallet/ordinals/inscribe" class={primaryButton}>Inscribe</a>
    <a href="/wallet/receive" class={primaryButton}>Receive</a>
    <a href="/wallet" class={secondaryButton}>Return</a>
</div>
<br />
<div class="space-x-8">
    {#await getOrdinals(from)}
        <h1 class={heading1}>Loading ordinals...</h1>
    {:then ordinals}
        {#if ordinals.length > 0}
            <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
                {#each ordinals as ordinal}
                    <li>
                        <a href="/wallet/ordinals/{ordinal.outpoint}">
                            <Ordinal outpoint={ordinal.data.origin.data.outpoint} name={ordinal.data.origin.data.map.name}></Ordinal>
                        </a>
                    </li>
                {/each}
            </ul>
        {:else}
            <h1 class={heading1}>No ordinals found.</h1>
        {/if}
    {/await}
</div>