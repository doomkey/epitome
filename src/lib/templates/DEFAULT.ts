import { pt } from '$lib/functions/helpers';
import { basePageConfig, baseDefaultStyle, buildSections } from './base';
import { formatPeriod, ifNotEmpty, flattenSkills, buildEntry } from './utils';
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
		certifications: buildCertifications,
		extcurricular: buildExtcurricular,
		references: buildReferences
	})
});

function buildHeader(data: ResumeData) {
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
		if (i < links.length - 1) contactBar.push({ text: '  •  ', color: '#999999', link: null });
	});

	return {
		stack: [
			{ text: fullName || 'Your Name', style: 'name' },
			ifNotEmpty(title, { text: title, style: 'jobTitle', margin: [0, 2, 0, 2] }),
			{
				columns: [
					{ text: contactBar, style: 'meta', width: '*' },
					{ text: location || '', style: 'subtle', alignment: 'right', width: 'auto' }
				],
				margin: [0, 2, 0, 0]
			}
		].filter(Boolean),
		margin: [0, 0, 0, pt(8)]
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
	if (!data.personal.summary) return null;
	return buildSectionWrapper('OBJECTIVES', [
		{ text: data.personal.summary, style: 'meta', alignment: 'justify' }
	]);
}

function buildExperience(data: ResumeData) {
	return buildSectionWrapper(
		data.sections.experience.title,
		data.experience.map(buildExperienceEntry)
	);
}

function buildExperienceEntry(exp: ResumeData['experience'][number]) {
	return buildEntry({
		title: exp.jobTitle,
		titleRight: formatPeriod(exp.start, exp.end, exp.present),
		subtitle: exp.company,
		subtitleRight: exp.location,
		bullets: exp.responsibilities
	});
}

function buildEducation(data: ResumeData) {
	return buildSectionWrapper(
		data.sections.education.title,
		data.education.map(buildEducationEntry)
	);
}

function buildEducationEntry(edu: ResumeData['education'][number]) {
	return buildEntry({
		title: edu.degree,
		titleRight: formatPeriod(edu.start, edu.end),
		subtitle: edu.institution,
		subtitleRight: edu.location,
		subsubtitle: edu.gpa ? `CGPA: ${edu.gpa}` : undefined
	});
}

function buildProjects(data: ResumeData) {
	return buildSectionWrapper(data.sections.projects.title, data.projects.map(buildProjectEntry));
}

function buildProjectEntry(proj: ResumeData['projects'][number]) {
	return buildEntry(
		{
			title: proj.name,
			titleRight: proj.link ? 'View Project' : undefined,
			titleRightLink: proj.link,
			subtitle: proj.technologies,
			bullets: proj.description
		},
		{ subtitleStyle: 'subtle' }
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
			columns: [
				{ text: cat.category, style: 'entryTitle', width: pt(60) },
				{ text: cat.skills.join(', '), style: 'meta', width: '*' }
			],
			margin: [0, 0, 0, pt(2)]
		}))
	);
}

function buildCertifications(data: ResumeData) {
	return buildSectionWrapper(
		data.sections.certifications.title,
		data.certifications.map(buildCertEntry)
	);
}

function buildCertEntry(cert: ResumeData['certifications'][number]) {
	return buildEntry({
		title: cert.name,
		titleLink: cert.url,
		titleRight: cert.url ? 'Verify' : undefined,
		titleRightLink: cert.url,
		subtitle: cert.organization
	});
}

function buildExtcurricular(data: ResumeData) {
	return buildSectionWrapper(
		data.sections.extcurricular.title,
		data.extcurricular.map(buildExtcurricularEntry)
	);
}

function buildExtcurricularEntry(ext: ResumeData['extcurricular'][number]) {
	return buildEntry({
		title: ext.role,
		titleRight: formatPeriod(ext.start, ext.end, ext.present),
		subtitle: [ext.org].filter(Boolean).join(', '),
		bullets: ext.responsibilities
	});
}

function buildReferences(data: ResumeData) {
	return buildSectionWrapper(
		data.sections.references.title,
		data.references.map(buildReferencesEntry)
	);
}

function buildReferencesEntry(ref: ResumeData['references'][number]) {
	return buildEntry({
		title: ref.name,
		titleRight: ref.phone,
		subtitle: [ref.designation, ref.dept, ref.org].filter(Boolean).join(', '),
		subtitleRight: ref.email
	});
}
