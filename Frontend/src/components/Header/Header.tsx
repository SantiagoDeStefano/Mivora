import React from "react";
import { Link } from "react-router-dom";
import Button from "../Button";
import Container from "../Container/Container";
import { BRAND } from "../../constants/brand";

export default function Header() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-40 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-950/70 dark:border-gray-800",
        scrolled ? "shadow-sm" : "shadow-none",
      ].join(" ")}
      role="banner"
    >
      <Container>
  <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Left: Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/src/assets/Logo.svg"
              alt="Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Right: Search + Auth */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Search (đặt sát phải hơn) */}
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-1.5 dark:border-gray-700">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="opacity-60"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  d="m21 21-4.3-4.3m-8.7 2a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z"
                />
              </svg>
              <input
                placeholder="Search events..."
                className="w-56 bg-transparent text-sm outline-none"
                aria-label="Search"
              />
            </div>

            {/* Auth buttons */}
            <Link to="/login" className="hidden sm:inline-flex">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/signup" className="hidden sm:inline-flex">
              <Button style={{ backgroundColor: BRAND.primary }}>Sign up</Button>
            </Link>

            {/* Mobile menu */}
            <button
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              type="button"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  d="M4 7h16M4 12h16M4 17h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {open && (
          <nav className="md:hidden pb-3" aria-label="Mobile">
            <ul className="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
              <li className="bg-white/70 dark:bg-gray-950/70 backdrop-blur">
                <Link
                  to="/login"
                  className="block px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Log in
                </Link>
              </li>
              <li className="bg-white/70 dark:bg-gray-950/70 backdrop-blur">
                <Link
                  to="/signup"
                  className="block px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300"
                  style={{ color: BRAND.primary }}
                >
                  Sign up
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </Container>
    </header>
  );
}
