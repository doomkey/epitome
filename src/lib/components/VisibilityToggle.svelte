<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import EyeIcon from '@lucide/svelte/icons/eye';
	import EyeOffIcon from '@lucide/svelte/icons/eye-off';

	let {
		visible = true,
		onchange
	}: {
		visible?: boolean;
		onchange: (visible: boolean) => void;
	} = $props();
</script>

<Button
	variant="ghost"
	size="icon"
	onclick={() => onchange(!visible)}
	aria-label={visible ? 'Hide' : 'Show'}
>
	{#if visible}
		<EyeIcon class="h-4 w-4" />
	{:else}
		<EyeOffIcon class="h-4 w-4" />
	{/if}
</Button>
