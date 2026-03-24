<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import CheckIcon from '@lucide/svelte/icons/check';
	import XIcon from '@lucide/svelte/icons/x';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import { saveCurrentWorkspace } from '$lib/stores/workspace.svelte';

	let {
		value,
		onconfirm
	}: {
		value: string;
		onconfirm: (newValue: string) => void;
	} = $props();

	let editing = $state(false);
	let editingValue = $state(value);

	function startEdit() {
		editingValue = value;
		editing = true;
	}

	async function confirmEdit() {
		onconfirm(editingValue);
		await saveCurrentWorkspace();
		editing = false;
	}

	function cancelEdit() {
		editing = false;
	}
</script>

<div class="flex items-center gap-2">
	{#if editing}
		<Input
			class="h-8 w-[50%] min-w-25 text-lg font-semibold"
			bind:value={editingValue}
			onkeydown={(e) => {
				if (e.key === 'Enter') confirmEdit();
				if (e.key === 'Escape') cancelEdit();
			}}
			autofocus
		/>
		<button
			onclick={confirmEdit}
			class="text-muted-foreground hover:text-foreground"
			aria-label="Confirm"
		>
			<CheckIcon class="h-4 w-4" />
		</button>
		<button
			onclick={cancelEdit}
			class="text-muted-foreground hover:text-foreground"
			aria-label="Cancel"
		>
			<XIcon class="h-4 w-4" />
		</button>
	{:else}
		<p class="font-semibold">{value}</p>
		<button
			onclick={startEdit}
			class="text-muted-foreground hover:text-foreground"
			aria-label="Rename"
		>
			<PencilIcon class="h-3.5 w-3.5" />
		</button>
	{/if}
</div>
