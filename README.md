# Genesis Minds

Public marketplace repository for Genesis-created Chamber mind templates and CLI tools.

## What's in this marketplace

The `plugins/genesis-minds/plugin.json` manifest declares two arrays:

- **`minds[]`** — Pre-built Genesis mind templates that Chamber can install into the user's mind directory.
- **`tools[]`** — Globally-installable CLI tools that Chamber will install via `npm install -g` and advertise to every mind in the session system message.

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
