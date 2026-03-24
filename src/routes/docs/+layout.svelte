<script lang="ts">
	import { page } from '$app/state';
	import { nav } from './nav';
	import MenuIcon from '@lucide/svelte/icons/menu';
	import XIcon from '@lucide/svelte/icons/x';

	let { children } = $props();
	let sidebarOpen = $state(false);
</script>

<svelte:head>
	<title>Documentation - Epitome</title>
</svelte:head>
<div class="sticky top-0 z-10 flex items-center gap-2 border-b bg-background px-4 py-2 sm:hidden">
	<button
		onclick={() => (sidebarOpen = !sidebarOpen)}
		class="flex items-center gap-2 text-sm font-medium"
	>
		{#if sidebarOpen}
			<XIcon class="h-4 w-4" />
			Close
		{:else}
			<MenuIcon class="h-4 w-4" />
			Docs Menu
		{/if}
	</button>
	<span class="ml-auto text-sm text-muted-foreground">
		{nav
			.flatMap((item) => ('heading' in item ? item.links : [item]))
			.find((l) => l.href === page.url.pathname)?.label ?? ''}
	</span>
</div>

<div class="container mx-auto max-w-5xl px-4 py-10 sm:flex sm:gap-10">
	<aside
		class="mb-16 sm:mb-0 sm:block sm:w-48 sm:shrink-0
            {sidebarOpen ? 'block' : 'hidden'}"
	>
		<p class="mb-2 text-2xl">Epitome</p>
		{#each nav as item (item)}
			{#if 'heading' in item}
				<!-- NavSection -->
				<div class="mb-6">
					<p class="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
						{item.heading}
					</p>
					<ul class="flex flex-col gap-1">
						{#each item.links as link (link.href)}
							<li>
								<a
									href={link.href}
									onclick={() => (sidebarOpen = false)}
									class="block rounded-md px-2 py-1 text-sm transition-colors hover:bg-muted
                                {page.url.pathname === link.href
										? 'bg-muted font-medium text-foreground'
										: 'text-muted-foreground'}"
								>
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{:else}
				<a
					href={item.href}
					onclick={() => (sidebarOpen = false)}
					class="mb-1 block rounded-md px-2 py-1 text-sm transition-colors hover:bg-muted
                {page.url.pathname === item.href
						? 'bg-muted font-medium text-foreground'
						: 'text-muted-foreground'}"
				>
					{item.label}
				</a>
			{/if}
		{/each}
	</aside>

	<article class="prose max-w-lg flex-1 prose-neutral dark:prose-invert">
		{@render children()}
	</article>
</div>
