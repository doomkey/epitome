<script lang="ts">
	import { browser } from '$app/environment';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import PaperSelect from '$lib/components/settings/PaperSelect.svelte';
	import { createPDFDocument } from '$lib/functions/pdfGenerator';
	import type { ResumeData } from '$lib/types';
	import { resumeData } from '$lib/stores/resumeStore.svelte';

	interface Props {
		data?: ResumeData;
		isShared?: boolean;
	}

	let { data, isShared = false }: Props = $props();
	const source = $derived(data ?? resumeData);
	let previewUrls = $state<string[]>([]);
	let currentPage = $state(0);
	let totalPages = $state(0);
	let isFullscreen = $state(false);
	import { getPdfjs } from '$lib/functions/pdfjs';
	import { getPdfMake, pdfEngineState } from '$lib/functions/pdfEngine.svelte';

	const scale = $derived(isShared ? 2 : 1);
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;
	let cancelled = false;

	async function updatePreview(snapshot: ResumeData, retries = 3) {
		cancelled = false;
		try {
			const [pdfjs] = await Promise.all([getPdfjs(), getPdfMake()]);
			if (cancelled) return;

			const pdfDocGenerator = await createPDFDocument(snapshot);
			const pdfData = await pdfDocGenerator.getBuffer();
			if (cancelled) return;

			const pdf = await pdfjs.getDocument({ data: pdfData, isEvalSupported: false }).promise;
			if (cancelled) return;

			const urls: string[] = [];
			totalPages = pdf.numPages;

			const canvas = document.createElement('canvas');
			for (let i = 1; i <= pdf.numPages; i++) {
				if (cancelled) return;
				const page = await pdf.getPage(i);
				const viewport = page.getViewport({ scale });
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
			if (retries > 0 && String(err).includes('not found in virtual file system')) {
				await new Promise((res) => setTimeout(res, 300));
				return updatePreview(snapshot, retries - 1);
			}
			if (!cancelled) console.error('Preview Error:', err);
		}
	}

	$effect(() => {
		if (!browser) return;
		const ready = pdfEngineState.ready;
		if (!ready) return;
		const snapshot = $state.snapshot(source);
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => updatePreview(snapshot), 500);

		return () => {
			cancelled = true;
			if (debounceTimer) clearTimeout(debounceTimer);
			previewUrls.forEach((url) => URL.revokeObjectURL(url));
		};
	});

	async function download() {
		if (!browser) return;
		const doc = await createPDFDocument($state.snapshot(source));
		doc.download(`${source.personal.fullName || 'resume'}.pdf`);
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
			class="w-full rounded-sm border object-contain shadow-sm"
		/>
		<!-- <div
				class="absolute right-2 bottom-2 rounded bg-black/50 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
			>
				Click to enlarge
			</div>
		</button> -->
	</div>

	<!-- <Dialog.Root bind:open={isFullscreen}>
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
	</Dialog.Root> -->
{:else}
	<div class="h-full w-full">
		<div class="space-y-2">
			<p class="text-lg">Preview Loading...</p>
			{#each { length: 32 } as _}
				<Skeleton class="h-4 w-full" />
			{/each}
		</div>
	</div>
{/if}
