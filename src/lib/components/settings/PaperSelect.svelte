<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import { settingsStore } from '$lib/stores/settings.svelte';
	import { paperSizes } from '$lib/constant';

	const PAPERS = Object.values(paperSizes);
</script>

<Select.Root
	type="single"
	value={settingsStore.current.paperSize}
	onValueChange={(v) => settingsStore.update('paperSize', v)}
>
	<Select.Trigger class="max-w-full">
		{PAPERS.find((p) => p.value === settingsStore.current.paperSize)?.label}
	</Select.Trigger>
	<Select.Content>
		{#each PAPERS as size (size.value)}
			<Select.Item value={size.value}>{size.label}</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
