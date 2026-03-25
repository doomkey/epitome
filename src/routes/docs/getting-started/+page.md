---
title: Getting Started
---

<script>
import def from "./def.png";
  import ed from "./ed.png";
  import { base } from '$app/paths';
</script>


<svelte:head>
	<title>{title} - Epitome Documentation</title>
</svelte:head>



# { title }


Upon opening the [generate](/epitome/generate) page, a new workspace will be created. It will be populated with some prefilled information (to enhance the preview). You can resize the information panel and preview panel by dragging the handle sideways (on large screen). On smaller screen, the preview is under the information panel.

## Adding Data

Input the apporpriate data in appropriate sections by the navigating between tabs (large screen) or dropdown(smol screen).

<img src={def} />


The preview will be updated as you type. 

Your data will be saved automatically when you:

1. Navigate between sections
2. Rename the [workspace](/epitome/docs/workspaces)
3. Update any section(rename/hide/reorder)
4. Switch between workspaces.
4. Generate a pdf
5. Import/export a backup

Note that the saving occurs in your current browser only. If you want to use another browser, use the [import/export](/epitome/docs/data-management/exporting-data) functionalities.

Sections like education, experience etc feature folded-list entry. Use the caret icon on the left side of each entry to fold-unfold an entry. You can reorder and delete an entry with the icons on the right side. 


<img src={ed} />

Note that if a section has no entry, it will be hidden from the resume. However, you can [hide a section](/epitome/docs/customization/sections/) without deleting all of the entries of that section.

Visit [customization](/epitome/docs/customization) for customizing various aspects of your resume.
