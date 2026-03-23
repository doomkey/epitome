<script lang="ts">
	import { browser } from '$app/environment';
	import * as Card from '$lib/components/ui/card';
	import SectionsTab from '$lib/components/SectionsTab.svelte';
	import { resumeData } from '$lib/stores/resumeStore.svelte';

	import { createPDFDocument } from '$lib/functions/pdfGenerator';

	let previewUrl = $state('');
	$effect(() => {
		if (!browser) return;

		const currentState = $state.snapshot(resumeData);
		const updatePreview = async () => {
			try {
				const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

				if (!pdfjs.GlobalWorkerOptions.workerSrc) {
					const worker = await import('pdfjs-dist/legacy/build/pdf.worker.mjs?url');
					pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
				}

				const pdfDocGenerator = createPDFDocument(currentState);
				const pdfData = await pdfDocGenerator.getBuffer();

				const loadingTask = pdfjs.getDocument({
					data: pdfData,
					isEvalSupported: false
				});

				const pdf = await loadingTask.promise;
				const page = await pdf.getPage(1);

				const viewport = page.getViewport({ scale: 1.5 });
				const canvas = document.createElement('canvas');
				const context = canvas.getContext('2d');
				if (!context) return;

				canvas.height = viewport.height;
				canvas.width = viewport.width;
				//@ts-ignore
				await page.render({ canvasContext: context, viewport }).promise;

				if (previewUrl) URL.revokeObjectURL(previewUrl);
				previewUrl = canvas.toDataURL('image/png');
			} catch (err) {
				console.error('Minimal Preview Error:', err);
			}
		};

		const timer = setTimeout(updatePreview, 250);
		return () => clearTimeout(timer);
	});
	function download() {
		if (!browser) return;
		const currentState = $state.snapshot(resumeData);
		const doc = createPDFDocument(currentState);
		doc.download(`${resumeData.personal.fullName || 'resume'}.pdf`);
	}
</script>

<main class="container mx-auto">
	<section class="grid grid-cols-1 items-start gap-8 space-y-6 py-6 lg:grid-cols-3">
		<div class="lg:col-span-2">
			<SectionsTab />

			<!-- <Button class="mt-4 w-full" onclick={download}>Download PDF</Button> -->
		</div>
		<section class="sticky top-0 flex h-screen items-start justify-center p-0">
			<Card.Root
				class="flex h-full w-full flex-col items-center justify-center overflow-hidden border-2 bg-muted/20 p-6"
			>
				{#if previewUrl}
					<div class="relative flex h-full w-full items-center justify-center">
						<img
							src={previewUrl}
							alt="Preview"
							class="max-h-full max-w-full rounded-sm border bg-white object-contain shadow-2xl transition-all hover:scale-[1.01]"
						/>
					</div>
				{:else}
					<div class="flex h-full items-center justify-center text-muted-foreground italic">
						<span class="animate-pulse">Generating preview...</span>
					</div>
				{/if}
			</Card.Root>
		</section>
	</section>
</main>
