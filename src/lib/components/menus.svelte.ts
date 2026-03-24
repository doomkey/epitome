import { resumeData } from '$lib/stores/resumeStore.svelte';
import {
	workspaceStore,
	newWorkspace,
	saveCurrentWorkspace,
	switchWorkspace,
	renameWorkspace,
	deleteWorkspace
} from '$lib/stores/workspace.svelte';
import { exportBackup, importBackup } from '$lib/db/backup';
import { getAllWorkspaces } from '$lib/db/workspaces';
import { templates, fonts, createPDFDocument } from '$lib/functions/pdfGenerator';
import { toast } from 'svelte-sonner';
import { browser } from '$app/environment';
import { resolve } from '$app/paths';

export type MenuAction = {
	type?: undefined;
	label: string;
	shortcut?: string;
	disabled?: boolean;
	destructive?: boolean;
	onSelect: () => void;
};

export type MenuRadioGroup = {
	type: 'radio';
	heading: string;
	getValue: () => string;
	onChange: (v: string) => void;
	options: {
		label: string;
		value: string;
		onRename?: () => void;
		onDelete?: () => void;
		deleteDisabled?: boolean;
	}[];
};

export type MenuSeparator = {
	type: 'separator';
};

export type MenuSub = {
	type: 'sub';
	label: string;
	disabled?: boolean;
	children: MenuItem[];
};

export type MenuItem = MenuAction | MenuRadioGroup | MenuSeparator | MenuSub;

export type Menu = {
	label: string;
	items: MenuItem[];
};

let _fileInput: HTMLInputElement | null = null;

export function setFileInput(el: HTMLInputElement) {
	_fileInput = el;
}

async function handleGenerate() {
	if (!browser) return;
	await saveCurrentWorkspace();
	const currentState = $state.snapshot(resumeData);
	const doc = createPDFDocument(currentState);
	doc.download(`${resumeData.personal.fullName || 'resume'}.pdf`);
	toast.success('Resume downloaded!');
}

async function handleExport() {
	try {
		await exportBackup();
		toast.success('Backup exported.');
	} catch {
		toast.error('Export failed.');
	}
}

async function handleSwitch(id: string) {
	if (id === workspaceStore.activeId) return;
	await saveCurrentWorkspace();
	await switchWorkspace(id);
	toast.success(`Switched to "${workspaceStore.workspaces.find((w) => w.id === id)?.name}".`);
}

async function handleNew() {
	await newWorkspace();
	toast.success('New workspace created.');
}

export function getMenus(opts: {
	onRename: (id: string, name: string) => void;
	onDelete: (id: string) => void;
	onResetCurrent: () => void;
	onDeleteAll: () => void;
	onConfigureSections: () => void;
}): Menu[] {
	return [
		{
			label: 'File',
			items: [
				{
					label: 'Generate PDF',
					// shortcut: 'ALT G',
					onSelect: handleGenerate
				},
				{ type: 'separator' },
				{ label: 'Export Backup', onSelect: handleExport },
				{
					label: 'Import Backup',
					onSelect: () => _fileInput?.click()
				},
				{ type: 'separator' },
				{
					label: 'Delete All Workspaces',
					destructive: true,
					onSelect: () => opts.onDeleteAll()
				}
			]
		},
		{
			label: 'Workspace',
			items: [
				{
					type: 'radio',
					heading: 'Switch Workspace',
					getValue: () => workspaceStore.activeId,
					onChange: handleSwitch,
					options: workspaceStore.workspaces.map((w) => ({
						label: w.name,
						value: w.id,
						onDelete: () => opts.onDelete(w.id),
						deleteDisabled: w.id === workspaceStore.activeId
					}))
				},
				{ type: 'separator' },
				{ label: 'New Workspace', onSelect: handleNew },
				{ type: 'separator' },
				{
					label: 'Reset Current Workspace',
					destructive: true,
					onSelect: () => opts.onResetCurrent()
				}
			]
		},
		{
			label: 'Customize',
			items: [
				{
					type: 'radio',
					heading: 'Template',
					getValue: () => resumeData.config.template,
					onChange: (v) => (resumeData.config.template = v),
					options: Object.values(templates).map((t) => ({
						label: t.name,
						value: t.value
					}))
				},
				{ type: 'separator' },
				{
					type: 'radio',
					heading: 'Font',
					getValue: () => resumeData.config.font,
					onChange: (v) => (resumeData.config.font = v),
					options: Object.values(fonts).map((f) => ({
						label: f.name,
						value: f.value
					}))
				},
				{ type: 'separator' },
				{
					label: 'Configure Sections',
					onSelect: () => opts.onConfigureSections()
				}
			]
		},
		{
			label: 'Help',
			items: [
				{
					label: 'How to...',
					onSelect: () => window.open(resolve('/docs'), '_blank')
				},
				{
					label: 'GitHub',
					onSelect: () => window.open('https://github.com/doomkey/epitome', '_blank')
				},
				{
					label: 'Report an Issue',
					onSelect: () => window.open('https://github.com/doomkey/epitome/issues', '_blank')
				}
			]
		}
	];
}
