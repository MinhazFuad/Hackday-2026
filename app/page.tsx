"use client";

import { useState } from "react";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data: { reply: string } = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "bot", text: data.reply },
    ]);

    setInput("");
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-zinc-900 p-4 shadow-lg">
        <h1 className="mb-3 text-center text-xl font-semibold">
          Gemini Chatbot
        </h1>

        <div className="mb-3 h-80 overflow-y-auto rounded border p-3 space-y-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[80%] rounded p-2 text-sm ${
                msg.role === "user"
                  ? "ml-auto bg-blue-600 text-white"
                  : "bg-zinc-200 dark:bg-zinc-800"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && (
            <p className="text-sm text-zinc-500">Thinking…</p>
          )}
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 rounded border px-3 py-2 text-sm dark:bg-zinc-800"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="rounded bg-blue-600 px-4 py-2 text-sm text-white"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
