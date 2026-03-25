---
title: Importing Data
---

<svelte:head>
	<title>{title} - Epitome Documentation</title>
</svelte:head>



# { title }


> Menu > File > Import Backup

You will be prompted to select a previously exported backup.

It will merge the data with your current data. If a workspace in the backup is same as any workspace in the current session, the backed up workspace will overwrite the current one. However, if it is not, then it will simply be added as a new workspace, along with all the configuration tied with it.
