import { pt } from '$lib/functions/helpers';
import { basePageConfig, baseDefaultStyle, buildSections } from './base';
import { formatPeriod, formatContact, toBullets, ifNotEmpty, flattenSkills } from './utils';
import type { ResumeData } from '$lib/types';

export const classicTemplate = (data: ResumeData, font: string) => ({
	...basePageConfig,
	defaultStyle: baseDefaultStyle(font),
	styles: {
		name: { fontSize: 16, bold: true },
		jobTitle: { fontSize: 10, color: '#333333' },
		sectionHeader: { fontSize: 10, bold: true, decoration: 'underline' },
		entryTitle: { fontSize: 10, bold: true },
		entrySubtitle: { fontSize: 10, italics: true },
		period: { fontSize: 10 },
		meta: { fontSize: 10 },
		subtle: { fontSize: 10 },
		contact: { fontSize: 10, alignment: 'center' }
	},
	content: buildSections(data, {
		header: buildClassicHeader,
		summary: buildClassicSummary,
		experience: buildClassicExperience,
		education: buildClassicEducation,
		projects: buildClassicProjects,
		skills: buildClassicSkills,
		certifications: buildClassicCertifications
	})
});

function buildClassicHeader(data: ResumeData) {
	const { fullName, title, email, phone, location, linkedin, github, website } = data.personal;

	return {
		stack: [
			{ text: fullName || 'Your Name', style: 'name', alignment: 'center' },
			ifNotEmpty(formatContact([location, email, linkedin, github, website], ', '), {
				text: formatContact([location, email, linkedin, github, website], ', '),
				style: 'contact',
				margin: [0, 2, 0, 0]
			}),
			ifNotEmpty(phone, { text: phone, style: 'contact', margin: [0, 1, 0, 0] })
		].filter(Boolean),
		margin: [0, 0, 0, pt(8)]
	};
}

function buildClassicSection(title: string, entries: object[]) {
	return {
		stack: [{ text: title, style: 'sectionHeader', margin: [0, 0, 0, pt(3)] }, ...entries],
		margin: [0, 0, 0, pt(6)]
	};
}

function buildClassicSummary(data: ResumeData) {
	return buildClassicSection('OBJECTIVE', [{ text: data.personal.summary, style: 'meta' }]);
}

function buildClassicExperience(data: ResumeData) {
	return buildClassicSection(
		data.sections.experience.title.toUpperCase(),
		data.experience.map(buildClassicExperienceEntry)
	);
}

function buildClassicExperienceEntry(exp: ResumeData['experience'][number]) {
	const bullets = toBullets(exp.responsibilities).map((line) => ({
		text: line,
		margin: [0, 1, 0, 1]
	}));

	return {
		stack: [
			{
				columns: [
					{ text: exp.company, style: 'entryTitle', width: '*' },
					{
						text: formatPeriod(exp.start, exp.end, exp.present),
						style: 'period',
						alignment: 'right',
						width: 'auto'
					}
				]
			},
			{ text: exp.jobTitle, style: 'entrySubtitle' },
			bullets.length ? { ul: bullets, margin: [0, pt(2), 0, 0] } : null
		].filter(Boolean),
		margin: [0, 0, 0, pt(5)]
	};
}

function buildClassicEducation(data: ResumeData) {
	return buildClassicSection(
		data.sections.education.title.toUpperCase(),
		data.education.map(buildClassicEducationEntry)
	);
}

function buildClassicEducationEntry(edu: ResumeData['education'][number]) {
	return {
		stack: [
			{
				columns: [
					{ text: edu.institution, style: 'entryTitle', width: '*' },
					{
						text: edu.end ? `Expected Graduation: ${edu.end}` : formatPeriod(edu.start, edu.end),
						style: 'period',
						alignment: 'right',
						width: 'auto'
					}
				]
			},
			{ text: edu.degree, style: 'meta' },
			ifNotEmpty(edu.gpa, { text: `GPA: ${edu.gpa}`, style: 'meta' })
		].filter(Boolean),
		margin: [0, 0, 0, pt(5)]
	};
}

function buildClassicProjects(data: ResumeData) {
	return buildClassicSection(
		data.sections.projects.title.toUpperCase(),
		data.projects.map(buildClassicProjectEntry)
	);
}

function buildClassicProjectEntry(proj: ResumeData['projects'][number]) {
	const bullets = toBullets(proj.description).map((line) => ({
		text: line,
		margin: [0, 1, 0, 1]
	}));

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
			ifNotEmpty(proj.technologies, { text: proj.technologies, style: 'entrySubtitle' }),
			bullets.length ? { ul: bullets, margin: [0, pt(2), 0, 0] } : null
		].filter(Boolean),
		margin: [0, 0, 0, pt(5)]
	};
}

function buildClassicSkills(data: ResumeData) {
	const { skills } = data;
	const title = data.sections.skills.title.toUpperCase();
	if (skills.merge) {
		return buildClassicSection(title, [{ text: flattenSkills(skills.categories), style: 'meta' }]);
	}

	return buildClassicSection(
		title,
		skills.categories.map((cat) => ({
			text: [
				{ text: `${cat.category}: `, style: 'entryTitle' },
				{ text: cat.skills.join(', '), style: 'meta' }
			],
			margin: [0, 0, 0, pt(2)]
		}))
	);
}

function buildClassicCertifications(data: ResumeData) {
	return buildClassicSection(
		data.sections.certifications.title.toUpperCase(),
		data.certifications.map(buildClassicCertEntry)
	);
}

function buildClassicCertEntry(cert: ResumeData['certifications'][number]) {
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
		margin: [0, 0, 0, pt(4)]
	};
}
