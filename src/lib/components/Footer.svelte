<script lang="ts">
	import StarIcon from '@lucide/svelte/icons/star';

	const product = [
		{ label: 'Generate Resume', href: '/generate' },
		{ label: 'Features', href: '/#features' },
		{ label: 'Pricing', href: '/#pricing' }
	];

	const resources = [
		{ label: 'Documentation', href: '/docs' },
		{ label: 'Open Source Licenses', href: '/licenses' },
		{ label: 'GitHub', href: 'https://github.com/doomkey/epitome' }
	];

	const legal = [
		{ label: 'Terms of Service', href: '/terms' },
		{ label: 'Privacy Policy', href: '/privacy' }
	];
</script>

<footer class="border-t bg-background">
	<div class="container mx-auto px-4 py-12">
		<div class="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-4">
			<div class="col-span-2 sm:col-span-2 lg:col-span-1">
				<a href="/" class="text-lg font-bold tracking-tight transition-colors hover:text-primary">
					Epitome
				</a>
				<p class="mt-2 max-w-xs text-sm text-muted-foreground">
					A free, local-first resume generator. Your data never leaves your device.
				</p>

				<a
					href="https://github.com/doomkey/epitome"
					target="_blank"
					rel="noopener noreferrer"
					class="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
				>
					<StarIcon class="h-4 w-4" />
					Give us a star
				</a>
			</div>

			<div>
				<p class="mb-3 text-sm font-semibold">Product</p>
				<ul class="flex flex-col gap-2">
					{#each product as link (link.label)}
						<li>
							<a
								href={link.href}
								class="text-sm text-muted-foreground transition-colors hover:text-foreground"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<div>
				<p class="mb-3 text-sm font-semibold">Resources</p>
				<ul class="flex flex-col gap-2">
					{#each resources as link (link.label)}
						<li>
							<a
								href={link.href}
								class="text-sm text-muted-foreground transition-colors hover:text-foreground"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<div>
				<p class="mb-3 text-sm font-semibold">Legal</p>
				<ul class="flex flex-col gap-2">
					{#each legal as link (link.label)}
						<li>
							<a
								href={link.href}
								class="text-sm text-muted-foreground transition-colors hover:text-foreground"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<div class="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 sm:flex-row">
			<p class="text-xs text-muted-foreground">
				© {new Date().getFullYear()} Epitome. Open source and free forever.
			</p>

			<a
				href="https://github.com/doomkey/epitome"
				target="_blank"
				rel="noopener noreferrer"
				class="text-xs text-muted-foreground transition-colors hover:text-foreground"
			>
				github.com/doomkey/epitome
			</a>
		</div>
	</div>
</footer>
