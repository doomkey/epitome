import { templates, fonts } from '$lib/functions/pdfGenerator';
import { createEdu, createExp, createProject, createCert } from '$lib/functions/helpers';
import type { ResumeData } from '$lib/types';

export const defaultResumeData: ResumeData = $state({
	personal: {
		fullName: '',
		title: '',
		email: '',
		phone: '',
		location: '',
		linkedin: '',
		github: '',
		website: '',
		summary: ''
	},
	education: [createEdu(true)],
	experience: [createExp(true)],
	projects: [createProject(true)],
	certifications: [createCert(true)],
	skills: {
		categories: [
			{
				id: 1,
				category: 'Frontend',
				skills: ['SvelteKit', 'TypeScript', 'TailwindCSS']
			}
		],
		merge: false
	},
	config: {
		font: fonts.TINOS.value,
		template: templates.DEFAULT.value
	}
});
export const resumeData: ResumeData = $state(JSON.parse(JSON.stringify(defaultResumeData)));
