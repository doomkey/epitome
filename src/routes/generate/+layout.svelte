<script lang="ts">
	import { onMount } from 'svelte';
	import { initWorkspaces } from '$lib/stores/workspace.svelte';
	import AppMenubar from '$lib/components/AppMenubar.svelte';
	import { settingsStore } from '$lib/stores/settings.svelte';
	let { children } = $props();

	onMount(() => {
		settingsStore.init();
		initWorkspaces();
	});
</script>

<svelte:head>
	<title>Generate Resume</title>
	<meta name="description" content="Build free resume with Epitome." />
</svelte:head>

<AppMenubar />
<!-- <MobileMenu /> -->
{@render children()}
