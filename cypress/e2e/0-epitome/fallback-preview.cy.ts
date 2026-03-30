describe('ResumePreview fallback rendering', () => {
	beforeEach(() => {
		cy.visit('http://localhost:5173/generate', { timeout: 60000 });
	});

	it('renders canvas-based preview normally', () => {
		// Baseline: normal path still works
		cy.get('img[alt^="Preview"]')
			.should('have.attr', 'src')
			.and('match', /^blob:/);
	});

	it('falls back to iframe when canvas is unavailable', () => {
		cy.visit('http://localhost:5173/generate', {
			timeout: 60000,
			onBeforeLoad(win) {
				// Stub createElement to intercept canvas creation
				const originalCreateElement = win.document.createElement.bind(win.document);
				cy.stub(win.document, 'createElement').callsFake((tag: string) => {
					if (tag === 'canvas') {
						// Return a canvas-shaped object with no 2D context
						const fake = originalCreateElement('div');
						(fake as any).getContext = () => null;
						(fake as any).toBlob = () => {};
						(fake as any).width = 0;
						(fake as any).height = 0;
						return fake;
					}
					return originalCreateElement(tag);
				});

				// Ensure browser reports PDF support so we hit iframe, not unsupported
				Object.defineProperty(win.navigator, 'pdfViewerEnabled', {
					get: () => true,
					configurable: true
				});
			}
		});

		cy.get('iframe[title="Resume PDF Preview"]')
			.should('exist')
			.and('have.attr', 'src')
			.and('match', /^blob:/);
	});

	it('shows unsupported message when canvas and PDF viewer are both unavailable', () => {
		cy.visit('http://localhost:5173/generate', {
			timeout: 60000,
			onBeforeLoad(win) {
				const originalCreateElement = win.document.createElement.bind(win.document);
				cy.stub(win.document, 'createElement').callsFake((tag: string) => {
					if (tag === 'canvas') {
						const fake = originalCreateElement('div');
						(fake as any).getContext = () => null;
						(fake as any).toBlob = () => {};
						(fake as any).width = 0;
						(fake as any).height = 0;
						return fake;
					}
					return originalCreateElement(tag);
				});

				Object.defineProperty(win.navigator, 'pdfViewerEnabled', {
					get: () => false,
					configurable: true
				});

				Object.defineProperty(win.navigator, 'mimeTypes', {
					get: () => ({ namedItem: () => null }),
					configurable: true
				});
			}
		});

		cy.contains("Your browser isn't supported").should('be.visible');
		cy.contains('button', 'Download PDF').should('be.visible');
	});
});
