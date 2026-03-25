<script lang="ts">
	import './layout.css';
	// import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import banner from '$lib/assets/banner_epitome.png';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import Footer from '$lib/components/Footer.svelte';
	import NavbarDefault from '$lib/components/NavbarDefault.svelte';
	import { base } from '$app/paths';
	import { ModeWatcher } from 'mode-watcher';
	let { children } = $props();
</script>

<svelte:head>
	<meta property="og:image" content={banner} />
</svelte:head>
<ModeWatcher />
<Toaster position="top-center" />
{#if page.url.pathname !== base + '/generate'}
	<NavbarDefault />
{/if}

<!-- <svelte:head><link rel="icon" href={favicon} /></svelte:head> -->
{@render children()}

<Footer />
