<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Input } from '$lib/components/ui/input';
	import { sections } from '$lib/constant';
	import Button from '$lib/components/ui/button/button.svelte';
	import SectionEntry from '$lib/components/SectionEntry.svelte';
	import { moveItem, removeItem, createSkillCategory } from '$lib/functions/helpers';
	import XIcon from '@lucide/svelte/icons/x';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Switch } from '../ui/switch';
	import { Label } from '../ui/label';
	import { resumeData } from '$lib/stores/resumeStore.svelte';
	import EmptySection from '../EmptySection.svelte';

	let categories = $state([createSkillCategory(true)]);

	const flatSkills = $derived(categories.flatMap((c) => c.skills));
	let inputs: Record<number, string> = $state({});

	function addSkill(catId: number) {
		const raw = inputs[catId] ?? '';
		const newSkills = raw
			.split(',')
			.map((s) => s.trim())
			.filter((s) => s.length > 0);
		if (newSkills.length === 0) return;
		const cat = resumeData.skills.categories.find((c) => c.id === catId);
		if (!cat) return;
		cat.skills = [...cat.skills, ...newSkills];
		inputs[catId] = '';
	}

	function removeSkill(catId: number, skill: string) {
		const cat = resumeData.skills.categories.find((c) => c.id === catId);
		if (!cat) return;
		cat.skills = cat.skills.filter((s) => s !== skill);
	}

	function handleKeydown(e: KeyboardEvent, catId: number) {
		if (e.key === 'Enter' || e.key === ',') {
			e.preventDefault();
			addSkill(catId);
		}
	}
</script>

<Tabs.Content value={sections.skills.value}>
	{#if resumeData.skills.categories.length > 0}
		{#each resumeData.skills.categories as cat, i (cat.id)}
			<SectionEntry
				title={cat.category || 'Untitled'}
				index={i}
				total={resumeData.skills.categories.length}
				onMoveUp={() =>
					(resumeData.skills.categories = moveItem(resumeData.skills.categories, i, 'up'))}
				onMoveDown={() =>
					(resumeData.skills.categories = moveItem(resumeData.skills.categories, i, 'down'))}
				onRemove={() =>
					(resumeData.skills.categories = removeItem(resumeData.skills.categories, cat.id))}
			>
				<Field.Field>
					<Field.Label>Name of the Category</Field.Label>
					<Input
						placeholder="Category name (e.g. Frontend)"
						bind:value={cat.category}
						class="mb-3"
					/>
				</Field.Field>
				<Field.Field>
					<Field.Label>Skills</Field.Label>
					<Input
						placeholder="Type a skill and press Enter or comma..."
						bind:value={inputs[cat.id]}
						onkeydown={(e) => handleKeydown(e, cat.id)}
					/>
				</Field.Field>
				<div class="mb-3 flex flex-wrap gap-2">
					{#each cat.skills as skill, si (si)}
						<span
							class="inline-flex items-center gap-1 rounded-md border border-border bg-muted px-2.5 py-1 text-sm font-medium text-muted-foreground"
						>
							{skill}
							<button
								onclick={() => removeSkill(cat.id, skill)}
								class="ml-1 rounded transition-colors hover:text-destructive"
								aria-label="Remove {skill}"
							>
								<XIcon class="h-3 w-3" />
							</button>
						</span>
					{/each}
				</div>
			</SectionEntry>
		{/each}
	{:else}
		<EmptySection />
	{/if}

	<Button
		onclick={() =>
			(resumeData.skills.categories = [...resumeData.skills.categories, createSkillCategory()])}
		>Add Category</Button
	>

	<div class="mt-4 flex items-center gap-3">
		<Switch id="merge-skills" bind:checked={resumeData.skills.merge} />
		<Label for="merge-skills">
			Merge all skills into one list <span class="text-xs text-muted-foreground"
				>(no grouping on resume)</span
			>
		</Label>
	</div>
</Tabs.Content>
