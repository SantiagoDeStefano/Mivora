import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../../../contexts/app.context'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import {
  getProfileFromLocalStorage
} from '../../../utils/auth'
import { isAxiosUnprocessableEntityError } from '../../../utils/format'
import { ErrorResponse, ValidationErrorResponse } from '../../../types/response.types'
import { loginSchema, LoginSchema } from '../../../utils/rules'

import path from '../../../constants/path'
import Card from '../../../components/Card'
import Label from '../../../components/Label'
import Input from '../../../components/Input/Input'
import Button from '../../../components/Button'
import Container from '../../../components/Container/Container'
import usersApi from '../../../apis/users.api'

export default function Login() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<LoginSchema>({
    resolver: yupResolver(loginSchema) as any
  })

  const loginAccountMutation = useMutation({
    mutationFn: (body: LoginSchema) => {
      return usersApi.loginAccount(body)
    }
  })

  const onSubmit = handleSubmit((data) => {
    loginAccountMutation.mutate(data, {
      onSuccess: () => {
        setIsAuthenticated(true)
        setProfile(getProfileFromLocalStorage())
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<ValidationErrorResponse>>(error)) {
          const formError = error.response?.data.errors
          if (formError) {
            console.log('formError', formError)
            Object.keys(formError).forEach((key) => {
              setError(key as keyof LoginSchema, {
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
    <section id='login' className='py-10 sm:py-14'>
      <Container>
        <div className='mx-auto max-w-md'>
          <Card>
            <header>
              <h2 className='text-2xl font-semibold'>Log in</h2>
              <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>Welcome back</p>
            </header>

            <form className=' mt-4 grid gap-4' onSubmit={onSubmit} noValidate>
              <div>
                <Label htmlFor='login-email'>Email</Label>
                <Input<LoginSchema>
                  id='login-email'
                  name='email'
                  type='email'
                  register={register}
                  placeHolder='you@email.com'
                  className='mt-1'
                  errorMessages={errors.email?.message}
                />
              </div>

              <div>
                <Label htmlFor='login-pass'>Password</Label>
                <Input<LoginSchema>
                  id='login-pass'
                  name='password'
                  type='password'
                  register={register}
                  placeHolder='At least 8 characters'
                  className='mt-1'
                  errorMessages={errors.password?.message}
                />
              </div>

              <Link to={path.forgot_password} className='mr-auto text-sm text-pink-600 hover:underline'>
                Forgot password?
              </Link>

              <Button type='submit' className='h-10'>
                Log in
              </Button>
            </form>

            <p className='mt-4 text-sm text-gray-600 dark:text-gray-400'>
              New to Mivora?{' '}
              <Link to={path.register} className='text-pink-600 hover:underline'>
                Create an account
              </Link>
            </p>
          </Card>
        </div>
      </Container>
    </section>
  )
}
