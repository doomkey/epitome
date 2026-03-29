import type * as PDFJSType from 'pdfjs-dist';

let pdfjsLib: typeof PDFJSType | null = null;
let workerUrl: string | null = null;

export async function getPdfjs() {
	if (pdfjsLib) return pdfjsLib;

	const [pdfjs, worker] = await Promise.all([
		import('pdfjs-dist'),
		import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url')
	]);

	pdfjsLib = pdfjs;
	workerUrl = worker.default;

	if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
		pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
	}

	return pdfjsLib;
}

export function preloadPdfjs() {
	getPdfjs(); // fire and forget, warms the cache
}
