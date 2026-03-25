---
title: Exporting
---

<svelte:head>
<title>{title} - Epitome Documentation</title>
</svelte:head>

# { title }

> Menu > File > Export Backup

It is recommended that you do a regular backup.

This app uses [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) under the hood. There is evidence that some browser ["silently delete (...) saved data after 7 days"](https://www.reddit.com/r/webdev/comments/1rpp4oh/safari_silently_deleted_our_users_saved_data/). **If you don't do a backup and suddenly after one month find that your saved data is not there, then that is not on us**.

This will save a backup to your local device. Keep it somewhere safe and reliable. The backup will include:

1. Workspaces
2. Selected font
3. Selected templates
4. Title of the sections
5. Visibility of sections
6. Orders of sections etc.

The data will be compressed and encoded to base64 format, so it will be unreadable to human eyes.
