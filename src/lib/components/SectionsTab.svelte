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
	import { Input } from './ui/input';
	import Separator from './ui/separator/separator.svelte';
	import { resumeData } from '$lib/stores/resumeStore.svelte';
	import {
		saveCurrentWorkspace,
		renameWorkspace,
		workspaceStore
	} from '$lib/stores/workspace.svelte';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import CheckIcon from '@lucide/svelte/icons/check';
	import XIcon from '@lucide/svelte/icons/x';

	const sectionList = Object.values(sections);
	let activeTab = $state<string>(sections.personal.value);
	const activeSection = $derived(sectionList.find((s) => s.value === activeTab));

	let editing = $state(false);
	let editingName = $state('');

	const activeWorkspace = $derived(
		workspaceStore.workspaces.find((w) => w.id === workspaceStore.activeId)
	);

	function startEdit() {
		editingName = activeWorkspace?.name ?? '';
		editing = true;
	}

	function cancelEdit() {
		editing = false;
		editingName = '';
	}

	async function confirmEdit() {
		if (!editingName.trim() || !workspaceStore.activeId) return;
		await renameWorkspace(workspaceStore.activeId, editingName.trim());
		editing = false;
	}

	async function handleTabChange(val: string) {
		await saveCurrentWorkspace();
		activeTab = val;
	}
</script>

<div class="flex w-full flex-col gap-6">
	<Tabs.Root bind:value={activeTab} onValueChange={handleTabChange}>
		<div class="mb-2 flex items-center gap-2">
			{#if editing}
				<Input
					class="h-8 text-lg font-semibold"
					bind:value={editingName}
					onkeydown={(e) => {
						if (e.key === 'Enter') confirmEdit();
						if (e.key === 'Escape') cancelEdit();
					}}
					autofocus
				/>
				<button
					onclick={confirmEdit}
					class="text-muted-foreground hover:text-foreground"
					aria-label="Confirm rename"
				>
					<CheckIcon class="h-4 w-4" />
				</button>
				<button
					onclick={cancelEdit}
					class="text-muted-foreground hover:text-foreground"
					aria-label="Cancel rename"
				>
					<XIcon class="h-4 w-4" />
				</button>
			{:else}
				<h2 class="text-lg font-semibold">{activeWorkspace?.name ?? 'Workspace'}</h2>
				<button
					onclick={startEdit}
					class="text-muted-foreground hover:text-foreground"
					aria-label="Rename workspace"
				>
					<PencilIcon class="h-3.5 w-3.5" />
				</button>
			{/if}
		</div>

		<Tabs.List class="mb-4 hidden sm:flex">
			{#each sectionList as { title, value } (value)}
				<Tabs.Trigger {value}>{title}</Tabs.Trigger>
			{/each}
		</Tabs.List>

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
