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

export const paperSizes = {
	a4: { label: 'A4', value: 'A4' },
	letter: { label: 'Letter', value: 'LETTER' },
	legal: { label: 'Legal', value: 'LEGAL' },
	a3: { label: 'A3', value: 'A3' }
} as const;

export const workspaceBehaviors = {
	COPY: { label: 'Copy existing workspace', value: 'copy' },
	FRESH: { label: 'Start fresh', value: 'fresh' }
} as const;

export const margins = {
	narrow: { label: 'Narrow', value: [20, 20, 20, 20] },
	normal: { label: 'Normal', value: [40, 40, 40, 40] },
	wide: { label: 'Wide', value: [60, 60, 60, 60] },
	custom: { label: 'Custom', value: [0, 0, 0, 0] }
} as const;

export type PaperSizeOption = (typeof paperSizes)[keyof typeof paperSizes];

export type WorkspaceBehaviorOption = (typeof workspaceBehaviors)[keyof typeof workspaceBehaviors];
export type MarginOption = (typeof margins)[keyof typeof margins];
