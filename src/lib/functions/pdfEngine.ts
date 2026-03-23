import pdfMake from 'pdfmake/build/pdfmake';
//@ts-ignore
import * as vfs from '$lib/assets/fonts/vfs_fonts';
import type { CoverState, ResumeData } from '$lib/types';
import type { PdfTemplateFunction } from './helpers';

(pdfMake as any).vfs = vfs;
pdfMake.addFonts({
	TINOS: {
		normal: 'Tinos-Regular.ttf',
		bold: 'Tinos-Bold.ttf',
		italics: 'Tinos-Italic.ttf',
		bolditalics: 'Tinos-BoldItalic.ttf'
	},
	EBGARAMOND: {
		normal: 'EBGaramond-Regular.ttf',
		bold: 'EBGaramond-Bold.ttf',
		italics: 'EBGaramond-Italic.ttf',
		bolditalics: 'EBGaramond-BoldItalic.ttf'
	},
	JETBRAINSMONO: {
		normal: 'JetBrainsMono-Regular.ttf',
		bold: 'JetBrainsMono-Bold.ttf',
		italics: 'JetBrainsMono-Italic.ttf',
		bolditalics: 'JetBrainsMono-BoldItalic.ttf'
	},
	ROBOTO: {
		normal: 'Roboto-Regular.ttf',
		bold: 'Roboto-Bold.ttf',
		italics: 'Roboto-Italic.ttf',
		bolditalics: 'Roboto-BoldItalic.ttf'
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
