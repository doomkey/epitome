import { defineConfig } from 'cypress';
import { execSync } from 'child_process';

const findBrave = (): Cypress.Browser => {
	const browserPath = '/usr/bin/brave';
	const result = execSync(`${browserPath} --version`).toString().trim();
	const [, version] = /Brave Browser (\d+\.\d+\.\d+)/.exec(result) ?? [];
	const majorVersion = parseInt(version.split('.')[0]);
	return {
		name: 'Brave',
		channel: 'stable',
		family: 'chromium',
		displayName: 'Brave',
		version,
		path: browserPath,
		majorVersion,
		isHeaded: true,
		isHeadless: false
	};
};

export default defineConfig({
	allowCypressEnv: false,
	pageLoadTimeout: 60000,
	defaultCommandTimeout: 9000,
	e2e: {
		setupNodeEvents(on, config) {
			config.browsers = config.browsers.concat(findBrave());
			return config;
		}
	}
});
