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
	import InlineEdit from '$lib/components/InlineEdit.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import SectionsRearrange from './SectionsRearrange.svelte';

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
		<div class="mb-2">
			{#if workspaceStore.ready}
				<InlineEdit
					value={activeWorkspace?.name ?? 'Workspace'}
					onconfirm={(newName) => renameWorkspace(workspaceStore.activeId, newName)}
				/>
			{:else}
				<Skeleton class="h-6 w-24" />
			{/if}
		</div>

		<Tabs.List class="mb-4 hidden sm:flex">
			{#each sectionList as { title, value } (value)}
				<Tabs.Trigger {value}>{title}</Tabs.Trigger>
			{/each}
		</Tabs.List>

		<div class="mb-4 sm:hidden">
			<Label for="section-select" class="mb-1.5 block text-sm font-medium">Section</Label>
			<Select.Root type="single" value={activeTab} onValueChange={handleTabChange}>
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

		<Personal />
		<Education />
		<Experience />
		<Projects />
		<Certifications />
		<Skills />
	</Tabs.Root>
</div>
