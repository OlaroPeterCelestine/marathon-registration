"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/app/admin/actions";

export function AdminLogin() {
  const [state, action, pending] = useActionState(loginAdmin, undefined);

  return (
    <section className="card admin-login-card">
      <p className="kicker">Admin</p>
      <h1>Signups</h1>
      <p className="hint">
        Sign in to see who registered, including email, phone, country, and socials.
      </p>
      <form action={action}>
        <label>
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Admin password"
          />
        </label>
        {state?.error ? <p className="banner error">{state.error}</p> : null}
        <button type="submit" disabled={pending}>
          {pending ? "Checking…" : "Open dashboard"}
        </button>
      </form>
    </section>
  );
}
