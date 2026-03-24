import { pt } from '$lib/functions/helpers';
import { basePageConfig, baseDefaultStyle, buildSections } from './base';
import { formatPeriod, formatContact, toBullets, ifNotEmpty, flattenSkills } from './utils';
import type { ResumeData } from '$lib/types';

export const waterfallTemplate = (data: ResumeData, font: string) => ({
	...basePageConfig,
	defaultStyle: baseDefaultStyle(font),
	styles: {
		name: { fontSize: 24, bold: true, color: '#1a5f7a', margin: [0, 0, 0, pt(2)] },
		jobTitle: {
			fontSize: 12,
			bold: true,
			color: '#22a699',
			letterSpacing: 1,
			margin: [0, 0, 0, pt(4)]
		},
		sectionHeader: {
			fontSize: 12,
			bold: true,
			color: '#1a5f7a',
			margin: [0, pt(2), 0, pt(1)]
		},
		entryTitle: { fontSize: 11, bold: true, color: '#222222' },
		entrySubtitle: { fontSize: 10, color: '#444444' },
		period: { fontSize: 9, italics: true, color: '#666666', alignment: 'right' },
		meta: { fontSize: 10, color: '#333333', lineHeight: 1.2 },
		subtle: { fontSize: 9, color: '#777777' },
		contact: { fontSize: 9, color: '#555555', margin: [0, 0, 0, pt(1)] }
	},
	content: buildSections(data, {
		personal: buildWaterfallHeader,
		summary: buildWaterfallSummary,
		experience: buildWaterfallExperience,
		education: buildWaterfallEducation,
		projects: buildWaterfallProjects,
		skills: buildWaterfallSkills,
		certifications: buildWaterfallCertifications
	})
});

function buildWaterfallHeader(data: ResumeData) {
	const { fullName, title, email, phone, location, linkedin, github, website } = data.personal;

	const links = [
		email ? { text: email, link: `mailto:${email}` } : null,
		phone ? { text: phone, link: `tel:${phone}` } : null,
		location ? { text: location } : null,
		linkedin ? { text: 'LinkedIn', link: linkedin } : null,
		github ? { text: 'GitHub', link: github } : null,
		website ? { text: 'Portfolio', link: website } : null
	].filter(Boolean);

	const contactBar = [];
	links.forEach((link, i) => {
		contactBar.push(link);
		if (i < links.length - 1) contactBar.push({ text: '  -  ', color: '#cccccc' });
	});

	return {
		stack: [
			{ text: fullName || 'Your Name', style: 'name', alignment: 'left' },
			ifNotEmpty(title, { text: title?.toUpperCase(), style: 'jobTitle', alignment: 'left' }),
			{
				text: contactBar,
				style: 'contact',
				alignment: 'left'
			}
		].filter(Boolean),
		margin: [0, 0, 0, pt(6)]
	};
}

function buildWaterfallSection(title: string, entries: any[]) {
	if (!entries || entries.length === 0) return null;
	return {
		stack: [
			{ text: title, style: 'sectionHeader' },
			// {
			// 	canvas: [
			// 		{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#e0e0e0' }
			// 	],
			// 	margin: [0, 0, 0, pt(4)]
			// },
			...entries
		],
		margin: [0, 0, 0, pt(2)]
	};
}

function buildWaterfallSummary(data: ResumeData) {
	if (!data.personal.summary) return null;
	return buildWaterfallSection('PROFESSIONAL SUMMARY', [
		{ text: data.personal.summary, style: 'meta', alignment: 'left' }
	]);
}

function buildWaterfallExperienceEntry(exp: ResumeData['experience'][number]) {
	return {
		stack: [
			{
				columns: [
					{ text: exp.jobTitle, style: 'entryTitle', width: '*' },
					{ text: formatPeriod(exp.start, exp.end, exp.present), style: 'period', width: 'auto' }
				]
			},
			{ text: exp.company, style: 'entrySubtitle', margin: [0, pt(0), 0, pt(0)] },
			ifNotEmpty(exp.responsibilities, {
				ul: toBullets(exp.responsibilities),
				style: 'meta',
				margin: [pt(4), 0, 0, pt(1)]
			})
		].filter(Boolean),
		margin: [0, 0, 0, pt(2)]
	};
}

function buildWaterfallExperience(data: ResumeData) {
	return buildWaterfallSection(
		data.sections.experience.title.toUpperCase(),
		data.experience.map(buildWaterfallExperienceEntry)
	);
}

function buildWaterfallEducationEntry(edu: ResumeData['education'][number]) {
	return {
		stack: [
			{
				columns: [
					{ text: edu.degree, style: 'entryTitle', width: '*' },
					{
						text: edu.end && !edu.start ? `Class of ${edu.end}` : formatPeriod(edu.start, edu.end),
						style: 'period',
						width: 'auto'
					}
				]
			},
			{
				columns: [
					{ text: edu.institution, style: 'entrySubtitle', width: '*' },
					ifNotEmpty(edu.gpa, {
						text: `CGPA: ${edu.gpa}`,
						style: 'subtle',
						alignment: 'right',
						width: 'auto'
					})
				],
				margin: [0, pt(1), 0, 0]
			}
		],
		margin: [0, 0, 0, pt(2)]
	};
}

function buildWaterfallEducation(data: ResumeData) {
	return buildWaterfallSection(
		data.sections.education.title.toUpperCase(),
		data.education.map(buildWaterfallEducationEntry)
	);
}

function buildWaterfallProjectEntry(proj: ResumeData['projects'][number]) {
	return {
		stack: [
			{
				columns: [
					{ text: proj.name, style: 'entryTitle', width: '*' },
					ifNotEmpty(proj.link, {
						text: 'Link',
						link: proj.link,
						style: 'subtle',
						width: 'auto'
					})
				]
			},
			ifNotEmpty(proj.technologies, {
				text: proj.technologies,
				style: 'entrySubtitle',
				margin: [0, pt(0), 0, 0]
			}),
			ifNotEmpty(proj.description, {
				ul: toBullets(proj.description),
				style: 'meta',
				margin: [pt(4), pt(2), 0, pt(0)]
			})
		].filter(Boolean),
		margin: [0, 0, 0, pt(2)]
	};
}

function buildWaterfallProjects(data: ResumeData) {
	return buildWaterfallSection(
		data.sections.projects.title.toUpperCase(),
		data.projects.map(buildWaterfallProjectEntry)
	);
}

function buildWaterfallSkills(data: ResumeData) {
	const { skills } = data;
	const title = data.sections.skills.title.toUpperCase();

	const content = skills.merge
		? [{ text: flattenSkills(skills.categories), style: 'meta' }]
		: skills.categories.map((cat) => ({
				text: [
					{ text: `${cat.category}: `, style: 'entrySubtitle' },
					{ text: cat.skills.join(' • '), style: 'meta' }
				],
				margin: [0, 0, 0, pt(2)]
			}));

	return buildWaterfallSection(title, content);
}

function buildWaterfallCertifications(data: ResumeData) {
	return buildWaterfallSection(
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
							text: 'View Certificate',
							link: cert.url,
							style: 'subtle',
							width: 'auto'
						})
					]
				},
				{ text: cert.organization, style: 'entrySubtitle', margin: [0, pt(1), 0, 0] }
			],
			margin: [0, 0, 0, pt(4)]
		}))
	);
}
