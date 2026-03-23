<script lang="ts">
	import './layout.css';
	// import favicon from '$lib/assets/favicon.svg';
	import banner from '$lib/assets/banner_epitome.png';
	import { onMount } from 'svelte';
	import { initWorkspaces } from '$lib/stores/workspace.svelte';
	import WorkspaceSwitcher from '$lib/components/WorkspaceSwitcher.svelte';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import AppMenubar from '$lib/components/AppMenubar.svelte';
	import MobileMenu from '$lib/components/MobileMenu.svelte';
	let { children } = $props();

	onMount(() => {
		initWorkspaces();
	});
</script>

<svelte:head>
	<meta property="og:image" content={banner} />
</svelte:head>
<Toaster position="top-center" />
<!-- <nav class="flex items-center justify-between border-b bg-background px-8 py-4">
	<div class="text-xl font-bold">
		Epitome <span class="hidden text-sm font-normal text-muted-foreground lg:inline"
			>by <a href="https://doomkey.github.io">doomkey</a></span
		>
	</div>
	<WorkspaceSwitcher />
</nav> -->

<AppMenubar />
<MobileMenu />
<!-- <svelte:head><link rel="icon" href={favicon} /></svelte:head> -->
{@render children()}
