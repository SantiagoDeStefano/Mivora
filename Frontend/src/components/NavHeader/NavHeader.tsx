import { Link } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AppContext } from '../../contexts/app.context'
import { useMutation } from '@tanstack/react-query'
import { clearLocalStorage, getRefreshTokenFromLocalStorage } from '../../utils/auth'
import usersApi from '../../apis/users.api'

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

  return (
    <header className='sticky top-0 z-40 bg-gray-950 border-b border-gray-800 text-gray-400'>
      <div className='max-w-7xl mx-auto px-4 py-3 flex items-center gap-3'>
        {/* Left: Brand */}
        <Link to='/' className='flex items-center gap-2 group mr-auto'>
          <img
            src='/src/assets/Logo.svg'
            alt='Logo'
            className='h-8 w-auto object-contain transition-transform group-hover:scale-105'
          />
        </Link>

        {/* Search */}
          <div className='hidden sm:flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-1.5 dark:border-gray-700'>
          <svg width='16' height='16' viewBox='0 0 24 24' fill='none' aria-hidden='true' className='opacity-60'>
            <path
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              d='m21 21-4.3-4.3m-8.7 2a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z'
            />
          </svg>
          <input
            placeholder='Search events...'
            className='w-56 bg-transparent text-sm outline-none'
            aria-label='Search'
          />
        </div>

        {/* Right: Quick links + Account */}
        <div className='flex items-center gap-2'>
          {/* My Tickets */}
          <Link
            to='/attendee/tickets'
            className='px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400'
          >
            My Tickets
          </Link>

          {/* Account Dropdown */}
          <details className='relative group'>
            <summary className='list-none flex items-center gap-2 px-1.5 py-1.5 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800'>
              {/* ==== AVATAR (đã chèn) ==== */}
              <div className='size-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 ring-1 ring-gray-200 dark:ring-gray-700 grid place-items-center text-xs font-semibold text-gray-700 dark:text-gray-200'>
                {!imgError ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.name}
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
                {getLastName(profile.name)}
              </span>
            </summary>

            <div
              className='absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg p-1.5'
              onClick={(e) => {
                // đóng dropdown khi chọn item
                const el = e.currentTarget.parentElement as HTMLDetailsElement
                if (el?.nodeName === 'DETAILS') el.open = false
              }}
            >
              <Link
                to='/tickets'
                className='flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              >
                My Tickets
                <span className='text-xs text-gray-400'> </span>
              </Link>
              <Link
                to='/profile'
                className='block px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              >
                My Account
              </Link>
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
