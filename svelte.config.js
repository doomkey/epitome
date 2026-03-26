import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const path_to_layout = join(__dirname, './src/lib/layouts');
const blog = join(path_to_layout, '/blog.svelte');
const def = join(path_to_layout, '/default.svelte');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({ pages: 'build', assets: 'build' }),
		paths: {
			base: process.argv.includes('dev') ? '' : '/epitome',
			relative: false
		},
		prerender: { handleHttpError: 'warn', handleMissingId: 'warn' }
	},
	preprocess: [
		mdsvex({
			extensions: ['.svx', '.md'],
			layout: {
				blog: blog,
				_: def
			}
		})
	],
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
