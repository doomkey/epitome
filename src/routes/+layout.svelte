<script lang="ts">
	import './layout.css';
	// import favicon from '$lib/assets/favicon.svg';
	import banner from '$lib/assets/banner_overcast.png';

	let { children } = $props();
</script>

<svelte:head>
	<meta property="og:image" content={banner} />
</svelte:head>
<!-- <svelte:head><link rel="icon" href={favicon} /></svelte:head> -->
{@render children()}
