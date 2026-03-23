<script lang="ts">
	import { exportBackup, importBackup, type ImportResult } from '$lib/db/backup';
	import { Button } from '$lib/components/ui/button/index.js';
	import { workspaceStore } from '$lib/stores/workspace.svelte';
	import { getAllWorkspaces } from '$lib/db/workspaces';
	import DownloadIcon from '@lucide/svelte/icons/download';
	import UploadIcon from '@lucide/svelte/icons/upload';
	import { toast } from 'svelte-sonner';

	let importing = $state(false);
	let fileInput: HTMLInputElement;

	async function handleExport() {
		try {
			await exportBackup();
			toast.success('Backup exported successfully.');
		} catch {
			toast.error('Failed to export backup.');
		}
	}

	async function handleFileChange(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		importing = true;
		try {
			const result = await importBackup(file);
			workspaceStore.workspaces = await getAllWorkspaces();

			if (result.errors.length > 0) {
				result.errors.forEach((err) => toast.error(err));
			} else {
				toast.success(
					`Import complete — ${result.added} added, ${result.overwritten} overwritten.`
				);
			}
		} catch {
			toast.error('Unexpected error during import.');
		} finally {
			importing = false;
			fileInput.value = '';
		}
	}
</script>

<div class="grid grid-cols-2 gap-2">
	<Button variant="outline" class="gap-2" onclick={handleExport}>
		<DownloadIcon class="h-4 w-4" />
		Export Backup
	</Button>
	<Button variant="outline" class="gap-2" onclick={() => fileInput.click()} disabled={importing}>
		<UploadIcon class="h-4 w-4" />
		{importing ? 'Importing...' : 'Import Backup'}
	</Button>
	<input
		bind:this={fileInput}
		type="file"
		accept=".epitome"
		class="hidden"
		onchange={handleFileChange}
	/>
</div>
