import { useContext, useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import type { User } from '../../../types/user.types'

import UpdateProfile from '../UpdateProfile'
import Container from '../../../components/Container'
import Button from '../../../components/Button'
import Badge from '../../../components/Badge'
import path from '../../../constants/path'
import { AppContext } from '../../../contexts/app.context'

export default function MePage() {
  const [isEditing, setIsEditing] = useState(false)
  const { profile } = useContext(AppContext)

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('edit') === '1') {
      setIsEditing(true) // giữ chế độ edit
      navigate(location.pathname, { replace: true }) // URL chỉ còn /users/me
    }
  }, [location.pathname, location.search, navigate])

  const toEdit = () => setIsEditing(true)
  const toView = () => setIsEditing(false)

  const me: User =
    profile ??
    ({
      name: '',
      email: '',
      avatar_url: '',
      verified: 'unverified',
      role: ['attendee']
    } as User)

  // Hỗ trợ role là string hoặc string[]
  const roles: string[] = Array.isArray(me.role) ? me.role : me.role ? [me.role] : []
  const isVerified = me.verified === 'verified'
  const isOrganizer = roles.map((r) => r.toLowerCase()).includes('organizer')
  const isAttendee = !isOrganizer && roles.map((r) => r.toLowerCase()).includes('attendee')

  // Edit mode: show UpdateProfile
  if (isEditing) {
    return <UpdateProfile profile={me} onCancel={toView} onSaved={toView} />
  }

  // View mode: inline ProfilePage UI
  return (
    <section id='profile' className='py-10 sm:py-14'>
      <Container>
        {/* Header */}
        <div className='mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4'>
          <div>
            <h1 className='text-2xl sm:text-3xl font-semibold tracking-tight'>My account</h1>
            <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>View and update your account information.</p>
          </div>

          <div className='flex items-center gap-2'>
            <Button variant='secondary'>Verify email</Button>

            <Button type='button' onClick={toEdit}>
              Edit profile
            </Button>
          </div>
        </div>

        {/* Layout: Left nav buttons | Right content */}
        <div className='grid gap-6 lg:grid-cols-[220px_1fr]'>
          {/* Left: nav */}
          <div className='flex flex-col gap-2'>
            <NavLink
              to={path.profile}
              className={({ isActive }) =>
                [
                  'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition',
                  isActive
                    ? 'bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-200'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                ].join(' ')
              }
            >
              My Account
            </NavLink>

            <NavLink
              to='/tickets'
              className={({ isActive }) =>
                [
                  'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition',
                  isActive
                    ? 'bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-200'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                ].join(' ')
              }
            >
              My Tickets
            </NavLink>
          </div>

          {/* Right: Account Information */}
          <div className='rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/70 backdrop-blur p-6 shadow-sm'>
            {/* Avatar & meta */}
            <div className='rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50 p-3 shadow-sm'>
              <div className='flex items-center gap-4'>
                <div className='relative'>
                  <img
                    src={me.avatar_url}
                    alt={me.name}
                    className='size-20 sm:size-24 rounded-2xl object-cover bg-gray-200 dark:bg-gray-800'
                  />
                  {/* Nút sửa avatar */}
                  <button
                    type='button'
                    className='
                      absolute bottom-0 right-0
                      translate-x-1/4 translate-y-1/4
                      rounded-full bg-white dark:bg-gray-900
                      border border-gray-300 dark:border-gray-700
                      hover:bg-pink-50 dark:hover:bg-pink-900/30
                      p-2 shadow-sm transition
                    '
                    title='Edit avatar'
                  >
                    <Pencil className='size-4 text-pink-600' />
                  </button>
                </div>

                <div className='min-w-0'>
                  <div className='flex items-center gap-2'>
                    <div className='text-base sm:text-lg font-semibold truncate max-w-[16rem]'>{me.name}</div>
                    {isVerified ? <Badge tone='success'>Verified</Badge> : <Badge tone='neutral'>Unverified</Badge>}
                  </div>

                  <div
                    className='mt-1 text-sm text-gray-600 dark:text-gray-300 truncate max-w-[20rem]'
                    title={me.email}
                  >
                    {me.email}
                  </div>

                  <div className='mt-2 flex flex-wrap items-center gap-2'>
                    {isOrganizer ? <Badge tone='neutral'>Organizer</Badge> : <Badge tone='pink'>Attendee</Badge>}
                  </div>
                </div>
              </div>
            </div>

            {/* Account info */}
            <div className='mt-6'>
              <h2 className='text-lg font-semibold mb-4 text-center'>Account Information</h2>

              <form className='flex flex-col items-center gap-5'>
                <div className='w-full max-w-sm'>
                  <label htmlFor='pf-name' className='block text-sm font-medium mb-1 text-center sm:text-left'>
                    Full name
                  </label>
                  <input
                    id='pf-name'
                    type='text'
                    defaultValue={me.name}
                    className='w-full max-w-sm rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm'
                    readOnly
                  />
                </div>

                <div className='w-full max-w-sm'>
                  <label htmlFor='pf-email' className='block text-sm font-medium mb-1 text-center sm:text-left'>
                    Email
                  </label>
                  <input
                    id='pf-email'
                    type='email'
                    defaultValue={me.email}
                    className='w-full max-w-sm rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-950/60 cursor-not-allowed'
                    readOnly
                  />
                </div>

                <div className='w-full max-w-sm'>
                  <label htmlFor='pf-verified' className='block text-sm font-medium mb-1 text-center sm:text-left'>
                    Verification
                  </label>
                  <input
                    id='pf-verified'
                    type='text'
                    defaultValue={isVerified ? 'Verified' : 'Unverified'}
                    className='w-full max-w-sm rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-950/60 cursor-not-allowed'
                    readOnly
                  />
                </div>

                <div className='w-full max-w-sm'>
                  <label htmlFor='pf-role' className='block text-sm font-medium mb-1 text-center sm:text-left'>
                    Role
                  </label>
                  <input
                    id='pf-role'
                    type='text'
                    defaultValue={isOrganizer ? 'Organizer' : 'Attendee'}
                    className='w-full max-w-sm rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-950/60 cursor-not-allowed'
                    readOnly
                  />
                </div>
              </form>
            </div>
          </div>
          {/* End Right */}
        </div>
      </Container>
    </section>
  )
}
