<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input';
	import {
		workspaceStore,
		newWorkspace,
		renameWorkspace,
		deleteWorkspace,
		switchWorkspace,
		saveCurrentWorkspace
	} from '$lib/stores/workspace.svelte';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import CheckIcon from '@lucide/svelte/icons/check';
	import XIcon from '@lucide/svelte/icons/x';
	import BackupManager from './BackupManager.svelte';

	let open = $state(false);
	let editingId = $state<string | null>(null);
	let editingName = $state('');

	const side = $derived(
		typeof window !== 'undefined' && window.innerWidth < 640 ? 'bottom' : 'right'
	);

	const activeWorkspace = $derived(
		workspaceStore.workspaces.find((w) => w.id === workspaceStore.activeId)
	);

	function startRename(id: string, currentName: string) {
		editingId = id;
		editingName = currentName;
	}

	function cancelRename() {
		editingId = null;
		editingName = '';
	}

	async function confirmRename() {
		if (!editingId || !editingName.trim()) return;
		await renameWorkspace(editingId, editingName.trim());
		editingId = null;
	}

	async function handleSwitch(id: string) {
		if (id === workspaceStore.activeId) return;
		await saveCurrentWorkspace();
		await switchWorkspace(id);
		open = false;
	}

	async function handleNew() {
		await newWorkspace();
		open = false;
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" class="gap-2">
				Workspaces
				<!-- {activeWorkspace?.name ?? 'Workspace'} -->
				<!-- <ChevronDownIcon class="h-4 w-4" /> -->
			</Button>
		{/snippet}
	</Sheet.Trigger>

	<Sheet.Content {side} class="flex flex-col sm:max-w-sm">
		<Sheet.Header>
			<Sheet.Title>Workspaces</Sheet.Title>
			<Sheet.Description>Switch between workspaces or create a new one.</Sheet.Description>
		</Sheet.Header>

		<!-- Workspace list -->
		<div class="flex-1 overflow-y-auto px-4">
			<Button onclick={handleNew} variant="outline" class="mb-4 w-full gap-2">
				<PlusIcon class="h-4 w-4" />
				New Workspace
			</Button>
			<div class="flex flex-col gap-1">
				{#each workspaceStore.workspaces as workspace (workspace.id)}
					<div
						class="flex items-center gap-2 rounded-md px-3 py-2 {workspace.id ===
						workspaceStore.activeId
							? 'bg-muted'
							: 'hover:bg-muted/50'}"
					>
						{#if editingId === workspace.id}
							<Input
								class="h-8 flex-1 text-sm"
								bind:value={editingName}
								onkeydown={(e) => {
									if (e.key === 'Enter') confirmRename();
									if (e.key === 'Escape') cancelRename();
								}}
								autofocus
							/>
							<button
								onclick={confirmRename}
								class="p-1 text-muted-foreground hover:text-foreground"
								aria-label="Confirm rename"
							>
								<CheckIcon class="h-4 w-4" />
							</button>
							<button
								onclick={cancelRename}
								class="p-1 text-muted-foreground hover:text-foreground"
								aria-label="Cancel"
							>
								<XIcon class="h-4 w-4" />
							</button>
						{:else}
							<button
								class="flex-1 truncate text-left text-sm {workspace.id === workspaceStore.activeId
									? 'font-medium'
									: 'text-muted-foreground'}"
								onclick={() => handleSwitch(workspace.id)}
							>
								{workspace.name}
							</button>
							<button
								onclick={() => startRename(workspace.id, workspace.name)}
								class="p-1 text-muted-foreground hover:text-foreground"
								aria-label="Rename"
							>
								<PencilIcon class="h-4 w-4" />
							</button>
							<button
								onclick={() => deleteWorkspace(workspace.id)}
								class="p-1 text-muted-foreground hover:text-destructive disabled:opacity-30"
								disabled={workspaceStore.workspaces.length <= 1}
								aria-label="Delete"
							>
								<Trash2Icon class="h-4 w-4" />
							</button>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<Sheet.Footer class="border-t pt-4">
			<BackupManager />
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
