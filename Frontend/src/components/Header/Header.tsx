import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../Logo/Logo";
import SearchButton from "../SearchButton/SearchButton";
import path from "../../constants/path";
import Button from "../../components/Button";
export default function Header() {
  const navigate = useNavigate();
  const navLink =
    "text-sm font-medium text-gray-400 hover:text-pink-400 px-3 py-1.5 rounded-lg";

  return (
    <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-950 text-gray-200">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Logo className="h-10" />
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={navLink} end>Home</NavLink>
          <NavLink to="/about" className={navLink}>About</NavLink>
          <SearchButton />
        </nav>

        <div className="flex items-center gap-2">
          <NavLink to = {path.my_tickets}
            className='px-3 py-1.5 rounded-xl text-sm font-medium border hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400'
          >
            My Tickets
          </NavLink>

          <Button
            variant="secondary"
            className="rounded-full cursor-pointer"
            onClick={() => navigate(path.login)}
          >
            Log in
          </Button>
          <Button className="rounded-full cursor-pointer" onClick={() => navigate(path.register)}>
            Register
          </Button>
        </div>
      </div>
    </header>
  );
}
