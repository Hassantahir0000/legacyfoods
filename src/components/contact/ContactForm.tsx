"use client";

import { useState } from "react";
import { site } from "@/lib/site";

type Status = { kind: "idle" | "sending" | "ok" | "error"; message?: string };

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      form.reset();
      setStatus({ kind: "ok", message: "Thank you for your message. It has been sent." });
    } catch (err) {
      setStatus({
        kind: "error",
        message: `${err instanceof Error ? err.message : "Something went wrong."} You can also email us at ${site.email}.`,
      });
    }
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate={false}>
      <label>
        <span>YOUR EMAIL</span>
        <input type="email" name="email" required autoComplete="email" />
      </label>
      <label>
        <span>YOUR MESSAGE</span>
        <textarea name="message" rows={4} required minLength={5} />
      </label>
      {/* Honeypot: humans never see or fill this. */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <button type="submit" disabled={status.kind === "sending"}>
        {status.kind === "sending" ? "SENDING…" : "SEND MESSAGE"}
      </button>
      {status.message && (
        <p className={`contact-form__status contact-form__status--${status.kind}`} role="status">
          {status.message}
        </p>
      )}
    </form>
  );
}
