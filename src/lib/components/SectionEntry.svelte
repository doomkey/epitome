<script lang="ts">
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import ChevronUpIcon from '@lucide/svelte/icons/chevron-up';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Separator } from '$lib/components/ui/separator';

	let {
		title,
		index,
		total,
		onMoveUp,
		onMoveDown,
		onRemove,
		children
	}: {
		title: string;
		index: number;
		total: number;
		onMoveUp: () => void;
		onMoveDown: () => void;
		onRemove: () => void;
		children: import('svelte').Snippet;
	} = $props();
</script>

<Collapsible.Root class="space-y-2">
	<div class="flex items-center justify-between space-x-4">
		<div class="flex items-center">
			<Collapsible.Trigger
				class={buttonVariants({ variant: 'ghost', size: 'sm', class: 'w-9 p-0' })}
			>
				<ChevronsUpDownIcon />
				<span class="sr-only">Toggle</span>
			</Collapsible.Trigger>
			<h4 class="text-sm font-semibold">{title}</h4>
		</div>

		<div class="flex items-center gap-1">
			<Button
				class={buttonVariants({ variant: 'ghost', size: 'sm', class: 'w-9 p-0' })}
				onclick={onMoveUp}
				disabled={index === 0}
				aria-label="Move up"
			>
				<ChevronUpIcon />
			</Button>

			<Button
				class={buttonVariants({ variant: 'ghost', size: 'sm', class: 'w-9 p-0' })}
				onclick={onMoveDown}
				disabled={index === total - 1}
				aria-label="Move down"
			>
				<ChevronDownIcon />
			</Button>

			<Button
				class={buttonVariants({ variant: 'destructive', size: 'sm', class: 'w-9 p-0' })}
				onclick={onRemove}
				aria-label="Remove entry"
			>
				<Trash2Icon />
			</Button>
		</div>
	</div>

	<Collapsible.Content class="space-y-2">
		{@render children()}
	</Collapsible.Content>
</Collapsible.Root>
<Separator class="my-4" />
