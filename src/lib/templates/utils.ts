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

export const ATS_LINK_COLOR = '#1a56db';

/** Display version of a URL for ATS parsers: strip protocol, www., trailing slash. */
export function prettyUrl(url: string | undefined | null): string {
	if (!url) return '';
	let out = url.trim();
	out = out
		.replace(/^https?:\/\//i, '')
		.replace(/^www\./i, '')
		.replace(/\/+$/, '');
	return out || url.trim();
}

/** Ensure clickable link has a scheme so pdfmake emits a valid URI annotation. */
export function ensureHttpUrl(url: string | undefined | null): string {
	if (!url) return '';
	const trimmed = url.trim();
	if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return trimmed;
	return `https://${trimmed}`;
}

/** pdfmake text node showing the URL itself (ATS-parseable) with hyperlink attached. */
export function atsLinkNode(url: string | undefined | null) {
	if (!url?.trim()) return null;
	return {
		text: prettyUrl(url),
		link: ensureHttpUrl(url),
		color: ATS_LINK_COLOR,
		decoration: 'underline'
	};
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
					...(titleLink
						? { link: ensureHttpUrl(titleLink), color: ATS_LINK_COLOR, decoration: 'underline' }
						: {})
				},
				{
					text: titleRight,
					style: titleRightStyle,
					alignment: 'right',
					width: 'auto',
					...(opts.titleRightLink
						? {
								link: ensureHttpUrl(opts.titleRightLink),
								color: ATS_LINK_COLOR,
								decoration: 'underline'
							}
						: {})
				}
			]
		});
	} else {
		rows.push({
			text: title,
			style: titleStyle,
			...(titleLink
				? { link: ensureHttpUrl(titleLink), color: ATS_LINK_COLOR, decoration: 'underline' }
				: {})
		});
	}

	if (subtitle) {
		if (subtitleRight) {
			rows.push({
				columns: [
					{
						text: subtitle,
						style: subtitleStyle,
						width: '*',
						...(subtitleLink
							? {
									link: ensureHttpUrl(subtitleLink),
									color: ATS_LINK_COLOR,
									decoration: 'underline'
								}
							: {})
					},
					{ text: subtitleRight, style: subtitleRightStyle, alignment: 'right', width: 'auto' }
				].filter(Boolean)
			});
		} else {
			rows.push({
				text: subtitle,
				style: subtitleStyle,
				...(subtitleLink
					? { link: ensureHttpUrl(subtitleLink), color: ATS_LINK_COLOR, decoration: 'underline' }
					: {})
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
