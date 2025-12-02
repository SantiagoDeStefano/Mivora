import { useLocation, useNavigate } from 'react-router-dom'
import { resetPasswordSchema, ResetPasswordSchema } from '../../../utils/rules'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { isAxiosUnprocessableEntityError } from '../../../utils/format'
import { ErrorResponse, ValidationErrorResponse } from '../../../types/response.types'
import ReactDOM from 'react-dom'
import Label from '../../../components/Label/Label'
import Input from '../../../components/Input/Input'
import Button from '../../../components/Button'
import path from '../../../constants/path'
import usersApi from '../../../apis/users.api'

export default function ResetPasswordModal() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const onClose = () => navigate(path.login)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<ResetPasswordSchema>({
    resolver: yupResolver(resetPasswordSchema) as any
  })

  const resetPasswordMutation = useMutation({
    mutationFn: (body: ResetPasswordSchema) => {
      return usersApi.resetPassword({
        ...body,
        forgot_password_token: state.forgot_password_token
      })
    }
  })

  const onSubmit = handleSubmit((data, e: React.FormEvent) => {
    e.preventDefault()
    resetPasswordMutation.mutate(data, {
      onSuccess: () => {
        e.preventDefault()
        navigate(path.login)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<ValidationErrorResponse>>(error)) {
          const formError = error.response?.data.errors
          if (formError) {
            console.log('formError', formError)
            Object.keys(formError).forEach((key) => {
              setError(key as keyof ResetPasswordSchema, {
                message: formError[key].msg,
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })

  return ReactDOM.createPortal(
    <div className='fixed inset-0 z-[100]' aria-labelledby='rp-title' role='dialog' aria-modal='true'>
      {/* Overlay */}
      <div className='absolute inset-0 bg-black/40 backdrop-blur-[2px]' onClick={onClose} />

      {/* Panel */}
      <div className='absolute inset-0 grid place-items-center px-4'>
        <div className='w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 shadow-xl'>
          {/* Header */}
          <div className='flex items-center justify-between px-4 py-3 border-b border-gray-800'>
            <h2 id='rp-title' className='text-lg font-semibold text-gray-50'>
              Reset your password
            </h2>
            <button
              onClick={onClose}
              aria-label='Close'
              className='inline-flex size-8 items-center justify-center rounded-lg hover:bg-gray-800 text-gray-300'
            >
              ×
            </button>
          </div>

          {/* Body */}
          <form onSubmit={onSubmit} className='px-4 py-4 grid gap-3' noValidate>
            <div className='text-sm text-gray-400'>Enter a new password for your account.</div>

            {/* (Optional) Hiển thị token đã verify cho dev check */}
            {/* <div className="text-xs text-gray-400">token: {token}</div> */}

            <div>
              <Label htmlFor='rp-pass'>New password</Label>
              <Input
                id='rp-pass'
                name='password'
                type='password'
                register={register}
                placeHolder='At least 8 characters'
                className='mt-1'
                errorMessages={errors.password?.message}
              />
            </div>

            <div>
              <Label htmlFor='rp-pass-confirm'>Confirm new password</Label>
              <Input
                id='rp-pass-confirm'
                name='confirm_password'
                type='password'
                register={register}
                placeHolder='Re-enter new password'
                className='mt-1'
                errorMessages={errors.confirm_password?.message}
              />
            </div>

            <div className='mt-2 grid grid-cols-2 gap-2'>
              <Button type='button' onClick={onClose} variant='secondary'>
                Cancel
              </Button>
              <Button type='submit'>Change password</Button>
            </div>

            {/* Gợi ý nhỏ */}
            <p className='text-xs text-gray-400 mt-1'>Use at least 8 characters with a mix of letters and numbers.</p>
          </form>
        </div>
      </div>
    </div>,
    document.body
  )
}
