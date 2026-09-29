import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatWhen(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function RegistrationsPage() {
  let registrations: Awaited<ReturnType<typeof prisma.registration.findMany>> = [];
  let dbError = false;

  try {
    registrations = await prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    dbError = true;
  }

  return (
    <main>
      <div className="page-head">
        <div>
          <p className="kicker">Starter list</p>
          <h1>Registrations</h1>
        </div>
        <p className="count">
          {dbError ? "Database offline" : `${registrations.length} saved`}
        </p>
      </div>

      {dbError ? (
        <div className="db-error">
          <h2>Postgres is not reachable.</h2>
          <p>
            Start the database with docker compose, then run the Prisma migration so this
            list can load.
          </p>
        </div>
      ) : registrations.length === 0 ? (
        <div className="table-wrap">
          <div className="empty">
            <h2>No runners yet.</h2>
            <p>The first registration from the form will appear in this table.</p>
          </div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Country</th>
                <th>Contact</th>
                <th>Socials</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((runner) => (
                <tr key={runner.id}>
                  <td>{runner.name}</td>
                  <td>{runner.email}</td>
                  <td>{runner.country}</td>
                  <td>{runner.contact}</td>
                  <td className="socials">{runner.socials}</td>
                  <td>{formatWhen(runner.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
