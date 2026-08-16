import { useState } from "react";
import { floatClient } from "../lib/floatClient";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  pending?: boolean;
}

const SUGGESTIONS = [
  "What is Globex Industries working on?",
  "What projects is the Synthetic team on?",
  "Which projects are ending soon?",
  "Show me completed projects.",
];

let nextId = 1;

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Ask me about clients, projects, departments, or people in Float. I'm currently answering from temporary sample data.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(question: string) {
    const trimmed = question.trim();
    if (!trimmed || busy) return;

    const userMessage: ChatMessage = { id: `m${nextId++}`, role: "user", content: trimmed };
    const pendingMessage: ChatMessage = { id: `m${nextId++}`, role: "assistant", content: "Thinking…", pending: true };
    setMessages((prev) => [...prev, userMessage, pendingMessage]);
    setInput("");
    setBusy(true);

    const answer = await floatClient.ask(trimmed);

    setMessages((prev) =>
      prev.map((m) => (m.id === pendingMessage.id ? { ...m, content: answer, pending: false } : m)),
    );
    setBusy(false);
  }

  return (
    <section className="card chat-panel">
      <h2>Ask about your schedule</h2>
      <p className="card-subtitle">Natural-language Q&amp;A over Float data</p>

      <div className="chat-messages">
        {messages.map((m) => (
          <div key={m.id} className={`chat-message ${m.role}${m.pending ? " pending" : ""}`}>
            {m.content}
          </div>
        ))}
      </div>

      <div className="chat-suggestions">
        {SUGGESTIONS.map((s) => (
          <button key={s} type="button" className="chat-suggestion-chip" onClick={() => send(s)} disabled={busy}>
            {s}
          </button>
        ))}
      </div>

      <form
        className="chat-input-row"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. What is Dana Reyes working on?"
          disabled={busy}
        />
        <button type="submit" disabled={busy || !input.trim()}>
          Send
        </button>
      </form>
    </section>
  );
}
