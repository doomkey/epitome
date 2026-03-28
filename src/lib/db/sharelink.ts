import protobuf from 'protobufjs';
import schemaJSON from './schema.json';

const root = protobuf.Root.fromJSON(schemaJSON);
const Resume = root.lookupType('Resume');

export async function compressResume(data: object): Promise<string> {
	const buffer = Resume.encode(Resume.create(data)).finish();
	const stream = new Blob([buffer]).stream().pipeThrough(new CompressionStream('deflate-raw'));
	const compressedBuffer = await new Response(stream).arrayBuffer();

	return btoa(String.fromCharCode(...new Uint8Array(compressedBuffer)))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');
}

export async function decompressResume(base64Url: string): Promise<any> {
	let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	while (base64.length % 4) base64 += '=';

	const binary = atob(base64);
	const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));

	const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
	const decompressedBuffer = await new Response(stream).arrayBuffer();

	const message = Resume.decode(new Uint8Array(decompressedBuffer));
	return Resume.toObject(message, {
		longs: String,
		enums: String,
		bytes: String,
		defaults: true
	});
}
