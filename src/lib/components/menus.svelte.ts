import { resumeData } from '$lib/stores/resumeStore.svelte';
import {
	workspaceStore,
	newWorkspace,
	saveCurrentWorkspace,
	switchWorkspace,
	renameWorkspace,
	deleteWorkspace
} from '$lib/stores/workspace.svelte';
import { compress, exportBackup, importBackup } from '$lib/db/backup';
import { getAllWorkspaces } from '$lib/db/workspaces';
import { templates, fonts, createPDFDocument } from '$lib/functions/pdfGenerator';
import { toast } from 'svelte-sonner';
import { browser } from '$app/environment';
import { resolve } from '$app/paths';
import { compressResume } from '$lib/db/sharelink';

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
async function handleJson() {
	if (!browser) return;
	await saveCurrentWorkspace();
	const currentState = $state.snapshot(resumeData);
	const { sections, sections_order, config, ...restData } = currentState;
	const s = JSON.stringify(currentState);

	const blob = new Blob([s], { type: 'text/plain' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `resume-${new Date().toISOString().split('T')[0]}.json`;
	a.click();
	URL.revokeObjectURL(url);
}

async function handleShareLink() {
	if (!browser) return;
	await saveCurrentWorkspace();
	const currentState = $state.snapshot(resumeData);
	const c = await compressResume(currentState);
	toast.error('Not yet implemented.');
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
	onOpenSettings: () => void;
}): Menu[] {
	return [
		{
			label: 'File',
			items: [
				{
					label: 'Download PDF',
					// shortcut: 'ALT G',
					onSelect: handleGenerate
				},
				{
					label: 'Download JSON',
					onSelect: handleShareLink
				},
				{ type: 'separator' },

				{
					label: 'Data Management',
					type: 'sub',
					children: [
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
				{ label: 'Settings', onSelect: opts.onOpenSettings }
			]
		},
		{
			label: 'Workspace',
			items: [
				{
					label: 'Switch Workspace',
					type: 'sub',
					children: [
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
						}
					]
				},
				{ label: 'New Workspace', onSelect: handleNew },
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
					type: 'sub',
					label: 'Template',
					children: [
						{
							type: 'radio',
							heading: 'Template',
							getValue: () => resumeData.config.template,
							onChange: (v) => (resumeData.config.template = v),
							options: Object.values(templates).map((t) => ({
								label: t.name,
								value: t.value
							}))
						}
					]
				},
				{
					type: 'sub',
					label: 'Font',
					children: [
						{
							type: 'radio',
							heading: 'Font',
							getValue: () => resumeData.config.font,
							onChange: (v) => (resumeData.config.font = v),
							options: Object.values(fonts).map((f) => ({
								label: f.name,
								value: f.value
							}))
						}
					]
				},
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
