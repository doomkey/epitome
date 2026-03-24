import { pt } from '$lib/functions/helpers';
import { basePageConfig, baseDefaultStyle, buildSections } from './base';
import { formatPeriod, formatContact, toBullets, ifNotEmpty, flattenSkills } from './utils';
import type { ResumeData } from '$lib/types';

export const classicTemplate = (data: ResumeData, font: string) => ({
	...basePageConfig,
	defaultStyle: baseDefaultStyle(font),
	styles: {
		name: { fontSize: 16, bold: true, color: '#000000' },
		jobTitle: { fontSize: 11, italics: true, color: '#444444' },
		sectionHeader: {
			fontSize: 10,
			bold: true,
			decoration: 'underline',
			margin: [0, pt(4), 0, pt(2)]
		},
		entryTitle: { fontSize: 10, bold: true },
		entrySubtitle: { fontSize: 10, italics: true },
		period: { fontSize: 10, color: '#333333' },
		meta: { fontSize: 10 },
		subtle: { fontSize: 8, color: '#666666' },
		contact: { fontSize: 9, alignment: 'center' }
	},
	content: buildSections(data, {
		personal: buildClassicHeader,
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

	const links = [
		email ? { text: email, link: `mailto:${email}` } : null,
		phone ? { text: phone, link: `tel:${phone}` } : null,
		linkedin ? { text: 'LinkedIn', link: linkedin } : null,
		github ? { text: 'GitHub', link: github } : null,
		website ? { text: 'Portfolio', link: website } : null
	].filter(Boolean);

	const contactBar = [];
	links.forEach((link, i) => {
		contactBar.push(link);
		if (i < links.length - 1) contactBar.push({ text: '  •  ', color: '#999999' });
	});

	return {
		stack: [
			{ text: fullName || 'Your Name', style: 'name', alignment: 'center' },
			{
				columns: [
					{ text: title?.toUpperCase() || '', style: 'jobTitle', alignment: 'left', width: '*' },
					{ text: location || '', style: 'subtle', alignment: 'right', width: '*' }
				],
				margin: [0, 1, 0, 4]
			},

			{
				text: contactBar,
				style: 'contact',
				margin: [0, 4, 0, 0]
			}
		].filter(Boolean),
		margin: [0, 0, 0, pt(4)]
	};
}

function buildClassicSection(title: string, entries: any[]) {
	if (!entries || entries.length === 0) return null;
	return {
		stack: [{ text: title, style: 'sectionHeader' }, ...entries],
		margin: [0, 0, 0, pt(2)]
	};
}

function buildClassicSummary(data: ResumeData) {
	if (!data.personal.summary) return null;
	return buildClassicSection('OBJECTIVE', [
		{ text: data.personal.summary, style: 'meta', alignment: 'justify' }
	]);
}

function buildClassicExperienceEntry(exp: ResumeData['experience'][number]) {
	return {
		stack: [
			{
				columns: [
					{ text: exp.company, style: 'entryTitle', width: '*' },
					{ text: formatPeriod(exp.start, exp.end, exp.present), style: 'period', width: 'auto' }
				]
			},
			{ text: exp.jobTitle, style: 'entrySubtitle', margin: [0, 1, 0, 0] },
			ifNotEmpty(exp.responsibilities, {
				ul: toBullets(exp.responsibilities),
				style: 'meta',
				margin: [0, pt(0), 0, pt(2)]
			})
		].filter(Boolean)
	};
}

function buildClassicExperience(data: ResumeData) {
	return buildClassicSection(
		data.sections.experience.title.toUpperCase(),
		data.experience.map(buildClassicExperienceEntry)
	);
}

function buildClassicEducationEntry(edu: ResumeData['education'][number]) {
	return {
		stack: [
			{
				columns: [
					{ text: edu.institution, style: 'entryTitle', width: '*' },
					{
						text:
							edu.end && !edu.start ? `Graduated: ${edu.end}` : formatPeriod(edu.start, edu.end),
						style: 'period',
						width: 'auto'
					}
				]
			},
			{
				columns: [
					{ text: edu.degree, style: 'meta', width: '*' },
					ifNotEmpty(edu.gpa, { text: `CGPA: ${edu.gpa}`, style: 'meta', width: 'auto' })
				]
			}
		],
		margin: [0, 0, 0, pt(5)]
	};
}

function buildClassicEducation(data: ResumeData) {
	return buildClassicSection(
		data.sections.education.title.toUpperCase(),
		data.education.map(buildClassicEducationEntry)
	);
}

function buildClassicProjectEntry(proj: ResumeData['projects'][number]) {
	return {
		stack: [
			{
				columns: [
					{ text: proj.name, style: 'entryTitle', width: '*' },
					ifNotEmpty(proj.link, {
						text: 'View Project',
						link: proj.link,
						style: 'subtle',
						decoration: 'underline',
						width: 'auto'
					})
				]
			},
			ifNotEmpty(proj.technologies, { text: proj.technologies, style: 'entrySubtitle' }),
			ifNotEmpty(proj.description, {
				ul: toBullets(proj.description),
				style: 'meta',
				margin: [0, 2, 0, 4]
			})
		].filter(Boolean)
	};
}

function buildClassicProjects(data: ResumeData) {
	return buildClassicSection(
		data.sections.projects.title.toUpperCase(),
		data.projects.map(buildClassicProjectEntry)
	);
}

function buildClassicSkills(data: ResumeData) {
	const { skills } = data;
	const title = data.sections.skills.title.toUpperCase();

	const content = skills.merge
		? [{ text: flattenSkills(skills.categories), style: 'meta' }]
		: skills.categories.map((cat) => ({
				text: [
					{ text: `${cat.category}: `, style: 'entryTitle' },
					{ text: cat.skills.join(', '), style: 'meta' }
				],
				margin: [0, 0, 0, pt(2)]
			}));

	return buildClassicSection(title, content);
}

function buildClassicCertifications(data: ResumeData) {
	return buildClassicSection(
		data.sections.certifications.title.toUpperCase(),
		data.certifications.map((cert) => ({
			stack: [
				{
					columns: [
						{
							text: cert.name,
							style: 'entryTitle',
							link: cert.url || null,
							width: '*'
						},
						ifNotEmpty(cert.url, {
							text: 'Verify',
							link: cert.url,
							style: 'subtle',
							width: 'auto'
						})
					]
				},
				{ text: cert.organization, style: 'entrySubtitle' }
			],
			margin: [0, 0, 0, pt(4)]
		}))
	);
}
