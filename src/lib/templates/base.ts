import type { ResumeData } from '$lib/types';

export const baseStyles = {
	name: { fontSize: 22, bold: true },
	jobTitle: { fontSize: 11, color: '#444444' },
	sectionHeader: { fontSize: 11, bold: true, color: '#1a1a1a' },
	entryTitle: { fontSize: 10, bold: true },
	entrySubtitle: { fontSize: 10, bold: true, color: '#333333' },
	period: { fontSize: 9, color: '#666666' },
	meta: { fontSize: 9, color: '#555555' },
	subtle: { fontSize: 9, color: '#888888' }
};

export const basePageConfig = {
	pageSize: 'A4',
	pageMargins: [40, 40, 40, 40]
};

export function baseDefaultStyle(font: string) {
	return { font: font || 'TINOS', fontSize: 10, lineHeight: 1.4 };
}

export function buildSections(data: ResumeData, builders: SectionBuilders) {
	return [
		builders.header(data),
		data.personal.summary && builders.summary?.(data),
		data.experience.length && builders.experience?.(data),
		data.education.length && builders.education?.(data),
		data.projects.length && builders.projects?.(data),
		data.skills.categories.length && builders.skills?.(data),
		data.certifications.length && builders.certifications?.(data)
	].filter(Boolean);
}

export type SectionBuilders = {
	header: (data: ResumeData) => object;
	summary?: (data: ResumeData) => object;
	experience?: (data: ResumeData) => object;
	education?: (data: ResumeData) => object;
	projects?: (data: ResumeData) => object;
	skills?: (data: ResumeData) => object;
	certifications?: (data: ResumeData) => object;
};
