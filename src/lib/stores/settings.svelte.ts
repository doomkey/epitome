import { db, type Settings } from '$lib/db';
import { margins, marginUnits, paperSizes, workspaceBehaviors } from '$lib/constant';
import { initWorkspaces } from './workspace.svelte';

const defaultSettings: Settings = {
	paperSize: paperSizes.a4.value,
	newWorkspaceBehavior: workspaceBehaviors.COPY.value,
	marginLabel: margins.normal.label,
	marginValue: margins.normal.value,
	marginUnit: 'mm'
};

let settings = $state<Settings>({ ...defaultSettings });
let isInitialized = $state(false);

export const settingsStore = {
	get current() {
		return settings;
	},
	get loaded() {
		return isInitialized;
	},

	async init() {
		if (isInitialized) return;

		try {
			const keys = Object.keys(defaultSettings) as (keyof Settings)[];
			const rows = await db.settings.where('key').anyOf(keys).toArray();

			rows.forEach((row) => {
				if (row.key in settings) {
					(settings as any)[row.key] = row.value;
				}
			});
		} catch (e) {
			console.error('Failed to load settings', e);
		} finally {
			isInitialized = true;
		}
	},

	async update<K extends keyof Settings>(key: K, value: Settings[K]) {
		settings[key] = value;
		await db.settings.put({ key, value });
		initWorkspaces();
	}
};
