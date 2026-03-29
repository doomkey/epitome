function snapshotImg() {
	return cy
		.get('img[alt^="Preview"]')
		.should(($img) => {
			const img = $img[0] as HTMLImageElement;
			expect(img.naturalWidth).to.be.greaterThan(0);
			expect(img.complete).to.be.true; // Check if the browser finished loading
		})
		.then(($img) => {
			const img = $img[0] as HTMLImageElement;
			const canvas = document.createElement('canvas');
			canvas.width = img.naturalWidth;
			canvas.height = img.naturalHeight;
			const ctx = canvas.getContext('2d');
			if (ctx) {
				ctx.drawImage(img, 0, 0);
			}
			return canvas.toDataURL();
		});
}
describe('Epitome preview test', () => {
	beforeEach(() => {
		cy.visit('http://localhost:5173/generate', {
			timeout: 60000
		});
	});

	it('renders the preview', () => {
		cy.get('[data-pane-id]')
			.find('img')
			.should('have.attr', 'src')
			.and('match', /^blob:/);
	});

	it('input changes the preview', function () {
		cy.get('img[alt^="Preview"]').then(($img) => {
			$img[0].addEventListener('load', cy.stub().as('imgReloaded'));
		});

		cy.get('#bits-s16 input[placeholder="Your Name"]').click().type('Hello{enter}');

		cy.get('@imgReloaded').should('have.been.called');
		cy.get('#bits-s16 div.border').click();
	});

	it('tab change', function () {
		cy.get('#sections-tab').realClick();
		cy.contains('[role="option"]', 'Education').click();
		cy.get('.\@container\/card-header > .leading-none > .flex > p').should(
			'contain.text',
			'Skills'
		);
	});
});
