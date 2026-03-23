<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { sections } from '$lib/constant';
	import Button from '$lib/components/ui/button/button.svelte';
	import SectionEntry from '$lib/components/SectionEntry.svelte';
	import { moveItem, removeItem, createProject } from '$lib/functions/helpers';
	import { resumeData } from '$lib/stores/resumeStore.svelte';
	import EmptySection from '../EmptySection.svelte';
</script>

<Tabs.Content value={sections.projects.value}>
	{#if resumeData.projects.length > 0}
		{#each resumeData.projects as p, i (p.id)}
			<SectionEntry
				title={p.name || 'Untitled'}
				index={i}
				total={resumeData.projects.length}
				onMoveUp={() => (resumeData.projects = moveItem(resumeData.projects, i, 'up'))}
				onMoveDown={() => (resumeData.projects = moveItem(resumeData.projects, i, 'down'))}
				onRemove={() => (resumeData.projects = removeItem(resumeData.projects, p.id))}
			>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<Field.Field>
						<Field.Label>Project Name</Field.Label>
						<Input placeholder="My Awesome Project" bind:value={p.name} required />
					</Field.Field>
					<Field.Field>
						<Field.Label>Technologies Used</Field.Label>
						<Input placeholder="React, Node.js, PostgreSQL" bind:value={p.technologies} />
					</Field.Field>
					<Field.Field class="md:col-span-2">
						<Field.Label>Project Link</Field.Label>
						<Input placeholder="https://github.com/you/project" type="url" bind:value={p.link} />
					</Field.Field>
					<Field.Field class="md:col-span-2">
						<Field.Label>Description</Field.Label>
						<Textarea
							placeholder="What does the project do? What problem does it solve?"
							bind:value={p.description}
							class="min-h-24 resize-y"
						/>
					</Field.Field>
				</div>
			</SectionEntry>
		{/each}
	{:else}
		<EmptySection />
	{/if}

	<Button onclick={() => resumeData.projects.push(createProject())}>Add New</Button>
</Tabs.Content>
