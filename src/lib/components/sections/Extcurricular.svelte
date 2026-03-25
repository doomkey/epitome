<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { sections } from '$lib/constant';
	import Button from '$lib/components/ui/button/button.svelte';
	import SectionEntry from '$lib/components/SectionEntry.svelte';
	import { moveItem, removeItem, createExt } from '$lib/functions/helpers';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { resumeData } from '$lib/stores/resumeStore.svelte';
	import EmptySection from '../EmptySection.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import InlineEdit from '$lib/components/InlineEdit.svelte';
</script>

<Tabs.Content value={sections.extcurricular.value}>
	<Card.Root>
		<Card.Header>
			<Card.Title>
				<InlineEdit
					value={resumeData.sections.extcurricular.title}
					onconfirm={(val) => (resumeData.sections.extcurricular.title = val)}
				/>
			</Card.Title>
			<Card.Description>{sections.extcurricular.subtitle}</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if resumeData.extcurricular && resumeData.extcurricular.length > 0}
				{#each resumeData.extcurricular as e, index (e.id)}
					<SectionEntry
						title={e.role || 'Untitled'}
						{index}
						total={resumeData.extcurricular.length}
						onMoveUp={() =>
							(resumeData.extcurricular = moveItem(resumeData.extcurricular, index, 'up'))}
						onMoveDown={() =>
							(resumeData.extcurricular = moveItem(resumeData.extcurricular, index, 'down'))}
						onRemove={() => (resumeData.extcurricular = removeItem(resumeData.extcurricular, e.id))}
					>
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<Field.Field>
								<Field.Label>Role</Field.Label>
								<Input placeholder="Member" bind:value={e.role} required />
							</Field.Field>
							<Field.Field>
								<Field.Label>Organization</Field.Label>
								<Input placeholder="Some org" bind:value={e.org} required />
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

			<Button onclick={() => resumeData.extcurricular.push(createExt())}>Add New</Button>
		</Card.Content>
	</Card.Root>
</Tabs.Content>
