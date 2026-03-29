<script lang="ts">
	import './layout.css';
	// import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import Footer from '$lib/components/Footer.svelte';
	import NavbarDefault from '$lib/components/NavbarDefault.svelte';
	import { base } from '$app/paths';
	import { ModeWatcher } from 'mode-watcher';
	import { ProgressBar } from '@prgm/sveltekit-progress-bar';
	let { children } = $props();
	import { onMount } from 'svelte';
	import { preloadPdfjs } from '$lib/functions/pdfjs';
	import { preloadPdfMake } from '$lib/functions/pdfEngine';

	onMount(() => {
		preloadPdfjs();
		preloadPdfMake();
	});
</script>

<svelte:head>
	<meta name="description" content="Feature-packed, free, browser-only resume builder." />
</svelte:head>
<ModeWatcher />
<ProgressBar class="text-pink-500" zIndex={999} />
<Toaster position="top-center" />
{#if page.url.pathname !== base + '/generate'}
	<NavbarDefault />
{/if}

<!-- <svelte:head><link rel="icon" href={favicon} /></svelte:head> -->
{@render children()}

<Footer />
