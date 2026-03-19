import type { CoverState } from '$lib/types';

export const pt = (mm: number) => mm * 2.83465;
export const ptY = (mm: number, fontSize: number = 12) => pt(mm - fontSize * 0.25);

export const getVal = (field: { value: string; placeholder: string }) =>
	field.value.trim() !== '' ? field.value : field.placeholder;

export type PdfTemplateFunction = (state: CoverState, font: string) => any;
