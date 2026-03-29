import pdfMake from 'pdfmake/build/pdfmake';
import * as vfs from '$lib/assets/fonts/vfs_fonts';
import type { ResumeData } from '$lib/types';
import type { PdfTemplateFunction } from './helpers';

(pdfMake as any).vfs = vfs;
pdfMake.addFonts({
	TINOS: {
		normal: 'Tinos-Regular.ttf',
		bold: 'Tinos-Bold.ttf',
		italics: 'Tinos-Italic.ttf',
		bolditalics: 'Tinos-BoldItalic.ttf'
	}
});

const templates: Record<string, PdfTemplateFunction> = {};

export function registerTemplate(name: string, templateFn: PdfTemplateFunction) {
	templates[name] = templateFn;
}

export function generatePdf(data: ResumeData) {
	const template = templates[data.config.template];
	if (!template) throw new Error(`Template not found.`);

	const docDefinition = template(data, data.config.font);

	return pdfMake.createPdf(docDefinition as any);
}
