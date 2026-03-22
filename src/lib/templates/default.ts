import { pt } from '$lib/functions/helpers';
import type { ResumeData } from '$lib/types';

export const defaultTemplate = (data: ResumeData, font: string) => {
	return {
		pageSize: 'A4',
		pageMargins: [pt(20), pt(20), pt(20), pt(20)],
		defaultStyle: { font: font || 'TINOS', fontSize: 10, lineHeight: 1.4, characterSpacing: 0 },
		styles: {
			name: { fontSize: 18, bold: true },
			jobTitle: { fontSize: 11, color: '#444444' },

			sectionHeader: { fontSize: 11, bold: true, color: '#1a1a1a' },

			entryTitle: { fontSize: 10, bold: true },

			entrySubtitle: { fontSize: 10, bold: true, color: '#333333' },
			period: { fontSize: 9, color: '#666666' },
			meta: { fontSize: 9, color: '#555555' },
			subtle: { fontSize: 9, color: '#888888' }
		},
		content: [
			buildHeader(data),

			data.personal.summary &&
				buildSection('SUMMARY', [{ text: data.personal.summary, style: 'meta' }]),

			data.experience.length &&
				buildSection('WORK EXPERIENCE', data.experience.map(buildExperienceEntry)),

			data.education.length && buildSection('EDUCATION', data.education.map(buildEducationEntry)),

			data.projects.length && buildSection('PROJECTS', data.projects.map(buildProjectEntry)),

			data.skills.categories.length && buildSection('SKILLS', [buildSkills(data.skills)]),

			data.certifications.length &&
				buildSection('CERTIFICATIONS', data.certifications.map(buildCertEntry))
		].filter(Boolean)
	};
};

function buildHeader(data: ResumeData) {
	const { fullName, title, email, phone, location, linkedin, github, website } = data.personal;

	const contactParts = [email, phone, location, linkedin, github, website].filter(Boolean);

	return {
		stack: [
			{ text: fullName || 'Your Name', style: 'name', lineheight: 1 },
			title && { text: title, style: 'jobTitle', margin: [0, 2, 0, 2] },

			contactParts.length && {
				text: contactParts.join(' | '),
				style: 'meta',
				margin: [0, 2, 0, 0]
			}
		].filter(Boolean),
		margin: [0, 0, 0, pt(8)]
	};
}

function buildSection(title: string, entries: object[]) {
	return {
		stack: [
			{ text: title, style: 'sectionHeader' },
			{
				canvas: [
					{
						type: 'line',
						x1: 0,
						y1: 2,
						x2: pt(170),
						y2: 2,
						lineWidth: 0.5,
						lineColor: '#cccccc'
					}
				],
				margin: [0, 0, 0, pt(4)]
			},
			...entries
		],
		margin: [0, 0, 0, pt(8)]
	};
}

function buildExperienceEntry(exp: ResumeData['experience'][number]) {
	const period = exp.present
		? `${exp.start} – Present`
		: `${exp.start}${exp.end ? ` – ${exp.end}` : ''}`;

	return {
		stack: [
			{
				columns: [
					{ text: exp.jobTitle, style: 'entryTitle', width: '*' },
					{ text: period, style: 'period', alignment: 'right', width: 'auto' }
				]
			},

			{
				columns: [
					{ text: exp.company, style: 'entrySubtitle', width: '*' },
					exp.location && { text: exp.location, style: 'subtle', alignment: 'right', width: 'auto' }
				].filter(Boolean)
			},
			exp.responsibilities && {
				text: exp.responsibilities,
				style: 'meta',

				margin: [pt(4), pt(3), 0, 0]
			}
		].filter(Boolean),

		margin: [0, 0, 0, pt(6)]
	};
}

function buildEducationEntry(edu: ResumeData['education'][number]) {
	const period = `${edu.start}${edu.end ? ` – ${edu.end}` : ''}`;

	return {
		stack: [
			{
				columns: [
					{ text: edu.degree, style: 'entryTitle', width: '*' },
					{ text: period, style: 'period', alignment: 'right', width: 'auto' }
				]
			},

			{
				columns: [
					{ text: edu.institution, style: 'entrySubtitle', width: '*' },
					edu.location && { text: edu.location, style: 'subtle', alignment: 'right', width: 'auto' }
				].filter(Boolean)
			},
			edu.gpa && {
				text: `GPA: ${edu.gpa}`,
				style: 'subtle',
				margin: [0, 2, 0, 0]
			}
		].filter(Boolean),
		margin: [0, 0, 0, pt(6)]
	};
}

function buildProjectEntry(proj: ResumeData['projects'][number]) {
	return {
		stack: [
			{
				columns: [
					{ text: proj.name, style: 'entryTitle', width: '*' },
					proj.link && {
						text: proj.link,
						style: 'subtle',
						alignment: 'right',
						width: 'auto',
						fontSize: 8
					}
				].filter(Boolean)
			},
			proj.technologies && {
				text: proj.technologies,
				style: 'subtle',
				margin: [0, 2, 0, 0]
			},
			proj.description && {
				text: proj.description,
				style: 'meta',
				margin: [0, pt(2), 0, 0]
			}
		].filter(Boolean),
		margin: [0, 0, 0, pt(6)]
	};
}

function buildSkills(skills: ResumeData['skills']) {
	if (skills.merge) {
		const all = skills.categories.flatMap((c) => c.skills).join(', ');
		return { text: all, style: 'meta' };
	}

	return {
		stack: skills.categories.map((cat) => ({
			columns: [
				{ text: cat.category, style: 'entrySubtitle', width: pt(40) },
				{ text: cat.skills.join(', '), style: 'meta', width: '*' }
			],
			margin: [0, 0, 0, pt(3)]
		}))
	};
}

function buildCertEntry(cert: ResumeData['certifications'][number]) {
	return {
		stack: [
			{ text: cert.name, style: 'entryTitle' },
			{
				columns: [
					{ text: cert.organization, style: 'entrySubtitle', width: '*' },
					cert.url && {
						text: cert.url,
						style: 'subtle',
						alignment: 'right',
						width: 'auto',
						fontSize: 8
					}
				].filter(Boolean)
			}
		],
		margin: [0, 0, 0, pt(5)]
	};
}
