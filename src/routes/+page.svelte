<script lang="ts">
	import { browser } from '$app/environment';
	import { createPDFDocument, fonts, templates } from '$lib/functions/pdfGenerator';
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

	$effect(() => {
		console.log(resumeData);
	});

	let font = $state(fonts.TINOS.value);
	let template = $state(templates.CLASSIC.value);

	let previewUrl = $state('');
	$effect(() => {
		if (!browser) return;

		const currentState = $state.snapshot(resumeData);
		const currentFont = $state.snapshot(font);
		const currentTemplate = $state.snapshot(template);
		const updatePreview = async () => {
			try {
				const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

				if (!pdfjs.GlobalWorkerOptions.workerSrc) {
					const worker = await import('pdfjs-dist/legacy/build/pdf.worker.mjs?url');
					pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
				}

				const pdfDocGenerator = createPDFDocument(currentTemplate, currentState, currentFont);
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
		const doc = createPDFDocument(
			$state.snapshot(template),
			$state.snapshot(resumeData),
			$state.snapshot(font)
		);
		doc.download(`${resumeData.personal.fullName || 'resume'}.pdf`);
	}
	// IMPLEMENT
	const triggerContent = $derived(
		Object.values(fonts).find((f) => f.value === font)?.name ?? 'Select a font'
	);
	function templateChange(value: string) {
		template = value;
	}
</script>

<nav class="flex items-center justify-between border-b bg-background px-8 py-4">
	<div class="text-xl font-bold">
		Epitome <span class="text-sm font-normal text-muted-foreground"
			>by <a href="https://doomkey.github.io">doomkey</a></span
		>
	</div>
</nav>

<main class="container mx-auto">
	<section class="grid grid-cols-1 items-start gap-8 space-y-6 py-6 lg:grid-cols-3">
		<div class="lg:col-span-2">
			<!-- <Card.Header>
				<Card.Title>Assignment Details</Card.Title>
				<Card.Description>Fill in the details to update the cover page preview.</Card.Description>
			</Card.Header> -->
			<SectionsTab />
			<!-- <Field.Group>
					<Field.Set>
						<Field.Group>
							<Field.Field orientation="horizontal">
								<Input
									bind:value={state.subtitle.value}
									placeholder={state.subtitle.placeholder}
									disabled={!state.subtitle.visible}
								/>
								<Switch bind:checked={state.subtitle.visible} aria-label="Toggle Subtitle" />
							</Field.Field>
							<Field.Field orientation="horizontal">
								<Input
									bind:value={state.title.value}
									placeholder={state.title.placeholder}
									disabled={!state.title.visible}
								/>
								<Switch bind:checked={state.title.visible} aria-label="Toggle Title" />
							</Field.Field>
						</Field.Group>
					</Field.Set>

					<Field.Set>
						<Field.Legend>Submitted to</Field.Legend>
						<Field.Group>
							{#each ['submittedTo', 'designation', 'dept', 'varsity'] as key}
								{@const field = state[key as keyof typeof state]}
								<Field.Field orientation="horizontal">
									<Input
										bind:value={field.value}
										placeholder={field.placeholder}
										disabled={!field.visible}
									/>
									<Switch bind:checked={field.visible} aria-label={`Toggle ${field.placeholder}`} />
								</Field.Field>
							{/each}
						</Field.Group>
					</Field.Set>

					<Field.Set>
						<Field.Legend>Submitted by</Field.Legend>
						<Field.Group>
							{#each ['submittedBy', 'studentId', 'regNo', 'session', 'date'] as key}
								{@const field = state[key as keyof typeof state]}
								<Field.Field orientation="horizontal">
									<Input
										bind:value={field.value}
										placeholder={field.placeholder}
										disabled={!field.visible}
									/>
									<Switch bind:checked={field.visible} aria-label={`Toggle ${field.placeholder}`} />
								</Field.Field>
							{/each}
						</Field.Group>
					</Field.Set>

					<Field.Set>
						<Field.Legend>Institution Information</Field.Legend>
						<Field.Group class="gap-6">
							<Field.Group>
								<Field.Field orientation="horizontal">
									<Input
										placeholder="Department name"
										disabled={conditions.dept || !state.dept_bottom.visible}
										bind:value={state.dept_bottom.value}
									/>
									<Switch
										bind:checked={state.dept_bottom.visible}
										aria-label="Toggle Bottom Department"
									/>
								</Field.Field>
								<Field.Field orientation="horizontal">
									<Checkbox id="department-same" bind:checked={conditions.dept} />
									<Field.Label
										for="department-same"
										class="text-xs font-normal text-muted-foreground"
									>
										Same as teacher's department
									</Field.Label>
								</Field.Field>
							</Field.Group>

							<Field.Group>
								<Field.Field orientation="horizontal">
									<Input
										placeholder="Name of the Institute"
										bind:value={state.varsity_bottom.value}
										disabled={conditions.varsity || !state.varsity_bottom.visible}
									/>
									<Switch
										bind:checked={state.varsity_bottom.visible}
										aria-label="Toggle Bottom Institute"
									/>
								</Field.Field>
								<Field.Field orientation="horizontal">
									<Checkbox id="institute-same" bind:checked={conditions.varsity} />
									<Field.Label
										for="institute-same"
										class="text-xs font-normal text-muted-foreground"
									>
										Same as teacher's institute
									</Field.Label>
								</Field.Field>
							</Field.Group>
						</Field.Group>
					</Field.Set>
					<Field.Set>
						<Field.Legend>Customization</Field.Legend>
						<Field.Group>
							<Field.Field>
								<Field.Label>Document Font</Field.Label>
								<Select.Root type="single" name="font" bind:value={font}>
									<Select.Trigger class="w-full">
										{triggerContent}
									</Select.Trigger>
									<Select.Content>
										<Select.Group>
											{#each Object.values(fonts) as f}
												<Select.Item value={f.value} label={f.name}>
													{f.name}
												</Select.Item>
											{/each}
										</Select.Group>
									</Select.Content>
								</Select.Root>
							</Field.Field>
							<Field.Field>
								<Field.Label>Template</Field.Label>
								<TemplateSelector onSelect={templateChange} starting={template} />
							</Field.Field>
						</Field.Group>
					</Field.Set>

					</Field.Group> -->
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
