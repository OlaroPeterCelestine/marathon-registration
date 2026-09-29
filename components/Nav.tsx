import Link from "next/link";

export function Nav() {
  return (
    <header className="nav">
      <Link href="/" className="brand">
        <span className="mark">M</span>
        Marathon
      </Link>
    </header>
  );
}
