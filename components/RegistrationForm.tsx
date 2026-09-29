"use client";

import { FormEvent, useState } from "react";
import { COUNTRIES } from "@/lib/countries";

type Status = "idle" | "submitting" | "success" | "error";

export function RegistrationForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(body.error ?? "Could not save this registration.");
        return;
      }

      form.reset();
      setStatus("success");
      setMessage("Saved. This runner is now in the registration list.");
    } catch {
      setStatus("error");
      setMessage("Network error. Check that the app and database are running.");
    }
  }

  return (
    <section className="card">
      <div className="card-kicker">
        <span>Entry form</span>
      </div>

      <form onSubmit={onSubmit}>
        <label>
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="runner@email.com"
            required
            maxLength={180}
          />
        </label>

        <label>
          Name
          <input
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Full name"
            required
            maxLength={120}
          />
        </label>

        <label>
          Country
          <select name="country" required defaultValue="">
            <option value="" disabled>
              Select a country
            </option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </label>

        <label>
          Contact
          <input
            name="contact"
            type="tel"
            autoComplete="tel"
            placeholder="+254 700 000 000"
            required
            maxLength={40}
          />
        </label>

        <label>
          Socials
          <textarea
            name="socials"
            placeholder="Instagram, X, Strava, or profile links"
            required
            maxLength={400}
          />
          <p className="hint">Add any handles or links you want on the start list.</p>
        </label>

        {status === "error" ? <p className="banner error">{message}</p> : null}
        {status === "success" ? <p className="banner ok">{message}</p> : null}

        <button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Saving…" : "Register"}
        </button>
      </form>
    </section>
  );
}
