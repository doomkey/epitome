import { db, type Workspace } from './index';
import type { ResumeData } from '$lib/types';
import { nanoid } from 'nanoid';

export async function getAllWorkspaces(): Promise<Workspace[]> {
	return db.workspaces.orderBy('updatedAt').reverse().toArray();
}

export async function getWorkspace(id: string): Promise<Workspace | undefined> {
	const workspace = await db.workspaces.get(id);
	if (!workspace) return undefined;
	return JSON.parse(JSON.stringify(workspace));
}

export async function createWorkspace(name: string, data: ResumeData): Promise<string> {
	const id = nanoid();
	await db.workspaces.add({
		id,
		name,
		data,
		createdAt: Date.now(),
		updatedAt: Date.now()
	});
	return id;
}

export async function saveWorkspace(id: string, data: ResumeData): Promise<void> {
	await db.workspaces.update(id, { data, updatedAt: Date.now() });
}

export async function renameWorkspace(id: string, name: string): Promise<void> {
	await db.workspaces.update(id, { name, updatedAt: Date.now() });
}

export async function deleteWorkspace(id: string): Promise<void> {
	await db.workspaces.delete(id);
}
