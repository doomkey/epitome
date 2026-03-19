<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Input } from '$lib/components/ui/input';
	import { sections } from '$lib/constant';
	import { resumeData } from '$lib/stores/resumeStore.svelte';

	const personal = resumeData.personal;
</script>

<Tabs.Content value={sections.personal.value}>
	<Field.Group>
		<Field.Set>
			<Field.Group>
				<Field.Field>
					<Field.Label>Full Name</Field.Label>
					<Input placeholder="Your Name" bind:value={personal.fullName} required />
				</Field.Field>
			</Field.Group>
			<Field.Group>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					<Field.Field>
						<Field.Label>Professional Title</Field.Label>
						<Input placeholder="Software Developer" bind:value={personal.title} required />
					</Field.Field>
					<Field.Field>
						<Field.Label>Email</Field.Label>
						<Input placeholder="mail@mail.org" type="email" bind:value={personal.email} required />
					</Field.Field>
					<Field.Field>
						<Field.Label>Phone</Field.Label>
						<Input placeholder="+000 000 00000" type="tel" bind:value={personal.phone} />
					</Field.Field>
					<Field.Field class="lg:col-span-2">
						<Field.Label>Location</Field.Label>
						<Input placeholder="000 Street, City, Country" bind:value={personal.location} />
					</Field.Field>
					<Field.Field>
						<Field.Label>LinkedIn</Field.Label>
						<Input
							placeholder="https://linkedin.com/in/user"
							type="url"
							bind:value={personal.linkedin}
						/>
					</Field.Field>
					<Field.Field>
						<Field.Label>GitHub</Field.Label>
						<Input placeholder="https://github.com/user" type="url" bind:value={personal.github} />
					</Field.Field>
					<Field.Field class="md:col-span-2">
						<Field.Label>Website</Field.Label>
						<Input placeholder="https://user.portfolio" type="url" bind:value={personal.website} />
					</Field.Field>
				</div>
			</Field.Group>
			<Field.Group>
				<Field.Field>
					<Field.Label>Summary</Field.Label>
					<Textarea
						placeholder="Write something describing yourself."
						bind:value={personal.summary}
					/>
				</Field.Field>
			</Field.Group>
		</Field.Set>
	</Field.Group>
</Tabs.Content>
