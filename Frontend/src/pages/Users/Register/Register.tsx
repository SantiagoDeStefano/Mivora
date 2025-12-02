import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../../../contexts/app.context'
import { registerSchema, RegisterSchema } from '../../../utils/rules'
import { useMutation } from '@tanstack/react-query'
import { getProfileFromLocalStorage } from '../../../utils/auth'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { isAxiosUnprocessableEntityError } from '../../../utils/format'
import { ErrorResponse, ValidationErrorResponse } from '../../../types/response.types'

import Card from '../../../components/Card/Card'
import Label from '../../../components/Label/Label'
import Input from '../../../components/Input/Input'
import Button from '../../../components/Button'
import Container from '../../../components/Container/Container'
import path from '../../../constants/path'
import usersApi from '../../../apis/users.api'

export default function RegisterPage() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<RegisterSchema>({
    resolver: yupResolver(registerSchema) as any
  })

  const registerAccountMutation = useMutation({
    mutationFn: (body: RegisterSchema) => {
      return usersApi.registerAccount(body)
    }
  })

  const onSubmit = handleSubmit((data) => {
    registerAccountMutation.mutate(data, {
      onSuccess: () => {
        setIsAuthenticated(true)
        setProfile(getProfileFromLocalStorage())
        navigate(path.profile)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<ValidationErrorResponse>>(error)) {
          const formError = error.response?.data.errors
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof RegisterSchema, {
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
    <section id='signin' className='py-10 sm:py-14'>
      <Container>
        <div className='mx-auto max-w-md'>
          <Card>
            <header>
              <h2 className='text-2xl font-semibold'>Create your account</h2>
            </header>

            <form className='mt-4 grid gap-4' onSubmit={onSubmit} noValidate>
              <div>
                <Label htmlFor='name'>Full Name</Label>
                <Input<RegisterSchema>
                  id='name'
                  name='name'
                  register={register}
                  placeHolder='Enter your full name'
                  className='mt-1'
                  errorMessages={errors.name?.message}
                />
              </div>

              <div>
                <Label htmlFor='email'>Email</Label>
                <Input<RegisterSchema>
                  id='email'
                  name='email'
                  type='email'
                  register={register}
                  placeHolder='you@email.com'
                  className='mt-1'
                  errorMessages={errors.email?.message}
                />
              </div>

              <div>
                <Label htmlFor='password'>Password</Label>
                <Input<RegisterSchema>
                  id='password'
                  name='password'
                  type='password'
                  register={register}
                  placeHolder='At least 6 characters'
                  className='mt-1'
                  errorMessages={errors.password?.message}
                />
              </div>

              <div>
                <Label htmlFor='confirm_password'>Confirm Password</Label>
                <Input<RegisterSchema>
                  id='confirm_password'
                  name='confirm_password'
                  type='password'
                  register={register}
                  placeHolder='Re-enter your password'
                  className='mt-1'
                  errorMessages={errors.confirm_password?.message}
                />
              </div>

              <Button type='submit'>Create account</Button>
            </form>

                <p className='mt-4 text-sm text-gray-400'>
              Already have an account?{' '}
              <Link to={path.login} className='text-pink-600 hover:underline'>
                Log in
              </Link>
            </p>
          </Card>
        </div>
      </Container>
    </section>
  )
}
