import { registerTemplate, generatePdf } from '$lib/functions/pdfEngine';
import { hotashaCoverTemplate } from '$lib/templates/hotasha';
import { omanishaCoverTemplate } from '$lib/templates/omanisha';
import { omabossaCoverTemplate } from '$lib/templates/omabossha';
import type { CoverState, ResumeData } from '$lib/types';
import omanisha from '$lib/assets/template_thumbs/omanisha.png';
import ordhochondro from '$lib/assets/template_thumbs/ordhochondro.png';
import omabossa from '$lib/assets/template_thumbs/omabossa.png';
import { defaultTemplate } from '$lib/templates/default';
export const templates = {
	OMANISHA: {
		name: 'Omanisha',
		value: 'OMANISHA',
		img: omanisha
	},
	ORDHOCHONDRO: { name: 'Ordhochondro', value: 'ORDHOCHONDRO', img: ordhochondro },
	OMABOSSA: { name: 'Omabossa', value: 'OMABOSSA', img: omabossa },
	DEFAULT: { name: 'Default', value: 'DEFAULT', img: omabossa }
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

export function createPDFDocument(
	template = templates.DEFAULT.value,
	data: ResumeData,
	font = fonts.ROBOTO.value
) {
	return generatePdf(template, data, font);
}
