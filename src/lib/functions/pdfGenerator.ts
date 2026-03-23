import { registerTemplate, generatePdf } from '$lib/functions/pdfEngine';
import type { CoverState, ResumeData } from '$lib/types';
import omabossa from '$lib/assets/template_thumbs/omabossa.png';
import { defaultTemplate } from '$lib/templates/DEFAULT';
import { classicTemplate } from '$lib/templates/CLASSIC';
export const templates = {
	DEFAULT: { name: 'Default', value: 'DEFAULT', img: omabossa },
	CLASSIC: { name: 'Classic', value: 'CLASSIC', img: omabossa }
};
export const fonts = {
	TINOS: {
		name: 'Tinos (Times New Roman)',
		value: 'TINOS'
	},
	ROBOTO: {
		name: 'Roboto',
		value: 'ROBOTO'
	},
	EB_GARAMOND: {
		name: 'EB Garamond',
		value: 'EBGARAMOND'
	},
	JETBRAINSMONO: {
		name: 'JetBrains Mono',
		value: 'JETBRAINSMONO'
	}
};

registerTemplate(templates.DEFAULT.value, defaultTemplate);
registerTemplate(templates.CLASSIC.value, classicTemplate);

export function createPDFDocument(
	template = templates.DEFAULT.value,
	data: ResumeData,
	font = fonts.ROBOTO.value
) {
	return generatePdf(template, data, font);
}
