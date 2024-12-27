<script lang="ts">
	import { heading1, heading3, primaryButton, secondaryButton } from '$lib/classes';
</script>

<h1 class={heading1}>Welcome to BitVault</h1>
<h3 class={heading3}>The Private Wallet for your BSV, BSV20/21 Tokens, and 1SatOrdinals</h3>
<br />
<div class="space-x-8">
	<a href="/create/new" class={primaryButton}>Create New Wallet</a>
	<a href="/create/import" class={secondaryButton}>Import Mnemonic</a>
</div>
