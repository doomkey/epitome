<script lang="ts">
	import { browser } from '$app/environment';
	import * as Card from '$lib/components/ui/card';
	import SectionsTab from '$lib/components/SectionsTab.svelte';
	import { resumeData } from '$lib/stores/resumeStore.svelte';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import { createPDFDocument } from '$lib/functions/pdfGenerator';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import PaperSelect from '$lib/components/settings/PaperSelect.svelte';
	let previewUrls = $state<string[]>([]);
	let currentPage = $state(0);
	let totalPages = $state(0);
	let isFullscreen = $state(false);
	let pdfjsLib: typeof import('pdfjs-dist/legacy/build/pdf.mjs') | null = null;
	async function getPdfjs() {
		if (pdfjsLib) return pdfjsLib;
		pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
		if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
			const worker = await import('pdfjs-dist/legacy/build/pdf.worker.mjs?url');
			pdfjsLib.GlobalWorkerOptions.workerSrc = worker.default;
		}
		return pdfjsLib;
	}
	$effect(() => {
		if (!browser) return;

		const currentState = $state.snapshot(resumeData);
		let cancelled = false;
		const updatePreview = async () => {
			try {
				const pdfjs = await getPdfjs();
				if (cancelled) return;

				const pdfDocGenerator = createPDFDocument(currentState);
				const pdfData = await pdfDocGenerator.getBuffer();
				if (cancelled) return;

				const pdf = await pdfjs.getDocument({
					data: pdfData,
					isEvalSupported: false
				}).promise;
				if (cancelled) return;

				const urls: string[] = [];
				totalPages = pdf.numPages;
				const canvas = document.createElement('canvas');
				for (let i = 1; i <= pdf.numPages; i++) {
					if (cancelled) return;
					const page = await pdf.getPage(i);
					const viewport = page.getViewport({ scale: 1.5 });
					const context = canvas.getContext('2d');
					if (!context) continue;

					canvas.height = viewport.height;
					canvas.width = viewport.width;
					await page.render({ canvasContext: context, viewport }).promise;
					const blob = await new Promise<Blob>((res) => canvas.toBlob(res, 'image/png'));
					urls.push(URL.createObjectURL(blob));

					canvas.width = 0;
					canvas.height = 0;
				}
				previewUrls.forEach((url) => URL.revokeObjectURL(url));
				previewUrls = urls;

				// Reset page index if its  out of bounds
				if (currentPage >= totalPages) currentPage = 0;
			} catch (err) {
				if (!cancelled) console.error('Preview Error:', err);
			}
		};

		const timer = setTimeout(updatePreview, 500);
		return () => {
			cancelled = true;
			clearTimeout(timer);
		};
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

<main class=" container mx-auto mt-4">
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
					<section class="flex min-h-dvh items-start justify-center p-0">
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

	<section class="space-y-6 py-6 md:hidden">
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
				<div
					class="flex w-full flex-col-reverse items-center justify-between gap-2 md:flex-row md:items-baseline"
				>
					<div class="flex items-center gap-4">
						<Button variant="outline" size="icon" onclick={prevPage} disabled={currentPage === 0}>
							&larr;
						</Button>
						<span class="text-sm font-medium">Page {currentPage + 1} of {totalPages}</span>
						<Button
							variant="outline"
							size="icon"
							onclick={nextPage}
							disabled={currentPage === totalPages - 1}
						>
							&rarr;
						</Button>
					</div>
					<div class="space-y-2">
						<div class="flex items-center gap-2">
							<p class="w-full">Paper Size</p>
							<PaperSelect />
						</div>
						<p class="text-xs">Margin can be edited in File > Settings</p>
					</div>
				</div>
			{/if}
			<button
				type="button"
				onclick={() => (isFullscreen = true)}
				class="relative flex flex-1 cursor-zoom-in items-center justify-center overflow-hidden transition-opacity hover:opacity-95 lg:cursor-default"
			>
				<img
					src={previewUrls[currentPage]}
					alt="Preview Page {currentPage + 1}"
					class=" -z-1 max-h-full max-w-full rounded-sm border object-contain shadow-sm"
				/>
				<div
					class="absolute right-2 bottom-2 rounded bg-black/50 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
				>
					Click to enlarge
				</div>
			</button>
		</div>

		<Dialog.Root bind:open={isFullscreen}>
			<Dialog.Content
				class=" z-90 flex h-dvh max-w-[100vw] flex-col items-center justify-center bg-background/95 p-0 backdrop-blur-md"
			>
				<Dialog.Header class="sr-only ">
					<Dialog.Title>Resume Preview</Dialog.Title>
				</Dialog.Header>

				<div class="relative flex w-full flex-1 items-center justify-center overflow-auto">
					<img
						src={previewUrls[currentPage]}
						alt="Fullscreen Preview"
						class="max-h-full w-auto object-contain shadow-2xl"
					/>
				</div>

				<div class="m-2">
					<Button onclick={download}>Download PDF</Button>
				</div>
			</Dialog.Content>
		</Dialog.Root>
	{:else}
		<div class="-z-1 h-full w-full">
			<div class="space-y-2">
				<p class="text-lg">Preview Loading...</p>

				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
			</div>
		</div>
	{/if}
{/snippet}
