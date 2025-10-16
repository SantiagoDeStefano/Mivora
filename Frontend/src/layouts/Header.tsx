import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../components/Button";
import { Container } from "./Container";
import { LogoMark } from "../constants/brandLogo";
import { BRAND } from "../constants/brand";
import { navItems } from "../constants/navItems";

export default function Header() {
  const { pathname } = useLocation();
  const [open, setOpen] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    setOpen(false);
    setShowSearch(false);
  }, [pathname]);

  return (
    <header
      className={[
        "sticky top-0 z-40 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-950/70 dark:border-gray-800",
        scrolled ? "shadow-sm" : "shadow-none",
      ].join(" ")}
      role="banner"
    >
      <Container>
        <div className="flex h-14 items-center gap-2">
          {/* Brand */}
          <Link
            to="/"
            className="group flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-pink-50 dark:hover:bg-gray-800"
            aria-label={`${BRAND.name} home`}
          >
            <LogoMark />
            <span className="text-sm font-semibold tracking-tight" style={{ color: BRAND.primary }}>
              {BRAND.name}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((it) => {
              const isActive = pathname === it.to;
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  className={[
                    "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
                  ].join(" ")}
                >
                  {it.label}
                  <span
                    className={[
                      "pointer-events-none absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full",
                      isActive ? "" : "opacity-0",
                    ].join(" ")}
                    style={{ backgroundColor: BRAND.primary }}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-1">
            {/* Search */}
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-1.5 dark:border-gray-700">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="opacity-60">
                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="m21 21-4.3-4.3m-8.7 2a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z" />
              </svg>
              <input placeholder="Search events..." className="w-56 bg-transparent text-sm outline-none" aria-label="Search" />
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {showSearch && (
        <div className="sm:hidden pb-3">
          <div className="flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 dark:border-gray-700">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
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
              className="flex-1 bg-transparent text-sm outline-none"
              placeholder="Search…"
              aria-label="Search"
            />
            <Button variant="ghost" onClick={() => setShowSearch(false)}>Close</Button>
          </div>
        </div>
      )}


        {/* Mobile nav */}
        {open && (
          <nav className="md:hidden pb-3" aria-label="Mobile">
            <ul className="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
              {navItems.map((it) => {
                const isActive = pathname === it.to;
                return (
                  <li key={it.to} className="bg-white/70 dark:bg-gray-950/70 backdrop-blur">
                    <Link
                      to={it.to}
                      className={[
                        "block px-4 py-3 text-sm font-medium",
                        isActive ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300",
                      ].join(" ")}
                      style={isActive ? { color: BRAND.primary } : undefined}
                    >
                      {it.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </Container>
    </header>
  );
}
