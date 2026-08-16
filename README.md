# Float Scheduling Dashboard

A small tool for querying and monitoring your team's schedule in
[Float](https://www.float.com), built around two areas:

1. **Chat** — ask natural-language questions about clients, projects,
   departments, and people ("What is Globex Industries working on?", "Which
   projects are ending soon?").
2. **Dashboard widgets**:
   - **Client projects** — pick a client from a dropdown and see the
     list/status of every project running for them.
   - **Synthetic department** — a snapshot of projects currently underway by
     the Synthetic team, plus team roster and status counts.

## Data source: temporary sample data

There's no Float MCP connection configured yet, so the app currently runs on
hand-written sample data shaped like Float's real entities (clients,
departments, people, projects, allocations). Every component talks to a
single `FloatClient` interface in `src/lib/floatClient.ts` — nothing outside
that file knows the data is fake.

**To connect a real Float account:**

1. Set up a Float MCP server — either Float's own
   [MCP (beta)](https://support.float.com/en/articles/12688168-float-mcp-beta)
   or the community
   [`asachs01/float-mcp`](https://github.com/asachs01/float-mcp) server. The
   community server exposes four consolidated tools: `manage-entity` (people,
   projects, clients, departments, roles, statuses), `manage-project-workflow`
   (phases, milestones, tasks, allocations), `manage-time-tracking` (logged
   time, time off, timesheets), and `generate-report` (utilization, capacity,
   budget reports).
2. Implement a `RealFloatClient` in `src/lib/floatClient.ts` that satisfies
   the existing `FloatClient` interface, backed by MCP tool calls instead of
   `mockFloatData.ts`.
3. For the chat area specifically, route `ask(question)` through an LLM with
   the Float MCP tools bound to it, replacing the keyword-matching
   `askMock()` stand-in.
4. Swap the exported `floatClient` singleton from the mock implementation to
   `RealFloatClient`. No component changes are required — `ChatPanel`,
   `ClientProjectWidget`, and `SyntheticWidget` only ever call the
   `FloatClient` interface.

## Stack

React + TypeScript + Vite, no backend — a static SPA (same shape as this
account's other projects).

## Setup

```bash
npm install
npm run dev
```
