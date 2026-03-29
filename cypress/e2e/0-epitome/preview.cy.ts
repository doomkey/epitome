function snapshotImg() {
	return cy.get('img[alt^="Preview"]').then(($img) => {
		const img = $img[0];
		const canvas = document.createElement('canvas');
		canvas.width = img.naturalWidth;
		canvas.height = img.naturalHeight;
		canvas.getContext('2d')!.drawImage(img, 0, 0);
		return canvas.toDataURL();
	});
}
describe('Epitome preview test', () => {
	beforeEach(() => {
		cy.visit('https://doomkey.github.io/epitome/generate', {
			timeout: 60000
		});
	});

	it('renders the preview', () => {
		cy.get('[data-pane-id]', { timeout: 900000 })
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

	it('page size change reflects in the preview', function () {
		snapshotImg().as('snap1');

		cy.get('#bits-c128').click();
		cy.get('#bits-c134').click();
		cy.wait(2000);

		snapshotImg().then(function (newSnap) {
			expect(newSnap).not.to.equal(this.snap1);
		});

		snapshotImg().as('snap2');

		cy.get('#bits-c128').click();
		cy.get('#bits-c144').click();
		cy.wait(2000);

		snapshotImg().then(function (newSnap) {
			expect(newSnap).not.to.equal(this.snap2);
		});
	});

	it('tab change', function () {
		cy.get('#bits-s14').click();
		cy.get('#bits-c138').click();
		cy.get('#bits-s112 > .gap-6 > .\@container\/card-header > .leading-none > .flex > p').should(
			'contain.text',
			'Skill'
		);
	});
});
