import { Link, useMatch } from "react-router-dom";
import path from "../../constants/path";
export default function RegisterHeader() {
  const registerMatch = useMatch(path.register);
  const isRegister = Boolean(registerMatch);

  return (
<header className="py-2 sticky top-0 z-40 bg-gray-950 border-b border-gray-800 text-gray-400 backdrop-blur-md">
  <div className="max-w-7xl mx-auto px-4">  
    <nav className="flex items-center justify-between">
      {/* Sign In / Sign Up */}
      <div className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-400">
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
