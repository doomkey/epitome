<script lang="ts">
	import { onMount } from 'svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button/index.js';
	import Pricing from './Pricing.svelte';
	import NavbarDefault from './NavbarDefault.svelte';
	let visible = $state(false);
	import { resolve } from '$app/paths';
	import FAQ from './FAQ.svelte';
	import SectionHeader from './SectionHeader.svelte';

	onMount(() => {
		setTimeout(() => (visible = true), 50);
	});

	const features = [
		{
			title: 'Local First',
			description: 'Everything runs in your browser. Your data never reaches a server.'
		},
		{
			title: 'Multiple Templates',
			description:
				'Choose from a growing library of ATS-friendly templates. Each one built with care for readability and precision.'
		},
		{
			title: 'Workspaces',
			description:
				'Maintain separate resumes for different roles or industries. Switch between them instantly without losing your work.'
		},
		{
			title: 'Backup & Restore',
			description:
				'Export all your workspaces and import them in other devices to continue your work.'
		},
		{
			title: 'Open Source',
			description: 'Licensed under AGPL v3.'
		},
		{
			title: 'Free Forever',
			description: 'No "export to PDF for $n/month". Generate as many resumes as you want.'
		}
	];
	let isLoading = $state(false);
</script>

<div>
	<section class="flex min-h-[90vh] items-center justify-center px-6 py-16">
		<div class="mx-auto flex w-full max-w-3xl flex-col gap-6">
			<Separator />

			<div class="flex flex-wrap items-center gap-2">
				<Badge variant="secondary">Resume Generator</Badge>
				<Badge variant="secondary">Free & Open Source</Badge>
				<Badge variant="secondary">Fully Local</Badge>
			</div>

			<h1
				class="flex flex-col gap-1 text-[clamp(3rem,8vw,6.5rem)] leading-[1.05] font-black tracking-tight text-foreground"
			>
				<span>Resume </span>
				<span> should be</span>
				<span class="font-[Playfair_Display,serif] font-bold text-primary italic">Free.</span>
			</h1>

			<Separator />

			<p class="max-w-lg text-lg leading-relaxed font-light text-muted-foreground">
				Epitome generates beautiful, ATS-friendly resumes entirely in your browser. No more filling
				your data and then prompt to login for getting the pdf.
			</p>

			<div class="flex flex-wrap items-center gap-3">
				<Button
					href={resolve('/generate')}
					size="lg"
					class="group gap-2 font-medium"
					onclick={() => (isLoading = true)}
				>
					{isLoading ? 'Loading...' : 'Generate Resume'}
					{#if !isLoading}
						<span class="transition-transform duration-200 group-hover:translate-x-1">→</span>
					{/if}
				</Button>
				<Button href={resolve('/docs')} variant="outline" size="lg" class="font-medium"
					>Documentation</Button
				>
			</div>

			<Separator />

			<p class="text-xs text-muted-foreground">
				Licensed under AGPL v3 &nbsp;·&nbsp;
				<a
					href="https://github.com/doomkey/epitome"
					target="_blank"
					rel="noopener"
					class="underline underline-offset-4 transition-colors hover:text-foreground"
				>
					View on GitHub ↗
				</a>
			</p>
		</div>
	</section>

	<section class="border-t border-border px-6 py-24">
		<div class="mx-auto max-w-5xl">
			<SectionHeader
				title="Why Epitome?"
				description="Built for people who've had enough of resume builders that cause distress."
				id="features"
			/>

			<div class="grid grid-cols-1 border border-border sm:grid-cols-2 lg:grid-cols-3">
				{#each features as feature, i (feature)}
					<div
						class="flex flex-col gap-4 border-r border-b border-border p-8 transition-colors duration-200 hover:bg-muted"
					>
						<span class="text-xs font-bold tracking-wider text-muted-foreground">
							0{i + 1}
						</span>
						<div class="flex flex-col gap-2">
							<h3 class="text-sm font-medium text-foreground">{feature.title}</h3>
							<p class="text-sm leading-relaxed font-light text-muted-foreground">
								{feature.description}
							</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>
	<Pricing />
	<FAQ />
	<section class="border-t border-border px-6 py-24">
		<div class="mx-auto max-w-5xl">
			<div class="flex flex-col gap-10">
				<Separator />
				<div class="flex flex-wrap items-center justify-between gap-6">
					<h2 class="text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-foreground">
						Ready to build your resume?
					</h2>
					<Button href={resolve('/generate')} size="lg" class="group gap-2 font-medium">
						Free forever
						<span class="transition-transform duration-200 group-hover:translate-x-1">→</span>
					</Button>
				</div>
				<Separator />
			</div>
		</div>
	</section>
</div>
