// svelte-sitemap.config.ts
import type { OptionsSvelteSitemap } from 'svelte-sitemap';

const config: OptionsSvelteSitemap = {
	domain: 'https://doomkey.github.io/epitome',
	trailingSlashes: true,
	ignore: ['xtodo']
};

export default config;
