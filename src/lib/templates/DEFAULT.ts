import { pt } from '$lib/functions/helpers';
import { basePageConfig, baseDefaultStyle, buildSections } from './base';
import { formatPeriod, formatContact, toBullets, ifNotEmpty, flattenSkills } from './utils';
import type { ResumeData } from '$lib/types';

export const defaultTemplate = (data: ResumeData, font: string) => ({
	...basePageConfig,
	defaultStyle: baseDefaultStyle(font),
	styles: {
		name: { fontSize: 22, bold: true },
		jobTitle: { fontSize: 11, color: '#444444' },
		sectionHeader: { fontSize: 11, bold: true, color: '#1a1a1a' },
		entryTitle: { fontSize: 10, bold: true },
		entrySubtitle: { fontSize: 10, bold: false, color: '#333333', italics: true },
		period: { fontSize: 9, color: '#666666' },
		meta: { fontSize: 9, color: '#555555' },
		subtle: { fontSize: 9, color: '#888888' }
	},
	content: buildSections(data, {
		personal: buildHeader,
		summary: buildSummary,
		experience: buildExperience,
		education: buildEducation,
		projects: buildProjects,
		skills: buildSkills,
		certifications: buildCertifications
	})
});

function buildHeader(data: ResumeData) {
	const { fullName, title, email, phone, location, linkedin, github, website } = data.personal;

	return {
		stack: [
			{ text: fullName || 'Your Name', style: 'name' },
			ifNotEmpty(title, { text: title, style: 'jobTitle', margin: [0, 2, 0, 2] }),
			ifNotEmpty(formatContact([email, phone, location, linkedin, github, website]), {
				text: formatContact([email, phone, location, linkedin, github, website]),
				style: 'meta',
				margin: [0, 2, 0, 0]
			})
		].filter(Boolean),
		margin: [0, 0, 0, pt(8)]
	};
}

function buildSectionWrapper(title: string, entries: object[]) {
	return {
		stack: [
			{ text: title, style: 'sectionHeader' },
			{
				canvas: [
					{
						type: 'line',
						x1: 0,
						y1: 2,
						x2: pt(182),
						y2: 2,
						lineWidth: 0.5,
						lineColor: '#cccccc'
					}
				],
				margin: [0, 0, 0, pt(4)]
			},
			...entries
		],
		margin: [0, 0, 0, pt(6)]
	};
}

function buildSummary(data: ResumeData) {
	return buildSectionWrapper('SUMMARY', [{ text: data.personal.summary, style: 'meta' }]);
}

function buildExperience(data: ResumeData) {
	return buildSectionWrapper('WORK EXPERIENCE', data.experience.map(buildExperienceEntry));
}

function buildExperienceEntry(exp: ResumeData['experience'][number]) {
	return {
		stack: [
			{
				columns: [
					{ text: exp.jobTitle, style: 'entryTitle', width: '*' },
					{
						text: formatPeriod(exp.start, exp.end, exp.present),
						style: 'period',
						alignment: 'right',
						width: 'auto'
					}
				]
			},
			{
				columns: [
					{ text: exp.company, style: 'entrySubtitle', width: '*' },
					ifNotEmpty(exp.location, {
						text: exp.location,
						style: 'subtle',
						alignment: 'right',
						width: 'auto'
					})
				].filter(Boolean)
			},
			ifNotEmpty(exp.responsibilities, {
				ul: toBullets(exp.responsibilities),
				style: 'meta',
				margin: [pt(4), pt(1), 0, 0]
			})
		].filter(Boolean),
		margin: [0, 0, 0, pt(2)]
	};
}

function buildEducation(data: ResumeData) {
	return buildSectionWrapper('EDUCATION', data.education.map(buildEducationEntry));
}

function buildEducationEntry(edu: ResumeData['education'][number]) {
	return {
		stack: [
			{
				columns: [
					{ text: edu.degree, style: 'entryTitle', width: '*' },
					{
						text: formatPeriod(edu.start, edu.end),
						style: 'period',
						alignment: 'right',
						width: 'auto'
					}
				]
			},
			{
				columns: [
					{ text: edu.institution, style: 'entrySubtitle', width: '*' },
					ifNotEmpty(edu.location, {
						text: edu.location,
						style: 'subtle',
						alignment: 'right',
						width: 'auto'
					})
				].filter(Boolean)
			},
			ifNotEmpty(edu.gpa, { text: `CGPA: ${edu.gpa}`, style: 'subtle', margin: [0, 2, 0, 0] })
		].filter(Boolean),
		margin: [0, 0, 0, pt(2)]
	};
}

function buildProjects(data: ResumeData) {
	return buildSectionWrapper('PROJECTS', data.projects.map(buildProjectEntry));
}

function buildProjectEntry(proj: ResumeData['projects'][number]) {
	return {
		stack: [
			{
				columns: [
					{ text: proj.name, style: 'entryTitle', width: '*' },
					ifNotEmpty(proj.link, {
						text: proj.link,
						style: 'subtle',
						alignment: 'right',
						width: 'auto',
						fontSize: 8
					})
				].filter(Boolean)
			},
			ifNotEmpty(proj.technologies, {
				text: proj.technologies,
				style: 'subtle',
				margin: [0, 2, 0, 0]
			}),
			ifNotEmpty(proj.description, {
				text: proj.description,
				style: 'meta',
				margin: [0, pt(2), 0, 0]
			})
		].filter(Boolean),
		margin: [0, 0, 0, pt(0)]
	};
}

function buildSkills(data: ResumeData) {
	const { skills } = data;

	if (skills.merge) {
		return buildSectionWrapper('SKILLS', [
			{ text: flattenSkills(skills.categories), style: 'meta' }
		]);
	}

	return buildSectionWrapper(
		'SKILLS',
		skills.categories.map((cat) => ({
			columns: [
				{ text: cat.category, style: 'entrySubtitle', width: pt(40) },
				{ text: cat.skills.join(', '), style: 'meta', width: '*' }
			],
			margin: [0, 0, 0, pt(3)]
		}))
	);
}

function buildCertifications(data: ResumeData) {
	return buildSectionWrapper('CERTIFICATIONS', data.certifications.map(buildCertEntry));
}

function buildCertEntry(cert: ResumeData['certifications'][number]) {
	return {
		stack: [
			{ text: cert.name, style: 'entryTitle' },
			{
				columns: [
					{ text: cert.organization, style: 'entrySubtitle', width: '*' },
					ifNotEmpty(cert.url, {
						text: cert.url,
						style: 'subtle',
						alignment: 'right',
						width: 'auto',
						fontSize: 8
					})
				].filter(Boolean)
			}
		],
		margin: [0, 0, 0, pt(5)]
	};
}
