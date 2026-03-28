<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import { decompressResume } from '$lib/db/sharelink';
	import Preview from '$lib/components/Preview.svelte';
	import type { ResumeData } from '$lib/types';
	import { resolve } from '$app/paths';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';

	let { data, form }: PageProps = $props();
	let d = $state<ResumeData | null>(null);
	let isLoading = $state(true);
	let errorMessage = $state<string | null>(null);
	onMount(async () => {
		if (!browser) return;
		isLoading = true;
		errorMessage = null;
		try {
			const query = page.url.searchParams.get('q');
			if (!query) throw new Error('No resume data found in the URL.');

			d = (await decompressResume(query)) as ResumeData;
		} catch (e) {
			console.error(e);
			errorMessage = 'Failed to load resume. The link might be invalid.';
		} finally {
			isLoading = false;
		}
	});
</script>

{#if isLoading}
	<main class="container h-dvh">
		<div class="-z-1 h-full w-full">
			<div class="space-y-2">
				<p class="text-lg">Preview Loading...</p>
				{#each { length: 32 } as _}
					<Skeleton class="h-4 w-full" />
				{/each}
			</div>
		</div>
	</main>
{:else if errorMessage}
	<main class="container h-dvh">
		<div class="mx-auto flex h-full max-w-md flex-col justify-center space-y-4">
			<h2 class="text-4xl">Oops! Something went wrong</h2>
			<p>{errorMessage}</p>
			<Button href={resolve('/')}>Go Back Home</Button>
		</div>
	</main>
{:else if d}
	<Preview data={d} isShared={true} />
{/if}
