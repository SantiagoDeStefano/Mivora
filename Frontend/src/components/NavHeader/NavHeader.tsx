import { Link } from "react-router-dom";

interface User {
  name?: string;
}

interface NavHeaderProps {
  user?: User;
  onSignOut?: () => void;
}

function getInitials(name = "User") {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map(p => p[0]?.toUpperCase() ?? "").join("");
}

export default function NavHeader({ user, onSignOut }: NavHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/70 dark:border-gray-800/70 bg-white/70 dark:bg-gray-900/60 backdrop-blur-md">
  <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
    {/* Left: Brand */}
    <Link to="/" className="flex items-center gap-2 group mr-auto">
      <img
        src="/src/assets/Logo.svg"
        alt="Logo"
        className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
      />
    </Link>

    {/* Middle: Search (ẩn bớt trên màn nhỏ) */}
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const q = new FormData(e.currentTarget).get("q");
        if (q) {
          // Điều hướng tới trang tìm kiếm của bạn
          // ví dụ: navigate(`/search?q=${encodeURIComponent(q)}`)
        }
      }}
      className="hidden sm:flex items-center flex-1 max-w-xl mx-2"
      role="search"
    >
      <label htmlFor="global-search" className="sr-only">
        Search events
      </label>
      <input
        id="global-search"
        name="q"
        type="search"
        placeholder="Search events…"
        className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/60"
      />
    </form>

    {/* Right: Quick links + Account */}
    <div className="flex items-center gap-2">
      {/* My Tickets (nổi bật nhẹ) */}
      <Link
        to="/attendee/tickets"
        className="px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
      >
        My Tickets
      </Link>

      {/* Account Dropdown - dùng <details> để đơn giản & accessible */}
      <details className="relative group">
        <summary className="list-none flex items-center gap-2 px-1.5 py-1.5 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
          <div className="size-8 rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 grid place-items-center text-xs font-semibold">
            {getInitials(user?.name)}
          </div>
          <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
            {user?.name || "Account"}
          </span>
        </summary>

        <div
          className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg p-1.5"
          onClick={(e) => {
            // đóng dropdown khi chọn item
            const el = e.currentTarget.parentElement as HTMLDetailsElement;
            if (el?.nodeName === "DETAILS") el.open = false;
          }}
        >
          <Link
            to="/tickets"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            My Tickets
            <span className="text-xs text-gray-400">⌘T</span>
          </Link>
          <Link
            to="/profile"
            className="block px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            My Account
          </Link>
          <button
            onClick={onSignOut}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-gray-800"
          >
            Log out
          </button>
        </div>
      </details>
    </div>
  </div>

  {/* Mobile search row */}
  <div className="sm:hidden border-t border-gray-200/70 dark:border-gray-800/70 px-4 py-2">
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const q = new FormData(e.currentTarget).get("q");
        if (q) {
          // ví dụ: navigate(`/search?q=${encodeURIComponent(q)}`)
        }
      }}
      role="search"
    >
      <label htmlFor="global-search-mobile" className="sr-only">
        Search events
      </label>
      <input
        id="global-search-mobile"
        name="q"
        type="search"
        placeholder="Search events…"
        className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/60"
      />
    </form>
  </div>
</header>
  );
}
