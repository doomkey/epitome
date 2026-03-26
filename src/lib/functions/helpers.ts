import type { ResumeData } from '$lib/types';

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
		jobTitle: prefill ? 'Software Engineer' : '',
		company: prefill ? 'Company Corp' : '',
		location: prefill ? 'Earth' : '',
		start: prefill ? 'Jan 1984' : '',
		end: prefill ? 'Dec 2029' : '',
		present: false,
		responsibilities: prefill
			? 'Led a team of 5 engineers to deliver a product. \n Made many user happy.'
			: ''
	};
}
export function createExt(prefill = false) {
	return {
		id: Math.floor(Math.random() * 1000),
		role: prefill ? 'Volunteer' : '',
		org: prefill ? 'Some Org' : '',
		start: prefill ? 'May 1900' : '',
		end: prefill ? 'Dec 2100' : '',
		present: false,
		responsibilities: prefill
			? 'Helped penguins to cross mountains \nRefroze 120 tonnes of glaciers.'
			: ''
	};
}
export function createRef(prefill = false) {
	return {
		id: Math.floor(Math.random() * 1000),
		name: prefill ? 'Dr. X' : '',
		designation: prefill ? 'Professor' : '',
		dept: prefill ? 'Dept. of X' : '',
		org: prefill ? 'University of X' : '',
		phone: prefill ? '+000000' : '',
		email: prefill ? 'mail@mail.mail' : ''
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
		name: prefill ? 'Certified Human' : '',
		organization: prefill ? 'Some Orgnization' : '',
		url: prefill ? 'https://some.org/certification' : ''
	};
}

export function createSkillCategory(prefill = false) {
	return {
		id: Math.floor(Math.random() * 1000),
		category: prefill ? 'Frontend' : 'New Category',
		skills: prefill ? ['SvelteKit', 'TypeScript', 'TailwindCSS'] : ([] as string[])
	};
}
export function getFormattedDate(date: string) {
	return new Date(date).toLocaleDateString('en-US', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
}

export function getPlaceholder(src: string) {
	if (!src) return;
	const parts = src.split('/');
	const filename = parts.pop();
	const extension = filename.split('.').pop();
	const placeholderFilename = filename.replace('.' + extension, '_placeholder.' + extension);
	parts.push(placeholderFilename);
	return parts.join('/');
}
