<script lang="ts">
	let { children } = $props();
</script>

<div class="container mx-auto flex max-w-5xl gap-10 px-4 py-10">
	<aside class="w-48 shrink-0">
		<!-- nav links -->
	</aside>
	<article class="prose prose-neutral dark:prose-invert max-w-none flex-1">
		{@render children()}
	</article>
</div>
