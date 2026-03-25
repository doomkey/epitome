<script lang="ts">
	import { onMount } from 'svelte';
	import { initWorkspaces } from '$lib/stores/workspace.svelte';
	import AppMenubar from '$lib/components/AppMenubar.svelte';
	let { children } = $props();

	onMount(() => {
		initWorkspaces();
	});
</script>

<svelte:head>
	<title>Epitome Resume Builder</title>
</svelte:head>

<AppMenubar />
<!-- <MobileMenu /> -->
{@render children()}
