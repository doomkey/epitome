<script>
	import * as Card from './ui/card';
	import * as Accordion from './ui/accordion';

	const faqs = [
		{
			q: 'Is Epitome really free?',
			a: 'Yes, completely. There is no subscription, no paywall, no credit card.'
		},
		{
			q: 'Do I need to create an account?',
			a: 'Nope. Epitome runs entirely in your browser.'
		},
		{
			q: 'Is my resume data private?',
			a: 'Your data never leaves your device. There is no server to send your data to.'
		},
		{
			q: 'Can I download my resume as PDF for free?',
			a: 'Yes, always free, no watermark or anything.'
		},
		{
			q: 'How do I do (X)',
			a: 'Please visit the documentation on detailed guide.'
		}
	];
</script>

<svelte:head>
	<script type="application/ld+json">
    {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": f.a
            }
        }))
    })}
	</script>
</svelte:head>
<section class="container my-4" id="faq">
	<Card.Root>
		<Card.Header>
			<h3 class="text-lg font-bold">Frequently Asked Questions</h3>
		</Card.Header>
		<Card.Content>
			<Accordion.Root class="w-full">
				{#each faqs as faq (faq.q)}
					<Accordion.Item value={faq.q}>
						<Accordion.Trigger class="font-medium">{faq.q}</Accordion.Trigger>
						<Accordion.Content class="text-sm text-muted-foreground">
							{faq.a}
						</Accordion.Content>
					</Accordion.Item>
				{/each}
			</Accordion.Root>
		</Card.Content>
	</Card.Root>
</section>
