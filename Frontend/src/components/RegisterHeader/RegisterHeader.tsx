import { Link, useMatch } from "react-router-dom";
import { BRAND } from "../../constants/brand";
import { LogoMark } from "../../constants/brandLogo";

export default function RegisterHeader() {
  const registerMatch = useMatch("/signup"); // or '/register' depending on your route
  const isRegister = Boolean(registerMatch);

  return (
    <header className="py-5 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-end">
          <Link
            to="/"
            className="group flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-pink-50 dark:hover:bg-gray-800"
          >
            <LogoMark />
            <span
              className="text-sm font-semibold tracking-tight"
              style={{ color: BRAND.primary }}
            >
              {BRAND.name}
            </span>
          </Link>

          <div className="ml-5 text-xl lg:text-2xl">
            {isRegister ? "Sign Up" : "Sign In"}
          </div>
        </nav>
      </div>
    </header>
  );
}
