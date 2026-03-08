---
name: generate-icons
description: How to regenerate the PNG icons from the source SVG file for the PWA manifest
---

# Generate Icons

This skill describes how to update the application's PNG icons whenever the source SVG (`icons/icon.svg`) is modified.

The Imposter game uses two PNG icons for its PWA (Progressive Web App) manifest:
- `icons/icon-192.png` (192x192)
- `icons/icon-512.png` (512x512)

These PNG files should not be edited manually. Instead, they should be generated from the source `icons/icon.svg` file to ensure consistency and high quality.

## Instructions

Whenever you modify `icons/icon.svg`, or when the user asks you to regenerate the icons, you MUST run the following command in the terminal from the root of the project to update the PNG files:

```bash
npx -y svgexport icons/icon.svg icons/icon-512.png 512:512 && npx -y svgexport icons/icon.svg icons/icon-192.png 192:192
```

This command uses `svgexport` to export the SVG vector graphic into precisely sized PNG raster graphics as dictated by the PWA requirements.

Always verify that the command executes successfully.
