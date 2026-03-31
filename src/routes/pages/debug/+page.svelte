<script lang="ts">
	import { UAParser } from 'ua-parser-js';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
	const ua = UAParser(navigator.userAgent);
	const { browser, cpu, device, engine, os } = ua;
	const nd = 'Not defined';
</script>

<h1>Debug Page</h1>
<div class="grid grid-cols-1 md:grid-cols-2">
	<div>
		<h3>Browser</h3>
		<p>Name: {browser.name}</p>
		<p>Version: {browser.version}</p>
		<p>Major: {browser.major}</p>
		<p>Type: {browser.type ?? nd}</p>
	</div>
	<div>
		<h3>Device</h3>
		<p>Model: {device.model ?? nd}</p>
		<p>Type: {device.model ?? nd}</p>
		<p>Vendor: {device.model ?? nd}</p>
	</div>

	<div>
		<h3>CPU</h3>
		<p>Architecture: {cpu.architecture ?? nd}</p>
	</div>

	<div>
		<h3>OS</h3>
		<p>Name: {os.name ?? nd}</p>
		<p>Version: {os.version ?? nd}</p>
	</div>
	<div>
		<h3>Engine</h3>
		<p>Name: {engine.name ?? nd}</p>
		<p>Version: {engine.version ?? nd}</p>
	</div>
</div>
<p class="text-sm text-muted-foreground">
	Browser info is detected locally and never sent anywhere. You can share it when reporting a bug.
</p>
