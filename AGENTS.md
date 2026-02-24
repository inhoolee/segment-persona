# AGENTS.md

## Working Rules
- For every user task, always append a new entry to `CHANGELOG.md`.
- Each changelog entry must include:
  - Date/time
  - User request summary
  - What changed
  - Files changed
  - Verification status (tests/build/lint if run)
- Do not overwrite previous entries. Always append.
- If no file was changed, still log the request and note "No code change".

## CHANGELOG Entry Template
```md
## YYYY-MM-DD HH:mm
- Request: ...
- Changes:
  - ...
- Files:
  - path/to/file
- Verification:
  - ...
```
