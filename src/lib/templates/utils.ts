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
