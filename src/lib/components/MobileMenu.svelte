<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import MenuIcon from '@lucide/svelte/icons/menu';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import CheckIcon from '@lucide/svelte/icons/check';
	import { getMenus, setFileInput, type MenuItem, type Menu } from './menus.svelte';
	import {
		renameWorkspace,
		deleteWorkspace,
		workspaceStore,
		switchWorkspace,
		saveCurrentWorkspace
	} from '$lib/stores/workspace.svelte';
	import { createWorkspace, getAllWorkspaces } from '$lib/db/workspaces';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';

	//@ts-ignore
	import { toast } from 'svelte-sonner';
	import XIcon from '@lucide/svelte/icons/x';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import { defaultResumeData, resumeData } from '$lib/stores/resumeStore.svelte';
	import { db } from '$lib/db';
	let open = $state(false);
	let fileInput: HTMLInputElement;
	let renamingId = $state<string | null>(null);
	let renamingName = $state('');

	type StackEntry = {
		title: string;
		items: MenuItem[];
	};

	let stack = $state<StackEntry[]>([]);
	let animating = $state(false);
	let direction = $state<'push' | 'pop'>('push');

	const currentView = $derived(stack[stack.length - 1]);

	$effect(() => {
		if (fileInput) setFileInput(fileInput);
	});

	$effect(() => {
		if (open) {
			// reset to root when sheet opens
			stack = [
				{
					title: 'Menu',
					items: menus.map((m) => ({
						type: 'sub' as const,
						label: m.label,
						children: m.items
					}))
				}
			];
		}
	});
	let showResetDialog = $state(false);
	let showDeleteAllDialog = $state(false);
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
			onDeleteAll: () => (showDeleteAllDialog = true)
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

	function push(title: string, items: MenuItem[]) {
		direction = 'push';
		animating = true;
		setTimeout(() => {
			stack = [...stack, { title, items }];
			animating = false;
		}, 10);
	}

	function pop() {
		if (stack.length <= 1) return;
		direction = 'pop';
		animating = true;
		setTimeout(() => {
			stack = stack.slice(0, -1);
			animating = false;
		}, 10);
	}

	function handleAction(onSelect: () => void) {
		onSelect();
		open = false;
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
<div class="flex h-10 items-center justify-between border-b px-4 sm:hidden">
	<span class="text-sm font-semibold text-muted-foreground select-none">epitome</span>
	<Sheet.Root bind:open>
		<Sheet.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="ghost" size="icon-sm">
					<MenuIcon class="h-5 w-5" />
				</Button>
			{/snippet}
		</Sheet.Trigger>

		<Sheet.Content side="bottom" class="flex h-[70vh] flex-col p-0" showCloseButton={false}>
			<div class="relative flex h-12 shrink-0 items-center justify-center border-b px-4">
				{#if stack.length > 1}
					<button onclick={pop} class="absolute left-4 flex items-center gap-1 text-sm font-medium">
						<ChevronLeftIcon class="h-4 w-4" />
					</button>
				{/if}

				<span class="text-sm font-semibold">
					{currentView?.title ?? 'Menu'}
				</span>

				<button
					onclick={() => (open = false)}
					class="absolute right-4 text-muted-foreground hover:text-foreground"
				>
					<XIcon class="h-4 w-4" />
				</button>
			</div>

			<div class="relative flex-1 overflow-x-hidden overflow-y-auto">
				{#if currentView}
					<div
						class="w-full py-2 transition-transform duration-200 ease-in-out"
						class:translate-x-full={animating && direction === 'push'}
						class:-translate-x-full={animating && direction === 'pop'}
					>
						{#each currentView.items as menuItem (menuItem)}
							{@render renderItem(menuItem)}
						{/each}
					</div>
				{/if}
			</div>
		</Sheet.Content>
	</Sheet.Root>
</div>

{#snippet renderItem(menuItem: MenuItem)}
	{#if menuItem.type === 'separator'}
		<div class="mx-4 my-1 h-px bg-border"></div>
	{:else if menuItem.type === 'radio'}
		<p class="px-4 pt-3 pb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
			{menuItem.heading}
		</p>
		{#each menuItem.options as opt (opt.value)}
			<div class="flex items-center px-4 active:bg-muted">
				<button
					class="flex flex-1 items-center py-3 text-sm"
					onclick={() => {
						menuItem.onChange(opt.value);
						open = false;
					}}
				>
					{opt.label}
					{#if menuItem.getValue() === opt.value}
						<CheckIcon class="ml-auto h-4 w-4 text-primary" />
					{/if}
				</button>
				{#if opt.onRename || opt.onDelete}
					<div class="flex items-center gap-3 pl-3">
						{#if opt.onRename}
							<button
								onclick={() => opt.onRename?.()}
								class="text-muted-foreground"
								aria-label="Rename"
							>
								<PencilIcon class="h-4 w-4" />
							</button>
						{/if}
						{#if opt.onDelete}
							<button
								onclick={() => opt.onDelete?.()}
								class="text-muted-foreground disabled:opacity-30"
								disabled={opt.deleteDisabled}
								aria-label="Delete"
							>
								<Trash2Icon class="h-4 w-4 text-destructive" />
							</button>
						{/if}
					</div>
				{/if}
			</div>
		{/each}
	{:else if menuItem.type === 'sub'}
		<button
			class="flex w-full items-center px-4 py-3 text-sm active:bg-muted disabled:opacity-40"
			disabled={menuItem.disabled}
			onclick={() => push(menuItem.label, menuItem.children)}
		>
			{menuItem.label}
			<ChevronRightIcon class="ml-auto h-4 w-4 text-muted-foreground" />
		</button>
	{:else}
		<button
			class="flex w-full items-center px-4 py-3 text-sm active:bg-muted disabled:opacity-40
				{menuItem.destructive ? 'text-destructive' : ''}"
			disabled={menuItem.disabled}
			onclick={() => handleAction(menuItem.onSelect)}
		>
			{menuItem.label}
			{#if menuItem.shortcut}
				<span class="ml-auto text-xs text-muted-foreground">{menuItem.shortcut}</span>
			{/if}
		</button>
	{/if}
{/snippet}

<!-- Rename dialog -->
{#if renamingId}
	{@const workspace = workspaceStore.workspaces.find((w) => w.id === renamingId)}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
		<div class="flex w-full max-w-sm flex-col gap-3 rounded-lg border bg-popover p-4 shadow-lg">
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
					class="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
					onclick={handleRename}
				>
					Rename
				</button>
			</div>
		</div>
	</div>
{/if}
