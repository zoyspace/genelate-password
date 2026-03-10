# Fix Tailwind-specific syntax disabled warning

- [x] Create `.vscode/settings.json` to disable default CSS validation (which conflicts with Tailwind v4).
- [x] Create `biome.json` to enable `tailwindDirectives`, fixing Biome's integration with Tailwind v4.
- [x] Verify the configuration clears the error.
