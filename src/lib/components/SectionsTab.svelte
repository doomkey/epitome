<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import Personal from './sections/Personal.svelte';
	import { sections } from '$lib/constant';
	import Education from './sections/Education.svelte';
	import Experience from './sections/Experience.svelte';
	import Projects from './sections/Projects.svelte';
	import Certifications from './sections/Certifications.svelte';
	import Skills from './sections/Skills.svelte';
	import { Label } from './ui/label';
	import Separator from './ui/separator/separator.svelte';
	import { resumeData } from '$lib/stores/resumeStore.svelte';

	const sectionList = Object.values(sections);
	let activeTab = $state<string>(sections.personal.value);

	const activeSection = $derived(sectionList.find((s) => s.value === activeTab));

	$effect(() => {
		console.log(resumeData);
	});
</script>

<div class="flex w-full flex-col gap-6">
	<Tabs.Root bind:value={activeTab}>
		<!-- Desktop: tab list -->
		<Tabs.List class="mb-4 hidden sm:flex">
			{#each sectionList as { title, value } (value)}
				<Tabs.Trigger {value}>{title}</Tabs.Trigger>
			{/each}
		</Tabs.List>

		<!-- Mobile: select dropdown -->
		<div class="mb-4 sm:hidden">
			<Label for="section-select" class="mb-1.5 block text-sm font-medium">Section</Label>
			<Select.Root type="single" value={activeTab} onValueChange={(v) => (activeTab = v)}>
				<Select.Trigger class="w-full">
					{sectionList.find((s) => s.value === activeTab)?.title ?? 'Select section'}
				</Select.Trigger>
				<Select.Content>
					{#each sectionList as { title, value } (value)}
						<Select.Item {value}>{title}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
			<Separator class="mt-4" />
		</div>

		<Card.Root>
			<Card.Header>
				<Card.Title>{activeSection?.heading}</Card.Title>
				<Card.Description>{activeSection?.subtitle}</Card.Description>
			</Card.Header>
			<Card.Content>
				<Personal />
				<Education />
				<Experience />
				<Projects />
				<Certifications />
				<Skills />
			</Card.Content>
		</Card.Root>
	</Tabs.Root>
</div>
