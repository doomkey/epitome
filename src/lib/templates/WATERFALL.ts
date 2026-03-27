import { pt } from '$lib/functions/helpers';
import { basePageConfig, baseDefaultStyle, buildSections } from './base';
import { formatPeriod, ifNotEmpty, flattenSkills, buildEntry } from './utils';
import type { ResumeData } from '$lib/types';
import { settingsStore } from '$lib/stores/settings.svelte';

export const waterfallTemplate = (data: ResumeData, font: string) => ({
	...basePageConfig,
	pageSize: settingsStore.current.paperSize,
	pageMargins: settingsStore.current.marginValue,

	defaultStyle: baseDefaultStyle(font),
	styles: {
		name: { fontSize: 24, bold: true, color: '#000000', alignment: 'center' },
		jobTitle: { fontSize: 11, color: '#333333', alignment: 'center' },
		sectionHeader: {
			fontSize: 11,
			bold: true,
			color: '#000000',
			margin: [0, 6, 0, 2]
		},
		entryTitle: { fontSize: 10, bold: true },
		entrySubtitle: { fontSize: 10, bold: false, color: '#222222' },
		period: { fontSize: 9, color: '#444444', bold: true },
		meta: { fontSize: 9, color: '#333333', leadingLineHeight: 1.2 },
		subtle: { fontSize: 9, color: '#666666' }
	},
	content: buildSections(data, {
		personal: buildHeader,
		summary: buildSummary,
		experience: buildExperience,
		education: buildEducation,
		projects: buildProjects,
		skills: buildSkills,
		certifications: buildCertifications,
		extcurricular: buildExtcurricular,
		references: buildReferences
	})
});

function buildHeader(data: ResumeData) {
	const { fullName, title, email, phone, location, linkedin, github, website } = data.personal;

	const links = [
		email ? { text: email, link: `mailto:${email}` } : null,
		phone ? { text: phone } : null,
		location ? { text: location } : null,
		linkedin ? { text: 'LinkedIn', link: linkedin } : null,
		github ? { text: 'GitHub', link: github } : null,
		website ? { text: 'Portfolio', link: website } : null
	].filter(Boolean);

	const contactBar = [];
	links.forEach((link, i) => {
		contactBar.push(link);
		if (i < links.length - 1) contactBar.push({ text: '  |  ', color: '#aaaaaa', link: null });
	});

	return {
		stack: [
			{ text: fullName || 'Your Name', style: 'name' },
			ifNotEmpty(title, { text: title.toUpperCase(), style: 'jobTitle', margin: [0, 2, 0, 4] }),
			{
				text: contactBar,
				style: 'meta',
				alignment: 'center',
				margin: [0, 2, 0, 0]
			}
		].filter(Boolean),
		margin: [0, 0, 0, pt(12)]
	};
}

function buildSectionWrapper(title: string, entries: any[]) {
	if (!entries || entries.length === 0) return null;
	return {
		stack: [
			{ text: title.toUpperCase(), style: 'sectionHeader' },
			{
				canvas: [
					{
						type: 'line',
						x1: 0,
						y1: 0,
						x2: pt(182),
						y2: 0,
						lineWidth: 1,
						lineColor: '#111111'
					}
				],
				margin: [0, 0, 0, pt(4)]
			},
			...entries
		],
		margin: [0, 0, 0, pt(4)]
	};
}

function buildSummary(data: ResumeData) {
	if (!data.personal.summary) return null;
	return buildSectionWrapper('Professional Summary', [
		{ text: data.personal.summary, style: 'meta', alignment: 'justify' }
	]);
}

function buildExperience(data: ResumeData) {
	return buildSectionWrapper(
		data.sections.experience.title,
		data.experience.map((exp) =>
			buildEntry(
				{
					title: exp.jobTitle,
					titleRight: formatPeriod(exp.start, exp.end, exp.present),
					subtitle: exp.company,
					subtitleRight: exp.location,
					bullets: exp.responsibilities
				},
				{
					subtitleStyle: 'entrySubtitle'
				}
			)
		)
	);
}

function buildEducation(data: ResumeData) {
	return buildSectionWrapper(
		data.sections.education.title,
		data.education.map((edu) =>
			buildEntry({
				title: edu.degree,
				titleRight: formatPeriod(edu.start, edu.end),
				subtitle: edu.institution,
				subtitleRight: edu.location,
				subsubtitle: edu.gpa ? `CGPA: ${edu.gpa}` : undefined
			})
		)
	);
}

function buildSkills(data: ResumeData) {
	const { skills } = data;
	const title = data.sections.skills.title;

	if (skills.merge) {
		return buildSectionWrapper(title, [{ text: flattenSkills(skills.categories), style: 'meta' }]);
	}

	return buildSectionWrapper(
		title,
		skills.categories.map((cat) => ({
			text: [
				{ text: `${cat.category}: `, style: 'entryTitle' },
				{ text: cat.skills.join(', '), style: 'meta' }
			],
			margin: [0, 0, 0, pt(3)]
		}))
	);
}

const buildProjects = (data: ResumeData) =>
	buildSectionWrapper(
		data.sections.projects.title,
		data.projects.map((p) =>
			buildEntry(
				{
					title: p.name,
					titleRight: p.link ? 'Link' : undefined,
					titleRightLink: p.link,
					subtitle: p.technologies,
					bullets: p.description
				},
				{ subtitleStyle: 'subtle' }
			)
		)
	);

const buildCertifications = (data: ResumeData) =>
	buildSectionWrapper(
		data.sections.certifications.title,
		data.certifications.map((c) =>
			buildEntry({
				title: c.name,
				subtitle: c.organization,
				titleRight: c.url ? 'Verify' : undefined,
				titleRightLink: c.url
			})
		)
	);

const buildExtcurricular = (data: ResumeData) =>
	buildSectionWrapper(
		data.sections.extcurricular.title,
		data.extcurricular.map((e) =>
			buildEntry({
				title: e.role,
				subtitle: e.org,
				titleRight: formatPeriod(e.start, e.end, e.present),
				bullets: e.responsibilities
			})
		)
	);

const buildReferences = (data: ResumeData) =>
	buildSectionWrapper(
		data.sections.references.title,
		data.references.map((r) =>
			buildEntry({
				title: r.name,
				titleRight: r.phone,
				subtitle: [r.designation, r.org].filter(Boolean).join(' at '),
				subtitleRight: r.email
			})
		)
	);
