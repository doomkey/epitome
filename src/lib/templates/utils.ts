export function formatPeriod(start: string, end: string, present: boolean = false): string {
	if (!start) return '';
	if (present) return `${start} – Present`;
	if (end) return `${start} – ${end}`;
	return start;
}

export function toBullets(text: string, separator: 'newline' | 'sentence' = 'newline') {
	if (!text) return [];
	if (separator === 'sentence') {
		return text
			.split(/(?<=\.)\s+/)
			.map((s) => s.trim())
			.filter(Boolean);
	}
	return text
		.split('\n')
		.map((s) => s.trim())
		.filter(Boolean);
}

export function formatContact(fields: (string | undefined)[], separator: string = ' | '): string {
	return fields.filter(Boolean).join(separator);
}

export function isEmpty(value: string | undefined | null): boolean {
	return !value || value.trim().length === 0;
}

export function ifNotEmpty<T>(value: string | undefined, node: T): T | null {
	return isEmpty(value) ? null : node;
}

export function flattenSkills(categories: { skills: string[] }[]): string {
	return categories.flatMap((c) => c.skills).join(', ');
}

import { pt } from '$lib/functions/helpers';

export type EntryOptions = {
	title: string;
	titleDecorator?: string;
	titleRight?: string;
	titleLink?: string;

	subtitle?: string;
	subtitleRight?: string;
	subtitleLink?: string;
	titleRightLink?: string;
	subsubtitle?: string;

	bullets?: string;
	bulletIndent?: number;

	extra?: object[];

	margin?: number[];
};

export function buildEntry(opts: EntryOptions, styles: EntryStyles = {}) {
	const {
		title,
		titleDecorator,
		titleRight,
		titleLink,
		subtitle,
		subtitleRight,
		subtitleLink,
		subsubtitle,
		bullets,
		bulletIndent = pt(4),
		extra = [],
		margin = [0, 0, 0, pt(2)]
	} = opts;

	const {
		titleStyle = 'entryTitle',
		titleRightStyle = 'period',
		subtitleStyle = 'entrySubtitle',
		subtitleRightStyle = 'subtle',
		subsubtitleStyle = 'subtle',
		bulletsStyle = 'meta'
	} = styles;

	const rows: object[] = [];

	if (titleRight) {
		rows.push({
			columns: [
				{
					text: [titleDecorator, title].filter(Boolean).join(' '),
					style: titleStyle,
					width: '*',
					...(titleLink ? { link: titleLink } : {})
				},
				{
					text: titleRight,
					style: titleRightStyle,
					alignment: 'right',
					width: 'auto',
					...(opts.titleRightLink ? { link: opts.titleRightLink, decoration: 'underline' } : {})
				}
			]
		});
	} else {
		rows.push({ text: title, style: titleStyle, ...(titleLink ? { link: titleLink } : {}) });
	}

	if (subtitle) {
		if (subtitleRight) {
			rows.push({
				columns: [
					{
						text: subtitle,
						style: subtitleStyle,
						width: '*',
						...(subtitleLink ? { link: subtitleLink } : {})
					},
					{ text: subtitleRight, style: subtitleRightStyle, alignment: 'right', width: 'auto' }
				].filter(Boolean)
			});
		} else {
			rows.push({
				text: subtitle,
				style: subtitleStyle,
				...(subtitleLink ? { link: subtitleLink } : {})
			});
		}
	}

	if (subsubtitle) {
		rows.push({ text: subsubtitle, style: subsubtitleStyle, margin: [0, 1, 0, 0] });
	}

	if (bullets?.trim()) {
		rows.push({
			ul: toBullets(bullets),
			style: bulletsStyle,
			margin: [bulletIndent, pt(1), 0, 0]
		});
	}

	rows.push(...extra);

	return { stack: rows.filter(Boolean), margin };
}

export type EntryStyles = {
	titleStyle?: string;
	titleRightStyle?: string;
	subtitleStyle?: string;
	subtitleRightStyle?: string;
	subsubtitleStyle?: string;
	bulletsStyle?: string;
};
