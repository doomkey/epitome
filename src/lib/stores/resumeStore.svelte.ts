import { templates, fonts } from '$lib/functions/pdfGenerator';
import {
	createEdu,
	createExp,
	createProject,
	createCert,
	createExt,
	createRef
} from '$lib/functions/helpers';
import type { ResumeData } from '$lib/types';
import { sections } from '$lib/constant';

function createResumeData(prefill = false): ResumeData {
	return {
		personal: prefill
			? {
					fullName: '',
					title: 'Profession',
					email: 'mail@mail.mail',
					phone: '+00000000',
					location: 'Earth, Sol',
					linkedin: 'https://linkedin.com/in/user',
					github: 'https://github.com/user',
					website: 'https://coolsite.nice',
					summary: 'There are many variations of passages of Lorem Ipsum...'
				}
			: {
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
		education: prefill ? [createEdu(true), createEdu(true)] : [],
		experience: prefill ? [createExp(true), createExp(true), createExp(true)] : [],
		projects: prefill ? [createProject(true), createProject(true)] : [],
		certifications: prefill ? [createCert(true)] : [],
		skills: {
			categories: prefill
				? [
						{
							id: 1,
							category: 'Frontend',
							skills: ['SvelteKit', 'TypeScript', 'TailwindCSS']
						}
					]
				: [],
			merge: false
		},
		extcurricular: prefill ? [createExt(true)] : [],
		references: prefill ? [createRef(true)] : [],
		config: {
			font: fonts.TINOS.value,
			template: templates.DEFAULT.value
		},
		sections: {
			personal: { title: sections.personal.heading, hidden: false },
			certifications: { title: sections.certifications.heading, hidden: false },
			education: { title: sections.education.heading, hidden: false },
			experience: { title: sections.experience.heading, hidden: false },
			projects: { title: sections.projects.heading, hidden: false },
			skills: { title: sections.skills.heading, hidden: false },
			extcurricular: { title: sections.extcurricular.heading, hidden: false },
			references: { title: sections.references.heading, hidden: false }
		},
		sections_order: Object.keys(sections)
	};
}
export const defaultResumeData: ResumeData = $state(createResumeData(true));
export const resumeData: ResumeData = $state(defaultResumeData);
export { createResumeData };
