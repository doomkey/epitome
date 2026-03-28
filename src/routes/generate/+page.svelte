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
	import Preview from '$lib/components/Preview.svelte';

	function download() {
		if (!browser) return;
		const currentState = $state.snapshot(resumeData);
		const doc = createPDFDocument(currentState);
		doc.download(`${resumeData.personal.fullName || 'resume'}.pdf`);
	}
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
							<Preview data={resumeData} />
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
				<Preview data={resumeData} />
			</Card.Root>
		</section>
		<div class="lg:col-span-2">
			<Button class="w-full" onclick={download}>Download PDF</Button>
		</div>
	</section>
</main>
