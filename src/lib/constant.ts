export const sections = {
	personal: {
		title: 'Personal',
		value: 'personal',
		heading: 'Personal Information',
		subtitle: 'Basic details that appear at the top of your resume.'
	},
	education: {
		title: 'Education',
		value: 'edu',
		heading: 'Education',
		subtitle: 'Add your academic qualifications and degrees.'
	},
	experience: {
		title: 'Experience',
		value: 'exp',
		heading: 'Work Experience',
		subtitle: 'List your work history, starting with the most recent.'
	},
	projects: {
		title: 'Projects',
		value: 'proj',
		heading: 'Projects',
		subtitle: 'Highlight personal or professional projects you have built.'
	},
	skills: {
		title: 'Skills',
		value: 'sk',
		heading: 'Skills',
		subtitle: 'Group your skills by category or merge them into a single list.'
	},
	certifications: {
		title: 'Certifications',
		value: 'cert',
		heading: 'Certifications',
		subtitle: 'Add any certifications or credentials you have earned.'
	},
	extcurricular: {
		title: 'Extracurricular Activities',
		value: 'ext',
		heading: 'Extracurricular Activities',
		subtitle: "List the extracurricular activities you've done"
	},
	references: {
		title: 'References',
		value: 'ref',
		heading: 'References',
		subtitle: 'Add the references/endorsements of yourself'
	}
} as const;

export type SectionKey = keyof typeof sections;
export type Section = (typeof sections)[SectionKey];
