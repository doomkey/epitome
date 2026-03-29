import { createResumeData, defaultResumeData, resumeData } from './resumeStore.svelte';
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
import { settingsStore } from './settings.svelte';
import { workspaceBehaviors } from '$lib/constant';

const ACTIVE_KEY = 'epitome_active_workspace';

function cloneResumeData(): ResumeData {
	return JSON.parse(JSON.stringify(resumeData));
}

function deepMerge<T extends object>(defaults: T, saved: Partial<T>): T {
	const result = { ...defaults };
	for (const key in defaults) {
		if (!(key in saved)) continue;
		const savedVal = saved[key];
		const defaultVal = defaults[key];
		if (
			savedVal !== null &&
			typeof savedVal === 'object' &&
			!Array.isArray(savedVal) &&
			typeof defaultVal === 'object' &&
			!Array.isArray(defaultVal)
		) {
			result[key] = deepMerge(defaultVal as object, savedVal as object) as T[typeof key];
		} else {
			result[key] = savedVal as T[typeof key];
		}
	}
	return result;
}

function hydrateResumeData(data: ResumeData) {
	const defaults = JSON.parse(JSON.stringify(defaultResumeData));
	const saved = JSON.parse(JSON.stringify(data));
	const merged = deepMerge(defaults, saved);
	merged.sections_order = [
		...merged.sections_order.filter((k) => k in merged.sections),
		...Object.keys(merged.sections).filter((k) => !merged.sections_order.includes(k))
	];
	for (const key in defaults) {
		(resumeData as any)[key] = merged[key as keyof ResumeData];
	}
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
	await saveCurrentWorkspace();
}

export async function saveCurrentWorkspace() {
	if (!workspaceStore.activeId) return;
	await dbSave(workspaceStore.activeId, cloneResumeData());

	workspaceStore.workspaces = workspaceStore.workspaces.map((w) =>
		w.id === workspaceStore.activeId ? { ...w, updatedAt: Date.now() } : w
	);
}

export async function newWorkspace() {
	await saveCurrentWorkspace();
	const behav = settingsStore.current.newWorkspaceBehavior;
	let id = '';
	if (behav === workspaceBehaviors.COPY.value) {
		id = await createWorkspace('New Workspace', cloneResumeData());
	} else {
		id = await createWorkspace('Default Workspace', createResumeData(false));
	}
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
