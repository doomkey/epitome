import { pt } from '$lib/functions/helpers';
import { basePageConfig, baseDefaultStyle, buildSections } from './base';
import { formatPeriod, toBullets, ifNotEmpty, flattenSkills, buildEntry } from './utils';
import type { ResumeData } from '$lib/types';
import { settingsStore } from '$lib/stores/settings.svelte';

export const classicTemplate = (data: ResumeData, font: string) => ({
	...basePageConfig,
	pageSize: settingsStore.current.paperSize,
	pageMargins: settingsStore.current.marginValue,
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
		certifications: buildClassicCertifications,
		extcurricular: buildClassicExtcurricular,
		references: buildClassicReferences
	})
});
const classicStyles: EntryStyles = {
	subtitleStyle: 'entrySubtitle',
	subtitleRightStyle: 'subtle',
	bulletsStyle: 'meta'
};

function buildClassicHeader(data: ResumeData) {
	const { fullName, title, email, phone, location, linkedin, github, website } = data.personal;

	const links = [
		email ? { text: email, link: `mailto:${email}` } : null,
		phone ? { text: phone, link: `tel:${phone}` } : null,
		linkedin ? { text: 'LinkedIn', link: linkedin } : null,
		github ? { text: 'GitHub', link: github } : null,
		website ? { text: 'Portfolio', link: website } : null
	].filter(Boolean);

	const contactBar: any[] = [];
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
			{ text: contactBar, style: 'contact', margin: [0, 4, 0, 0] }
		].filter(Boolean),
		margin: [0, 0, 0, pt(4)]
	};
}

function buildClassicSection(title: string, entries: any[]) {
	if (!entries || entries.length === 0) return null;
	return {
		stack: [{ text: title.toUpperCase(), style: 'sectionHeader' }, ...entries],
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
	return buildEntry(
		{
			title: exp.company,
			titleRight: formatPeriod(exp.start, exp.end, exp.present),
			subtitle: exp.jobTitle,
			bullets: exp.responsibilities
		},
		classicStyles
	);
}

function buildClassicEducationEntry(edu: ResumeData['education'][number]) {
	return buildEntry(
		{
			title: edu.institution,
			titleRight:
				edu.end && !edu.start ? `Graduated: ${edu.end}` : formatPeriod(edu.start, edu.end),
			subtitle: edu.degree,
			subtitleRight: edu.gpa ? `CGPA: ${edu.gpa}` : undefined
		},
		classicStyles
	);
}

function buildClassicExperience(data: ResumeData) {
	return buildClassicSection(
		data.sections.experience.title,
		data.experience.map(buildClassicExperienceEntry)
	);
}

function buildClassicEducation(data: ResumeData) {
	return buildClassicSection(
		data.sections.education.title,
		data.education.map(buildClassicEducationEntry)
	);
}

function buildClassicProjects(data: ResumeData) {
	return buildClassicSection(
		data.sections.projects.title.toUpperCase(),
		data.projects.map((proj) =>
			buildEntry(
				{
					title: proj.name,
					titleRight: proj.link ? 'View Project' : undefined,
					titleRightLink: proj.link,
					subtitle: proj.technologies,
					bullets: proj.description,
					margin: [0, 0, 0, pt(4)]
				},
				{ ...classicStyles, subtitleStyle: 'subtle' }
			)
		)
	);
}

function buildClassicSkills(data: ResumeData) {
	const { skills } = data;
	const title = data.sections.skills.title;

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
		data.sections.certifications.title,
		data.certifications.map((cert) =>
			buildEntry(
				{
					title: cert.name,
					titleLink: cert.url,
					titleRight: cert.url ? 'Verify' : undefined,
					titleRightLink: cert.url,
					subtitle: cert.organization,
					margin: [0, 0, 0, pt(4)]
				},
				classicStyles
			)
		)
	);
}

function buildClassicExtcurricular(data: ResumeData) {
	return buildClassicSection(
		data.sections.extcurricular.title,
		data.extcurricular.map((ext) =>
			buildEntry(
				{
					title: ext.org,
					titleRight: formatPeriod(ext.start, ext.end, ext.present),
					subtitle: ext.role,
					bullets: ext.responsibilities,
					margin: [0, 0, 0, pt(4)]
				},
				classicStyles
			)
		)
	);
}

function buildClassicReferences(data: ResumeData) {
	return buildClassicSection(
		data.sections.references.title,
		data.references.map((ref) =>
			buildEntry(
				{
					title: ref.name,
					titleRight: ref.phone,
					subtitle: [ref.designation, ref.dept, ref.org].filter(Boolean).join(', '),
					subtitleRight: ref.email,
					margin: [0, 0, 0, pt(2)]
				},
				classicStyles
			)
		)
	);
}
