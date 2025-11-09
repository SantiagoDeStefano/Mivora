import { Link, useMatch } from "react-router-dom";

export default function RegisterHeader() {
  const registerMatch = useMatch("/signup");
  const isRegister = Boolean(registerMatch);

  return (
<header className="py-2 border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 backdrop-blur-md">
  <div className="max-w-7xl mx-auto px-4">
    <nav className="flex items-center justify-between">
      {/* Sign In / Sign Up */}
      <div className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-700 dark:text-gray-200">
        {isRegister ? "Sign Up" : "Sign In"}
      </div>

      {/* Logo */}
      <Link
        to="/"
        className="group flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-pink-50 dark:hover:bg-gray-800"
        aria-label="Home"
      >
        <img
          src="/src/assets/Logo.svg"
          alt="Logo"
          className="h-8 w-auto object-contain transition-transform group-hover:scale-105 duration-200"
        />
      </Link>
    </nav>
  </div>
</header>


  );
}
