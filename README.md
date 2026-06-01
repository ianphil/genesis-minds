# Genesis Minds

Public marketplace repository for Genesis-created Chamber mind templates, CLI tools, and managed skills.

## What's in this marketplace

The `plugins/genesis-minds/plugin.json` manifest declares three arrays:

- **`minds[]`** — Pre-built Genesis mind templates that Chamber can install into the user's mind directory.
- **`tools[]`** — Globally-installable CLI tools that Chamber will install via `npm install -g` and advertise to every mind in the session system message.
- **`skills[]`** — Managed Copilot skills that Chamber materializes into each mind's `.github/skills/<id>/` directory.

## Skills

| Skill | Root | Purpose |
| --- | --- | --- |
| `lens` | `skills/lens` | Create, inspect, fix, and manage Chamber Lens views. |
| `automation` | `skills/automation` | Create, validate, run, inspect, and schedule Chamber automation scripts. |
| `ttasks` | `skills/ttasks` | Author TypeScript task graphs and workflows with `@ianphil/ttasks-ts`. |

Each skill entry in `plugin.json` follows this shape:

```jsonc
{
  "id": "automation",
  "displayName": "Chamber Automation",
  "description": "...",
  "root": "skills/automation",
  "requiredFiles": ["SKILL.md", "examples/briefing-with-canvas.ts"],
  "capabilities": ["chamber-automation", "cron-scripts", "ttasks-runtime"]
}
```

The `root` directory must contain `SKILL.md`; Chamber copies the files listed in `requiredFiles` into each mind under `.github/skills/<id>/`. The Copilot SDK then discovers them from the mind's `.github/skills` parent directory.

## Tools

| Tool | Package | Purpose |
| --- | --- | --- |
| `workiq` | [`@microsoft/workiq`](https://www.npmjs.com/package/@microsoft/workiq) | Query Microsoft 365 data (emails, meetings, documents, Teams messages) using natural language. |

Each tool entry in `plugin.json` follows this shape:

```jsonc
{
  "id": "workiq",
  "displayName": "Microsoft Work IQ",
  "description": "...",
  "install": { "type": "npm-global", "package": "@microsoft/workiq", "version": "latest" },
  "bin": "workiq",
  "help": "workiq ask --help",
  "preflight": ["workiq accept-eula"],
  "agentInstructions": "Use Work IQ when you need information from the user's Microsoft 365 data..."
}
```

`agentInstructions` is rendered into each session's system message under a `## Tools` heading so the model knows how to invoke the CLI.

## Public vs internal split

This is the **public** marketplace, intended for any Chamber user. Internal-only Microsoft capabilities (Myelin, A365) live in [`agency-microsoft/genesis-minds`](https://github.com/agency-microsoft/genesis-minds) and require private repository access. Public Chamber installs only see entries from this repository unless the user explicitly enrolls an additional marketplace.
