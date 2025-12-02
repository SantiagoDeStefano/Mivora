import { NavLink, useNavigate } from 'react-router-dom'
import Logo from '../Logo/Logo'
import { useContext, useState } from 'react'
import { AppContext } from '../../contexts/app.context'
import { useMutation } from '@tanstack/react-query'
import { clearLocalStorage, getRefreshTokenFromLocalStorage } from '../../utils/auth'
import usersApi from '../../apis/users.api'
import path from '../../constants/path'

function getInitials(name = 'User') {
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase() ?? '').join('')
}

const getLastName = (fullName: string) => {
  return fullName.trim().split(/\s+/).pop() || ''
}

export default function NavHeader() {
  const { setIsAuthenticated, setProfile, profile, isAuthenticated } = useContext(AppContext)
  const [imgError, setImgError] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const navigate = useNavigate()

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

  const handleSearchSubmit = (value: string) => {
    const q = value.trim()
    if (!q) return
    navigate({
      pathname: '/search',
      search: `?q=${encodeURIComponent(q)}`
    })
  }

  const navLink =
    'text-sm font-medium text-gray-400 hover:text-pink-400 px-3 py-1.5 rounded-lg'

  const isOrganizer = (() => {
    const r = (profile as any)?.role
    if (!r) return false
    if (Array.isArray(r)) return r.map((x: string) => x.toLowerCase()).includes('organizer')
    return String(r).toLowerCase() === 'organizer'
  })()

  return (
    <header className='sticky top-0 z-40 border-b border-gray-800 bg-gray-950 text-gray-200'>
      <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-3'>
        <div className='flex items-center gap-2'>
          <Logo className='h-10' />
        </div>

        {/* Desktop nav + search */}
        <nav className='hidden items-center gap-1 md:flex'>
          <NavLink to='/' className={navLink} end>
            Home
          </NavLink>

          {isOrganizer && (
            <NavLink to={path.organizer_manage_event} className={navLink}>
              Events
            </NavLink>
          )}

          <NavLink to='/about' className={navLink}>
            About
          </NavLink>

          {/* Desktop search */}
          <form
            className='ml-2 flex items-center gap-2'
            onSubmit={(e) => {
              e.preventDefault()
              handleSearchSubmit(searchValue)
            }}
            role='search'
          >
            <label htmlFor='global-search-desktop' className='sr-only'>
              Search events
            </label>
            <input
              id='global-search-desktop'
              type='search'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder='Search events…'
              className='w-56 rounded-xl border border-gray-800 bg-gray-900 px-3 py-1.5 text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/60'
            />
          </form>
        </nav>

        {/* Right: tickets + account */}
        <div className='flex items-center gap-2'>
          {isAuthenticated ? (
            <>
              <NavLink
                to={path.my_tickets}
                className='px-3 py-1.5 rounded-xl border border-gray-800 text-sm font-medium hover:bg-gray-800 text-gray-400'
              >
                My Tickets
              </NavLink>

              <details className='relative group'>
                <summary className='list-none flex items-center gap-2 px-1.5 py-1.5 rounded-xl cursor-pointer hover:bg-gray-800'>
                  <div className='size-8 rounded-full overflow-hidden bg-gray-700 ring-1 ring-gray-700 grid place-items-center text-xs font-semibold text-gray-200'>
                    {!imgError ? (
                      <img
                        src={profile?.avatar_url}
                        alt='avatar'
                        className='w-full h-full object-cover'
                        loading='lazy'
                        referrerPolicy='no-referrer'
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      getInitials(profile?.name)
                    )}
                  </div>

                  <span className='hidden sm:block text-sm font-medium text-gray-400'>
                    {getLastName(profile?.name ?? '')}
                  </span>
                </summary>

                <div
                  className='absolute right-0 mt-2 w-56 rounded-xl border border-gray-800 bg-gray-900 shadow-lg p-1.5'
                  onClick={(e) => {
                    const el = e.currentTarget.parentElement as HTMLDetailsElement
                    if (el?.nodeName === 'DETAILS') el.open = false
                  }}
                >
                  <button
                    onClick={() => navigate(path.my_tickets)}
                    className='text-left w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800'
                  >
                    My Tickets
                  </button>
                  <button
                    onClick={() => navigate(path.profile)}
                    className='text-left w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800'
                  >
                    My Account
                  </button>
                  <button
                    onClick={handleLogout}
                    className='text-left w-full px-3 py-2 rounded-lg text-sm text-pink-500 hover:bg-gray-800'
                  >
                    Log out
                  </button>
                </div>
              </details>
            </>
          ) : null}
        </div>
      </div>

      {/* Mobile search row */}
      <div className='sm:hidden border-t border-gray-800/70 px-4 py-2'>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const q = (formData.get('q') as string) ?? ''
            handleSearchSubmit(q)
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
            className='w-full rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/60'
          />
        </form>
      </div>
    </header>
  )
}
