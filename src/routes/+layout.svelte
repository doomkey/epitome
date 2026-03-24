<script lang="ts">
	import './layout.css';
	// import favicon from '$lib/assets/favicon.svg';
	import banner from '$lib/assets/banner_epitome.png';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import Footer from '$lib/components/Footer.svelte';
	let { children } = $props();
</script>

<svelte:head>
	<meta property="og:image" content={banner} />
</svelte:head>
<Toaster position="top-center" />

<!-- <svelte:head><link rel="icon" href={favicon} /></svelte:head> -->
{@render children()}

<Footer />
