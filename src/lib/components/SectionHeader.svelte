<script>
	import Separator from '$lib/components/ui/separator/separator.svelte';

	let { title, description = '', id = '' } = $props();
</script>

<div class="mb-16 flex flex-col gap-6" {id}>
	<Separator />
	<div class="flex flex-wrap items-center justify-between gap-4">
		<h1
			class="font-[Playfair_Display,serif] text-[clamp(2rem,5vw,3.5rem)] leading-tight font-black text-foreground"
		>
			{title}
		</h1>
		<p class="max-w-sm text-sm leading-relaxed font-light text-muted-foreground">
			{description ? description : ''}
		</p>
	</div>
	<Separator />
</div>
