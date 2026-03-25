<script lang="ts">
	import { onMount } from 'svelte';
	import { initWorkspaces } from '$lib/stores/workspace.svelte';
	import AppMenubar from '$lib/components/AppMenubar.svelte';
	import MobileMenu from '$lib/components/MobileMenu.svelte';
	let { children } = $props();

	onMount(() => {
		initWorkspaces();
	});
</script>

<AppMenubar />
<!-- <MobileMenu /> -->
{@render children()}
