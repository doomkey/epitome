import { templates, fonts } from '$lib/functions/pdfGenerator';
import { createEdu, createExp, createProject, createCert } from '$lib/functions/helpers';
import type { ResumeData } from '$lib/types';
import { sections } from '$lib/constant';

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
	},
	sections: {
		personal: {
			title: sections.personal.heading,
			hidden: false
		},
		certifications: {
			title: sections.certifications.heading,
			hidden: false
		},
		education: {
			title: sections.education.heading,
			hidden: false
		},
		experience: {
			title: sections.experience.heading,
			hidden: false
		},
		projects: {
			title: sections.projects.heading,
			hidden: false
		},
		skills: {
			title: sections.skills.heading,
			hidden: false
		}
	},
	sections_order: Object.keys(sections)
});
export const resumeData: ResumeData = $state(JSON.parse(JSON.stringify(defaultResumeData)));
