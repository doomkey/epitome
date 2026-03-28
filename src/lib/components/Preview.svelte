<script lang="ts">
	import { browser } from '$app/environment';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import PaperSelect from '$lib/components/settings/PaperSelect.svelte';
	import { createPDFDocument } from '$lib/functions/pdfGenerator';
	import type { ResumeData } from '$lib/types';

	interface Props {
		data: ResumeData;
		isShared?: boolean;
	}

	let { data, isShared = false }: Props = $props();

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
	const scale = $derived(isShared ? 2 : 1);

	$effect(() => {
		if (!browser) return;

		const snapshot = $state.snapshot(data);
		let cancelled = false;

		const updatePreview = async () => {
			try {
				const pdfjs = await getPdfjs();
				if (cancelled) return;

				const pdfDocGenerator = createPDFDocument(snapshot);
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
					const viewport = page.getViewport({ scale: scale });
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

				if (currentPage >= totalPages) currentPage = 0;
			} catch (err) {
				if (!cancelled) console.error('Preview Error:', err);
			}
		};

		const timer = setTimeout(updatePreview, 500);
		return () => {
			cancelled = true;
			clearTimeout(timer);
			previewUrls.forEach((url) => URL.revokeObjectURL(url));
		};
	});

	function download() {
		if (!browser) return;
		const doc = createPDFDocument($state.snapshot(data));
		doc.download(`${data.personal.fullName || 'resume'}.pdf`);
	}

	const nextPage = () => {
		if (currentPage < totalPages - 1) currentPage++;
	};
	const prevPage = () => {
		if (currentPage > 0) currentPage--;
	};
</script>

{#if previewUrls.length > 0}
	<div
		class="relative flex h-full w-full flex-col items-center justify-center gap-4"
		class:p-4={isShared}
	>
		{#if totalPages > 1}
			<div
				class="flex w-md max-w-full flex-col-reverse items-center justify-between gap-2 md:flex-row md:items-baseline"
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
				{#if !isShared}
					<div class="space-y-2">
						<div class="flex items-center gap-2">
							<p class="w-full">Paper Size</p>
							<PaperSelect />
						</div>
						<p class="text-xs">Margin can be edited in File &gt; Settings</p>
					</div>
				{:else}
					<Button onclick={download}>Download PDF</Button>
				{/if}
			</div>
		{/if}

		<!-- <button
			type="button"
			onclick={() => (isFullscreen = true)}
			class="relative flex flex-1 cursor-zoom-in items-center justify-center overflow-hidden transition-opacity hover:opacity-95 lg:cursor-default"
		> -->
		<img
			src={previewUrls[currentPage]}
			alt="Preview Page {currentPage + 1}"
			class=" max-w-full rounded-sm border object-contain shadow-sm"
		/>
		<!-- <div
				class="absolute right-2 bottom-2 rounded bg-black/50 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
			>
				Click to enlarge
			</div>
		</button> -->
	</div>

	<Dialog.Root bind:open={isFullscreen}>
		<Dialog.Content
			class="z-90 flex h-dvh max-w-[100vw] flex-col items-center justify-center bg-background/95 p-0 backdrop-blur-md"
		>
			<Dialog.Header class="sr-only">
				<Dialog.Title>Resume Preview</Dialog.Title>
			</Dialog.Header>

			<div class="relative flex w-full flex-1 items-center justify-center overflow-auto">
				<img
					src={previewUrls[currentPage]}
					alt="Fullscreen Preview"
					class="max-h-full w-auto object-contain shadow-2xl"
				/>
			</div>
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<div class="-z-1 h-full w-full">
		<div class="space-y-2">
			<p class="text-lg">Preview Loading...</p>
			{#each { length: 32 } as _}
				<Skeleton class="h-4 w-full" />
			{/each}
		</div>
	</div>
{/if}
