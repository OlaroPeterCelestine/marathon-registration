"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { logoutAdmin } from "@/app/admin/actions";
import type { AdminRunner, AdminStats } from "@/lib/runners";

export function AdminDashboard({
  runners,
  stats,
  dbError,
}: {
  runners: AdminRunner[];
  stats: AdminStats;
  dbError: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("all");
  const [selectedId, setSelectedId] = useState(runners[0]?.id ?? "");

  const countries = useMemo(() => {
    return [...new Set(runners.map((runner) => runner.country))].sort((a, b) =>
      a.localeCompare(b),
    );
  }, [runners]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return runners.filter((runner) => {
      if (country !== "all" && runner.country !== country) return false;
      if (!needle) return true;
      return [runner.name, runner.email, runner.country, runner.contact, runner.socials]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [runners, query, country]);

  const selected = filtered.find((runner) => runner.id === selectedId) ?? filtered[0] ?? null;

  const byCountry = useMemo(() => {
    const counts = new Map<string, number>();
    for (const runner of runners) {
      counts.set(runner.country, (counts.get(runner.country) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [runners]);

  return (
    <main className="admin">
      <div className="page-head">
        <div>
          <p className="kicker">Admin</p>
          <h1>Signups</h1>
        </div>
        <div className="admin-actions">
          <button type="button" className="ghost" onClick={() => router.refresh()}>
            Refresh
          </button>
          <form action={logoutAdmin}>
            <button type="submit" className="ghost">
              Log out
            </button>
          </form>
        </div>
      </div>

      <section className="stats" aria-label="Signup totals">
        <article className="stat">
          <span>Registered</span>
          <strong>{dbError ? "—" : stats.total}</strong>
        </article>
        <article className="stat">
          <span>Countries</span>
          <strong>{dbError ? "—" : stats.countries}</strong>
        </article>
        <article className="stat">
          <span>Last 7 days</span>
          <strong>{dbError ? "—" : stats.week}</strong>
        </article>
        <article className="stat">
          <span>Today</span>
          <strong>{dbError ? "—" : stats.today}</strong>
        </article>
      </section>

      {dbError ? (
        <div className="db-error">
          <h2>Postgres is not reachable.</h2>
          <p>Start the database with docker compose, then run the Prisma migration.</p>
        </div>
      ) : runners.length === 0 ? (
        <div className="table-wrap">
          <div className="empty">
            <h2>No runners yet.</h2>
            <p>New registrations from the public form will show up here with full details.</p>
          </div>
        </div>
      ) : (
        <>
          {byCountry.length > 0 ? (
            <p className="country-strip">
              {byCountry.map(([name, count]) => (
                <span key={name}>
                  {name} <strong>{count}</strong>
                </span>
              ))}
            </p>
          ) : null}

          <div className="admin-grid">
            <section className="roster-card">
              <div className="roster-tools">
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search name, email, phone, social"
                  aria-label="Search signups"
                />
                <select
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  aria-label="Filter by country"
                >
                  <option value="all">All countries</option>
                  {countries.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <p className="roster-count">
                {filtered.length} {filtered.length === 1 ? "person" : "people"}
              </p>
              {filtered.length === 0 ? (
                <div className="empty compact">
                  <h2>No matches.</h2>
                  <p>Try another name, email, or country.</p>
                </div>
              ) : (
                <div className="roster">
                  {filtered.map((runner) => {
                    const active = selected?.id === runner.id;
                    return (
                      <button
                        key={runner.id}
                        type="button"
                        className="runner"
                        aria-current={active ? "true" : undefined}
                        onClick={() => setSelectedId(runner.id)}
                      >
                        <span>
                          <strong>{runner.name}</strong>
                          <small>{runner.email}</small>
                        </span>
                        <span className="runner-meta">
                          {runner.country}
                          <small>{runner.registered}</small>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            <aside className="detail">
              {selected ? (
                <>
                  <p className="kicker">Details</p>
                  <h2>{selected.name}</h2>
                  <p className="detail-when">Registered {selected.registered}</p>
                  <dl className="detail-grid">
                    <div>
                      <dt>Email</dt>
                      <dd>
                        <a href={`mailto:${selected.email}`}>{selected.email}</a>
                      </dd>
                    </div>
                    <div>
                      <dt>Phone</dt>
                      <dd>
                        <a href={`tel:${selected.contact.replace(/\s/g, "")}`}>{selected.contact}</a>
                      </dd>
                    </div>
                    <div>
                      <dt>Country</dt>
                      <dd>{selected.country}</dd>
                    </div>
                    <div>
                      <dt>{selected.platform}</dt>
                      <dd>{selected.handle}</dd>
                    </div>
                  </dl>
                  <p className="detail-id">{selected.id}</p>
                </>
              ) : (
                <div className="empty compact">
                  <h2>Select a signup.</h2>
                  <p>Choose someone from the list to see their full details.</p>
                </div>
              )}
            </aside>
          </div>
        </>
      )}
    </main>
  );
}
