<script lang="ts">
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { fly, fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { globalStore } from '$lib/stores/global.svelte';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import { UseClipboard } from '$lib/hooks/use-clipboard.svelte';
	import {
		getBrowserName,
		getPrettyBrowserName,
		isUnsupportedBrowser
	} from '$lib/functions/helpers';
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/state';

	interface Props {
		mode?: 'preview' | 'shared_preview';
	}

	let { mode = 'preview' }: Props = $props();

	const steps = [
		'Loading fonts…',
		'Loading templates…',
		'Loading workspace…',
		'Rendering preview…'
	];

	let stepIndex = $state(0);
	let browserName = $state('');
	let isUnsupported = $state(false);
	const clipboard = new UseClipboard();
	const interval = setInterval(() => {
		if (stepIndex < steps.length - 1) {
			stepIndex++;
		} else {
			clearInterval(interval);
		}
	}, 1000);
	let url = $state('');
	onMount(() => {
		browserName = getPrettyBrowserName();
		isUnsupported = isUnsupportedBrowser(getBrowserName(), mode);
		url = page.url.href;
	});
	let forceShowPage = $state(false);
</script>

{#if (globalStore.renderMode === 'loading' || isUnsupported) && !forceShowPage}
	<div
		class="fixed inset-0 z-900 flex flex-col items-center justify-center gap-3 rounded-sm bg-background/80 backdrop-blur-sm"
		transition:fade={{ duration: 200 }}
		aria-live="polite"
		aria-label="Loading preview"
	>
		{#if !isUnsupported}
			<Spinner class="size-6 text-foreground/70" />

			<div class="relative h-5 w-48 overflow-hidden">
				{#key stepIndex}
					<p
						class="absolute inset-0 flex items-center justify-center text-sm font-medium text-muted-foreground"
						in:fly={{ y: 8, duration: 250, delay: 150 }}
						out:fly={{ y: -8, duration: 200 }}
					>
						{steps[stepIndex]}
					</p>
				{/key}
			</div>
		{:else}
			<div class="space-y-4 px-8 text-center">
				<div class="space-y-1">
					<p>{browserName} browser does not support the Preview Algorithm™.</p>
					<a href={resolve('/docs/supported-browsers')} class="text-sm text-primary">
						List of supported browsers
					</a>
				</div>

				<div class="space-y-2">
					<p class="text-sm text-muted-foreground">Open in another browser?</p>
					<Button onclick={() => !clipboard.copied && clipboard.copy(url)}>
						<CopyIcon />
						{#if clipboard.copied}
							Copied current URL!
						{:else}
							Copy current URL
						{/if}
					</Button>
					<Button variant="outline" onclick={() => (forceShowPage = true)}
						>View the Page Anyway</Button
					>
				</div>
			</div>
		{/if}
	</div>
{/if}
