<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { templates } from '$lib/functions/pdfGenerator';
	import { cn } from '$lib/utils.js';

	let {
		onSelect,
		starting
	}: {
		onSelect: (value: string) => void;
		starting: string;
	} = $props();
	const items = Object.values(templates);
	let selectedName = $derived(starting);

	function handleSelect(value: string) {
		selectedName = value;
		onSelect(value);
	}
</script>

<div class="grid w-full grid-cols-2 items-start gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
	{#each items as item}
		<button
			type="button"
			class="group relative w-full p-0 text-left transition-transform duration-200 focus:outline-none active:scale-95"
			onclick={() => handleSelect(item.value)}
			aria-pressed={selectedName === item.value}
		>
			<Card.Root
				class={cn(
					'm-0 overflow-hidden border-2 p-0 transition-all',
					selectedName === item.value
						? 'border-primary ring-2 ring-primary/20'
						: 'border-muted hover:border-muted-foreground/30'
				)}
			>
				<Card.Content class="relative m-0 flex flex-col p-0">
					<div class="w-full bg-muted leading-[0]">
						<img
							src={item.img}
							alt={item.name}
							class="block h-auto w-full transition-transform duration-300 group-hover:scale-105"
						/>
					</div>

					<div
						class={cn(
							'absolute inset-0 flex items-center justify-center p-4 transition-opacity duration-300',
							'bg-black/40 group-hover:bg-black/60',
							selectedName === item.value ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
						)}
					>
						<span
							class="text-center text-sm font-bold tracking-widest text-white uppercase drop-shadow-lg"
						>
							{item.name}
						</span>
					</div>
				</Card.Content>
			</Card.Root>
		</button>
	{/each}
</div>
