<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { sections } from '$lib/constant';
	import Button from '$lib/components/ui/button/button.svelte';
	import SectionEntry from '$lib/components/SectionEntry.svelte';
	import { moveItem, removeItem, createExp } from '$lib/functions/helpers';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { resumeData } from '$lib/stores/resumeStore.svelte';
	import EmptySection from '../EmptySection.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import InlineEdit from '$lib/components/InlineEdit.svelte';
	import VisibilityToggle from '$lib/components/VisibilityToggle.svelte';
</script>

<Tabs.Content value={sections.experience.value}>
	<Card.Root>
		<Card.Header>
			<Card.Title>
				<!-- <VisibilityToggle
					visible={!resumeData.sections.experience.hidden}
					onchange={(v) => (resumeData.sections.experience.hidden = !v)}
				/> -->
				<InlineEdit
					value={resumeData.sections.experience.title}
					onconfirm={(val) => (resumeData.sections.experience.title = val)}
				/>
			</Card.Title>
			<Card.Description>{sections.experience.subtitle}</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if resumeData.experience.length > 0}
				{#each resumeData.experience as e, index (e.id)}
					<SectionEntry
						title={e.jobTitle || 'Untitled'}
						{index}
						total={resumeData.experience.length}
						onMoveUp={() => (resumeData.experience = moveItem(resumeData.experience, index, 'up'))}
						onMoveDown={() =>
							(resumeData.experience = moveItem(resumeData.experience, index, 'down'))}
						onRemove={() => (resumeData.experience = removeItem(resumeData.experience, e.id))}
					>
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<Field.Field>
								<Field.Label>Job Title</Field.Label>
								<Input placeholder="Software Engineer" bind:value={e.jobTitle} required />
							</Field.Field>
							<Field.Field>
								<Field.Label>Company</Field.Label>
								<Input placeholder="Acme Corp" bind:value={e.company} required />
							</Field.Field>
							<Field.Field>
								<Field.Label>Location</Field.Label>
								<Input placeholder="Dhaka, Bangladesh" bind:value={e.location} />
							</Field.Field>
							<Field.Field>
								<Field.Label>Start</Field.Label>
								<Input placeholder="Jan 2020" bind:value={e.start} />
							</Field.Field>
							<Field.Field class={e.present ? 'pointer-events-none opacity-50' : ''}>
								<Field.Label>End</Field.Label>
								<Input placeholder="Dec 2023" bind:value={e.end} disabled={e.present} />
							</Field.Field>
							<Field.Field>
								<Field.Label></Field.Label>
								<div class="flex items-center gap-2 pt-2">
									<Checkbox
										id="present-{e.id}"
										bind:checked={e.present}
										onCheckedChange={(v) => {
											if (v) e.end = '';
										}}
									/>
									<Label for="present-{e.id}">Currently working here</Label>
								</div>
							</Field.Field>
							<Field.Field class="col-span-full">
								<Field.Label>Responsibilities & Achievements</Field.Label>
								<Textarea
									placeholder="Describe your key responsibilities and achievements..."
									bind:value={e.responsibilities}
									class="min-h-28 resize-y"
								/>
							</Field.Field>
						</div>
					</SectionEntry>
				{/each}
			{:else}
				<EmptySection />
			{/if}

			<Button onclick={() => resumeData.experience.push(createExp())}>Add New</Button>
		</Card.Content>
	</Card.Root>
</Tabs.Content>
