<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Label } from '$lib/components/ui/label';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	import { settingsStore } from '$lib/stores/settings.svelte';
	import { margins, paperSizes, workspaceBehaviors, marginUnits } from '$lib/constant';
	import { Input } from './ui/input';
	import { IN_TO_PT, MM_TO_PT } from '$lib/functions/helpers';
	import PaperSelect from './settings/PaperSelect.svelte';

	const PAPERS = Object.values(paperSizes);
	const BEHAVIORS = Object.values(workspaceBehaviors);
	const MARGINS = Object.values(margins);

	const isCustomMargin = $derived(settingsStore.current.marginLabel === margins.custom.label);
	let customMargin = $state(
		settingsStore.current.marginValue ? settingsStore.current.marginValue : [27, 28, 28, 28]
	);
	let marginLabels = ['Left', 'Top', 'Right', 'Bottom'];
	const MM_TO_INCH = 25.4;

	export const convertMargins = (
		values: [number, number, number, number],
		toUnit: 'mm' | 'inch'
	): [number, number, number, number] => {
		return values.map((v) => {
			const converted = toUnit === 'inch' ? v / MM_TO_INCH : v * MM_TO_INCH;
			return Number(converted.toFixed(2));
		}) as unknown as [number, number, number, number];
	};
	function handleInput(index: number, val: number) {
		const unit = settingsStore.current.marginUnit;

		const ptValue = unit === 'inch' ? val * IN_TO_PT : val * MM_TO_PT;

		customMargin[index] = Number(ptValue.toFixed(2));
		settingsStore.update('marginValue', [...customMargin]);
	}
</script>

<div class="flex flex-col gap-8">
	<div class="flex flex-col gap-4">
		<div class="flex flex-col justify-between gap-2 md:flex-row md:items-center">
			<div>
				<Label class="text-sm font-medium">Paper Size</Label>
				<p class="text-xs text-muted-foreground">Used when generating the PDF.</p>
			</div>
			<PaperSelect />
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
				value={settingsStore.current.marginLabel}
				onValueChange={(v) => {
					const selectedPreset = MARGINS.find((m) => m.label === v);

					if (selectedPreset) {
						settingsStore.update('marginLabel', selectedPreset.label);
						settingsStore.update('marginValue', [...selectedPreset.value]);
						customMargin = [...selectedPreset.value];
					}
				}}
			>
				<Select.Trigger class="w-52">
					{settingsStore.current.marginLabel ?? 'Custom'}
				</Select.Trigger>
				<Select.Content>
					{#each MARGINS as margin (margin.label)}
						<Select.Item value={margin.label}>{margin.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
		{#if isCustomMargin}
			<ToggleGroup.Root
				type="single"
				class="ml-auto"
				value={settingsStore.current.marginUnit}
				onValueChange={(v) => {
					settingsStore.update('marginUnit', v);
				}}
			>
				{#each marginUnits as m (m)}
					<ToggleGroup.Item
						value={m}
						aria-label="toggle {m}"
						disabled={m === settingsStore.current.marginUnit}>{m}</ToggleGroup.Item
					>
				{/each}
			</ToggleGroup.Root>
			<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
				{#each customMargin as c, i (i)}
					<Field.Field>
						<p class="text-xs text-muted-foreground">{marginLabels[i]}</p>
						<Input
							step={settingsStore.current.marginUnit === 'inch' ? '0.01' : '1'}
							placeholder={i.toString()}
							value={settingsStore.current.marginUnit === 'inch'
								? Number((c / IN_TO_PT).toFixed(2))
								: Number((c / MM_TO_PT).toFixed(2))}
							oninput={(e) => handleInput(i, Number(e.currentTarget.value))}
							type="number"
						/>
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
