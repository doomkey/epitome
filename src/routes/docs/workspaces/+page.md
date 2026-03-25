---
title: Workspaces
---

<script>
import RW from "./rename-workspace.png"
import NW from "./nw.png"
import del from "./del.png"
  import res from "./res.png"
  import { base } from '$app/paths';
</script>

<svelte:head>
<title>{title} - Epitome Documentation</title>
</svelte:head>

# { title }

Workspaces allow you to save different resume for different purpose.

For example, you might create a resume targeting company A, and later you need a slightly different resume for company B. In that case, you can just create a new workspace to modify the resume, while keeping the company A resume intact. This will allow a modification at later date. Very handy.

## Creating a Workspace

> Menu > Workspace > New Workspace

<img src={NW} />

**Creating a new workspace will copy over the currently selected workspace's data to the new one.**

## Renaming a Workspace

Click the pencil icon besides the Workspace name in the generate page.

<img src={RW} />

## Deletion

You may delete a workspace (why though? workspaces are unlimited) by clicking the trash icon in the workspace menu.

<img src={del} />

## Resetting a Workspace

> Menu > Workspace > Reset Current Workspace

<img src={res} />

This will revert all the input data to empty value in the currently selected workspace. **It is recommended to use the _new workspace_ feature to modify something, rather than erasing all the data you've entered.** However, the option is there for UX purposes. Some might need it.

## Deleting all Workspaces

See [Data Deletion]({base}/docs/data-management/data-deletion)
