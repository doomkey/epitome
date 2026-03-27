import Dexie, { type EntityTable } from 'dexie';
import type { ResumeData } from '$lib/types';

export type Workspace = {
	id: string;
	name: string;
	data: ResumeData;
	createdAt: number;
	updatedAt: number;
};
export type SettingsData = {
	paper: 'a4' | 'letter';
	new_workspace: 'copy' | 'fresh';
};
export type Setting = {
	key: string;
	value: unknown;
};
export class EpitomeDB extends Dexie {
	workspaces!: EntityTable<Workspace, 'id'>;
	settings!: EntityTable<Setting, 'key'>;
	constructor() {
		super('epitome');
		this.version(1).stores({
			workspaces: '++id, name, updatedAt'
		});
		this.version(2).stores({
			workspaces: '++id, name, updatedAt',
			settings: 'key'
		});
	}
}

export const db = new EpitomeDB();

// usage
// // set
//await db.settings.put({ key: 'theme', value: 'dark' });

// get
//const theme = await db.settings.get('theme');
