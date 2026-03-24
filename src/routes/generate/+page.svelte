<script lang="ts">
	import { browser } from '$app/environment';
	import * as Card from '$lib/components/ui/card';
	import SectionsTab from '$lib/components/SectionsTab.svelte';
	import { resumeData } from '$lib/stores/resumeStore.svelte';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import { createPDFDocument } from '$lib/functions/pdfGenerator';
	import { Button } from '$lib/components/ui/button';

	let previewUrls = $state<string[]>([]);
	let currentPage = $state(0);
	let totalPages = $state(0);
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

				const urls: string[] = [];
				totalPages = pdf.numPages;

				for (let i = 1; i <= pdf.numPages; i++) {
					const page = await pdf.getPage(i);
					const viewport = page.getViewport({ scale: 2 });
					const canvas = document.createElement('canvas');
					const context = canvas.getContext('2d');
					if (!context) continue;

					canvas.height = viewport.height;
					canvas.width = viewport.width;
					await page.render({ canvasContext: context, viewport }).promise;
					urls.push(canvas.toDataURL('image/png'));
				}

				// Cleanup old URLs
				previewUrls.forEach((url) => URL.revokeObjectURL(url));
				previewUrls = urls;

				// Reset page index if its  out of bounds
				if (currentPage >= totalPages) currentPage = 0;
			} catch (err) {
				console.error(' Preview Error:', err);
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
	const nextPage = () => {
		if (currentPage < totalPages - 1) currentPage++;
	};
	const prevPage = () => {
		if (currentPage > 0) currentPage--;
	};
</script>

<main class="container mx-auto">
	<div class="hidden md:block">
		<Resizable.PaneGroup direction="horizontal">
			<Resizable.Pane defaultSize={55}>
				<div class="mr-2">
					<SectionsTab />
				</div>
			</Resizable.Pane>
			<Resizable.Handle withHandle />
			<Resizable.Pane defaultSize={45}>
				<div>
					<section class=" flex min-h-dvh items-start justify-center p-0">
						<div
							class=" flex h-full w-full flex-col items-center justify-center overflow-hidden p-2"
						>
							{@render preview()}
						</div>
					</section>
				</div>
			</Resizable.Pane>
		</Resizable.PaneGroup>
	</div>

	<section class="space-y-6 py-6 lg:hidden">
		<SectionsTab />
		<section class="flex h-screen items-start justify-center p-0">
			<Card.Root
				class="flex h-full w-full flex-col items-center justify-center overflow-hidden border-2 bg-muted/20 p-6"
			>
				{@render preview()}
			</Card.Root>
		</section>
		<div class="lg:col-span-2">
			<Button class="w-full" onclick={download}>Download PDF</Button>
		</div>
	</section>
</main>
{#snippet preview()}
	{#if previewUrls.length > 0}
		<div class="relative flex h-full w-full flex-col items-center justify-center gap-4">
			{#if totalPages > 1}
				<div class="flex items-center gap-4">
					<Button variant="outline" size="icon" onclick={prevPage} disabled={currentPage === 0}>
						<span class="sr-only">Previous Page</span>
						&larr;
					</Button>

					<span class="text-sm font-medium">
						Page {currentPage + 1} of {totalPages}
					</span>

					<Button
						variant="outline"
						size="icon"
						onclick={nextPage}
						disabled={currentPage === totalPages - 1}
					>
						<span class="sr-only">Next Page</span>
						&rarr;
					</Button>
				</div>
			{/if}
			<div class="relative flex flex-1 items-center justify-center overflow-hidden">
				<img
					src={previewUrls[currentPage]}
					alt="Preview Page {currentPage + 1}"
					class="max-h-full max-w-full rounded-sm border object-contain shadow-sm"
				/>
			</div>
		</div>
	{:else}
		<div class="flex h-full items-center justify-center text-muted-foreground italic">
			<span class="animate-pulse">Generating preview...</span>
		</div>
	{/if}
{/snippet}
