import { NavLink, useNavigate } from 'react-router-dom'
import Logo from '../Logo/Logo'
import { useContext, useState } from 'react'
import { AppContext } from '../../contexts/app.context'
import { useMutation, useQuery } from '@tanstack/react-query'
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
  const [isChatOpen, setIsChatOpen] = useState(false)

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

  const { data: ticketsData } = useQuery({
    queryKey: ['my-tickets', 'for-chat'],
    queryFn: () =>
      usersApi.searchMyTickets({
        limit: 20,
        page: 1
      }),
    enabled: isAuthenticated
  })

  const handleSearchSubmit = (value: string) => {
    const q = value.trim()
    if (!q) return
    navigate({
      pathname: '/search',
      search: `?q=${encodeURIComponent(q)}`
    })
  }

  const navLink = 'text-sm font-medium text-gray-400 hover:text-pink-400 px-3 py-1.5 rounded-lg'

  const isOrganizer = (() => {
    const r = (profile as any)?.role
    if (!r) return false
    if (Array.isArray(r)) return r.map((x: string) => x.toLowerCase()).includes('organizer')
    return String(r).toLowerCase() === 'organizer'
  })()

  // Mock data – replace with real API data later
  const conversations = (() => {
    const tickets = ticketsData?.data?.result?.tickets ?? ([] as any)

    return tickets.map((t) => ({
      id: t.event_id, // Chat event_id
      ticketId: t.id, // Ticket id (if needed)
      name: t.event_title, // Chat name in sidebar
      poster: t.poster_url, // NEW: event poster image
      lastMessage: '', // You will fill later when you have last message
      time: '' // You will fill later
    }))
  })()

  return (
    <header className='sticky top-0 z-40 border-b border-gray-800 bg-gray-950 text-gray-200'>
      <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-3'>
        <div className='flex items-center gap-2'>
          <Logo className='h-10' />
        </div>

        {/* Desktop nav + search */}
        <nav className='hidden items-center gap-1 md:flex'>
          <NavLink to='/' className={navLink} end onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
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

        {/* Right: tickets + chat + account */}
        <div className='flex items-center gap-2'>
          {isAuthenticated ? (
            <>
              <NavLink
                to={path.my_tickets}
                className='px-3 py-1.5 rounded-xl border border-gray-800 text-sm font-medium hover:bg-gray-800 text-gray-400'
              >
                My Tickets
              </NavLink>

              {/* Chat trigger + popup */}
              <div className='relative'>
                <button
                  type='button'
                  onClick={() => setIsChatOpen((prev) => !prev)}
                  className='flex items-center justify-center size-9 rounded-xl border border-gray-800 bg-gray-900 hover:bg-gray-800'
                  aria-label='Open chat'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    className='w-5 h-5 text-gray-300'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='1.8'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M5 20l2.5-2H18a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3' />
                  </svg>
                </button>

                {isChatOpen && (
                  <div className='absolute right-0 mt-2 w-80 max-h-[26rem] rounded-xl border border-gray-800 bg-gray-900 shadow-2xl flex flex-col overflow-hidden'>
                    {/* Header */}
                    <div className='flex items-center justify-between px-3 py-2 border-b border-gray-800'>
                      <span className='text-sm font-semibold text-gray-100'>Chat</span>
                      <button
                        type='button'
                        onClick={() => setIsChatOpen(false)}
                        className='text-xs text-gray-400 hover:text-gray-200'
                      >
                        Close
                      </button>
                    </div>

                    {/* Conversation list */}
                    <div className='flex-1 overflow-y-auto'>
                      {conversations.map((c) => (
                        <button
                          key={c.id}
                          type='button'
                          className='w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-800/80 text-left'
                          onClick={() => {
                            // TODO: open a specific chat thread
                            // navigate(`/messages/${c.id}`)
                          navigate(`/events/${c.id}/messages`)
                          }}
                        >
                          <div className='flex-shrink-0'>
                            <div className='w-9 h-9 rounded-full bg-gray-700 ring-1 ring-gray-700 grid place-items-center text-xs font-semibold text-gray-200'>
                              <img src={c.poster} alt={c.name} className='w-full h-full object-cover' />
                            </div>
                          </div>

                          <div className='flex-1 min-w-0'>
                            <div className='flex items-center justify-between gap-2'>
                              <span className='text-sm font-medium text-gray-100 truncate'>{c.name}</span>
                              <span className='text-[11px] text-gray-500 flex-shrink-0'>{c.time}</span>
                            </div>
                            <p className='text-xs text-gray-400 truncate'>{c.lastMessage}</p>
                          </div>
                        </button>
                      ))}

                      {conversations.length === 0 && (
                        <div className='px-3 py-4 text-center text-xs text-gray-500'>No conversations yet.</div>
                      )}
                    </div>

                    {/* Footer: see all */}
                    <button
                      type='button'
                      onClick={() => {
                        setIsChatOpen(false)
                        navigate('/messages') // adjust this route to your real "all chats" page
                      }}
                      className='w-full px-3 py-2 text-xs font-medium text-pink-400 hover:bg-gray-800 border-t border-gray-800 text-center'
                    >
                      See all messages
                    </button>
                  </div>
                )}
              </div>

              {/* Profile dropdown */}
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
                  {isOrganizer && (
                    <button
                      onClick={() => navigate(path.scan_ticket)}
                      className='text-left w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800'
                    >
                      Scan tickets
                    </button>
                  )}
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
