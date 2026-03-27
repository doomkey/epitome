<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Label } from '$lib/components/ui/label';

	import { settingsStore } from '$lib/stores/settings.svelte';
	import { margins, paperSizes, workspaceBehaviors } from '$lib/constant';
	import { Input } from './ui/input';

	const PAPERS = Object.values(paperSizes);
	const BEHAVIORS = Object.values(workspaceBehaviors);
	const MARGINS = Object.values(margins);

	const isCustomMargin = $derived(settingsStore.current.margin === margins.custom.value.toString());
	let customMargin = $state([27, 28, 28, 28]);
	let marginLabels = ['Top Left', 'Top Right', 'Bottom Left', 'Bottom Right'];
	$effect(() => {
		console.log(isCustomMargin);
	});
</script>

<div class="flex flex-col gap-8">
	<div class="flex flex-col gap-4">
		<div class="flex flex-col justify-between gap-2 md:flex-row md:items-center">
			<div>
				<Label class="text-sm font-medium">Paper Size</Label>
				<p class="text-xs text-muted-foreground">Used when generating the PDF.</p>
			</div>
			<Select.Root
				type="single"
				value={settingsStore.current.paperSize}
				onValueChange={(v) => settingsStore.update('paperSize', v)}
			>
				<Select.Trigger class="w-52">
					{PAPERS.find((p) => p.value === settingsStore.current.paperSize)?.label}
				</Select.Trigger>
				<Select.Content>
					{#each PAPERS as size (size.value)}
						<Select.Item value={size.value}>{size.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	</div>
	<div class="flex flex-col gap-4">
		<div class="flex flex-col justify-between gap-2 md:flex-row md:items-center">
			<div>
				<Label class="text-sm font-medium">Margin</Label>
				<p class="text-xs text-muted-foreground">Select a margin for your resume.</p>
			</div>
			<Select.Root
				type="single"
				value={settingsStore.current.margin.toString()}
				onValueChange={(v) => settingsStore.update('margin', v)}
			>
				<Select.Trigger class="w-52">
					{MARGINS.find((p) => p.value.toString() === settingsStore.current.margin.toString())
						?.label}
				</Select.Trigger>
				<Select.Content>
					{#each MARGINS as margin (margin.value)}
						<Select.Item value={margin.value.toString()}>{margin.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
		{#if isCustomMargin}
			<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
				{#each customMargin as c, i (i)}
					<Field.Field>
						<p class="text-xs text-muted-foreground">{marginLabels[i]}</p>
						<Input placeholder={i.toString()} bind:value={customMargin[i]} type="number" />
					</Field.Field>
				{/each}
			</div>
		{/if}
	</div>
	<div class="flex flex-col gap-4">
		<div class="flex flex-col justify-between gap-2 md:flex-row md:items-center">
			<div>
				<Label class="text-sm font-medium">New Workspace</Label>
				<p class="text-xs text-muted-foreground">What happens when you create a new workspace.</p>
			</div>
			<Select.Root
				type="single"
				value={settingsStore.current.newWorkspaceBehavior}
				onValueChange={(v) => settingsStore.update('newWorkspaceBehavior', v)}
			>
				<Select.Trigger class="w-52">
					{BEHAVIORS.find((p) => p.value === settingsStore.current.newWorkspaceBehavior)?.label}
				</Select.Trigger>
				<Select.Content>
					{#each BEHAVIORS as behavior (behavior.value)}
						<Select.Item value={behavior.value}>{behavior.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	</div>
</div>
