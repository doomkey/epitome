describe('Epitome homepage', () => {
	beforeEach(() => {
		cy.visit('https://doomkey.github.io/epitome/');
	});

	it('has the correct title and hero text', () => {
		cy.contains('h1', 'Resume').should('be.visible');
		cy.contains('Free.').should('be.visible');
	});

	it('has working navigation links', () => {
		cy.get('nav').contains('Home').should('have.attr', 'href', '/epitome/');
		cy.get('nav').contains('Docs').should('have.attr', 'href', '/epitome/docs');
		cy.get('nav').contains('Blog').should('have.attr', 'href', '/epitome/blog');
	});

	it('has a working Generate Resume CTA', () => {
		cy.contains('a', 'Generate Resume').first().should('have.attr', 'href', '/epitome/generate');
	});

	it('shows the features section', () => {
		cy.get('#features').should('exist');
		cy.contains('Local First').should('be.visible');
		cy.contains('Multiple Templates').should('be.visible');
		cy.contains('Workspaces').should('be.visible');
		cy.contains('Backup & Restore').should('be.visible');
		cy.contains('Shareable Link').should('be.visible');
		cy.contains('Free Forever').should('be.visible');
	});

	it('shows the pricing section', () => {
		cy.get('#pricing').should('exist');
		cy.contains('Epitome').should('be.visible');
		cy.contains('$0').should('be.visible');
		cy.contains('Actually Free').should('be.visible');
	});

	it('pricing shows all epitome features', () => {
		cy.get('#pricing').within(() => {
			cy.contains('Download as PDF').should('be.visible');
			cy.contains('Unlimited resumes').should('be.visible');
			cy.contains('No watermark, ever').should('be.visible');
			cy.contains('Your data stays on your device').should('be.visible');
		});
	});

	it('FAQ section is present and interactive', () => {
		cy.contains('Frequently Asked Questions').should('be.visible');
		cy.contains('Is Epitome really free?').click();
		cy.contains('There is no subscription, no paywall, no credit card').should('be.visible');
	});

	it('has a dark mode toggle', () => {
		cy.get('[aria-label="Toggle dark mode"]').should('exist').click();
	});

	it('footer has correct links', () => {
		cy.get('footer').within(() => {
			cy.contains('GitHub')
				.should('have.attr', 'href')
				.and('include', 'github.com/doomkey/epitome');
			cy.contains('Terms of Service').should('have.attr', 'href', '/epitome/pages/legal/terms');
			cy.contains('Privacy Policy').should('have.attr', 'href', '/epitome/pages/legal/pp');
		});
	});

	it('navigates to generate page', () => {
		cy.contains('a', 'Generate Resume').first().click();
		cy.url().should('include', '/epitome/generate');
	});
});
