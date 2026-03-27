<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
	import FileQuestionIcon from '@lucide/svelte/icons/file-question-mark';
</script>

<div class="flex min-h-screen items-center justify-center bg-background p-4">
	<Card class="w-full max-w-md border-dashed text-center">
		<CardHeader>
			<div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
				<FileQuestionIcon class="h-10 w-10 text-muted-foreground" />
			</div>
			<CardTitle class="text-4xl font-extrabold tracking-tight lg:text-5xl">404</CardTitle>
			<p class="text-xl text-muted-foreground">Page not found</p>
		</CardHeader>

		<CardContent>
			<p class="text-sm leading-7 text-muted-foreground">
				Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or
				perhaps it never existed in the first place.
			</p>
		</CardContent>

		<CardFooter class="flex flex-col gap-2 sm:flex-row sm:justify-center">
			<Button href={resolve('/')} variant="default" class="w-full sm:w-auto">Back to Home</Button>

			<Button href={resolve('/docs')} variant="outline" class="w-full sm:w-auto"
				>Visit Documentation</Button
			>
		</CardFooter>
	</Card>
</div>
