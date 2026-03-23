<script lang="ts">
	import { browser } from '$app/environment';
	import PDFWorker from 'pdfjs-dist/legacy/build/pdf.worker.mjs?worker';
	import * as Card from '$lib/components/ui/card';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Input } from '$lib/components/ui/input';
	import { Switch } from '$lib/components/ui/switch';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Label } from '$lib/components/ui/label';
	import Roadmap from '$lib/components/Roadmap.svelte';
	import * as Field from '$lib/components/ui/field/index.js';
	import FAQ from '$lib/components/FAQ.svelte';
	import TemplateSelector from '$lib/components/TemplateSelector.svelte';
	import SectionsTab from '$lib/components/SectionsTab.svelte';
	import { resumeData } from '$lib/stores/resumeStore.svelte';

	import { createPDFDocument, fonts, templates } from '$lib/functions/pdfGenerator';

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

				const pdfDocGenerator = createPDFDocument(
					currentState.config.template,
					currentState,
					currentState.config.font
				);
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
		const doc = createPDFDocument(
			currentState.config.template,
			currentState,
			currentState.config.font
		);
		doc.download(`${resumeData.personal.fullName || 'resume'}.pdf`);
	}
	// IMPLEMENT
	const triggerContent = $derived(
		Object.values(fonts).find((f) => f.value === resumeData.config.template)?.name ??
			'Select a font'
	);
	function templateChange(value: string) {
		resumeData.config.template = value;
	}
</script>

<main class="container mx-auto">
	<section class="grid grid-cols-1 items-start gap-8 space-y-6 py-6 lg:grid-cols-3">
		<div class="lg:col-span-2">
			<SectionsTab />

			<Button class="mt-4 w-full" onclick={download}>Download PDF</Button>
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
	<FAQ />
</main>
