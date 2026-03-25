<script lang="ts">
	let { children } = $props();
</script>

<svelte:head>
	<title>Epitome Resume Builder</title>
</svelte:head>
<!-- <svelte:head><link rel="icon" href={favicon} /></svelte:head> -->
<main class="container mx-auto max-w-5xl px-4 py-10 sm:flex sm:gap-10">
	<div class="prose max-w-lg flex-1 prose-neutral dark:prose-invert">
		{@render children()}
	</div>
</main>
