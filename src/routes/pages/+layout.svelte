<script lang="ts">
	import NavbarDefault from '$lib/components/NavbarDefault.svelte';

	let { children, title } = $props();
</script>

<svelte:head>
	{#if title}
		<title>{title}</title>
	{:else}
		<title>Epitome Resume Builder</title>
	{/if}
</svelte:head>
<!-- <svelte:head><link rel="icon" href={favicon} /></svelte:head> -->
<main class="container mx-auto max-w-5xl px-4 py-10 sm:flex sm:gap-10">
	<div class="prose max-w-lg flex-1 prose-neutral dark:prose-invert">
		{@render children()}
	</div>
</main>
