<script lang="ts">
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
	const {
		meta: { title, description, date },
		content,
		slug
	} = $derived(data);
	let PostContent = $derived(content);
	const author = 'Epitome Team';
</script>

<svelte:head>
	<title>{title} - Epitome Blog</title>
	<meta name="description" content={description} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content="{title} - Epitome Blog" />
	<meta property="og:url" content="https://doomkey.github.io/epitome/blog/{slug}" />
	<meta property="og:description" content={description} />
</svelte:head>

<main class="container mt-4 mb-12">
	<header
		class="mb-16 grid grid-cols-1 gap-8 rounded-2xl bg-accent p-6 text-accent-foreground md:grid-cols-[1fr,minmax(320px,auto)] md:gap-12 md:p-10"
	>
		<div class="order-1 flex h-full flex-col justify-between space-y-6 md:order-2">
			<div class="space-y-5">
				<div class="flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
					<!-- {topic} -->
				</div>

				<h1
					class="border-b border-stone-950/10 pb-2 font-serif text-5xl leading-[0.95] font-extrabold
                    tracking-tight md:text-6xl"
				>
					{title}
				</h1>

				<p class="font-lightmd:text-2xl text-xl leading-snug">
					{description}
				</p>
			</div>

			<div class="flex items-center gap-4 border-t pt-8">
				<div class="flex flex-col">
					<span class="text-sm font-bold">by {author}</span>
					<time class="text-sm" datetime={date}>{date}</time>
				</div>
			</div>
		</div>

		<div
			class="order-2 flex aspect-video items-center justify-center rounded-xl bg-black/5 p-8 md:order-1 md:aspect-auto"
		>
			<span class="font-serif text-[180px] leading-none font-black text-stone-950/10">E</span>
		</div>
	</header>

	<article class="mx-auto prose max-w-md dark:prose-invert">
		<PostContent />
	</article>
</main>
