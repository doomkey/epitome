import type { CoverState, ResumeData } from '$lib/types';

export const pt = (mm: number) => mm * 2.83465;
export const ptY = (mm: number, fontSize: number = 12) => pt(mm - fontSize * 0.25);

export const getVal = (field: { value: string; placeholder: string }) =>
	field.value.trim() !== '' ? field.value : field.placeholder;

export type PdfTemplateFunction = (data: ResumeData, font: string) => any;
export function moveItem<T>(arr: T[], index: number, direction: 'up' | 'down'): T[] {
	const target = direction === 'up' ? index - 1 : index + 1;
	if (target < 0 || target >= arr.length) return arr;
	const updated = [...arr];
	[updated[index], updated[target]] = [updated[target], updated[index]];
	return updated;
}

export function removeItem<T extends { id: number }>(arr: T[], id: number): T[] {
	return arr.filter((item) => item.id !== id);
}
export function createEdu(prefill = false) {
	return {
		id: Math.floor(Math.random() * 1000),
		degree: prefill ? 'Bachelor of X in Y' : '',
		institution: prefill ? 'Uni of A' : '',
		start: prefill ? 'Jan 1984' : '',
		end: prefill ? 'Dec 2000' : '',
		location: prefill ? '000 Street, City, Country' : '',
		gpa: prefill ? 'GPA' : ''
	};
}

export function createExp(prefill = false) {
	return {
		id: Math.floor(Math.random() * 1000),
		jobTitle: prefill ? 'Senior Software Engineer' : '',
		company: prefill ? 'Acme Corp' : '',
		location: prefill ? 'Dhaka, Bangladesh' : '',
		start: prefill ? 'Jan 2020' : '',
		end: prefill ? 'Dec 2023' : '',
		present: false,
		responsibilities: prefill ? 'Led a team of 5 engineers to deliver...' : ''
	};
}

export function createProject(prefill = false) {
	return {
		id: Math.floor(Math.random() * 1000),
		name: prefill ? 'My Awesome Project' : '',
		technologies: prefill ? 'SvelteKit, TypeScript, TailwindCSS' : '',
		link: prefill ? 'https://github.com/doomkey/project' : '',
		description: prefill ? 'A brief description of what the project does...' : ''
	};
}

export function createCert(prefill = false) {
	return {
		id: Math.floor(Math.random() * 1000),
		name: prefill ? 'AWS Certified Solutions Architect' : '',
		organization: prefill ? 'Amazon Web Services' : '',
		url: prefill ? 'https://aws.amazon.com/certification' : ''
	};
}

export function createSkillCategory(prefill = false) {
	return {
		id: Math.floor(Math.random() * 1000),
		category: prefill ? 'Frontend' : 'New Category',
		skills: prefill ? ['SvelteKit', 'TypeScript', 'TailwindCSS'] : ([] as string[])
	};
}
