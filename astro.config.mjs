// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://scene.robinfactory.co.jp',
	// Preserve Astro 6's HTML whitespace behavior during the security upgrade.
	compressHTML: true,
	integrations: [sitemap()],
	// This static site uses ordinary img tags and needs no native image decoder.
	image: { service: passthroughImageService() },
});
