import Dexie, { type EntityTable } from 'dexie';
import type { ResumeData } from '$lib/types';

export type Workspace = {
	id: string;
	name: string;
	data: ResumeData;
	createdAt: number;
	updatedAt: number;
};

export class EpitomeDB extends Dexie {
	workspaces!: EntityTable<Workspace, 'id'>;

	constructor() {
		super('epitome');
		this.version(1).stores({
			workspaces: '++id, name, updatedAt'
		});
	}
}

export const db = new EpitomeDB();
