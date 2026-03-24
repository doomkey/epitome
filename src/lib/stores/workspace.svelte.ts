import { resumeData } from './resumeStore.svelte';
import {
	getAllWorkspaces,
	getWorkspace,
	createWorkspace,
	saveWorkspace as dbSave,
	renameWorkspace as dbRename,
	deleteWorkspace as dbDelete
} from '$lib/db/workspaces';
import type { Workspace } from '$lib/db/index';
import type { ResumeData } from '$lib/types';

const ACTIVE_KEY = 'epitome_active_workspace';

function cloneResumeData(): ResumeData {
	return JSON.parse(JSON.stringify(resumeData));
}

function hydrateResumeData(data: ResumeData) {
	Object.assign(resumeData, JSON.parse(JSON.stringify(data)));
}
export const workspaceStore = $state({
	activeId: '' as string,
	workspaces: [] as Workspace[],
	ready: false
});

export async function initWorkspaces() {
	const workspaces = await getAllWorkspaces();
	const savedId = localStorage.getItem(ACTIVE_KEY);

	if (workspaces.length === 0) {
		const id = await createWorkspace('Resume for X Corp.', cloneResumeData());
		workspaceStore.workspaces = await getAllWorkspaces();
		await switchWorkspace(id);
	} else {
		workspaceStore.workspaces = workspaces;
		const idToLoad =
			savedId && workspaces.find((w) => w.id === savedId) ? savedId : workspaces[0].id;
		await switchWorkspace(idToLoad);
	}

	workspaceStore.ready = true;
}

export async function switchWorkspace(id: string) {
	const workspace = await getWorkspace(id);
	if (!workspace) return;
	hydrateResumeData(JSON.parse(JSON.stringify(workspace.data)));
	workspaceStore.activeId = id;
	localStorage.setItem(ACTIVE_KEY, id);
}

export async function saveCurrentWorkspace() {
	if (!workspaceStore.activeId) return;
	console.log(2);
	await dbSave(workspaceStore.activeId, cloneResumeData());

	workspaceStore.workspaces = workspaceStore.workspaces.map((w) =>
		w.id === workspaceStore.activeId ? { ...w, updatedAt: Date.now() } : w
	);
}

export async function newWorkspace() {
	await saveCurrentWorkspace();
	const id = await createWorkspace('New Workspace', cloneResumeData());
	workspaceStore.workspaces = await getAllWorkspaces();
	await switchWorkspace(id);
}

export async function renameWorkspace(id: string, name: string) {
	await dbRename(id, name);
	workspaceStore.workspaces = workspaceStore.workspaces.map((w) =>
		w.id === id ? { ...w, name } : w
	);
}

export async function deleteWorkspace(id: string) {
	if (workspaceStore.workspaces.length <= 1) return;
	await dbDelete(id);
	workspaceStore.workspaces = workspaceStore.workspaces.filter((w) => w.id !== id);

	if (workspaceStore.activeId === id) {
		await switchWorkspace(workspaceStore.workspaces[0].id);
	}
}
