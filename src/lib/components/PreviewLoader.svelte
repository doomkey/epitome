<script lang="ts">
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { fly, fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { globalStore } from '$lib/stores/global.svelte';

	interface Props {
		visible?: boolean;
	}

	let { visible = globalStore.renderMode === 'loading' }: Props = $props();

	const steps = [
		'Loading fonts…',
		'Loading templates…',
		'Loading workspace…',
		'Rendering preview…'
	];

	let stepIndex = $state(0);
	const interval = setInterval(() => {
		if (stepIndex < steps.length - 1) {
			stepIndex++;
		} else {
			clearInterval(interval);
		}
	}, 1000);
</script>

{#if globalStore.renderMode === 'loading'}
	<div
		class="fixed inset-0 z-900 flex flex-col items-center justify-center gap-3 rounded-sm bg-background/80 backdrop-blur-sm"
		transition:fade={{ duration: 200 }}
		aria-live="polite"
		aria-label="Loading preview"
	>
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
	</div>
{/if}
