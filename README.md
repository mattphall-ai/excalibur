# Studio Rx Content Schedule

A small tool for querying and monitoring Studio Rx's content schedule in
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

There's no Float connection configured yet, so the app currently runs on
hand-written sample data shaped like Float's real entities (clients,
departments, people, projects, allocations). Every component talks to a
single `FloatClient` interface in `src/lib/floatClient.ts` — nothing outside
that file knows the data is fake.

**To connect the real Float account, using Float's own hosted MCP (beta):**

1. Have a Float admin enable [Float MCP (beta)](https://support.float.com/en/articles/12688168-float-mcp-beta)
   on the account and provide the connection details.
2. Implement a `RealFloatClient` in `src/lib/floatClient.ts` that satisfies
   the existing `FloatClient` interface, backed by calls through Float's MCP
   instead of `mockFloatData.ts`.
3. For the chat area specifically, route `ask(question)` through an LLM with
   Float's MCP tools bound to it, replacing the keyword-matching `askMock()`
   stand-in.
4. Swap the exported `floatClient` singleton from the mock implementation to
   `RealFloatClient`. No component changes are required — `ChatPanel`,
   `ClientProjectWidget`, and `SyntheticWidget` only ever call the
   `FloatClient` interface.

Because this app is a static SPA with no backend, the MCP connection (and any
Float credentials) needs to be brokered through a small server or the MCP
client itself — never called directly from the browser.

## Stack

React + TypeScript + Vite, no backend — a static SPA (same shape as this
account's other projects).

## Setup

```bash
npm install
npm run dev
```
