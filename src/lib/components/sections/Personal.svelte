<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Input } from '$lib/components/ui/input';
	import { sections } from '$lib/constant';
	import { resumeData } from '$lib/stores/resumeStore.svelte';
	import * as Card from '$lib/components/ui/card/index.js';

	let summaryLength = $state(0);
	const RECOMMENDED_LENGTH = 400;
	const isRecommendedExceeded = $derived(summaryLength > RECOMMENDED_LENGTH);
	// @ts-ignore
	function updateSummaryCount(e) {
		summaryLength = e.target.value.length;
	}
</script>

<Tabs.Content value={sections.personal.value}>
	<Card.Root>
		<Card.Header>
			<Card.Title>{resumeData.sections.personal.title}</Card.Title>
			<Card.Description>{sections.personal.subtitle}</Card.Description>
		</Card.Header>
		<Card.Content>
			<Field.Group>
				<Field.Set>
					<Field.Group>
						<Field.Field>
							<Field.Label>Full Name</Field.Label>
							<Input placeholder="Your Name" bind:value={resumeData.personal.fullName} required />
						</Field.Field>
					</Field.Group>
					<Field.Group>
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
							<Field.Field>
								<Field.Label>Professional Title</Field.Label>
								<Input
									placeholder="Software Developer"
									bind:value={resumeData.personal.title}
									required
								/>
							</Field.Field>
							<Field.Field>
								<Field.Label>Email</Field.Label>
								<Input
									placeholder="mail@mail.org"
									type="email"
									bind:value={resumeData.personal.email}
									required
								/>
							</Field.Field>
							<Field.Field>
								<Field.Label>Phone</Field.Label>
								<Input
									placeholder="+000 000 00000"
									type="tel"
									bind:value={resumeData.personal.phone}
								/>
							</Field.Field>
							<Field.Field class="lg:col-span-2">
								<Field.Label>Location</Field.Label>
								<Input
									placeholder="000 Street, City, Country"
									bind:value={resumeData.personal.location}
								/>
							</Field.Field>
							<Field.Field>
								<Field.Label>LinkedIn</Field.Label>
								<Input
									placeholder="https://linkedin.com/in/user"
									type="url"
									bind:value={resumeData.personal.linkedin}
								/>
							</Field.Field>
							<Field.Field>
								<Field.Label>GitHub</Field.Label>
								<Input
									placeholder="https://github.com/user"
									type="url"
									bind:value={resumeData.personal.github}
								/>
							</Field.Field>
							<Field.Field class="md:col-span-2">
								<Field.Label>Website</Field.Label>
								<Input
									placeholder="https://user.portfolio"
									type="url"
									bind:value={resumeData.personal.website}
								/>
							</Field.Field>
						</div>
					</Field.Group>
					<Field.Group>
						<Field.Field>
							<div class="flex justify-between">
								<Field.Label>Summary</Field.Label>
								<p
									class="text-xs"
									class:text-destructive={isRecommendedExceeded}
									class:text-muted-foreground={!isRecommendedExceeded}
								>
									{summaryLength} ch
								</p>
							</div>
							<Textarea
								placeholder="Write something describing yourself."
								bind:value={resumeData.personal.summary}
								oninput={updateSummaryCount}
							/>
							{#if isRecommendedExceeded}
								<p class="text-sm text-muted-foreground">
									It is recommended to keep the summary short.
								</p>
							{/if}
						</Field.Field>
					</Field.Group>
				</Field.Set>
			</Field.Group>
		</Card.Content>
	</Card.Root>
</Tabs.Content>
