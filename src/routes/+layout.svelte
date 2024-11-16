<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="bg-stone-100">
	{@render children()}
</div>

<footer class="fixed bottom-0 left-0 w-full p-4 text-black text-sm font-poppins">
	<p>Copyright © 2024 Octagon. MIT Licensed</p>
</footer>
