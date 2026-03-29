import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	build: {
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
				passes: 3,
				pure_funcs: ['console.info', 'console.warn']
			},
			mangle: {
				toplevel: true
			},
			format: {
				comments: false
			}
		}
	}
});
