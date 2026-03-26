<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge';
	import CheckIcon from '@lucide/svelte/icons/check';
	import XIcon from '@lucide/svelte/icons/x';
	import { resolve } from '$app/paths';
	import SectionHeader from './SectionHeader.svelte';

	const them = {
		name: 'The Others',
		badge: 'Industry Standard™',
		price: '$9.99',
		period: '/month',
		description: 'Everything you need (require unlocking).',
		cta: 'Start Free Trial*',
		ctaNote: '*Credit card required. Cancel anytime**',
		ctaNote2: '**Cancellation requires a 30-minute phone call with a retention specialist.',
		features: [
			{ label: 'Create a resume', included: true },
			{ label: 'Type your info', included: true },
			{ label: 'Choose a template', included: false, note: 'Require Account Creation' },
			{ label: 'Actually see your resume', included: false, note: 'Pro only' },
			{ label: 'Download as PDF', included: false, note: 'Pro only' },
			{ label: 'More than 1 resume', included: false, note: 'Business plan' },
			{ label: 'Remove watermark', included: false, note: 'Pro only' },
			{
				label: 'Your data stays private',
				included: false,
				note: 'We need it for "personalization"'
			},
			{ label: 'Cancel without crying', included: false, note: 'Good luck' }
		]
	};

	const us = {
		name: 'Epitome',
		badge: 'Actually Free',
		price: '$0',
		period: 'forever',
		description: 'Just use your browser.',
		cta: 'Generate Resume',
		href: resolve('/generate'),
		features: [
			{ label: 'Create a resume', included: true },
			{ label: 'Choose a template', included: true },
			{ label: 'Type your name', included: true },
			{ label: 'Actually see your resume', included: true },
			{ label: 'Download as PDF', included: true },
			{ label: 'Unlimited resumes', included: true },
			{ label: 'No watermark, ever', included: true },
			{ label: 'Your data stays on your device', included: true },
			{ label: 'Close the tab', included: true }
		]
	};
</script>

<section class="border-t border-border px-6 py-24" id="pricing">
	<div class="mx-auto max-w-5xl">
		<SectionHeader title="Pricing" />

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div class="relative flex flex-col border border-border p-8 opacity-80">
				<!-- scratched out-->
				<div class="pointer-events-none absolute inset-0 overflow-hidden">
					<div class="absolute top-1/2 left-0 h-px w-full -rotate-2 bg-muted-foreground/20"></div>
				</div>

				<div class="mb-6 flex items-start justify-between gap-4">
					<div>
						<p
							class="font-[Playfair_Display,serif] text-xl font-bold text-foreground line-through decoration-muted-foreground/50"
						>
							{them.name}
						</p>
						<p class="mt-1 text-sm font-light text-muted-foreground">{them.description}</p>
					</div>
					<Badge variant="outline" class="shrink-0 text-muted-foreground">{them.badge}</Badge>
				</div>

				<div class="mb-6">
					<span class="font-[Playfair_Display,serif] text-5xl font-black text-foreground">
						{them.price}
					</span>
					<span class="text-sm text-muted-foreground">{them.period}</span>
					<p class="mt-1 text-xs text-muted-foreground/60 italic">after free trial ends</p>
				</div>

				<ul class="mb-8 flex flex-col gap-3">
					{#each them.features as feature (feature)}
						<li class="flex items-start gap-3 text-sm">
							{#if feature.included}
								<CheckIcon class="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
								<span class="text-muted-foreground">{feature.label}</span>
							{:else}
								<XIcon class="mt-0.5 h-4 w-4 shrink-0 text-destructive/70" />
								<span class="text-muted-foreground/50 line-through">
									{feature.label}
								</span>
								{#if feature.note}
									<span
										class="ml-auto shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground italic"
									>
										{feature.note}
									</span>
								{/if}
							{/if}
						</li>
					{/each}
				</ul>

				<Button variant="outline" disabled class="mt-auto w-full opacity-50">
					{them.cta}
				</Button>
				<p class="mt-2 text-center text-[10px] text-muted-foreground/50 italic">{them.ctaNote}</p>
				<p class="mt-1 text-center text-[10px] text-muted-foreground/40 italic">{them.ctaNote2}</p>
			</div>

			<div class="relative flex flex-col border-2 border-foreground p-8">
				<div class="mb-6 flex items-start justify-between gap-4">
					<div>
						<p class="font-[Playfair_Display,serif] text-xl font-bold text-foreground">
							{us.name}
						</p>
						<p class="mt-1 text-sm font-light text-muted-foreground">{us.description}</p>
					</div>
					<Badge class="shrink-0">{us.badge}</Badge>
				</div>

				<div class="mb-6">
					<span class="font-[Playfair_Display,serif] text-5xl font-black text-foreground">
						{us.price}
					</span>
					<span class="text-sm text-muted-foreground">{us.period}</span>
					<p class="mt-1 text-xs text-muted-foreground italic">no asterisk here</p>
				</div>

				<ul class="mb-8 flex flex-col gap-3">
					{#each us.features as feature (feature)}
						<li class="flex items-center gap-3 text-sm">
							<CheckIcon class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
							<span class="text-foreground">{feature.label}</span>
						</li>
					{/each}
				</ul>

				<Button href={us.href} class="group mt-auto w-full gap-2">
					{us.cta}
					<span class="transition-transform duration-200 group-hover:translate-x-1">→</span>
				</Button>
				<p class="mt-2 text-center text-[10px] text-muted-foreground italic">
					Just create a resume and move on.
				</p>
			</div>
		</div>

		<!-- Footer quip -->
		<p class="mt-8 text-center text-xs text-muted-foreground/60 italic">
			"The Others" is a fictional entity. Any resemblance to actual resume builders is of course
			entirely intentional.
		</p>
	</div>
</section>
