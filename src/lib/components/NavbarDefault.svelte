<script lang="ts">
	import MoonIcon from '@lucide/svelte/icons/moon';
	import SunIcon from '@lucide/svelte/icons/sun';

	import { Button } from '$lib/components/ui/button/index.js';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { toggleMode } from 'mode-watcher';
	const links = [
		{
			title: 'Home',
			href: resolve('/')
		},
		{ title: 'Docs', href: resolve('/docs') },
		{
			title: 'GitHub',
			href: 'https://github.com/doomkey/epitome',
			target: '_blank',
			rel: 'noreferrer'
		}
	];

	function checkCurrentPage(a: string) {
		if (a.startsWith('http')) return false;
		return a === `/${page.url.pathname.split('/')[1]}`;
	}
</script>

<header
	class="sticky top-0 z-50 w-full border-b border-border bg-background/95 shadow-sm backdrop-blur"
>
	<div class="container mx-auto flex h-14 items-center justify-between px-4">
		<div class="flex items-center gap-2">
			<a
				href={resolve('/')}
				class="text-xl font-bold tracking-tight transition-opacity hover:opacity-80"
			>
				Epitome
			</a>
		</div>

		<nav class="hidden items-center gap-6 text-sm font-medium md:flex">
			{#each links as { title, href, rel, target } (title)}
				<a
					{href}
					class="text-foreground/60 transition-colors hover:text-primary"
					{rel}
					{target}
					class:text-primary={checkCurrentPage(href)}>{title}</a
				>
			{/each}
		</nav>

		<div class="flex items-center gap-2">
			<Button variant="ghost" size="icon" aria-label="Toggle dark mode" onclick={toggleMode}>
				<SunIcon
					class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90"
				/>
				<MoonIcon
					class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
				/>
			</Button>

			<div class="md:hidden"></div>
		</div>
	</div>
</header>
