<script lang="ts">
	import { getBSVBalance, getUSDBalance } from '$lib/addresses';
	import { heading1, heading3, primaryButton } from '$lib/classes';
</script>

{#await getBSVBalance()}
	<h1 class="{heading1}">Loading balance...</h1>
{:then balance}
	<h1 class="{heading1}">{balance / Math.pow(10, 8)} BSV</h1>
{/await}

{#await getUSDBalance()}
	<h3 class="{heading3}">Loading USD balance...</h3>
{:then balance}
	<h3 class="{heading3}">${balance} USD</h3>
{/await}

<br />
<a href="/wallet/receive" class="{primaryButton}">Receive</a>