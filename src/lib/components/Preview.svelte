<script lang="ts">
	import { browser } from '$app/environment';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import PaperSelect from '$lib/components/settings/PaperSelect.svelte';
	import { createPDFDocument } from '$lib/functions/pdfGenerator';
	import type { ResumeData } from '$lib/types';
	import { resumeData } from '$lib/stores/resumeStore.svelte';
	import { getPdfjs } from '$lib/functions/pdfjs';
	import { globalStore } from '$lib/stores/global.svelte';
	import { onMount } from 'svelte';
	import {
		getBrowserName,
		getPrettyBrowserName,
		isUnsupportedBrowser
	} from '$lib/functions/helpers';
	import type { BrokenType } from '$lib/constant';

	interface Props {
		data?: ResumeData;
		isShared?: boolean;
	}

	let { data, isShared = false }: Props = $props();
	const source = $derived(data ?? resumeData);
	let previewUrls = $state<string[]>([]);
	let pdfFallbackUrl = $state<string | null>(null);
	let currentPage = $state(0);
	let totalPages = $state(0);
	let isFullscreen = $state(false);

	const scale = $derived(isShared ? 2 : 1);
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;
	let cancelled = false;
	let isUnsupported = $state(false);
	let browserName = $state('');
	function isCanvasAvailable(): boolean {
		try {
			const c = document.createElement('canvas');
			const ctx = c.getContext('2d');
			if (!ctx) return false;

			c.width = 1;
			c.height = 1;
			ctx.fillStyle = 'red';
			ctx.fillRect(0, 0, 1, 1);
			const pixel = ctx.getImageData(0, 0, 1, 1).data;
			return pixel[0] === 255;
		} catch {
			return false;
		}
	}
	onMount(() => {
		browserName = getPrettyBrowserName();
		isUnsupported = isUnsupportedBrowser(getBrowserName(), isShared ? 'shared_preview' : 'preview');
	});
	function isBrowserPdfSupported(): boolean {
		if ('pdfViewerEnabled' in navigator) return navigator.pdfViewerEnabled;
		// older browser
		try {
			return navigator.mimeTypes?.namedItem('application/pdf') !== null;
		} catch {
			return false;
		}
	}

	async function updatePreview(snapshot: ResumeData) {
		if (isUnsupported) return;

		cancelled = false;
		try {
			const pdfDocGenerator = createPDFDocument(snapshot);

			if (!isCanvasAvailable()) {
				if (!isBrowserPdfSupported()) {
					globalStore.renderMode = 'unsupported';
					return;
				}
				// iframe fallback
				const pdfData = await pdfDocGenerator.getBuffer();
				if (cancelled) return;
				const blob = new Blob([pdfData], { type: 'application/pdf' });
				if (pdfFallbackUrl) URL.revokeObjectURL(pdfFallbackUrl);
				pdfFallbackUrl = URL.createObjectURL(blob);
				globalStore.renderMode = 'iframe';
				return;
			}

			//  canvas
			const pdfjs = await getPdfjs();
			if (cancelled) return;

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
				const blob = await new Promise<Blob | null>((res) =>
					canvas.toBlob((b) => res(b), 'image/png')
				);
				if (!blob || blob.size < 1000) {
					// canvas is giving false info, go to  iframe or unsupported
					previewUrls.forEach((u) => URL.revokeObjectURL(u));
					if (isBrowserPdfSupported()) {
						const pdfData2 = await createPDFDocument(snapshot).getBuffer();
						const fallback = new Blob([pdfData2], { type: 'application/pdf' });
						if (pdfFallbackUrl) URL.revokeObjectURL(pdfFallbackUrl);
						pdfFallbackUrl = URL.createObjectURL(fallback);
						globalStore.renderMode = 'iframe';
					} else {
						globalStore.renderMode = 'unsupported';
					}
					return;
				}

				urls.push(URL.createObjectURL(blob));
				canvas.width = 0;
				canvas.height = 0;
			}

			previewUrls.forEach((url) => URL.revokeObjectURL(url));
			previewUrls = urls;
			if (currentPage >= totalPages) currentPage = 0;
			globalStore.renderMode = 'canvas';
		} catch (err) {
			if (!cancelled) console.error('Preview Error:', err);
		}
	}

	$effect(() => {
		if (!browser) return;

		const snapshot = $state.snapshot(source);
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => updatePreview(snapshot), 500);

		return () => {
			cancelled = true;
			if (debounceTimer) clearTimeout(debounceTimer);
			previewUrls.forEach((url) => URL.revokeObjectURL(url));
			if (pdfFallbackUrl) URL.revokeObjectURL(pdfFallbackUrl);
		};
	});

	function download() {
		if (!browser) return;
		const doc = createPDFDocument($state.snapshot(source));
		doc.download(`${source.personal.fullName || 'resume'}.pdf`);
	}

	const nextPage = () => {
		if (currentPage < totalPages - 1) currentPage++;
	};
	const prevPage = () => {
		if (currentPage > 0) currentPage--;
	};
</script>

<div class="relative h-full w-full">
	{#if globalStore.renderMode === 'canvas' && previewUrls.length > 0}
		<div
			class="relative flex h-full w-full flex-col items-center justify-center gap-4"
			class:p-4={isShared}
		>
			{#if totalPages > 0}
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

			<img
				src={previewUrls[currentPage]}
				alt="Preview Page {currentPage + 1}"
				class="w-full rounded-sm border object-contain shadow-sm"
			/>
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
	{:else if globalStore.renderMode === 'iframe' && pdfFallbackUrl}
		<div class="flex h-dvh w-full flex-col gap-2" class:p-4={isShared}>
			{#if isShared}
				<div class="flex justify-end">
					<Button onclick={download}>Download PDF</Button>
				</div>
			{:else}
				<div class="flex items-center gap-2">
					<p class="w-full text-sm">Paper Size</p>
					<PaperSelect />
				</div>
			{/if}
			<iframe
				src={pdfFallbackUrl}
				title="Resume PDF Preview"
				class="h-full w-full flex-1 rounded-sm border shadow-sm"
				onload={(e) => {
					const frame = e.currentTarget as HTMLIFrameElement;
					if (!frame.contentDocument && !frame.contentWindow?.document) {
						globalStore.renderMode = 'unsupported';
					}
				}}
				onerror={() => {
					globalStore.renderMode = 'unsupported';
				}}
			></iframe>
		</div>
	{:else if globalStore.renderMode === 'unsupported' || isUnsupported}
		<div class="flex h-dvh w-full flex-col items-center justify-center gap-4 text-center">
			<p class="text-4xl">Uh-oh</p>
			<p class="text-lg font-semibold">This browser does not support live preview.</p>
			<p class="max-w-xs text-sm text-muted-foreground">
				PDF preview requires canvas or a built-in PDF viewer. Try Chrome, Firefox, or Safari, or use
				the download button below.
			</p>
			<Button onclick={download}>Download PDF Instead</Button>
		</div>
	{:else}
		<div class="h-full w-full">
			<div class="space-y-2">
				{#each { length: 32 } as _}
					<Skeleton class="h-4 w-full" />
				{/each}
			</div>
		</div>
	{/if}
</div>
