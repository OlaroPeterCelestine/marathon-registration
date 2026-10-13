"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="nav">
      <Link href="/" className="brand">
        <span className="mark">M</span>
        Marathon
      </Link>
      <nav className="nav-links">
        <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>
          Register
        </Link>
        <Link href="/admin" aria-current={pathname.startsWith("/admin") ? "page" : undefined}>
          Admin
        </Link>
      </nav>
    </header>
  );
}
