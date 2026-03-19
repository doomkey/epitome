import { pt } from '$lib/functions/helpers';
import type { ResumeData } from '$lib/types';

export const defaultTemplate = (data: ResumeData, font: string) => {
	return {
		pageSize: 'A4',
		pageMargins: [pt(20), pt(20), pt(20), pt(20)],
		defaultStyle: { font: font || 'TINOS', fontSize: 10, lineHeight: 1.4 },
		styles: {
			name: { fontSize: 24, bold: true },
			title: { fontSize: 12, color: '#555555' },
			sectionHeader: { fontSize: 11, bold: true, color: '#1a1a1a' },
			institution: { fontSize: 10, bold: true },
			meta: { fontSize: 9, color: '#666666' },
			subtle: { fontSize: 9, italics: true, color: '#888888' }
		},
		content: [
			buildHeader(data),

			data.personal.summary &&
				buildSection('Summary', [{ text: data.personal.summary, style: 'meta' }]),

			data.experience.length &&
				buildSection('Work Experience', data.experience.map(buildExperienceEntry)),

			data.education.length && buildSection('Education', data.education.map(buildEducationEntry)),

			data.projects.length && buildSection('Projects', data.projects.map(buildProjectEntry)),

			data.skills.categories.length && buildSection('Skills', [buildSkills(data.skills)]),

			data.certifications.length &&
				buildSection('Certifications', data.certifications.map(buildCertEntry))
		].filter(Boolean)
	};
};

function buildHeader(data: ResumeData) {
	const { fullName, title, email, phone, location, linkedin, github, website } = data.personal;

	const contactParts = [email, phone, location, linkedin, github, website].filter(Boolean);

	return {
		stack: [
			{ text: fullName || 'Your Name', style: 'name' },
			title && { text: title, style: 'title', margin: [0, 2, 0, 0] },
			contactParts.length && {
				text: contactParts.join('  ·  '),
				style: 'meta',
				margin: [0, 4, 0, 0]
			}
		].filter(Boolean),
		margin: [0, 0, 0, pt(6)]
	};
}

function buildSection(title: string, entries: object[]) {
	return {
		stack: [
			{
				stack: [
					{ text: title.toUpperCase(), style: 'sectionHeader' },
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
						]
					}
				],
				margin: [0, 0, 0, pt(3)]
			},
			...entries
		],
		margin: [0, 0, 0, pt(6)]
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
					{ text: exp.jobTitle, style: 'institution', width: '*' },
					{ text: period, style: 'subtle', alignment: 'right', width: 'auto' }
				]
			},
			{
				columns: [
					{ text: exp.company, style: 'meta', width: '*' },
					exp.location && { text: exp.location, style: 'subtle', alignment: 'right', width: 'auto' }
				].filter(Boolean)
			},
			exp.responsibilities && {
				text: exp.responsibilities,
				margin: [0, pt(2), 0, 0],
				fontSize: 9
			}
		].filter(Boolean),
		margin: [0, 0, 0, pt(4)]
	};
}

function buildEducationEntry(edu: ResumeData['education'][number]) {
	const period = `${edu.start}${edu.end ? ` – ${edu.end}` : ''}`;

	return {
		stack: [
			{
				columns: [
					{ text: edu.degree, style: 'institution', width: '*' },
					{ text: period, style: 'subtle', alignment: 'right', width: 'auto' }
				]
			},
			{
				columns: [
					{ text: edu.institution, style: 'meta', width: '*' },
					edu.location && { text: edu.location, style: 'subtle', alignment: 'right', width: 'auto' }
				].filter(Boolean)
			},
			edu.gpa && { text: `GPA: ${edu.gpa}`, style: 'subtle', margin: [0, 1, 0, 0] }
		].filter(Boolean),
		margin: [0, 0, 0, pt(4)]
	};
}

function buildProjectEntry(proj: ResumeData['projects'][number]) {
	return {
		stack: [
			{
				columns: [
					{ text: proj.name, style: 'institution', width: '*' },
					proj.link && {
						text: proj.link,
						style: 'subtle',
						alignment: 'right',
						width: 'auto',
						fontSize: 8
					}
				].filter(Boolean)
			},
			proj.technologies && { text: proj.technologies, style: 'subtle', margin: [0, 1, 0, 0] },
			proj.description && { text: proj.description, fontSize: 9, margin: [0, pt(2), 0, 0] }
		].filter(Boolean),
		margin: [0, 0, 0, pt(4)]
	};
}

function buildSkills(skills: ResumeData['skills']) {
	if (skills.merge) {
		const all = skills.categories.flatMap((c) => c.skills).join('  ·  ');
		return { text: all, fontSize: 9 };
	}

	return {
		stack: skills.categories.map((cat) => ({
			columns: [
				{ text: cat.category, style: 'institution', width: pt(35) },
				{ text: cat.skills.join('  ·  '), fontSize: 9, width: '*' }
			],
			margin: [0, 0, 0, pt(2)]
		}))
	};
}

function buildCertEntry(cert: ResumeData['certifications'][number]) {
	return {
		stack: [
			{ text: cert.name, style: 'institution' },
			{
				columns: [
					{ text: cert.organization, style: 'meta', width: '*' },
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
		margin: [0, 0, 0, pt(3)]
	};
}
