import { getFormattedDate } from '$lib/functions/helpers';
import type { PageServerLoad } from './$types';
import { dev } from '$app/environment';
export const load: PageServerLoad = async ({ params }) => {
	let posts = [];
	const offset = 0;
	let limit = 100;
	const paths = import.meta.glob('../../lib/blog/**/post.md', { eager: true });

	for (const path in paths) {
		const file = paths[path];

		const slug = path.split('/').at(-2);

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata;
			const { date, cover } = metadata;
			let updatedCover: Cover = {};
			const host = dev ? 'http://localhost:5173/epitome' : 'https://doomkey.github.io/epitome';
			if (cover) {
				updatedCover = {
					...cover,
					image: `${host}/article/${slug}/${cover.image}`
					// placeholder: getPlaceholder(`${host}/article/${slug}/${cover.image}`)
				};
			} else {
				updatedCover = {
					...cover,
					image: `${host}/epi.webp`,
					placeholder: `${host}/epi_placeholder.webp`
				};
			}
			const updatedMetadata = {
				...metadata,
				date: getFormattedDate(date),
				cover: updatedCover
			};
			const post = { ...updatedMetadata, slug };
			!post.draft && posts.push(post);
		}
	}
	posts = [...posts].sort((firstElement, secondElement) => {
		return new Date(secondElement.date).getTime() - new Date(firstElement.date).getTime();
	});

	if (offset) {
		posts = posts.slice(offset);
	}

	if (limit && limit < posts.length && limit != -1) {
		posts = posts.slice(0, limit);
	}
	console.log(posts);
	return { posts };
};
