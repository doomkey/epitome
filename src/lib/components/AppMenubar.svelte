<script lang="ts">
	import { Menubar } from 'bits-ui';
	import MenuIcon from '@lucide/svelte/icons/menu';
	//@ts-ignore
	import { toast } from 'svelte-sonner';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import { getMenus, setFileInput, type MenuItem } from './menus.svelte';
	import {
		renameWorkspace,
		deleteWorkspace,
		switchWorkspace,
		initWorkspaces
	} from '$lib/stores/workspace.svelte';
	import { createWorkspace, getAllWorkspaces } from '$lib/db/workspaces';
	import { workspaceStore } from '$lib/stores/workspace.svelte';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
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
	import DarkModeToggle from './DarkModeToggle.svelte';
	import { invalidateAll } from '$app/navigation';
	import Separator from './ui/separator/separator.svelte';
	import Settings from './Settings.svelte';
	import { browser } from '$app/environment';
	import { compressResume } from '$lib/db/sharelink';
	import { Input } from './ui/input';

	$effect(() => {
		if (fileInput) setFileInput(fileInput);
	});
	let mobileMenuOpen = $state(false);
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
				workspaceIdToBeDeleted = id;
				showDeleteAWorkspace = true;
			},
			onResetCurrent: () => (showResetDialog = true),
			onDeleteAll: () => (showDeleteAllDialog = true),
			onConfigureSections: () => (showConfigureSections = true),
			onOpenSettings: () => (showSettings = true),
			onShareLink: () => {
				showShareLink = true;
				handleShareLink();
			}
		})
	);
	let showShareLink = $state(false);
	let showSettings = $state(false);
	let showDeleteAWorkspace = $state(false);
	let workspaceIdToBeDeleted = $state('');

	async function handleDeleteAWorkspace() {
		if (workspaceIdToBeDeleted === '') {
			toast.error('Workspace not found.');
			showDeleteAWorkspace = false;
			return;
		}
		const name = workspaceStore.workspaces.find((w) => w.id === workspaceIdToBeDeleted)?.name;
		await deleteWorkspace(workspaceIdToBeDeleted);
		toast.success(`"${name}" deleted.`);
		workspaceIdToBeDeleted = '';
		showDeleteAWorkspace = false;
	}
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
			console.log(result);
			workspaceStore.workspaces = await getAllWorkspaces();
			if (result.errors.length > 0) result.errors.forEach((err) => toast.error(err));
			else toast.success(`Imported — ${result.added} added, ${result.overwritten} overwritten.`);
		} catch {
			toast.error('Import failed.');
		} finally {
			fileInput.value = '';
			initWorkspaces(); // to refresh the data
		}
	}

	let shareLink = $state('');
	async function handleShareLink() {
		if (!browser) return;
		await saveCurrentWorkspace();
		const currentState = $state.snapshot(resumeData);
		const c = await compressResume(currentState);
		shareLink = 'https://doomkey.gitub.io/epitome/prev?q=' + c;
	}
	let status = $state('Copy');
	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(shareLink);
			status = 'Copied!';

			setTimeout(() => {
				status = 'Copy';
			}, 2000);
		} catch (err) {
			status = 'Error!';
		}
	}
</script>

<input bind:this={fileInput} type="file" accept=".epitome" class="hidden" onchange={handleImport} />

<Menubar.Root
	class="sticky top-0 flex h-14 items-center gap-0 rounded-none border-x-0 border-t-0 border-b bg-background px-1 shadow-md md:gap-0.5 md:px-2"
>
	<span class="px-2 text-sm font-semibold text-muted-foreground select-none">Epitome</span>
	<div class="mx-1 hidden h-4 w-px bg-border md:block"></div>
	<DarkModeToggle />

	{#each menus as menu (menu.label)}
		<Menubar.Menu>
			<Menubar.Trigger class="{item} hidden md:flex">{menu.label}</Menubar.Trigger>
			<Menubar.Portal>
				<Menubar.Content class={content} align="start" sideOffset={4}>
					{#each menu.items as menuItem (menuItem)}
						{@render renderItem(menuItem)}
					{/each}
				</Menubar.Content>
			</Menubar.Portal>
		</Menubar.Menu>
	{/each}

	<Button
		variant="ghost"
		size="icon"
		class="ml-auto h-8 w-8 md:hidden"
		onclick={() => (mobileMenuOpen = true)}
	>
		<MenuIcon class="h-5 w-5" />
	</Button>
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

<Dialog.Root bind:open={showConfigureSections}>
	<Dialog.Content class="overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>Configure Sections</Dialog.Title>
			<Dialog.Description
				>Use the Eye to toggle visibility, and the arrows to change order.</Dialog.Description
			>
		</Dialog.Header>
		<SectionsRearrange />
	</Dialog.Content>
</Dialog.Root>

<!-- settings -->

<Dialog.Root bind:open={showSettings}>
	<Dialog.Content class="overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>Settings</Dialog.Title>
		</Dialog.Header>
		<Settings />
	</Dialog.Content>
</Dialog.Root>

<Sheet.Root bind:open={mobileMenuOpen}>
	<Sheet.Content side="left" class=" overflow-y-auto pb-8">
		<Sheet.Header>
			<Sheet.Title>Menu</Sheet.Title>
		</Sheet.Header>
		<div class="mt-6 flex flex-col gap-2">
			{#each menus as menu (menu.label)}
				<div class="mx-1 flex flex-col gap-1 p-4">
					<h3 class="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
						{menu.label}
					</h3>
					{#each menu.items as menuItem (menuItem)}
						<div class="rounded-sm bg-muted/20">
							{@render renderMobileItem(menuItem)}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</Sheet.Content>
</Sheet.Root>

{#snippet renderMobileItem(menuItem: MenuItem)}
	{#if menuItem.type === 'separator'}
		<div></div>
	{:else if menuItem.type === 'radio'}
		<div class="mt-1 mb-2 flex flex-col gap-1">
			<!-- <span class="text-xs font-medium text-muted-foreground">{menuItem.heading}</span> -->
			{#each menuItem.options as opt (opt.value)}
				<button
					class="flex items-center gap-2 rounded-sm px-2 py-2 text-left text-sm hover:bg-muted"
					onclick={() => {
						menuItem.onChange(opt.value);
						mobileMenuOpen = false;
					}}
				>
					{#if menuItem.getValue() === opt.value}
						<CheckIcon class="h-4 w-4 text-primary" />
					{:else}
						<div class="h-4 w-4"></div>
					{/if}

					<span class="flex-1">{opt.label}</span>

					{#if opt.onDelete}
						<button
							class="text-muted-foreground hover:text-destructive disabled:opacity-30"
							disabled={opt.deleteDisabled}
							onclick={(e) => {
								e.stopPropagation();
								opt.onDelete?.();
							}}
						>
							<Trash2Icon class="h-4 w-4" />
						</button>
					{/if}
				</button>
			{/each}
		</div>
	{:else if menuItem.type === 'sub'}
		<details class="group mt-1">
			<summary
				class="flex cursor-pointer items-center justify-between rounded-md px-2 py-2 text-sm font-medium hover:bg-muted"
			>
				{menuItem.label}
				<ChevronRightIcon class="h-4 w-4 transition-transform group-open:rotate-90" />
			</summary>
			<div class="mt-1 ml-2 flex flex-col gap-1 border-l-2 border-border pl-2">
				{#each menuItem.children as child}
					{@render renderMobileItem(child)}
				{/each}
			</div>
		</details>
	{:else}
		<button
			class="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm hover:bg-muted disabled:opacity-50 {menuItem.destructive
				? 'text-destructive'
				: ''}"
			disabled={menuItem.disabled}
			onclick={() => {
				menuItem.onSelect();
				mobileMenuOpen = false;
			}}
		>
			{menuItem.label}
			{#if menuItem.shortcut}
				<span class="text-xs text-muted-foreground">{menuItem.shortcut}</span>
			{/if}
		</button>
	{/if}
{/snippet}

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

<AlertDialog.Root bind:open={showDeleteAWorkspace}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete this workspace?</AlertDialog.Title>
			<AlertDialog.Description>
				This will permanently delete this workspace and its data. This cannot be undone.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
				onclick={handleDeleteAWorkspace}
			>
				Delete
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<Dialog.Root bind:open={showShareLink}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Share this resume.</Dialog.Title>
			<Dialog.Description>
				This link contains all the information on this specific resume. You should only share it
				with who you trust.
			</Dialog.Description>
		</Dialog.Header>
		<Input value={shareLink} />
		<Dialog.Footer>
			<p class="text-xs">
				Due to the url being very long, some browser may not parse it properly, leading to a faulty
				resume. So please test it yourself before sharing.
			</p>
			<Button onclick={copyToClipboard}>
				<CopyIcon />
				<span>{status}</span>
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
