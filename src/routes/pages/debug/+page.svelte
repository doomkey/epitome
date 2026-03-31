<script lang="ts">
	import { UAParser } from 'ua-parser-js';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
	const ua = UAParser(navigator.userAgent);
	const { browser, cpu, device, engine, os } = ua;
	const nd = 'Not defined';
</script>

<svelte:head>
	<title>Report a Bug - Epitome Resume Builder</title>
</svelte:head>

<h1>Report a Bug</h1>
<div>
	<p>
		Please <a href="https://github.com/doomkey/epitome/issues/new" target="_blank">open an issue</a> in
		the github repo stating the bug along with a screenshot/copied text of this page.
	</p>
	<p class="text-sm text-muted-foreground">
		Browser info is detected locally and never sent anywhere. <a
			href="https://github.com/doomkey/epitome/blob/main/src/routes/pages/debug/%2Bpage.svelte"
			target="_blank">View page source</a
		>
	</p>
</div>
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
