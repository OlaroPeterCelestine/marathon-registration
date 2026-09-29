"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { COUNTRIES, countryByIso } from "@/lib/countries";
import { formatSocial, isValidHandle, SOCIAL_PLATFORMS } from "@/lib/socials";

type Status = "idle" | "submitting" | "success" | "error";

export function RegistrationForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [savedName, setSavedName] = useState("");
  const [country, setCountry] = useState("");
  const [dialIso, setDialIso] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (status !== "success") return;
    closeRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setStatus("idle");
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [status]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const dial = countryByIso(String(data.dialCode ?? ""));
    const phone = String(data.phone ?? "").replace(/\D/g, "");
    const platform = String(data.socialPlatform ?? "");
    const handle = String(data.socialHandle ?? "").trim().replace(/^@+/, "");

    if (!dial || phone.length < 4) {
      setStatus("error");
      setMessage("Choose a country code and enter the phone number.");
      return;
    }

    if (
      !SOCIAL_PLATFORMS.includes(platform as (typeof SOCIAL_PLATFORMS)[number]) ||
      !isValidHandle(handle)
    ) {
      setStatus("error");
      setMessage("Choose a social platform and enter the handle.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          name: data.name,
          country: data.country,
          socials: formatSocial(platform, handle),
          contact: `+${dial.dial} ${phone}`,
        }),
      });
      const body = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(body.error ?? "Could not save this registration.");
        return;
      }

      const runnerName = String(data.name ?? "").trim();
      form.reset();
      setCountry("");
      setDialIso("");
      setSavedName(runnerName);
      setStatus("success");
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
          <select
            name="country"
            required
            value={country}
            onChange={(event) => {
              const next = event.target.value;
              setCountry(next);
              const match = COUNTRIES.find((item) => item.name === next);
              if (match) setDialIso(match.iso);
            }}
          >
            <option value="" disabled>
              Select a country
            </option>
            {COUNTRIES.map((item) => (
              <option key={item.iso} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Contact
          <div className="contact-row">
            <select
              name="dialCode"
              aria-label="Country code"
              required
              value={dialIso}
              onChange={(event) => setDialIso(event.target.value)}
            >
              <option value="" disabled>
                Code
              </option>
              {COUNTRIES.map((item) => (
                <option key={item.iso} value={item.iso}>
                  +{item.dial} {item.name}
                </option>
              ))}
            </select>
            <input
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="700 000 000"
              required
              maxLength={20}
            />
          </div>
        </label>

        <label>
          Socials
          <div className="contact-row">
            <select name="socialPlatform" aria-label="Social platform" required defaultValue="">
              <option value="" disabled>
                Handle
              </option>
              {SOCIAL_PLATFORMS.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
            <input
              name="socialHandle"
              type="text"
              placeholder="@username"
              required
              maxLength={80}
            />
          </div>
        </label>

        {status === "error" ? <p className="banner error">{message}</p> : null}

        <button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Saving…" : "Register"}
        </button>
      </form>

      {status === "success" ? (
        <div className="modal-backdrop" onClick={() => setStatus("idle")}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="kicker">Registered</p>
            <h2 id="success-title">You&apos;re in.</h2>
            <p>
              {savedName
                ? `${savedName} is registered for the marathon.`
                : "Your registration is saved."}
            </p>
            <button ref={closeRef} type="button" onClick={() => setStatus("idle")}>
              Done
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
