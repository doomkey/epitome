import type { ResumeData } from '$lib/types';
import type { PdfTemplateFunction } from './helpers';

const templates: Record<string, PdfTemplateFunction> = {};
import type pdfMakeType from 'pdfmake/build/pdfmake';

export const pdfEngineState = $state({ ready: false });
// let pdfMake: typeof pdfMakeType | null = null;
let pdfMakePromise: Promise<typeof pdfMakeType> | null = null;
export async function getPdfMake() {
	if (!pdfMakePromise) {
		pdfMakePromise = (async () => {
			const [{ default: pm }, vfs] = await Promise.all([
				import('pdfmake/build/pdfmake'),
				import('$lib/assets/fonts/vfs_fonts')
			]);
			(pm as any).vfs = vfs;
			pm.addFonts({
				TINOS: {
					normal: 'Tinos-Regular.ttf',
					bold: 'Tinos-Bold.ttf',
					italics: 'Tinos-Italic.ttf',
					bolditalics: 'Tinos-BoldItalic.ttf'
				}
			});
			pdfEngineState.ready = true;
			return pm;
		})();
	}
	return pdfMakePromise;
}

export function preloadPdfMake() {
	getPdfMake();
}

export function registerTemplate(name: string, templateFn: PdfTemplateFunction) {
	templates[name] = templateFn;
}

export async function generatePdf(data: ResumeData) {
	const pm = await getPdfMake();

	// for prod env
	const vfs = await import('$lib/assets/fonts/vfs_fonts');
	(pm as any).vfs = vfs;

	const template = templates[data.config.template];
	if (!template) throw new Error('Template not found.');
	const docDefinition = template(data, data.config.font);
	return pm.createPdf(docDefinition as any);
}
