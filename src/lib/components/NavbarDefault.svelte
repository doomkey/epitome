<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import DarkModeToggle from './DarkModeToggle.svelte';
	import { parentInfo } from '$lib/constant';
	const links = [
		{
			title: 'Home',
			href: resolve('/')
		},
		{ title: 'Docs', href: resolve('/docs') },
		{ title: 'Blog', href: resolve('/blog') }
	];

	function checkCurrentPage(a: string) {
		if (a.startsWith('http')) return false;
		return a === `/${page.url.pathname.split('/')[1]}`;
	}
</script>

<header
	class="sticky top-0 z-10 w-full border-b border-border bg-background/95 shadow-sm backdrop-blur"
>
	<div class="container mx-auto flex h-14 items-center justify-between px-4">
		<div class="flex items-center gap-2">
			<a
				href={resolve('/')}
				class=" font-secondary text-lg font-bold tracking-tight transition-colors hover:text-primary"
			>
				Epitome
			</a>
			<span class="font-base text-sm">
				by <a class="font-secondary text-primary" href={parentInfo.link}>
					{parentInfo.name}
				</a></span
			>
		</div>

		<nav class="hidden items-center gap-6 text-sm font-medium md:flex">
			{#each links as { title, href } (title)}
				<a
					{href}
					class="text-foreground/60 transition-colors hover:text-primary"
					class:text-primary={checkCurrentPage(href)}>{title}</a
				>
			{/each}
		</nav>

		<div class="flex items-center gap-2">
			<DarkModeToggle />

			<div class="md:hidden"></div>
		</div>
	</div>
</header>
