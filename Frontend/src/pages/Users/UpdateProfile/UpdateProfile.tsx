// src/pages/Users/Profile/UpdateProfile.tsx
import { NavLink, useNavigate } from 'react-router-dom'
import Container from '../../../components/Container'
import Button from '../../../components/Button'
import Badge from '../../../components/Badge'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Pencil } from 'lucide-react'
import { useContext } from 'react'
import { AppContext } from '../../../contexts/app.context'
import type { User } from '../../../types/user.types'
import { updateMe, UpdateMeSchema } from '../../../utils/rules'
import { useMutation } from '@tanstack/react-query'
import usersApi from '../../../apis/users.api'
import { setProfileToLocalStorage } from '../../../utils/auth'
import { isAxiosUnprocessableEntityError } from '../../../utils/format'
import { ErrorResponse, ValidationErrorResponse } from '../../../types/response.types'
import Input from '../../../components/Input/Input'
import path from '../../../constants/path'

type UpdateProfileProps = {
  profile?: User | null
  onCancel?: () => void
  onSaved?: () => void
}

export default function UpdateProfile({ onCancel: onCancelProp, onSaved }: UpdateProfileProps) {
  const { profile, setProfile } = useContext(AppContext)
  const navigate = useNavigate()

  const isVerified = profile.verified === 'verified'
  const isOrganizer = Array.isArray(profile.role) ? profile.role.includes('organizer') : profile.role === 'organizer'

  const onCancel = onCancelProp ?? (() => navigate(path.profile))

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<UpdateMeSchema>({
    resolver: yupResolver(updateMe) as any,
    defaultValues: {
      name: profile.name,
      role: isOrganizer ? 'organizer' : 'attendee'
    }
  })

  const updateMeMutation = useMutation({
    mutationFn: (body: UpdateMeSchema) => {
      return usersApi.updateMe(body)
    }
  })

  const updateAvatarMutation = useMutation({
    mutationFn: (formData: FormData) => {
      return usersApi.updateAvatar(formData)
    }
  })

  const onSubmitUpdateMe = handleSubmit((data) => {
      const payload: Partial<UpdateMeSchema> = {
       name: data.name
      }
      if (data.role === 'organizer' && !isOrganizer) {
        payload.role = 'organizer'
      }
    updateMeMutation.mutate(payload as UpdateMeSchema, {
      onSuccess: (response) => {
        setProfileToLocalStorage(response.data.result)
        setProfile(response.data.result)
        // notify parent if provided (Me page passes onSaved)
        if (typeof onSaved === 'function') onSaved()
        // navigate to profile page after successful update
        navigate(path.profile)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<ValidationErrorResponse>>(error)) {
          const formError = error.response?.data.errors
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof UpdateMeSchema, {
                message: formError[key].msg,
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })

  return (
    <section id='profile' className='py-10 sm:py-14'>
      <Container>
        {/* Header */}
        <div className='mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4'>
          <div>
            <h1 className='text-2xl sm:text-3xl font-semibold tracking-tight'>My account</h1>
            <p className='mt-1 text-sm text-gray-400'>View and update your account information.</p>
          </div>

          <div className='flex items-center gap-2'>
            <Button type='button' variant='secondary' onClick={onCancel}>
              Cancel
            </Button>
            <Button type='button' onClick={() => { onSubmitUpdateMe(); }} disabled={updateMeMutation.status === 'pending'}>
              {updateMeMutation.status === 'pending' ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </div>

        {/* Layout: Left nav buttons | Right content */}
        <div className='grid gap-6 lg:grid-cols-[220px_1fr]'>
          {/* Left: chỉ 2 button, không khung */}
          <div className='flex flex-col gap-2'>
            <NavLink
              to='/users/me'
              className={({ isActive }) =>
                [
                  'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition',
                  isActive ? 'bg-pink-900/30 text-pink-200' : 'text-gray-200 hover:bg-gray-800'
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
                  isActive ? 'bg-pink-900/30 text-pink-200' : 'text-gray-200 hover:bg-gray-800'
                ].join(' ')
              }
            >
              My Tickets
            </NavLink>
          </div>

          {/* Right: Account Information */}
          <div className='rounded-2xl border border-gray-800 bg-gray-900/70 backdrop-blur p-6 shadow-sm'>
            {/* Avatar & meta */}
            <div className='rounded-2xl border border-gray-800 bg-gray-900/50 p-3 shadow-sm'>
              <div className='flex items-center gap-4'>
                <div className='relative'>
                  <img
                    src={profile.avatar_url}
                    alt={profile.name}
                    className='size-20 sm:size-24 rounded-2xl object-cover bg-gray-800'
                  />
                  <input
                    id='avatar'
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={(e) => {
                      console.log('avatar file changed')

                      const file = e.target.files?.[0]
                      if (!file) {
                        console.log('no file selected')
                        return
                      }

                      const formData = new FormData()
                      // key must match what your backend expects (from Postman). Example: 'avatar'
                      formData.append('image', file)

                      updateAvatarMutation.mutate(formData, {
                        onSuccess: (response) => {
                          setProfileToLocalStorage(response.data.result)
                          setProfile(response.data.result)
                          if (typeof onSaved === 'function') onSaved()
                          navigate(path.profile)
                        }
                      })
                    }}
                  />
                
                  {/* Nút sửa avatar — nằm chồng lên ảnh (bên trong relative) */}
                  <label
                    htmlFor='avatar'
                    className='
                      absolute bottom-0 right-0
                      translate-x-1/4 translate-y-1/4
                      rounded-full bg-gray-900
                      border border-gray-700
                      hover:bg-pink-900/30
                      p-2 shadow-sm transition
                      cursor-pointer
                    '
                    title='Edit avatar'
                  >
                    <Pencil className='size-4 text-pink-600' />
                  </label>
                </div>

                <div className='min-w-0'>
                  <div className='flex items-center gap-2'>
                    <div className='text-base sm:text-lg font-semibold truncate max-w-[16rem]'>{profile.name}</div>
                    {isVerified ? <Badge tone='success'>Verified</Badge> : <Badge tone='neutral'>Unverified</Badge>}
                  </div>

                  <div className='mt-1 text-sm text-gray-300 truncate max-w-[20rem]' title={profile.email}>
                    {profile.email}
                  </div>

                  <div className='mt-2 flex flex-wrap items-center gap-2'>
                    {isOrganizer ? <Badge tone='neutral'>Organizer</Badge> : <Badge tone='pink'>Attendee</Badge>}
                  </div>
                </div>
              </div>
            </div>


            {/* Account info (inputs ngắn lại và căn giữa) */}
            <div className='mt-6'>
              <h2 className='text-lg font-semibold mb-4 text-center'>Account Information</h2>

              <form className='flex flex-col items-center gap-5' onSubmit={onSubmitUpdateMe} noValidate>
                <div className='w-full max-w-sm'>
                  <label htmlFor='pf-name' className='block text-sm font-medium mb-1 text-center sm:text-left'>
                    Full name
                  </label>
                  <Input<UpdateMeSchema>
                    id='pf-name'
                    name='name'
                    type='name'
                    register={register}
                    className='...'
                    errorMessages={errors.name?.message}
                  />
                </div>

                <div className='w-full max-w-sm'>
                  <label htmlFor='pf-email' className='block text-sm font-medium mb-1 text-center sm:text-left'>
                    Email
                  </label>
                  <Input<UpdateMeSchema>
                    id='pf-email'
                    type='email'
                    defaultValue={profile.email}
                    className='w-full max-w-sm rounded-xl border border-gray-700 px-3 py-2 text-sm bg-gray-950/60 cursor-not-allowed'
                    readOnly
                  />
                </div>

                <div className='w-full max-w-sm'>
                  <label htmlFor='pf-verified' className='block text-sm font-medium mb-1 text-center sm:text-left'>
                    Verification
                  </label>
                  <Input<UpdateMeSchema>
                    id='pf-verified'
                    type='text'
                    defaultValue={isVerified ? 'Verified' : 'Unverified'}
                    className='w-full max-w-sm rounded-xl border border-gray-700 px-3 py-2 text-sm bg-gray-950/60 cursor-not-allowed'
                    readOnly
                  />
                </div>

                {/* Role (dropdown) */}
                <div className='w-full max-w-sm'>
                  <label htmlFor='pf-role' className='block text-sm font-medium mb-1 text-center sm:text-left'>
                    Role
                  </label>

                <select
                  {...register('role')}
                  className='w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500/60'
                  disabled={isOrganizer}
                >
                  <option value='attendee'>Attendee</option>
                  <option value='organizer'>Organizer</option>
                </select>

                  {errors.role && (
                    <p className='mt-1 text-xs text-red-500 text-center sm:text-left'>{errors.role.message}</p>
                  )}

                  <p className='mt-1 text-xs text-gray-400 text-center sm:text-left'>Choose your role.</p>
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
