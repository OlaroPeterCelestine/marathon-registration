import { RegistrationForm } from "@/components/RegistrationForm";

export default function HomePage() {
  return (
    <main className="hero">
      <section>
        <p className="kicker">Open entry</p>
        <h1>Register for the marathon.</h1>
      </section>
      <RegistrationForm />
    </main>
  );
}
