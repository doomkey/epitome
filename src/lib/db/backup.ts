import { saveCurrentWorkspace } from '$lib/stores/workspace.svelte';
import { db } from './index';
import type { Setting, Settings, Workspace } from './index';

const BACKUP_VERSION = 1;

type BackupPayload = {
	version: number;
	exportedAt: number;
	workspaces: Workspace[];
	settings: Setting[];
};

export async function compress(data: string): Promise<string> {
	const encoder = new TextEncoder();
	const input = encoder.encode(data);

	const stream = new Blob([input]).stream().pipeThrough(new CompressionStream('gzip'));
	const compressedBuffer = await new Response(stream).arrayBuffer();

	return btoa(String.fromCharCode(...new Uint8Array(compressedBuffer)));
}

export async function decompress(base64: string): Promise<string> {
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}

	const stream = new DecompressionStream('gzip');
	const writer = stream.writable.getWriter();
	writer.write(bytes);
	writer.close();

	const chunks: Uint8Array[] = [];
	const reader = stream.readable.getReader();
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		chunks.push(value);
	}

	const total = chunks.reduce((acc, c) => acc + c.length, 0);
	const result = new Uint8Array(total);
	let offset = 0;
	for (const chunk of chunks) {
		result.set(chunk, offset);
		offset += chunk.length;
	}

	return new TextDecoder().decode(result);
}

export async function exportBackup(): Promise<void> {
	await saveCurrentWorkspace();
	const workspaces = await db.workspaces.toArray();
	const settings = await db.settings.toArray();
	const payload: BackupPayload = {
		version: BACKUP_VERSION,
		exportedAt: Date.now(),
		workspaces,
		settings
	};

	const compressed = await compress(JSON.stringify(payload));

	const blob = new Blob([compressed], { type: 'text/plain' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `epitome-backup-${new Date().toISOString().split('T')[0]}.epitome`;
	a.click();
	URL.revokeObjectURL(url);
}

export type ImportResult = {
	added: number;
	overwritten: number;
	errors: string[];
};

export async function importBackup(file: File): Promise<ImportResult> {
	const result: ImportResult = { added: 0, overwritten: 0, errors: [] };

	try {
		const text = await file.text();
		const decompressed = await decompress(text);
		const payload: BackupPayload = JSON.parse(decompressed);

		if (!payload.version || !payload.workspaces) {
			result.errors.push('Invalid backup file format.');
			return result;
		}

		if (payload.version > BACKUP_VERSION) {
			result.errors.push(`Backup was made with a newer version of Epitome. Please update the app.`);
			return result;
		}
		await db.transaction('rw', [db.workspaces, db.settings], async () => {
			for (const workspace of payload.workspaces) {
				const existing = await db.workspaces.get(workspace.id);
				if (existing) {
					await db.workspaces.put(workspace);
					result.overwritten++;
				} else {
					await db.workspaces.add(workspace);
					result.added++;
				}
			}

			for (const setting of payload.settings) {
				await db.settings.put(setting);
			}
			window.location.reload();
		});
	} catch (e) {
		result.errors.push('Failed to read or decompress backup file. It may be corrupted.');
	}

	return result;
}
