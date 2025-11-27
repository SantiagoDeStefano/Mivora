import { NavLink, useNavigate} from 'react-router-dom'
import Logo from '../Logo/Logo'
import SearchButton from '../SearchButton'
import { useContext, useState } from 'react'
import { AppContext } from '../../contexts/app.context'
import { useMutation } from '@tanstack/react-query'
import { clearLocalStorage, getRefreshTokenFromLocalStorage } from '../../utils/auth'
import usersApi from '../../apis/users.api'
import path from '../../constants/path'

interface User {
  name?: string
  avatarUrl?: string // <- thêm trường ảnh avatar
}

interface NavHeaderProps {
  user?: User
  onSignOut?: () => void
}

function getInitials(name = 'User') {
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase() ?? '').join('')
}

const getLastName = (fullName: string) => {
  return fullName.trim().split(/\s+/).pop() || ''
}

export default function NavHeader({ user }: NavHeaderProps) {
  const { setIsAuthenticated, setProfile, profile, isAuthenticated } = useContext(AppContext)
  const [imgError, setImgError] = useState(false)

  const logoutMutation = useMutation({
    mutationFn: () => usersApi.logout({ refresh_token: getRefreshTokenFromLocalStorage() }),
    onSuccess: () => {
      clearLocalStorage()
      setIsAuthenticated(false)
      setProfile(null)
    }
  })
  const handleLogout = () => {
    logoutMutation.mutate()
  }
  const navigate = useNavigate();
  const navLink =
    "text-sm font-medium text-gray-400 hover:text-pink-400 px-3 py-1.5 rounded-lg";

  // check if current profile contains organizer role (supports string or array)
  const isOrganizer = (() => {
    const r = (profile as any)?.role
    if (!r) return false
    if (Array.isArray(r)) return r.map((x: string) => x.toLowerCase()).includes('organizer')
    return String(r).toLowerCase() === 'organizer'
  })()

  return (
    <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-950 text-gray-200">
      
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Logo className="h-10" />
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={navLink} end>Home</NavLink>
          {isOrganizer && <NavLink to={path.organizer_manage_event} className={navLink}>Events</NavLink>}
          <NavLink to="/about" className={navLink}>About</NavLink>
          <SearchButton />
        </nav>
        
        {/* Right: Quick links + Account */}
        <div className='flex items-center gap-2'>
          {/* My Tickets */}
          <NavLink to = {path.my_tickets}
            className='px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400'
          >
            My Tickets
          </NavLink>

          {/* Account Dropdown */}
          <details className='relative group'>
            <summary className='list-none flex items-center gap-2 px-1.5 py-1.5 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800'>
              {/* ==== AVATAR (đã chèn) ==== */}
              <div className='size-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 ring-1 ring-gray-200 dark:ring-gray-700 grid place-items-center text-xs font-semibold text-gray-700 dark:text-gray-200'>
                {!imgError ? (
                  <img
                    src={'https://mivora-ap-southeast-1.s3.ap-southeast-1.amazonaws.com/avatar-images/tiu7tvddseqens3u2h5pvfnn2.jpg'}
                    alt={'123'}
                    className='w-full h-full object-cover'
                    loading='lazy'
                    referrerPolicy='no-referrer'
                    onError={() => setImgError(true)}
                  />
                ) : (
                  getInitials(user?.name)
                )}
                +
              </div>
              {/* ========================== */}

              <span className='hidden sm:block text-sm font-medium text-gray-400'>
                {getLastName('123')}
              </span>
            </summary>

            <div
              className='absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-900 shadow-lg p-1.5'
              onClick={(e) => {
                // đóng dropdown khi chọn item
                const el = e.currentTarget.parentElement as HTMLDetailsElement
                if (el?.nodeName === 'DETAILS') el.open = false
              }}
            >
              <button
                onClick={() => navigate(path.my_tickets)}
                className='text-left w-full px-3 py-2 rounded-lg text-sm text-gray-400 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              >
                My Tickets
                <span className='text-xs text-gray-400'> </span>
              </button>
              <button
                onClick={() => navigate(path.profile)}
                className='text-left w-full px-3 py-2 rounded-lg text-sm text-gray-400 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              >
                My Account
              </button>
              <button
                onClick={handleLogout}
                className='text-left w-full px-3 py-2 rounded-lg text-sm text-gray-400 dark:text-pink-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              >
                Log out
              </button>
            </div>
          </details>
        </div>
      </div>

      {/* Mobile search row */}
      <div className='sm:hidden border-t border-gray-200/70 dark:border-gray-800/70 px-4 py-2'>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const q = new FormData(e.currentTarget).get('q')
            if (q) {
              // ví dụ: navigate(`/search?q=${encodeURIComponent(q as string)}`)
            }
          }}
          role='search'
        >
          <label htmlFor='global-search-mobile' className='sr-only'>
            Search events
          </label>
          <input
            id='global-search-mobile'
            name='q'
            type='search'
            placeholder='Search events…'
            className='w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/60'
          />
        </form>
      </div>
    </header>
  )
}
