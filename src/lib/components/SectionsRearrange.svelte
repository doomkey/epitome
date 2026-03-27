<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import { Button } from '$lib/components/ui/button';
	import VisibilityToggle from '$lib/components/VisibilityToggle.svelte';
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
	import { resumeData } from '$lib/stores/resumeStore.svelte';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { saveCurrentWorkspace, workspaceStore } from '$lib/stores/workspace.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	let order = $state(Object.keys(resumeData.sections));
	async function moveUp(i: number) {
		if (i <= 1) return; // 0 is personal so locked
		[resumeData.sections_order[i - 1], resumeData.sections_order[i]] = [
			resumeData.sections_order[i],
			resumeData.sections_order[i - 1]
		];

		await saveCurrentWorkspace();
	}

	async function moveDown(i: number) {
		if (i === resumeData.sections_order.length - 1) return;
		[resumeData.sections_order[i + 1], resumeData.sections_order[i]] = [
			resumeData.sections_order[i],
			resumeData.sections_order[i + 1]
		];
		await saveCurrentWorkspace();
	}
	console.log(resumeData.sections_order);
</script>

{#if workspaceStore.ready}
	{#each resumeData.sections_order as key, i (key)}
		{@const section = resumeData.sections[key]}
		<div class="flex items-center gap-2 rounded-md px-2 py-1">
			<VisibilityToggle
				visible={!section.hidden}
				onchange={async (v) => {
					section.hidden = !v;
					await saveCurrentWorkspace();
				}}
			/>
			<span class="flex-1 text-sm font-medium">{section.title}</span>
			{#if key !== 'personal'}
				<Button
					class={buttonVariants({ variant: 'ghost', size: 'sm', class: 'w-9 p-0' })}
					onclick={() => moveUp(i)}
					disabled={i === 1}
					aria-label="Move up"
				>
					<ArrowUpIcon class="h-4 w-4" />
				</Button>
				<Button
					class={buttonVariants({ variant: 'ghost', size: 'sm', class: 'w-9 p-0' })}
					onclick={() => moveDown(i)}
					disabled={i === order.length - 1}
					aria-label="Move down"
				>
					<ArrowDownIcon class="h-4 w-4" />
				</Button>
			{:else}
				<div class="w-8" />
				<div class="w-8" />
			{/if}
		</div>
	{/each}
{:else}
	<div class="space-y-1">
		<Skeleton class="h-12" />
		<Skeleton class="h-12" />
		<Skeleton class="h-12" />
		<Skeleton class="h-12" />
		<Skeleton class="h-12" />
		<Skeleton class="h-12" />
	</div>
{/if}
