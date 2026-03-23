<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui//input';
	import { sections } from '$lib/constant';
	import Button from '$lib/components/ui/button/button.svelte';
	import SectionEntry from '$lib/components/SectionEntry.svelte';
	import { resumeData } from '$lib/stores/resumeStore.svelte';
	import { moveItem, removeItem, createEdu } from '$lib/functions/helpers';
	import EmptySection from '../EmptySection.svelte';
</script>

<Tabs.Content value={sections.education.value}>
	{#if resumeData.education.length > 0}
		{#each resumeData.education as e, index (e.id)}
			<SectionEntry
				title={e.degree || 'Untitled'}
				{index}
				total={resumeData.education.length}
				onMoveUp={() => (resumeData.education = moveItem(resumeData.education, index, 'up'))}
				onMoveDown={() => (resumeData.education = moveItem(resumeData.education, index, 'down'))}
				onRemove={() => (resumeData.education = removeItem(resumeData.education, e.id))}
			>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<Field.Field>
						<Field.Label>Degree/Field of Study</Field.Label>
						<Input placeholder="Name of the degree" bind:value={e.degree} required />
					</Field.Field>
					<Field.Field>
						<Field.Label>Name of the Institute</Field.Label>
						<Input placeholder="University of A" bind:value={e.institution} required />
					</Field.Field>
					<Field.Field>
						<Field.Label>Start</Field.Label>
						<Input placeholder="Dec 1984" bind:value={e.start} />
					</Field.Field>
					<Field.Field>
						<Field.Label>End</Field.Label>
						<Input placeholder="Dec 2000" bind:value={e.end} />
					</Field.Field>
					<Field.Field>
						<Field.Label>Location of the Institute</Field.Label>
						<Input placeholder="Location" bind:value={e.location} />
					</Field.Field>
					<Field.Field>
						<Field.Label>GPA</Field.Label>
						<Input placeholder="3.84/4.00" bind:value={e.gpa} />
					</Field.Field>
				</div>
			</SectionEntry>
		{/each}
	{:else}
		<EmptySection />
	{/if}

	<Button onclick={() => resumeData.education.push(createEdu())}>Add New</Button>
</Tabs.Content>
