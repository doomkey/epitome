<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input';
	import { sections } from '$lib/constant';
	import Button from '$lib/components/ui/button/button.svelte';
	import SectionEntry from '$lib/components/SectionEntry.svelte';
	import { moveItem, removeItem, createCert } from '$lib/functions/helpers';
	import { resumeData } from '$lib/stores/resumeStore.svelte';
	import EmptySection from '../EmptySection.svelte';
</script>

<Tabs.Content value={sections.certifications.value}>
	{#if resumeData.certifications.length > 0}
		{#each resumeData.certifications as c, i (c.id)}
			<SectionEntry
				title={c.name || 'Untitled'}
				index={i}
				total={resumeData.certifications.length}
				onMoveUp={() => (resumeData.certifications = moveItem(resumeData.certifications, i, 'up'))}
				onMoveDown={() =>
					(resumeData.certifications = moveItem(resumeData.certifications, i, 'down'))}
				onRemove={() => (resumeData.certifications = removeItem(resumeData.certifications, c.id))}
			>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<Field.Field>
						<Field.Label>Certification Name</Field.Label>
						<Input placeholder="AWS Certified Solutions Architect" bind:value={c.name} required />
					</Field.Field>
					<Field.Field>
						<Field.Label>Issuing Organization</Field.Label>
						<Input placeholder="Amazon Web Services" bind:value={c.organization} required />
					</Field.Field>
					<Field.Field class="md:col-span-2">
						<Field.Label>Certificate URL</Field.Label>
						<Input placeholder="https://credential.net/..." type="url" bind:value={c.url} />
					</Field.Field>
				</div>
			</SectionEntry>
		{/each}
	{:else}
		<EmptySection />
	{/if}

	<Button onclick={() => resumeData.certifications.push(createCert())}>Add New</Button>
</Tabs.Content>
