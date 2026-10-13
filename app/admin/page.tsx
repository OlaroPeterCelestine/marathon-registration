import { AdminDashboard } from "@/components/AdminDashboard";
import { toAdminRunner } from "@/lib/runners";
import { AdminLogin } from "@/components/AdminLogin";
import { isAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin · Marathon registration",
};

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return (
      <main className="admin-login">
        <AdminLogin />
      </main>
    );
  }

  let registrations: Awaited<ReturnType<typeof prisma.registration.findMany>> = [];
  let dbError = false;

  try {
    registrations = await prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    dbError = true;
  }

  const today = startOfToday();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 6);

  const runners = registrations.map(toAdminRunner);

  return (
    <AdminDashboard
      dbError={dbError}
      runners={runners}
      stats={{
        total: registrations.length,
        countries: new Set(registrations.map((runner) => runner.country)).size,
        week: registrations.filter((runner) => runner.createdAt >= weekAgo).length,
        today: registrations.filter((runner) => runner.createdAt >= today).length,
      }}
    />
  );
}
