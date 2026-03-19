import { createEdu, createExp, createProject, createCert } from '$lib/functions/helpers';

export const resumeData = $state({
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
	}
});
