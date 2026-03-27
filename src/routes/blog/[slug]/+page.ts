import { getFormattedDate } from '$lib/functions/helpers';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const post = await import(`../../../lib/blog/${params.slug}/post.md`);

	const { title, description, date } = post.metadata;
	const d = getFormattedDate(date);
	const meta = { title, description, date: d };
	return {
		content: post.default,
		meta,
		slug: params.slug
	};
};
