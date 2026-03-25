<script lang="ts">
	import { Menubar } from 'bits-ui';
	//@ts-ignore
	import { toast } from 'svelte-sonner';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import { getMenus, setFileInput, type MenuItem } from './menus.svelte';
	import { renameWorkspace, deleteWorkspace, switchWorkspace } from '$lib/stores/workspace.svelte';
	import { createWorkspace, getAllWorkspaces } from '$lib/db/workspaces';
	import { workspaceStore } from '$lib/stores/workspace.svelte';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	const item =
		'flex h-9 select-none items-center gap-2 rounded-sm px-3 text-sm font-medium data-highlighted:bg-muted data-disabled:opacity-50 data-disabled:pointer-events-none cursor-default';
	const separator = 'my-1 -mx-1 block h-px bg-border';
	const content =
		'z-50 min-w-48 rounded-md border bg-popover p-1 shadow-md data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95';

	let renamingId = $state<string | null>(null);
	let renamingName = $state('');
	let fileInput: HTMLInputElement;
	import { resumeData, defaultResumeData } from '$lib/stores/resumeStore.svelte';
	import { saveCurrentWorkspace } from '$lib/stores/workspace.svelte';
	import { db } from '$lib/db';
	import { Button } from '$lib/components/ui/button';
	import SectionsRearrange from './SectionsRearrange.svelte';

	$effect(() => {
		if (fileInput) setFileInput(fileInput);
	});

	let showResetDialog = $state(false);
	let showDeleteAllDialog = $state(false);
	let showConfigureSections = $state(false);
	const menus = $derived(
		getMenus({
			onRename: (id, name) => {
				renamingId = id;
				renamingName = name;
			},
			onDelete: async (id) => {
				const name = workspaceStore.workspaces.find((w) => w.id === id)?.name;
				await deleteWorkspace(id);
				toast.success(`"${name}" deleted.`);
			},
			onResetCurrent: () => (showResetDialog = true),
			onDeleteAll: () => (showDeleteAllDialog = true),
			onConfigureSections: () => (showConfigureSections = true)
		})
	);
	async function handleResetCurrent() {
		Object.assign(resumeData, JSON.parse(JSON.stringify(defaultResumeData)));
		await saveCurrentWorkspace();
		toast.success('Workspace reset.');
		showResetDialog = false;
	}

	async function handleDeleteAll() {
		await db.workspaces.clear();
		const id = await createWorkspace(
			'Resume for X Corp.',
			JSON.parse(JSON.stringify(defaultResumeData))
		);
		workspaceStore.workspaces = await getAllWorkspaces();
		await switchWorkspace(id);
		toast.success('All workspaces deleted.');
		showDeleteAllDialog = false;
	}

	async function handleRename() {
		if (!renamingId || !renamingName.trim()) return;
		await renameWorkspace(renamingId, renamingName.trim());
		renamingId = null;
		toast.success('Workspace renamed.');
	}

	async function handleImport(e: Event) {
		const { importBackup } = await import('$lib/db/backup');
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		try {
			const result = await importBackup(file);
			workspaceStore.workspaces = await getAllWorkspaces();
			if (result.errors.length > 0) result.errors.forEach((err) => toast.error(err));
			else toast.success(`Imported — ${result.added} added, ${result.overwritten} overwritten.`);
		} catch {
			toast.error('Import failed.');
		} finally {
			fileInput.value = '';
		}
	}
</script>

<input bind:this={fileInput} type="file" accept=".epitome" class="hidden" onchange={handleImport} />
<AlertDialog.Root bind:open={showResetDialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Reset all data?</AlertDialog.Title>
			<AlertDialog.Description>
				This will clear all information in the current workspace. This action cannot be undone.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
				onclick={handleResetCurrent}
			>
				Reset
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
<AlertDialog.Root bind:open={showDeleteAllDialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete all workspaces?</AlertDialog.Title>
			<AlertDialog.Description>
				This will permanently delete all workspaces and their data. A fresh workspace will be
				created. This cannot be undone.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
				onclick={handleDeleteAll}
			>
				Delete All
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
<Menubar.Root
	class="sticky top-0 z-90 flex h-10 items-center gap-0 rounded-none border-x-0 border-t-0 border-b-1 bg-background px-1 shadow-md md:gap-0.5 md:px-2"
>
	<span class="hidden px-2 text-sm font-semibold text-muted-foreground select-none md:block"
		>Epitome</span
	>
	<div class="mx-1 hidden h-4 w-px bg-border md:block"></div>

	{#each menus as menu (menu.label)}
		<Menubar.Menu>
			<Menubar.Trigger class={item}>{menu.label}</Menubar.Trigger>
			<Menubar.Portal>
				<Menubar.Content class={content} align="start" sideOffset={4}>
					{#each menu.items as menuItem (menuItem)}
						{@render renderItem(menuItem)}
					{/each}
				</Menubar.Content>
			</Menubar.Portal>
		</Menubar.Menu>
	{/each}
</Menubar.Root>

{#snippet renderItem(menuItem: MenuItem)}
	{#if menuItem.type === 'separator'}
		<Menubar.Separator class={separator} />
	{:else if menuItem.type === 'radio'}
		<Menubar.Group>
			<Menubar.GroupHeading class="px-3 py-1 text-xs text-muted-foreground">
				{menuItem.heading}
			</Menubar.GroupHeading>
			<Menubar.RadioGroup value={menuItem.getValue()} onValueChange={menuItem.onChange}>
				{#each menuItem.options as opt (opt.value)}
					<Menubar.RadioItem class={item} value={opt.value} closeOnSelect={!opt.onRename}>
						{#snippet children({ checked })}
							{#if opt.onDelete}
								<button
									class="text-muted-foreground hover:text-destructive disabled:opacity-30"
									disabled={opt.deleteDisabled}
									onclick={(e) => {
										e.stopPropagation();
										opt.onDelete?.();
									}}
									aria-label="Delete"
								>
									<Trash2Icon class="h-3.5 w-3.5" />
								</button>
							{/if}
							{opt.label}
							{#if checked}<CheckIcon class="ml-auto h-3.5 w-3.5" />{/if}
						{/snippet}
					</Menubar.RadioItem>
				{/each}
			</Menubar.RadioGroup>
		</Menubar.Group>
	{:else if menuItem.type === 'sub'}
		<Menubar.Sub>
			<Menubar.SubTrigger class={item} disabled={menuItem.disabled}>
				{menuItem.label}
				<ChevronRightIcon class="ml-auto h-3.5 w-3.5" />
			</Menubar.SubTrigger>
			<Menubar.SubContent class={content}>
				{#each menuItem.children as child}
					{@render renderItem(child)}
				{/each}
			</Menubar.SubContent>
		</Menubar.Sub>
	{:else}
		<Menubar.Item
			class="{item} {menuItem.destructive
				? 'text-destructive data-highlighted:text-destructive'
				: ''}"
			disabled={menuItem.disabled}
			onSelect={menuItem.onSelect}
		>
			{menuItem.label}
			{#if menuItem.shortcut}
				<span class="ml-auto text-xs text-muted-foreground">{menuItem.shortcut}</span>
			{/if}
		</Menubar.Item>
	{/if}
{/snippet}

<!-- Rename dialog -->
{#if renamingId}
	{@const workspace = workspaceStore.workspaces.find((w) => w.id === renamingId)}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="flex w-80 flex-col gap-3 rounded-lg border bg-popover p-4 shadow-lg">
			<p class="text-sm font-medium">Rename "{workspace?.name}"</p>
			<input
				class="w-full rounded-md border bg-background px-3 py-1.5 text-sm"
				bind:value={renamingName}
				onkeydown={(e) => {
					if (e.key === 'Enter') handleRename();
					if (e.key === 'Escape') renamingId = null;
				}}
			/>
			<div class="flex justify-end gap-2">
				<button
					class="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
					onclick={() => (renamingId = null)}
				>
					Cancel
				</button>
				<button
					class="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90"
					onclick={handleRename}
				>
					Rename
				</button>
			</div>
		</div>
	</div>
{/if}

<Sheet.Root bind:open={showConfigureSections}>
	<Sheet.Content side="left">
		<Sheet.Header>
			<Sheet.Title>Configure Sections</Sheet.Title>
			<Sheet.Description
				>Use the Eye to toggle visibility, and the arrows to change order.</Sheet.Description
			>
		</Sheet.Header>
		<SectionsRearrange />
	</Sheet.Content>
</Sheet.Root>
