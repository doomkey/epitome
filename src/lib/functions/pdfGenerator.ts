import { registerTemplate, generatePdf } from '$lib/functions/pdfEngine.svelte';
import type { ResumeData } from '$lib/types';
import { defaultTemplate } from '$lib/templates/DEFAULT';
import { classicTemplate } from '$lib/templates/CLASSIC';
import { waterfallTemplate } from '$lib/templates/WATERFALL';

export const templates = {
	DEFAULT: { name: 'Default', value: 'DEFAULT' },
	CLASSIC: { name: 'Classic', value: 'CLASSIC' },
	WATERFALL: { name: 'Waterfall', value: 'WATERFALL' }
};
export const fonts = {
	TINOS: {
		name: 'Tinos',
		value: 'TINOS'
	}
	// ROBOTO: {
	// 	name: 'Roboto',
	// 	value: 'ROBOTO'
	// },
	// EB_GARAMOND: {
	// 	name: 'EB Garamond',
	// 	value: 'EBGARAMOND'
	// },
	// UBUNTU: {
	// 	name: 'Ubuntu',
	// 	value: 'UBUNTU'
	// }
};

registerTemplate(templates.DEFAULT.value, defaultTemplate);
registerTemplate(templates.CLASSIC.value, classicTemplate);
registerTemplate(templates.WATERFALL.value, waterfallTemplate);

export function createPDFDocument(data: ResumeData) {
	return generatePdf(data);
}
