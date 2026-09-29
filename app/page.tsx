import { RegistrationForm } from "@/components/RegistrationForm";

export default function HomePage() {
  return (
    <main className="hero">
      <section>
        <p className="kicker">Open entry</p>
        <h1>Register for the marathon.</h1>
        <div className="facts">
          <div>
            <span>Fields</span>
            <strong>5 required</strong>
          </div>
          <div>
            <span>Storage</span>
            <strong>Postgres</strong>
          </div>
        </div>
      </section>
      <RegistrationForm />
    </main>
  );
}
