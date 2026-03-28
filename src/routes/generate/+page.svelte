<script lang="ts">
	import { browser } from '$app/environment';
	import * as Card from '$lib/components/ui/card';
	import SectionsTab from '$lib/components/SectionsTab.svelte';
	import { resumeData } from '$lib/stores/resumeStore.svelte';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import { createPDFDocument } from '$lib/functions/pdfGenerator';
	import { Button } from '$lib/components/ui/button';
	import Preview from '$lib/components/Preview.svelte';

	function download() {
		if (!browser) return;
		const doc = createPDFDocument($state.snapshot(resumeData));
		doc.download(`${resumeData.personal.fullName || 'resume'}.pdf`);
	}

	let isMobile = $state(false);

	$effect(() => {
		if (!browser) return;
		const mq = window.matchMedia('(max-width: 767px)');
		isMobile = mq.matches;
		const handler = (e: MediaQueryListEvent) => (isMobile = e.matches);
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	});
</script>

<main class="container mx-auto mt-4">
	{#if !isMobile}
		<Resizable.PaneGroup direction="horizontal">
			<Resizable.Pane defaultSize={55}>
				<div class="mr-2"><SectionsTab /></div>
			</Resizable.Pane>
			<Resizable.Handle withHandle />
			<Resizable.Pane defaultSize={45}>
				<section class="flex min-h-dvh items-start justify-center p-2">
					<Preview isShared={false} />
				</section>
			</Resizable.Pane>
		</Resizable.PaneGroup>
	{:else}
		<div class="space-y-6 py-6">
			<SectionsTab />
			<Card.Root
				class="flex h-screen w-full flex-col items-center justify-center overflow-hidden border-2 bg-muted/20 p-6"
			>
				<Preview isShared={false} />
			</Card.Root>
			<Button class="w-full" onclick={download}>Download PDF</Button>
		</div>
	{/if}
</main>
