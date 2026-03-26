<script lang="ts">
	import { resolve } from '$app/paths';
	import SectionHeader from '$lib/components/SectionHeader.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';

	let { data } = $props();
	const { posts } = data;
</script>

<svelte:head>
	<title>Blog - Epitome</title>
	<meta
		name="description"
		content="Tips, guides and insights on resume writing, job hunting and career development."
	/>
</svelte:head>

<div class="container mx-auto max-w-5xl px-4 py-16">
	<SectionHeader
		title="Blog"
		description="Resume tips, career guides, and the occasional rant about paywalled PDF exports."
	/>

	{#if posts.length === 0}
		<p class="text-sm text-muted-foreground">No posts yet. Check back soon.</p>
	{:else}
		<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
			{#each posts as post (post.slug)}
				{@const href = `/blog/${post.slug}`}
				<a
					href={resolve(href)}
					class="group flex flex-col gap-0 border border-border transition-colors duration-200 hover:border-foreground"
				>
					<div class="relative aspect-video overflow-hidden bg-muted">
						{#if post.cover?.image}
							<img
								src={post.cover.placeholder}
								data-src={post.cover.image}
								alt={post.title}
								class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
								loading="lazy"
							/>
						{:else}
							<div class="flex h-full w-full items-center justify-center">
								<span class=" text-4xl font-black text-muted-foreground/20"> E </span>
							</div>
						{/if}
					</div>

					<div class="flex flex-1 flex-col gap-3 p-5">
						<div class="flex items-center justify-between gap-2">
							<!-- <Badge variant="secondary" class="text-xs">{post.layout ?? 'Article'}</Badge> -->
							<span class="text-xs text-muted-foreground">{post.date}</span>
						</div>
						<h2
							class="text-lg leading-snug font-bold text-foreground transition-colors group-hover:text-primary"
						>
							{post.title}
						</h2>
						{#if post.description}
							<p class="line-clamp-2 text-sm leading-relaxed font-light text-muted-foreground">
								{post.description}
							</p>
						{/if}
						<div
							class="mt-auto flex items-center gap-1 pt-2 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground"
						>
							Read more
							<span class="transition-transform duration-200 group-hover:translate-x-1">→</span>
						</div>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>
