import type { ResumeData } from '$lib/types';
import type { PdfTemplateFunction } from './helpers';

const templates: Record<string, PdfTemplateFunction> = {};
import type pdfMakeType from 'pdfmake/build/pdfmake';

let pdfMake: typeof pdfMakeType | null = null;

export async function getPdfMake() {
	if (pdfMake) return pdfMake;

	const [{ default: pm }, vfs] = await Promise.all([
		import('pdfmake/build/pdfmake'),
		import('$lib/assets/fonts/vfs_fonts')
	]);

	pdfMake = pm;
	(pdfMake as any).vfs = vfs;
	pdfMake.addFonts({
		TINOS: {
			normal: 'Tinos-Regular.ttf',
			bold: 'Tinos-Bold.ttf',
			italics: 'Tinos-Italic.ttf',
			bolditalics: 'Tinos-BoldItalic.ttf'
		}
	});

	return pdfMake;
}

export function preloadPdfMake() {
	getPdfMake();
}

export function registerTemplate(name: string, templateFn: PdfTemplateFunction) {
	templates[name] = templateFn;
}

export async function generatePdf(data: ResumeData) {
	const pm = await getPdfMake();
	const template = templates[data.config.template];
	if (!template) throw new Error('Template not found.');
	const docDefinition = template(data, data.config.font);
	return pm.createPdf(docDefinition as any);
}
