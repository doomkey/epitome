<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { sections } from '$lib/constant';
	import Button from '$lib/components/ui/button/button.svelte';
	import SectionEntry from '$lib/components/SectionEntry.svelte';
	import { moveItem, removeItem, createExt, createRef } from '$lib/functions/helpers';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { resumeData } from '$lib/stores/resumeStore.svelte';
	import EmptySection from '../EmptySection.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import InlineEdit from '$lib/components/InlineEdit.svelte';
</script>

<Tabs.Content value={sections.references.value}>
	<Card.Root>
		<Card.Header>
			<Card.Title>
				<InlineEdit
					value={resumeData.sections.references.title}
					onconfirm={(val) => (resumeData.sections.references.title = val)}
				/>
			</Card.Title>
			<Card.Description>{sections.references.subtitle}</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if resumeData.references && resumeData.references.length > 0}
				{#each resumeData.references as e, index (e.id)}
					<SectionEntry
						title={e.name || 'Untitled'}
						{index}
						total={resumeData.references.length}
						onMoveUp={() => (resumeData.references = moveItem(resumeData.references, index, 'up'))}
						onMoveDown={() =>
							(resumeData.references = moveItem(resumeData.references, index, 'down'))}
						onRemove={() => (resumeData.references = removeItem(resumeData.references, e.id))}
					>
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<Field.Field>
								<Field.Label>Name</Field.Label>
								<Input placeholder="Dr. X" bind:value={e.name} required />
							</Field.Field>
							<Field.Field>
								<Field.Label>Designation</Field.Label>
								<Input placeholder="Professor" bind:value={e.designation} />
							</Field.Field>
							<Field.Field>
								<Field.Label>Department</Field.Label>
								<Input placeholder="Dept. of X" bind:value={e.dept} />
							</Field.Field>
							<Field.Field>
								<Field.Label>Institute</Field.Label>
								<Input placeholder="Uni of A" bind:value={e.org} required />
							</Field.Field>
							<Field.Field>
								<Field.Label>Phone</Field.Label>
								<Input placeholder="+0000000" bind:value={e.phone} type="tel" />
							</Field.Field>
							<Field.Field>
								<Field.Label>Email</Field.Label>
								<Input placeholder="mail@mail.mail" bind:value={e.email} type="email" />
							</Field.Field>
						</div>
					</SectionEntry>
				{/each}
			{:else}
				<EmptySection />
			{/if}

			<Button onclick={() => resumeData.references.push(createRef())}>Add New</Button>
		</Card.Content>
	</Card.Root>
</Tabs.Content>
