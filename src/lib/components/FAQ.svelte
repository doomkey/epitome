<script>
	import * as Card from './ui/card';
	import * as Accordion from './ui/accordion';
</script>

<section class="container mx-auto">
	<Card.Root>
		<Card.Header>
			<h3 class="text-lg font-bold">FAQ</h3>
		</Card.Header>
		<Card.Content>
			<Accordion.Root class="w-full">
				<Accordion.Item value="how-to-use">
					<Accordion.Trigger class="font-medium">How to use this?</Accordion.Trigger>
					<Accordion.Content class="text-sm text-muted-foreground">
						Just fill in the input boxes. The preview updates automatically.
					</Accordion.Content>
				</Accordion.Item>

				<Accordion.Item value="hide-fields">
					<Accordion.Trigger class="font-medium">Can I hide fields?</Accordion.Trigger>
					<Accordion.Content class="text-sm text-muted-foreground">
						Yes, use the toggle switches next to each input to hide specific data.
					</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
		</Card.Content>
	</Card.Root>
</section>
