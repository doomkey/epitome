import { templates, fonts } from '$lib/functions/pdfGenerator';
import { createEdu, createExp, createProject, createCert } from '$lib/functions/helpers';
import type { ResumeData } from '$lib/types';
import { sections } from '$lib/constant';

export const defaultResumeData: ResumeData = $state({
	personal: {
		fullName: '',
		title: 'Engineer',
		email: 'mail@mail.mail',
		phone: '+00000000',
		location: 'Earth, Sol',
		linkedin: 'https://linkedin.com/in/user',
		github: 'https://github.com/user',
		website: 'https://coolsite.nice',
		summary:
			'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isnt anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.'
	},
	education: [createEdu(true), createEdu(true)],
	experience: [createExp(true), createExp(true), createExp(true)],
	projects: [createProject(true), createProject(true)],
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
